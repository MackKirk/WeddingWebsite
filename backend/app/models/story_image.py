from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class StoryImage(Base):
    __tablename__ = "story_images"
    
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey('story_sections.id', ondelete='SET NULL'), nullable=True)
    image_url = Column(String)
    caption = Column(String, nullable=True)
    order = Column(Integer, default=0)

