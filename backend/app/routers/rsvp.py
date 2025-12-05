from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.rsvp import RSVP
from app.models.admin_user import AdminUser
from app.schemas.rsvp import RSVP as RSVPSchema, RSVPCreate

router = APIRouter(prefix="/api/rsvp", tags=["rsvp"])


@router.post("", response_model=RSVPSchema)
def create_rsvp(rsvp: RSVPCreate, db: Session = Depends(get_db)):
    db_rsvp = RSVP(**rsvp.model_dump())
    db.add(db_rsvp)
    db.commit()
    db.refresh(db_rsvp)
    return db_rsvp


@router.get("", response_model=List[RSVPSchema])
def get_rsvps(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    return db.query(RSVP).order_by(RSVP.created_at.desc()).all()

