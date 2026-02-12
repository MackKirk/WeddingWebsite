from sqlalchemy import Column, Integer, String, Date
from app.core.database import Base


class HomeContent(Base):
    __tablename__ = "home_content"
    
    id = Column(Integer, primary_key=True, index=True)
    hero_text = Column(String, default="Bianca & Joel")
    hero_image_url = Column(String, nullable=True)
    wedding_date = Column(Date, nullable=True)
    subtitle = Column(String, default="Join us for our special day")
    text_color = Column(String, nullable=True, default="#8B6F6D")  # Hero text / countdown
    navbar_color = Column(String, nullable=True, default="#F8F4EC")  # Navbar background
    navbar_text_color = Column(String, nullable=True, default="#8B6F6D")
    accent_color = Column(String, nullable=True, default="#D4B483")  # Buttons, links, highlights
    body_bg_color = Column(String, nullable=True, default="#F8F4EC")
    body_heading_color = Column(String, nullable=True, default="#8B6F6D")
    body_text_color = Column(String, nullable=True, default="#333333")
    footer_bg_color = Column(String, nullable=True, default="#CFA7A4")  # Footer background (use with opacity in frontend)
    footer_text_color = Column(String, nullable=True, default="#8B6F6D")

