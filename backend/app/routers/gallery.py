from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.gallery_image import GalleryImage
from app.models.admin_user import AdminUser
from app.schemas.gallery import (
    GalleryImage as GalleryImageSchema,
    GalleryImageCreate,
    GalleryImageUpdate
)

router = APIRouter(prefix="/api/gallery", tags=["gallery"])


@router.get("", response_model=List[GalleryImageSchema])
def get_gallery_images(db: Session = Depends(get_db)):
    return db.query(GalleryImage).order_by(GalleryImage.order).all()


@router.post("", response_model=GalleryImageSchema)
def create_gallery_image(
    image: GalleryImageCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_image = GalleryImage(**image.model_dump())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


@router.put("/{image_id}", response_model=GalleryImageSchema)
def update_gallery_image(
    image_id: int,
    image_update: GalleryImageUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_image = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    
    update_data = image_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_image, field, value)
    
    db.commit()
    db.refresh(db_image)
    return db_image


@router.delete("/{image_id}")
def delete_gallery_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_image = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    db.delete(db_image)
    db.commit()
    return {"message": "Gallery image deleted"}

