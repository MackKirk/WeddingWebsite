from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class RSVP(Base):
    __tablename__ = "rsvps"
    
    id = Column(Integer, primary_key=True, index=True)
    guest_name = Column(String)
    email = Column(String)
    num_attendees = Column(Integer)
    dietary_restrictions = Column(Text, nullable=True)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

