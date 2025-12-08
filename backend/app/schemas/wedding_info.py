from pydantic import BaseModel
from typing import Optional


class WeddingInfoSectionBase(BaseModel):
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    section_type: str
    map_embed_url: Optional[str] = None
    image_url: Optional[str] = None
    additional_info: Optional[str] = None


class WeddingInfoSectionCreate(WeddingInfoSectionBase):
    pass


class WeddingInfoSectionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    section_type: Optional[str] = None
    map_embed_url: Optional[str] = None
    image_url: Optional[str] = None
    additional_info: Optional[str] = None


class WeddingInfoSection(WeddingInfoSectionBase):
    id: int
    
    class Config:
        from_attributes = True

