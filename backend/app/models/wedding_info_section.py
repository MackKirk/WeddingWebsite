from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class WeddingInfoSection(Base):
    __tablename__ = "wedding_info_sections"
    
    id = Column(Integer, primary_key=True, index=True)
    sort_order = Column(Integer, default=0, nullable=False)
    title = Column(String)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    section_type = Column(String)  # ceremony, reception, dress_code, parking, hotel
    map_embed_url = Column(String, nullable=True)  # For Google Maps iframe
    image_url = Column(String, nullable=True)  # Legacy single image (kept for backward compat)
    gallery_urls = Column(Text, nullable=True)  # JSON array of image URLs for modal gallery
    additional_info = Column(Text, nullable=True)  # Additional details for modal

