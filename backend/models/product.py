from pydantic import BaseModel
from typing import Optional, Dict, Any


class ProductCreate(BaseModel):
    nom: str
    categorie: str
    prix: float
    stock: int
    producteur: str
    image_url: Optional[str] = ""
    attributs: Optional[Dict[str, Any]] = {}

    model_config = {"arbitrary_types_allowed": True}


class ProductUpdate(BaseModel):
    nom: Optional[str] = None
    prix: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    attributs: Optional[Dict[str, Any]] = None


class ProductResponse(BaseModel):
    id: str
    nom: str
    categorie: str
    prix: float
    stock: int
    producteur: str
    image_url: str = ""
    attributs: Dict[str, Any] = {}

    @classmethod
    def from_mongo(cls, doc: dict):
        return cls(
            id=str(doc["_id"]),
            nom=doc["nom"],
            categorie=doc["categorie"],
            prix=doc["prix"],
            stock=doc["stock"],
            producteur=doc["producteur"],
            image_url=doc.get("image_url", ""),
            attributs=doc.get("attributs", {}),
        )
