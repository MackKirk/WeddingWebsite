from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Union
from datetime import datetime


class RSVPBase(BaseModel):
    guest_name: str
    email: EmailStr
    num_attendees: int
    dietary_restrictions: Optional[str] = None
    message: Optional[str] = None
    
    @field_validator('dietary_restrictions', 'message', mode='before')
    @classmethod
    def empty_str_to_none(cls, v: Union[str, None]) -> Optional[str]:
        """Convert empty strings to None"""
        if v == '' or v is None:
            return None
        return str(v) if v else None
    
    @field_validator('num_attendees', mode='before')
    @classmethod
    def convert_to_int(cls, v: Union[int, str]) -> int:
        """Convert string numbers to int"""
        if isinstance(v, str):
            try:
                return int(v)
            except (ValueError, TypeError):
                raise ValueError('num_attendees must be a number')
        if isinstance(v, int):
            return v
        raise ValueError('num_attendees must be a number')


class RSVPCreate(RSVPBase):
    pass


class RSVP(RSVPBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

