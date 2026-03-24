from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class RSVP(Base):
    __tablename__ = "rsvps"

    id = Column(Integer, primary_key=True, index=True)
    guest_name = Column(String)
    email = Column(String)
    num_attendees = Column(Integer)
    dietary_restrictions = Column(Text, nullable=True)
    song_request = Column(Text, nullable=True)
    message = Column(Text, nullable=True)
    guest_invitation_id = Column(Integer, ForeignKey("guest_invitations.id"), nullable=True)
    attendance_json = Column(Text, nullable=True)  # JSON: [{"name": str, "attending": bool}, ...]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
