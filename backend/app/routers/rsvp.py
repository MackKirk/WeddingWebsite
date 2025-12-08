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
    try:
        # Ensure num_attendees is at least 1
        rsvp_data = rsvp.model_dump()
        if rsvp_data.get('num_attendees', 0) < 1:
            rsvp_data['num_attendees'] = 1
        
        # Convert empty strings to None
        if rsvp_data.get('dietary_restrictions') == '':
            rsvp_data['dietary_restrictions'] = None
        if rsvp_data.get('message') == '':
            rsvp_data['message'] = None
        
        db_rsvp = RSVP(**rsvp_data)
        db.add(db_rsvp)
        db.commit()
        db.refresh(db_rsvp)
        return db_rsvp
    except Exception as e:
        db.rollback()
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"Error creating RSVP: {str(e)}")


@router.get("", response_model=List[RSVPSchema])
def get_rsvps(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    return db.query(RSVP).order_by(RSVP.created_at.desc()).all()

