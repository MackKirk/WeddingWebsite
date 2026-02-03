from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.story_section import StorySection
from app.models.story_image import StoryImage
from app.models.admin_user import AdminUser
from app.schemas.story import (
    StorySection as StorySectionSchema,
    StorySectionCreate,
    StorySectionUpdate,
    StoryImage as StoryImageSchema,
    StoryImageCreate,
    StoryImageUpdate
)

router = APIRouter(prefix="/api/story", tags=["story"])


# Story Sections
@router.get("/sections", response_model=List[StorySectionSchema])
def get_story_sections(db: Session = Depends(get_db)):
    return db.query(StorySection).order_by(StorySection.order).all()


@router.post("/sections", response_model=StorySectionSchema)
def create_story_section(
    section: StorySectionCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_section = StorySection(**section.model_dump())
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section


@router.put("/sections/{section_id}", response_model=StorySectionSchema)
def update_story_section(
    section_id: int,
    section_update: StorySectionUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_section = db.query(StorySection).filter(StorySection.id == section_id).first()
    if not db_section:
        raise HTTPException(status_code=404, detail="Story section not found")
    
    update_data = section_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_section, field, value)
    
    db.commit()
    db.refresh(db_section)
    return db_section


@router.delete("/sections/{section_id}")
def delete_story_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_section = db.query(StorySection).filter(StorySection.id == section_id).first()
    if not db_section:
        raise HTTPException(status_code=404, detail="Story section not found")
    db.delete(db_section)
    db.commit()
    return {"message": "Story section deleted"}


# Story Images
@router.get("/images", response_model=List[StoryImageSchema])
def get_story_images(db: Session = Depends(get_db)):
    return db.query(StoryImage).order_by(StoryImage.order).all()


@router.post("/images", response_model=StoryImageSchema)
def create_story_image(
    image: StoryImageCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_image = StoryImage(**image.model_dump())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


@router.put("/images/{image_id}", response_model=StoryImageSchema)
def update_story_image(
    image_id: int,
    image_update: StoryImageUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_image = db.query(StoryImage).filter(StoryImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Story image not found")
    
    update_data = image_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_image, field, value)
    
    db.commit()
    db.refresh(db_image)
    return db_image


@router.delete("/images/{image_id}")
def delete_story_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_image = db.query(StoryImage).filter(StoryImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Story image not found")
    db.delete(db_image)
    db.commit()
    return {"message": "Story image deleted"}


@router.put("/images/reorder", response_model=List[StoryImageSchema])
def reorder_story_images(
    image_ids: List[int],
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    images = db.query(StoryImage).filter(StoryImage.id.in_(image_ids)).all()
    if len(images) != len(image_ids):
        raise HTTPException(status_code=404, detail="Some story images not found")
    for order, image_id in enumerate(image_ids):
        image = next(img for img in images if img.id == image_id)
        image.order = order
    db.commit()
    return db.query(StoryImage).order_by(StoryImage.order).all()

