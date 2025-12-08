from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import os
import sys

# Health check endpoint primeiro (antes de qualquer import que pode falhar)
app = FastAPI(title="Wedding Website API")

@app.get("/health")
def health():
    return {"status": "ok", "message": "Server is running"}

# Agora importa o resto
try:
    from app.core.config import settings
    from app.core.database import engine, Base
    
    # CORS middleware
    try:
        cors_origins = getattr(settings, 'CORS_ORIGINS', ['*'])
        if not cors_origins or cors_origins == ['*']:
            cors_origins = ['*']
        
        app.add_middleware(
            CORSMiddleware,
            allow_origins=cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    except Exception as e:
        print(f"Warning: CORS setup failed: {e}", file=sys.stderr)
        # CORS padrão permissivo
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    # Static files for uploads
    try:
        static_dir = Path(settings.STATIC_DIR)
        static_dir.mkdir(parents=True, exist_ok=True)
        app.mount("/static", StaticFiles(directory=static_dir), name="static")
    except Exception as e:
        print(f"Warning: Could not mount static files: {e}", file=sys.stderr)
    
except Exception as e:
    print(f"Error initializing app: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    # CORS mínimo para não crashar
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers (importante: antes do catch-all do frontend)
routers_to_load = [
    ('auth', 'auth'),
    ('home', 'home'),
    ('story', 'story'),
    ('info', 'info'),
    ('timeline', 'timeline'),
    ('gallery', 'gallery'),
    ('gifts', 'gifts'),
    ('rsvp', 'rsvp'),
    ('upload', 'upload'),
]

for module_name, router_name in routers_to_load:
    try:
        module = __import__(f'app.routers.{module_name}', fromlist=[router_name])
        router = getattr(module, 'router', None)
        if router:
            app.include_router(router)
            print(f"Loaded router: {module_name}", file=sys.stdout)
        else:
            print(f"Warning: Router {module_name} has no 'router' attribute", file=sys.stderr)
    except Exception as e:
        print(f"Warning: Could not load router {module_name}: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()

# Serve frontend static files
try:
    frontend_dist = Path(__file__).parent.parent / "frontend_dist"
    if frontend_dist.exists() and (frontend_dist / "index.html").exists():
        assets_dir = frontend_dist / "assets"
        if assets_dir.exists():
            app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
        
        @app.get("/{full_path:path}")
        async def serve_frontend(full_path: str, request: Request):
            if full_path.startswith(("api/", "auth/", "static/", "docs", "openapi.json", "redoc", "health")):
                raise HTTPException(status_code=404, detail="Not found")
            index_path = frontend_dist / "index.html"
            if index_path.exists():
                return FileResponse(index_path)
            raise HTTPException(status_code=404, detail="Frontend not found")
    else:
        @app.get("/")
        def root():
            return {"message": "Wedding Website API", "status": "running", "frontend": "not built"}
except Exception as e:
    print(f"Warning: Could not setup frontend: {e}", file=sys.stderr)
    @app.get("/")
    def root():
        return {"message": "Wedding Website API", "status": "running"}


@app.on_event("startup")
async def startup_event():
    print("=" * 50, file=sys.stdout)
    print("Startup event started", file=sys.stdout)
    print("=" * 50, file=sys.stdout)
    
    # Criar tabelas primeiro
    try:
        from app.core.database import engine, Base
        if engine is not None:
            Base.metadata.create_all(bind=engine)
            print("Database tables created", file=sys.stdout)
        else:
            print("Warning: Database engine not initialized", file=sys.stderr)
    except Exception as e:
        print(f"Warning: Could not create tables: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
    
    # Criar admin user
    try:
        from app.core.database import SessionLocal
        if SessionLocal is None:
            print("Warning: SessionLocal not initialized, skipping admin creation", file=sys.stderr)
        else:
            from app.models.admin_user import AdminUser
            from app.core.security import get_password_hash
            from app.core.config import settings
            
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
                    print(f"Admin user created: {settings.ADMIN_USERNAME}", file=sys.stdout)
                else:
                    print(f"Admin user already exists: {settings.ADMIN_USERNAME}", file=sys.stdout)
            except Exception as e:
                print(f"Warning: Could not create admin user: {e}", file=sys.stderr)
                import traceback
                traceback.print_exc()
            finally:
                db.close()
    except Exception as e:
        print(f"Warning: Startup error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
    
    print("=" * 50, file=sys.stdout)
    print("Startup completed", file=sys.stdout)
    print("=" * 50, file=sys.stdout)

