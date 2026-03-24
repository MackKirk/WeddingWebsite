from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class GuestInvitationOut(BaseModel):
    id: int
    display_label: str
    participants: List[str]

    class Config:
        from_attributes = True


class ParsedRow(BaseModel):
    display_label: str
    participants: List[str]


class PreviewParseRequest(BaseModel):
    text: str = Field(..., min_length=1)


class PreviewParseResponse(BaseModel):
    rows: List[ParsedRow]


class InvitationUpsert(BaseModel):
    display_label: str
    participants: List[str]


class ReplaceInvitationsRequest(BaseModel):
    invitations: List[InvitationUpsert]
