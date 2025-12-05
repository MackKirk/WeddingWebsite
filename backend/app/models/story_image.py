from sqlalchemy import Column, Integer, String
from app.core.database import Base


class StoryImage(Base):
    __tablename__ = "story_images"
    
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    caption = Column(String, nullable=True)
    order = Column(Integer, default=0)

