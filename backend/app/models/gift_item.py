from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class GiftItem(Base):
    __tablename__ = "gift_items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    link = Column(String)
    image_url = Column(String, nullable=True)
    item_type = Column(String)  # "external" or "card"
    order = Column(Integer, default=0)

