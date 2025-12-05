from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
import shutil
from pathlib import Path
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.models.admin_user import AdminUser

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Ensure upload directory exists
UPLOAD_DIR = Path(settings.STATIC_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("")
def upload_file(
    file: UploadFile = File(...),
    current_user: AdminUser = Depends(get_current_user)
):
    # Validate file type
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Generate unique filename
    import uuid
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    return {"url": f"/static/uploads/{unique_filename}"}


@router.delete("/{filename}")
def delete_file(
    filename: str,
    current_user: AdminUser = Depends(get_current_user)
):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path.unlink()
    return {"message": "File deleted"}

