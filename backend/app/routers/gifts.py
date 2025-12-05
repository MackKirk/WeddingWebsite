from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.gift_item import GiftItem
from app.models.admin_user import AdminUser
from app.schemas.gifts import (
    GiftItem as GiftItemSchema,
    GiftItemCreate,
    GiftItemUpdate
)

router = APIRouter(prefix="/api/gifts", tags=["gifts"])


@router.get("", response_model=List[GiftItemSchema])
def get_gift_items(db: Session = Depends(get_db)):
    return db.query(GiftItem).order_by(GiftItem.order).all()


@router.post("", response_model=GiftItemSchema)
def create_gift_item(
    gift: GiftItemCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_gift = GiftItem(**gift.model_dump())
    db.add(db_gift)
    db.commit()
    db.refresh(db_gift)
    return db_gift


@router.put("/{gift_id}", response_model=GiftItemSchema)
def update_gift_item(
    gift_id: int,
    gift_update: GiftItemUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_gift = db.query(GiftItem).filter(GiftItem.id == gift_id).first()
    if not db_gift:
        raise HTTPException(status_code=404, detail="Gift item not found")
    
    update_data = gift_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_gift, field, value)
    
    db.commit()
    db.refresh(db_gift)
    return db_gift


@router.delete("/{gift_id}")
def delete_gift_item(
    gift_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_gift = db.query(GiftItem).filter(GiftItem.id == gift_id).first()
    if not db_gift:
        raise HTTPException(status_code=404, detail="Gift item not found")
    db.delete(db_gift)
    db.commit()
    return {"message": "Gift item deleted"}

