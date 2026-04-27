from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime
from database import orders_collection, products_collection
from models.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])

SUIVI_INITIAL = [
    {"statut": "commandee",    "label": "Commande reçue",       "date": None, "fait": True},
    {"statut": "preparation",  "label": "En préparation",        "date": None, "fait": False},
    {"statut": "en_route",     "label": "En route",              "date": None, "fait": False},
    {"statut": "livree",       "label": "Livrée",                "date": None, "fait": False},
]


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

    suivi = SUIVI_INITIAL.copy()
    suivi[0]["date"] = datetime.utcnow().isoformat()

    doc = {
        "client": order.client,
        "prenom": order.prenom,
        "telephone": order.telephone,
        "region": order.region,
        "paiement": order.paiement,
        "date": datetime.utcnow(),
        "articles": [a.model_dump() for a in order.articles],
        "statut": "commandee",
        "total": round(total, 2),
        "suivi": suivi,
    }
    result = await orders_collection.insert_one(doc)
    created = await orders_collection.find_one({"_id": result.inserted_id})
    return OrderResponse.from_mongo(created)


# ── Mettre à jour le statut de livraison (admin) ─────────────────────────────
@router.put("/{order_id}/statut")
async def update_statut(order_id: str, body: dict):
    nouveau_statut = body.get("statut")
    statuts_valides = ["commandee", "preparation", "en_route", "livree"]
    if nouveau_statut not in statuts_valides:
        raise HTTPException(status_code=400, detail="Statut invalide")

    order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")

    suivi = order.get("suivi", [s.copy() for s in SUIVI_INITIAL])
    idx_map = {s["statut"]: i for i, s in enumerate(suivi)}
    nouveau_idx = idx_map.get(nouveau_statut, 0)

    for i, step in enumerate(suivi):
        if i <= nouveau_idx:
            step["fait"] = True
            if not step["date"]:
                step["date"] = datetime.utcnow().isoformat()
        else:
            step["fait"] = False
            step["date"] = None

    await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"statut": nouveau_statut, "suivi": suivi}}
    )
    return {"message": "Statut mis à jour", "statut": nouveau_statut}


# ── GET suivi par numéro de commande (client) ─────────────────────────────────
@router.get("/suivi/{order_id}")
async def get_suivi(order_id: str):
    try:
        doc = await orders_collection.find_one({"_id": ObjectId(order_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")
    if not doc:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    return {
        "id": str(doc["_id"]),
        "client": f"{doc.get('prenom','')} {doc['client']}",
        "region": doc.get("region", ""),
        "total": doc["total"],
        "statut": doc["statut"],
        "date": doc["date"].isoformat(),
        "suivi": doc.get("suivi", []),
        "articles": doc["articles"],
    }


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
