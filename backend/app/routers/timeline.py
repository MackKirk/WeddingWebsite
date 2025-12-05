from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.timeline_event import TimelineEvent
from app.models.admin_user import AdminUser
from app.schemas.timeline import (
    TimelineEvent as TimelineEventSchema,
    TimelineEventCreate,
    TimelineEventUpdate
)

router = APIRouter(prefix="/api/timeline", tags=["timeline"])


@router.get("", response_model=List[TimelineEventSchema])
def get_timeline_events(db: Session = Depends(get_db)):
    return db.query(TimelineEvent).order_by(TimelineEvent.order).all()


@router.post("", response_model=TimelineEventSchema)
def create_timeline_event(
    event: TimelineEventCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_event = TimelineEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.put("/{event_id}", response_model=TimelineEventSchema)
def update_timeline_event(
    event_id: int,
    event_update: TimelineEventUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_event = db.query(TimelineEvent).filter(TimelineEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Timeline event not found")
    
    update_data = event_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_event, field, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete("/{event_id}")
def delete_timeline_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_event = db.query(TimelineEvent).filter(TimelineEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Timeline event not found")
    db.delete(db_event)
    db.commit()
    return {"message": "Timeline event deleted"}


@router.put("/reorder", response_model=List[TimelineEventSchema])
def reorder_timeline_events(
    event_ids: List[int],
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    events = db.query(TimelineEvent).filter(TimelineEvent.id.in_(event_ids)).all()
    if len(events) != len(event_ids):
        raise HTTPException(status_code=404, detail="Some events not found")
    
    # Update order based on the provided list
    for order, event_id in enumerate(event_ids):
        event = next(e for e in events if e.id == event_id)
        event.order = order
    
    db.commit()
    return db.query(TimelineEvent).order_by(TimelineEvent.order).all()

