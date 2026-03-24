from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class GuestInvitation(Base):
    __tablename__ = "guest_invitations"

    id = Column(Integer, primary_key=True, index=True)
    display_label = Column(String(500), nullable=False, index=True)
    participants = Column(Text, nullable=False)  # JSON array of display names for RSVP questions
    created_at = Column(DateTime(timezone=True), server_default=func.now())
