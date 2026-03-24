import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.rsvp import RSVP
from app.models.guest_invitation import GuestInvitation
from app.models.admin_user import AdminUser
from app.schemas.rsvp import RSVP as RSVPSchema, RSVPCreate

router = APIRouter(prefix="/api/rsvp", tags=["rsvp"])


def _normalize_name(s: str) -> str:
    return " ".join(s.split()).lower()


def _participants_from_invitation(inv: GuestInvitation) -> List[str]:
    try:
        data = json.loads(inv.participants)
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, TypeError):
        return []


def _att_item_name(item) -> str:
    if isinstance(item, dict):
        return item.get("name", "")
    return getattr(item, "name", "")


def _validate_attendance(inv: GuestInvitation, attendance: list) -> None:
    expected = _participants_from_invitation(inv)
    if len(attendance) != len(expected):
        raise HTTPException(status_code=400, detail="Attendance count does not match invitation")
    for i, item in enumerate(attendance):
        if _normalize_name(_att_item_name(item)) != _normalize_name(expected[i]):
            raise HTTPException(
                status_code=400,
                detail=f"Name mismatch at position {i}: expected {expected[i]}",
            )


@router.post("", response_model=RSVPSchema)
def create_rsvp(rsvp: RSVPCreate, db: Session = Depends(get_db)):
    try:
        rsvp_data = rsvp.model_dump()

        if rsvp_data.get("dietary_restrictions") == "":
            rsvp_data["dietary_restrictions"] = None
        if rsvp_data.get("song_request") == "":
            rsvp_data["song_request"] = None
        if rsvp_data.get("message") == "":
            rsvp_data["message"] = None

        guest_invitation_id = rsvp_data.get("guest_invitation_id")

        if guest_invitation_id is not None:
            inv = db.query(GuestInvitation).filter(GuestInvitation.id == guest_invitation_id).first()
            if not inv:
                raise HTTPException(status_code=404, detail="Invitation not found")

            attendance = rsvp_data.get("attendance") or []
            _validate_attendance(inv, attendance)

            def _is_attending(a):
                if isinstance(a, dict):
                    return bool(a.get("attending"))
                return bool(getattr(a, "attending", False))

            num_yes = sum(1 for a in attendance if _is_attending(a))
            rsvp_data["guest_name"] = inv.display_label
            rsvp_data["num_attendees"] = num_yes
            rsvp_data["attendance_json"] = json.dumps(attendance)
            rsvp_data.pop("attendance", None)
        else:
            rsvp_data["num_attendees"] = rsvp_data.get("num_attendees") or 1
            if rsvp_data["num_attendees"] < 1:
                rsvp_data["num_attendees"] = 1
            rsvp_data["guest_invitation_id"] = None
            rsvp_data["attendance_json"] = None
            rsvp_data.pop("attendance", None)

        db_rsvp = RSVP(
            guest_name=rsvp_data["guest_name"],
            email=rsvp_data["email"],
            num_attendees=rsvp_data["num_attendees"],
            dietary_restrictions=rsvp_data.get("dietary_restrictions"),
            song_request=rsvp_data.get("song_request"),
            message=rsvp_data.get("message"),
            guest_invitation_id=rsvp_data.get("guest_invitation_id"),
            attendance_json=rsvp_data.get("attendance_json"),
        )
        db.add(db_rsvp)
        db.commit()
        db.refresh(db_rsvp)
        return db_rsvp
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating RSVP: {str(e)}")


@router.get("", response_model=List[RSVPSchema])
def get_rsvps(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user),
):
    return db.query(RSVP).order_by(RSVP.created_at.desc()).all()
