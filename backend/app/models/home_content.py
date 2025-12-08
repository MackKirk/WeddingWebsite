from sqlalchemy import Column, Integer, String, Date
from app.core.database import Base


class HomeContent(Base):
    __tablename__ = "home_content"
    
    id = Column(Integer, primary_key=True, index=True)
    hero_text = Column(String, default="Bianca & Joel")
    hero_image_url = Column(String, nullable=True)
    wedding_date = Column(Date, nullable=True)
    subtitle = Column(String, default="Join us for our special day")
    text_color = Column(String, nullable=True, default="#8B6F6D")  # Default darker rose color
    navbar_color = Column(String, nullable=True, default="#F8F4EC")  # Default champagne color

