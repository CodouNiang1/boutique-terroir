from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime
from database import orders_collection, products_collection
from models.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=OrderResponse, status_code=201)
async def create_order(order: OrderCreate):
    total = 0.0
    for item in order.articles:
        product = await products_collection.find_one({"_id": ObjectId(item.produit_id)})
        if not product:
            raise HTTPException(status_code=404, detail=f"Produit {item.produit_id} introuvable")
        if product["stock"] < item.quantite:
            raise HTTPException(status_code=400, detail=f"Stock insuffisant pour {product['nom']}")
        total += item.prix_unitaire * item.quantite

    for item in order.articles:
        await products_collection.update_one(
            {"_id": ObjectId(item.produit_id)},
            {"$inc": {"stock": -item.quantite}}
        )

    doc = {
        "client": order.client,
        "prenom": order.prenom,
        "telephone": order.telephone,
        "region": order.region,
        "paiement": order.paiement,
        "date": datetime.utcnow(),
        "articles": [a.dict() for a in order.articles],
        "statut": "confirmée",
        "total": round(total, 2),
    }
    result = await orders_collection.insert_one(doc)
    created = await orders_collection.find_one({"_id": result.inserted_id})
    return OrderResponse.from_mongo(created)


@router.get("/", response_model=List[OrderResponse])
async def get_orders():
    docs = await orders_collection.find().sort("date", -1).to_list(length=200)
    return [OrderResponse.from_mongo(d) for d in docs]


@router.get("/client/{client_name}", response_model=List[OrderResponse])
async def get_orders_by_client(client_name: str):
    docs = await orders_collection.find({"client": client_name}).sort("date", -1).to_list(100)
    return [OrderResponse.from_mongo(d) for d in docs]


@router.get("/stats/ca-par-categorie")
async def get_ca_par_categorie():
    pipeline = [
        {"$unwind": "$articles"},
        {"$lookup": {
            "from": "produits",
            "let": {"pid": {"$toObjectId": "$articles.produit_id"}},
            "pipeline": [{"$match": {"$expr": {"$eq": ["$_id", "$$pid"]}}}],
            "as": "produit_info"
        }},
        {"$unwind": "$produit_info"},
        {"$group": {
            "_id": "$produit_info.categorie",
            "chiffre_affaires": {"$sum": {"$multiply": ["$articles.prix_unitaire", "$articles.quantite"]}},
            "nb_commandes": {"$sum": 1}
        }},
        {"$sort": {"chiffre_affaires": -1}}
    ]
    result = await orders_collection.aggregate(pipeline).to_list(length=50)
    return [{"categorie": r["_id"], "chiffre_affaires": round(r["chiffre_affaires"], 2), "nb_commandes": r["nb_commandes"]} for r in result]


@router.get("/stats/top-produits")
async def get_top_produits():
    pipeline = [
        {"$unwind": "$articles"},
        {"$group": {
            "_id": "$articles.produit_id",
            "nom": {"$first": "$articles.nom_produit"},
            "total_vendu": {"$sum": "$articles.quantite"},
            "revenu": {"$sum": {"$multiply": ["$articles.prix_unitaire", "$articles.quantite"]}}
        }},
        {"$sort": {"total_vendu": -1}},
        {"$limit": 5}
    ]
    result = await orders_collection.aggregate(pipeline).to_list(length=5)
    return [{"produit_id": r["_id"], "nom": r["nom"], "total_vendu": r["total_vendu"], "revenu": round(r["revenu"], 2)} for r in result]
