from pydantic import BaseModel
from datetime import date
from typing import Optional


class HomeContentBase(BaseModel):
    hero_text: Optional[str] = None
    hero_image_url: Optional[str] = None
    wedding_date: Optional[date] = None
    subtitle: Optional[str] = None
    text_color: Optional[str] = None
    navbar_color: Optional[str] = None


class HomeContent(HomeContentBase):
    id: int
    
    class Config:
        from_attributes = True


class HomeContentUpdate(BaseModel):
    hero_text: Optional[str] = None
    hero_image_url: Optional[str] = None
    wedding_date: Optional[date] = None
    subtitle: Optional[str] = None
    text_color: Optional[str] = None
    navbar_color: Optional[str] = None

