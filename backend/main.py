from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from database import products_collection
from routes.products import router as products_router
from routes.orders import router as orders_router
from seed_and_scheduler import seed_products, create_random_order


# ── Lifespan: seed au démarrage + scheduler en background ────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_products()
    task = asyncio.create_task(scheduler_loop())
    yield
    task.cancel()


async def scheduler_loop():
    print("[SCHEDULER] ⏱️  Commande automatique toutes les 60s")
    while True:
        await asyncio.sleep(60)
        await create_random_order()


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Boutique Terroir Local API",
    description="API e-commerce pour la coopérative agricole",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En prod: spécifier les domaines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(orders_router)


@app.get("/")
async def root():
    return {"message": "Boutique Terroir Local API 🌿", "docs": "/docs"}
