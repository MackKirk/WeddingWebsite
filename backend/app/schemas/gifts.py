from pydantic import BaseModel
from typing import Optional


class GiftItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    link: str
    image_url: Optional[str] = None
    item_type: str  # "external" or "card"
    order: int = 0


class GiftItemCreate(GiftItemBase):
    pass


class GiftItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
    image_url: Optional[str] = None
    item_type: Optional[str] = None
    order: Optional[int] = None


class GiftItem(GiftItemBase):
    id: int
    
    class Config:
        from_attributes = True

