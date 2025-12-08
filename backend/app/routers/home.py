from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.home_content import HomeContent
from app.schemas.home_content import HomeContent as HomeContentSchema, HomeContentUpdate
from app.models.admin_user import AdminUser

router = APIRouter(prefix="/api/home", tags=["home"])


@router.get("", response_model=HomeContentSchema)
def get_home_content(db: Session = Depends(get_db)):
    content = db.query(HomeContent).first()
    if not content:
        # Create default content
        content = HomeContent(
            hero_text="Bianca & Joel",
            subtitle="Join us for our special day"
        )
        db.add(content)
        db.commit()
        db.refresh(content)
    return content


@router.put("", response_model=HomeContentSchema)
def update_home_content(
    content_update: HomeContentUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    content = db.query(HomeContent).first()
    if not content:
        # Create default content with same defaults as get_home_content
        content = HomeContent(
            hero_text="Bianca & Joel",
            subtitle="Join us for our special day"
        )
        db.add(content)
    
    update_data = content_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(content, field, value)
    
    db.commit()
    db.refresh(content)
    return content


@router.post("/reset-defaults")
def reset_to_defaults(db: Session = Depends(get_db)):
    """Reset home content to default values (Bianca & Joel)"""
    content = db.query(HomeContent).first()
    if content:
        content.hero_text = "Bianca & Joel"
        content.subtitle = "Join us for our special day"
    else:
        content = HomeContent(
            hero_text="Bianca & Joel",
            subtitle="Join us for our special day"
        )
        db.add(content)
    
    db.commit()
    db.refresh(content)
    return {"message": "Home content reset to defaults", "content": content}

