"""
seed_and_scheduler.py
- Insère 15 produits au démarrage (si la collection est vide)
- Génère une commande aléatoire toutes les 60 secondes
"""
import asyncio
import random
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "boutique_terroir")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
products_col = db["produits"]
orders_col = db["commandes"]

CLIENTS = ["Aminata Diallo", "Moussa Ndiaye", "Fatou Sow", "Ibrahima Fall", "Mariama Balde", "Cheikh Gueye", "Rokhaya Diop"]

PRODUCTS_SEED = [
    # Fruits locaux
    {"nom": "Mangues Kent", "categorie": "fruits", "prix": 1500, "stock": 120, "producteur": "Coopérative de Casamance", "attributs": {"variete": "Kent", "bio": True, "poids_kg": 1}},
    {"nom": "Pastèque sucrée", "categorie": "fruits", "prix": 2000, "stock": 80, "producteur": "Ferme Thiès", "attributs": {"bio": False, "poids_kg": 3}},
    {"nom": "Bissap frais (hibiscus)", "categorie": "fruits", "prix": 800, "stock": 60, "producteur": "Groupement de femmes Kaolack", "attributs": {"bio": True, "sac_g": 500}},
    {"nom": "Bananes plantains", "categorie": "fruits", "prix": 1200, "stock": 90, "producteur": "Coopérative de Ziguinchor", "attributs": {"bio": True, "regime": True}},
    # Légumes locaux
    {"nom": "Oignons de Potou", "categorie": "legumes", "prix": 600, "stock": 200, "producteur": "GIE Potou", "attributs": {"bio": False, "sac_kg": 1, "aop": True}},
    {"nom": "Tomates cerise Niayes", "categorie": "legumes", "prix": 1000, "stock": 100, "producteur": "Maraîchers des Niayes", "attributs": {"bio": True, "poids_kg": 1}},
    {"nom": "Gombo frais", "categorie": "legumes", "prix": 750, "stock": 70, "producteur": "Coopérative de Fatick", "attributs": {"bio": True, "botte": True}},
    {"nom": "Piment antillais", "categorie": "legumes", "prix": 500, "stock": 150, "producteur": "Maraîchers des Niayes", "attributs": {"force": "fort", "bio": False}},
    {"nom": "Patate douce", "categorie": "legumes", "prix": 900, "stock": 130, "producteur": "Ferme de Tambacounda", "attributs": {"variete": "orange", "bio": True, "sac_kg": 2}},
    # Produits laitiers locaux
    {"nom": "Lait caillé (thiakry)", "categorie": "laitier", "prix": 1500, "stock": 40, "producteur": "Éleveurs de Kolda", "attributs": {"lait": "vache zébu", "pot_ml": 500, "bio": True}},
    {"nom": "Fromage peul fumé", "categorie": "laitier", "prix": 3500, "stock": 25, "producteur": "Laiterie du Ferlo", "attributs": {"lait": "vache", "poids_g": 300, "fume": True}},
    # Miel et conserves
    {"nom": "Miel de baobab", "categorie": "miel", "prix": 4500, "stock": 50, "producteur": "Apiculteurs de Louga", "attributs": {"fleur": "baobab", "bio": True, "pot_g": 500}},
    {"nom": "Miel de mangrove", "categorie": "miel", "prix": 5000, "stock": 35, "producteur": "Coopérative de Sine Saloum", "attributs": {"fleur": "mangrove", "bio": True, "pot_g": 500}},
    {"nom": "Huile de palme rouge", "categorie": "conserves", "prix": 2500, "stock": 60, "producteur": "Huilerie de Ziguinchor", "attributs": {"bio": True, "bouteille_ml": 500}},
    {"nom": "Arachides grillées", "categorie": "conserves", "prix": 1200, "stock": 80, "producteur": "GIE Femmes de Kaolack", "attributs": {"grille": True, "sale": False, "sachet_g": 500}},
]


async def seed_products():
    count = await products_col.count_documents({})
    if count == 0:
        await products_col.insert_many(PRODUCTS_SEED)
        print(f"[SEED] ✅ {len(PRODUCTS_SEED)} produits insérés")
    else:
        print(f"[SEED] ℹ️  {count} produits déjà présents, seed ignoré")


async def create_random_order():
    # Choisir un produit aléatoire avec stock suffisant
    products = await products_col.find({"stock": {"$gte": 1}}).to_list(length=100)
    if not products:
        print("[SCHEDULER] ⚠️  Aucun produit en stock")
        return

    product = random.choice(products)
    quantite = random.randint(1, min(3, product["stock"]))
    client_name = random.choice(CLIENTS)

    order = {
        "client": client_name,
        "date": datetime.utcnow(),
        "articles": [{
            "produit_id": str(product["_id"]),
            "nom_produit": product["nom"],
            "quantite": quantite,
            "prix_unitaire": product["prix"],
        }],
        "statut": "confirmée",
        "total": round(product["prix"] * quantite, 2),
    }

    await orders_col.insert_one(order)
    await products_col.update_one(
        {"_id": product["_id"]},
        {"$inc": {"stock": -quantite}}
    )
    print(f"[SCHEDULER] 🛒 Commande auto : {client_name} → {quantite}x {product['nom']} ({order['total']} FCFA)")


async def run_scheduler():
    await seed_products()
    print("[SCHEDULER] ⏱️  Démarrage — commande automatique toutes les 60s")
    while True:
        await asyncio.sleep(60)
        await create_random_order()


if __name__ == "__main__":
    asyncio.run(run_scheduler())
