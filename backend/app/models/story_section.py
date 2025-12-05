from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class StorySection(Base):
    __tablename__ = "story_sections"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    order = Column(Integer, default=0)

