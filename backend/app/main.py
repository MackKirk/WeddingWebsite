from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import (
    auth, home, story, info, timeline, gallery, gifts, rsvp, upload
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wedding Website API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
static_dir = Path(settings.STATIC_DIR)
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(home.router)
app.include_router(story.router)
app.include_router(info.router)
app.include_router(timeline.router)
app.include_router(gallery.router)
app.include_router(gifts.router)
app.include_router(rsvp.router)
app.include_router(upload.router)


@app.on_event("startup")
async def startup_event():
    # Initialize admin user if it doesn't exist
    from app.core.database import SessionLocal
    from app.models.admin_user import AdminUser
    from app.core.security import get_password_hash
    
    db = SessionLocal()
    try:
        admin = db.query(AdminUser).filter(AdminUser.username == settings.ADMIN_USERNAME).first()
        if not admin:
            admin = AdminUser(
                username=settings.ADMIN_USERNAME,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD)
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Wedding Website API"}

