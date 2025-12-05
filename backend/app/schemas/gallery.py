from pydantic import BaseModel
from typing import Optional


class GalleryImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = None
    order: int = 0


class GalleryImageCreate(GalleryImageBase):
    pass


class GalleryImageUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None
    order: Optional[int] = None


class GalleryImage(GalleryImageBase):
    id: int
    
    class Config:
        from_attributes = True

