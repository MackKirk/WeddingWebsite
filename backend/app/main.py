from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import sys
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

logger.info("=" * 50)
logger.info("Starting Wedding Website Application")
logger.info("=" * 50)

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import (
    auth, home, story, info, timeline, gallery, gifts, rsvp, upload
)

logger.info("Creating database tables...")
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(title="Wedding Website API")
logger.info("FastAPI app created")

# CORS middleware - menos restritivo já que está tudo no mesmo domínio
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
static_dir = Path(settings.STATIC_DIR)
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include routers (importante: antes do catch-all do frontend)
app.include_router(auth.router)
app.include_router(home.router)
app.include_router(story.router)
app.include_router(info.router)
app.include_router(timeline.router)
app.include_router(gallery.router)
app.include_router(gifts.router)
app.include_router(rsvp.router)
app.include_router(upload.router)

# Serve frontend static files
# Tenta múltiplos caminhos possíveis
logger.info("Checking for frontend build...")
frontend_dist = None
possible_paths = [
    Path(__file__).parent.parent / "frontend_dist",  # backend/frontend_dist
    Path(__file__).parent.parent.parent / "frontend_dist",  # raiz/frontend_dist
]

for path in possible_paths:
    logger.info(f"Checking path: {path}")
    if path.exists():
        logger.info(f"Path exists: {path}")
        if (path / "index.html").exists():
            logger.info(f"Found index.html at: {path}")
            frontend_dist = path
            break
        else:
            logger.warning(f"Path exists but no index.html: {path}")
    else:
        logger.info(f"Path does not exist: {path}")

if frontend_dist:
    logger.info(f"Serving frontend from: {frontend_dist}")
    # Serve static assets (JS, CSS, images, etc.)
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        logger.info(f"Mounting assets from: {assets_dir}")
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    else:
        logger.warning(f"Assets directory not found: {assets_dir}")
    
    # Serve index.html for all non-API routes (SPA routing)
    # Esta rota DEVE ser a última para não interceptar rotas da API
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str, request: Request):
        # Don't serve frontend for API routes
        if full_path.startswith(("api/", "auth/", "static/", "docs", "openapi.json", "redoc")):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not found")
        
        # Serve index.html for all other routes
        index_path = frontend_dist / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Frontend not found")
else:
    logger.warning("Frontend not found! Serving API only.")
    # Se frontend não existe, pelo menos serve uma mensagem na raiz
    @app.get("/")
    def root():
        return {
            "message": "Wedding Website API",
            "status": "running",
            "frontend": "not built",
            "info": "Frontend files not found. Check build logs."
        }


@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("Startup event triggered")
    logger.info("=" * 50)
    
    # Initialize admin user if it doesn't exist
    try:
        logger.info("Initializing admin user...")
        from app.core.database import SessionLocal
        from app.models.admin_user import AdminUser
        from app.core.security import get_password_hash
        
        db = SessionLocal()
        try:
            admin = db.query(AdminUser).filter(AdminUser.username == settings.ADMIN_USERNAME).first()
            if not admin:
                logger.info(f"Creating admin user: {settings.ADMIN_USERNAME}")
                admin = AdminUser(
                    username=settings.ADMIN_USERNAME,
                    hashed_password=get_password_hash(settings.ADMIN_PASSWORD)
                )
                db.add(admin)
                db.commit()
                logger.info("Admin user created successfully")
            else:
                logger.info("Admin user already exists")
        except Exception as e:
            logger.error(f"Error initializing admin user: {e}", exc_info=True)
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Startup event error: {e}", exc_info=True)
        # Não falha o servidor se houver erro no startup
    
    logger.info("=" * 50)
    logger.info("Startup completed")
    logger.info("=" * 50)

