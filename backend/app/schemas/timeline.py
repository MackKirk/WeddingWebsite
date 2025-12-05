from pydantic import BaseModel
from typing import Optional
from datetime import time


class TimelineEventBase(BaseModel):
    time: time
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    order: int = 0


class TimelineEventCreate(TimelineEventBase):
    pass


class TimelineEventUpdate(BaseModel):
    time: Optional[time] = None
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None


class TimelineEvent(TimelineEventBase):
    id: int
    
    class Config:
        from_attributes = True

