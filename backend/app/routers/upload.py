from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
import shutil
from pathlib import Path
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.models.admin_user import AdminUser
from app.core.azure_storage import upload_to_blob, delete_from_blob

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Ensure upload directory exists (fallback for local storage)
UPLOAD_DIR = Path(settings.STATIC_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    current_user: AdminUser = Depends(get_current_user)
):
    # Validate file type
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Read file content
    file_content = await file.read()
    content_type = file.content_type or "image/jpeg"
    
    # Try Azure Blob Storage first
    blob_url = upload_to_blob(file_content, file.filename, content_type)
    
    if blob_url:
        # Successfully uploaded to Azure
        return {"url": blob_url}
    
    # Fallback to local storage
    import uuid
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file locally
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    
    # Return URL
    return {"url": f"/static/uploads/{unique_filename}"}


@router.delete("/{filename:path}")
def delete_file(
    filename: str,
    current_user: AdminUser = Depends(get_current_user)
):
    # Try Azure Blob Storage first
    if delete_from_blob(filename):
        return {"message": "File deleted from Azure Blob Storage"}
    
    # Fallback to local storage
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path.unlink()
    return {"message": "File deleted from local storage"}

