import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.wedding_info_section import WeddingInfoSection
from app.models.admin_user import AdminUser
from app.schemas.wedding_info import (
    WeddingInfoSection as WeddingInfoSectionSchema,
    WeddingInfoSectionCreate,
    WeddingInfoSectionUpdate
)

router = APIRouter(prefix="/api/info", tags=["info"])


def _serialize_gallery_urls(data: dict) -> dict:
    """Convert gallery_urls list to JSON string for DB storage."""
    if 'gallery_urls' in data and isinstance(data['gallery_urls'], list):
        data = {**data, 'gallery_urls': json.dumps(data['gallery_urls']) if data['gallery_urls'] else None}
    return data


@router.get("", response_model=List[WeddingInfoSectionSchema])
def get_info_sections(db: Session = Depends(get_db)):
    return db.query(WeddingInfoSection).order_by(WeddingInfoSection.sort_order.asc()).all()


@router.post("", response_model=WeddingInfoSectionSchema)
def create_info_section(
    section: WeddingInfoSectionCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    data = _serialize_gallery_urls(section.model_dump())
    result = db.query(func.max(WeddingInfoSection.sort_order)).scalar()
    data['sort_order'] = (result or -1) + 1
    db_section = WeddingInfoSection(**data)
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section


@router.put("/reorder", response_model=List[WeddingInfoSectionSchema])
def reorder_info_sections(
    section_ids: List[int],
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    sections = db.query(WeddingInfoSection).filter(WeddingInfoSection.id.in_(section_ids)).all()
    if len(sections) != len(section_ids):
        raise HTTPException(status_code=404, detail="Some info sections not found")
    for order, section_id in enumerate(section_ids):
        section = next(s for s in sections if s.id == section_id)
        section.sort_order = order
    db.commit()
    return db.query(WeddingInfoSection).order_by(WeddingInfoSection.sort_order.asc()).all()


@router.put("/{section_id}", response_model=WeddingInfoSectionSchema)
def update_info_section(
    section_id: int,
    section_update: WeddingInfoSectionUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_section = db.query(WeddingInfoSection).filter(WeddingInfoSection.id == section_id).first()
    if not db_section:
        raise HTTPException(status_code=404, detail="Info section not found")
    
    update_data = section_update.model_dump(exclude_unset=True)
    update_data = _serialize_gallery_urls(update_data)
    for field, value in update_data.items():
        setattr(db_section, field, value)
    
    db.commit()
    db.refresh(db_section)
    return db_section


@router.delete("/{section_id}")
def delete_info_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_section = db.query(WeddingInfoSection).filter(WeddingInfoSection.id == section_id).first()
    if not db_section:
        raise HTTPException(status_code=404, detail="Info section not found")
    db.delete(db_section)
    db.commit()
    return {"message": "Info section deleted"}

