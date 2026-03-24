from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional, Union, List, Any
from datetime import datetime


class AttendanceItem(BaseModel):
    name: str
    attending: bool


class RSVPCreate(BaseModel):
    email: EmailStr
    dietary_restrictions: Optional[str] = None
    song_request: Optional[str] = None
    message: Optional[str] = None

    guest_invitation_id: Optional[int] = None
    attendance: Optional[List[AttendanceItem]] = None

    guest_name: Optional[str] = None
    num_attendees: Optional[int] = None

    @field_validator("dietary_restrictions", "song_request", "message", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: Union[str, None]) -> Optional[str]:
        if v == "" or v is None:
            return None
        return str(v) if v else None

    @field_validator("num_attendees", mode="before")
    @classmethod
    def convert_to_int(cls, v: Union[int, str, None]) -> Optional[int]:
        if v is None or v == "":
            return None
        if isinstance(v, str):
            try:
                return int(v)
            except (ValueError, TypeError):
                raise ValueError("num_attendees must be a number")
        if isinstance(v, int):
            return v
        raise ValueError("num_attendees must be a number")

    @model_validator(mode="after")
    def invitation_or_legacy(self) -> "RSVPCreate":
        if self.guest_invitation_id is not None:
            if not self.attendance or len(self.attendance) < 1:
                raise ValueError("attendance is required when guest_invitation_id is set")
        else:
            if not self.guest_name or not str(self.guest_name).strip():
                raise ValueError("guest_name is required without guest_invitation_id")
            if self.num_attendees is None or self.num_attendees < 1:
                raise ValueError("num_attendees must be at least 1 without guest_invitation_id")
        return self


class RSVP(BaseModel):
    id: int
    guest_name: str
    email: EmailStr
    num_attendees: int
    dietary_restrictions: Optional[str] = None
    song_request: Optional[str] = None
    message: Optional[str] = None
    guest_invitation_id: Optional[int] = None
    attendance_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
