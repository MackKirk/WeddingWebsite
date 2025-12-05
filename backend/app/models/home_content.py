from sqlalchemy import Column, Integer, String, Date
from app.core.database import Base


class HomeContent(Base):
    __tablename__ = "home_content"
    
    id = Column(Integer, primary_key=True, index=True)
    hero_text = Column(String, default="John & Jane")
    hero_image_url = Column(String, nullable=True)
    wedding_date = Column(Date, nullable=True)
    subtitle = Column(String, default="Join us for our special day")

