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

@app.get("/debug/admin")
def debug_admin():
    """Debug endpoint to check admin credentials (only in dev)"""
    try:
        from app.core.config import settings
        from app.core.database import SessionLocal
        from app.models.admin_user import AdminUser
        
        admin_info = {
            "env_username": settings.ADMIN_USERNAME,
            "env_password_set": bool(settings.ADMIN_PASSWORD),
            "env_password_length": len(settings.ADMIN_PASSWORD) if settings.ADMIN_PASSWORD else 0,
        }
        
        if SessionLocal:
            db = SessionLocal()
            try:
                admin = db.query(AdminUser).filter(
                    AdminUser.username.ilike(settings.ADMIN_USERNAME)
                ).first()
                if admin:
                    admin_info["db_username"] = admin.username
                    admin_info["db_user_exists"] = True
                else:
                    admin_info["db_user_exists"] = False
            finally:
                db.close()
        else:
            admin_info["db_error"] = "SessionLocal not initialized"
        
        return admin_info
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}

@app.get("/debug/azure")
def debug_azure():
    """Debug endpoint to check Azure Blob Storage configuration"""
    try:
        from app.core.config import settings
        from app.core.azure_storage import get_container_client
        
        azure_info = {
            "connection_string_configured": bool(settings.AZURE_STORAGE_CONNECTION_STRING),
            "connection_string_length": len(settings.AZURE_STORAGE_CONNECTION_STRING) if settings.AZURE_STORAGE_CONNECTION_STRING else 0,
            "container_name": settings.AZURE_STORAGE_CONTAINER,
            "status": "unknown"
        }
        
        if not settings.AZURE_STORAGE_CONNECTION_STRING:
            azure_info["status"] = "not_configured"
            azure_info["error"] = "AZURE_STORAGE_CONNECTION_STRING is not set"
            return azure_info
        
        try:
            container_client = get_container_client()
            if container_client:
                azure_info["status"] = "connected"
                azure_info["container_exists"] = container_client.exists()
            else:
                azure_info["status"] = "connection_failed"
                azure_info["error"] = "Failed to get container client"
        except Exception as e:
            azure_info["status"] = "error"
            azure_info["error"] = str(e)
            import traceback
            azure_info["traceback"] = traceback.format_exc()
        
        return azure_info
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}

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
    ('seed', 'seed'),
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
    
    # Criar/Atualizar admin user
    try:
        from app.core.database import SessionLocal
        from app.core.config import settings
        
        print(f"Admin config - Username: {settings.ADMIN_USERNAME}", file=sys.stdout)
        print(f"Admin config - Password length: {len(settings.ADMIN_PASSWORD) if settings.ADMIN_PASSWORD else 0}", file=sys.stdout)
        
        if SessionLocal is None:
            print("Warning: SessionLocal not initialized, skipping admin creation", file=sys.stderr)
        else:
            from app.models.admin_user import AdminUser
            from app.core.security import get_password_hash
            
            db = SessionLocal()
            try:
                # Buscar admin (case-insensitive)
                admin = db.query(AdminUser).filter(
                    AdminUser.username.ilike(settings.ADMIN_USERNAME)
                ).first()
                
                if not admin:
                    # Criar novo admin
                    admin = AdminUser(
                        username=settings.ADMIN_USERNAME,
                        hashed_password=get_password_hash(settings.ADMIN_PASSWORD)
                    )
                    db.add(admin)
                    db.commit()
                    print(f"✅ Admin user CREATED: {settings.ADMIN_USERNAME}", file=sys.stdout)
                else:
                    # Atualizar username e senha do admin existente
                    old_username = admin.username
                    admin.username = settings.ADMIN_USERNAME
                    admin.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
                    db.commit()
                    if old_username != settings.ADMIN_USERNAME:
                        print(f"✅ Admin username UPDATED: {old_username} → {settings.ADMIN_USERNAME}", file=sys.stdout)
                    print(f"✅ Admin password UPDATED: {settings.ADMIN_USERNAME}", file=sys.stdout)
            except Exception as e:
                print(f"❌ Error creating/updating admin user: {e}", file=sys.stderr)
                import traceback
                traceback.print_exc()
            finally:
                db.close()
    except Exception as e:
        print(f"❌ Startup error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
    
    print("=" * 50, file=sys.stdout)
    print("Startup completed", file=sys.stdout)
    print("=" * 50, file=sys.stdout)

