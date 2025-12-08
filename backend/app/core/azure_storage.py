"""Azure Blob Storage integration"""
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from app.core.config import settings
import os
from typing import Optional
import uuid
from pathlib import Path


def get_blob_service_client() -> Optional[BlobServiceClient]:
    """Get Azure Blob Service Client"""
    if not settings.AZURE_STORAGE_CONNECTION_STRING:
        return None
    
    try:
        return BlobServiceClient.from_connection_string(
            settings.AZURE_STORAGE_CONNECTION_STRING
        )
    except Exception as e:
        print(f"Error creating blob service client: {e}")
        return None


def get_container_client() -> Optional[ContainerClient]:
    """Get Azure Container Client"""
    blob_service = get_blob_service_client()
    if not blob_service:
        return None
    
    try:
        container_client = blob_service.get_container_client(
            settings.AZURE_STORAGE_CONTAINER
        )
        # Create container if it doesn't exist
        if not container_client.exists():
            container_client.create_container()
        return container_client
    except Exception as e:
        print(f"Error getting container client: {e}")
        return None


def upload_to_blob(file_content: bytes, filename: str, content_type: str = "image/jpeg") -> Optional[str]:
    """Upload file to Azure Blob Storage and return public URL"""
    container_client = get_container_client()
    if not container_client:
        return None
    
    try:
        # Generate unique filename
        file_ext = Path(filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        
        # Upload blob
        blob_client = container_client.upload_blob(
            name=unique_filename,
            data=file_content,
            overwrite=True,
            content_settings={"content_type": content_type}
        )
        
        # Return public URL
        # Extract account name from connection string
        account_name = None
        for part in settings.AZURE_STORAGE_CONNECTION_STRING.split(";"):
            if part.startswith("AccountName="):
                account_name = part.split("AccountName=")[1]
                break
        
        if account_name:
            return f"https://{account_name}.blob.core.windows.net/{settings.AZURE_STORAGE_CONTAINER}/{unique_filename}"
        else:
            # Fallback: try to get from blob_client
            return blob_client.url
    except Exception as e:
        print(f"Error uploading to blob: {e}")
        return None


def delete_from_blob(filename: str) -> bool:
    """Delete file from Azure Blob Storage"""
    container_client = get_container_client()
    if not container_client:
        return False
    
    try:
        # Extract filename from URL if full URL is provided
        if "blob.core.windows.net" in filename:
            filename = filename.split("/")[-1]
        
        blob_client = container_client.get_blob_client(filename)
        blob_client.delete_blob()
        return True
    except Exception as e:
        print(f"Error deleting from blob: {e}")
        return False

