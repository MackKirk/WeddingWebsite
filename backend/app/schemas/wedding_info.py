import json
from pydantic import BaseModel, field_validator, model_validator
from typing import Optional, List


class WeddingInfoSectionBase(BaseModel):
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    section_type: str
    map_embed_url: Optional[str] = None
    image_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = None
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
    gallery_urls: Optional[List[str]] = None
    additional_info: Optional[str] = None


class WeddingInfoSection(WeddingInfoSectionBase):
    id: int

    @field_validator('gallery_urls', mode='before')
    @classmethod
    def parse_gallery_urls(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            return json.loads(v) if v.strip() else []
        return v

    @model_validator(mode='after')
    def fill_gallery_from_image_url(self):
        """Backward compat: if gallery_urls is empty but image_url exists, use it as single-image gallery."""
        if (not self.gallery_urls or len(self.gallery_urls) == 0) and self.image_url:
            self.gallery_urls = [self.image_url]
        return self

