from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class RSVPBase(BaseModel):
    guest_name: str
    email: EmailStr
    num_attendees: int
    dietary_restrictions: Optional[str] = None
    message: Optional[str] = None


class RSVPCreate(RSVPBase):
    pass


class RSVP(RSVPBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

