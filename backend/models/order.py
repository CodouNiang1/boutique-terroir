from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class OrderItem(BaseModel):
    produit_id: str
    nom_produit: str
    quantite: int
    prix_unitaire: float


class OrderCreate(BaseModel):
    client: str
    prenom: str
    telephone: str
    region: str
    paiement: str
    articles: List[OrderItem]


class OrderResponse(BaseModel):
    id: str
    client: str
    prenom: str
    telephone: str
    region: str
    paiement: str
    date: datetime
    articles: List[OrderItem]
    statut: str
    total: float

    @classmethod
    def from_mongo(cls, doc: dict):
        return cls(
            id=str(doc["_id"]),
            client=doc["client"],
            prenom=doc.get("prenom", ""),
            telephone=doc.get("telephone", ""),
            region=doc.get("region", ""),
            paiement=doc.get("paiement", "cash"),
            date=doc["date"],
            articles=[OrderItem(**a) for a in doc["articles"]],
            statut=doc["statut"],
            total=doc["total"],
        )
