from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import time


def _empty_str_to_none(v):
    if v == "" or v is None:
        return None
    return v


class TimelineEventBase(BaseModel):
    time: time
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    order: int = 0
    image_url: Optional[str] = None
    additional_info: Optional[str] = None


class TimelineEventCreate(TimelineEventBase):
    pass


class TimelineEventUpdate(BaseModel):
    time: Optional[time] = None
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    image_url: Optional[str] = None
    additional_info: Optional[str] = None

    @field_validator("description", "icon", "image_url", "additional_info", "title", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        return _empty_str_to_none(v)


class TimelineEvent(TimelineEventBase):
    id: int
    
    class Config:
        from_attributes = True

