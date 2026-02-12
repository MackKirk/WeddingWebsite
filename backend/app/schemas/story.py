from pydantic import BaseModel
from typing import Optional


class StorySectionBase(BaseModel):
    title: str
    content: str
    order: int = 0


class StorySectionCreate(StorySectionBase):
    pass


class StorySectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    order: Optional[int] = None


class StorySection(StorySectionBase):
    id: int
    
    class Config:
        from_attributes = True


class StoryImageBase(BaseModel):
    section_id: Optional[int] = None
    image_url: str
    caption: Optional[str] = None
    order: int = 0


class StoryImageCreate(StoryImageBase):
    pass


class StoryImageUpdate(BaseModel):
    section_id: Optional[int] = None
    image_url: Optional[str] = None
    caption: Optional[str] = None
    order: Optional[int] = None


class StoryImage(StoryImageBase):
    id: int
    
    class Config:
        from_attributes = True

