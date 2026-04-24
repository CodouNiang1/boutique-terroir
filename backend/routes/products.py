from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import products_collection
from models.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/products", tags=["products"])


# ── POST reset + reseed (admin only) ─────────────────────────────────────────
@router.post("/admin/reset-seed")
async def reset_seed():
    from seed_and_scheduler import PRODUCTS_SEED
    await products_collection.delete_many({})
    await products_collection.insert_many([p.copy() for p in PRODUCTS_SEED])
    return {"message": f"{len(PRODUCTS_SEED)} produits rechargés avec succès"}


# ── GET all products ──────────────────────────────────────────────────────────
@router.get("/", response_model=list[ProductResponse])
async def get_products(categorie: str = None):
    query = {}
    if categorie:
        query["categorie"] = categorie
    docs = await products_collection.find(query).to_list(length=100)
    return [ProductResponse.from_mongo(d) for d in docs]


# ── GET out of stock (stock < 5) ──────────────────────────────────────────────
@router.get("/admin/low-stock", response_model=list[ProductResponse])
async def get_low_stock():
    docs = await products_collection.find({"stock": {"$lt": 5}}).to_list(length=100)
    return [ProductResponse.from_mongo(d) for d in docs]


# ── GET single product ────────────────────────────────────────────────────────
@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    doc = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    return ProductResponse.from_mongo(doc)


# ── POST create product ───────────────────────────────────────────────────────
@router.post("/", response_model=ProductResponse, status_code=201)
async def create_product(product: ProductCreate):
    doc = product.model_dump()
    result = await products_collection.insert_one(doc)
    created = await products_collection.find_one({"_id": result.inserted_id})
    return ProductResponse.from_mongo(created)


# ── PUT update product ────────────────────────────────────────────────────────
@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, update: ProductUpdate):
    changes = {k: v for k, v in update.model_dump().items() if v is not None}
    if not changes:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    await products_collection.update_one(
        {"_id": ObjectId(product_id)}, {"$set": changes}
    )
    doc = await products_collection.find_one({"_id": ObjectId(product_id)})
    return ProductResponse.from_mongo(doc)


# ── DELETE product ────────────────────────────────────────────────────────────
@router.delete("/{product_id}")
async def delete_product(product_id: str):
    result = await products_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    return {"message": "Produit supprimé"}
