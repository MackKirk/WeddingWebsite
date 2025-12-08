from sqlalchemy import Column, Integer, String, Text, Time
from app.core.database import Base


class TimelineEvent(Base):
    __tablename__ = "timeline_events"
    
    id = Column(Integer, primary_key=True, index=True)
    time = Column(Time)
    title = Column(String)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    order = Column(Integer, default=0)
    image_url = Column(String, nullable=True)  # Image for modal
    additional_info = Column(Text, nullable=True)  # Additional details for modal

