"""Azure Blob Storage integration"""
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, ContentSettings, PublicAccess
from app.core.config import settings
import os
from typing import Optional
import uuid
from pathlib import Path
import sys


def get_blob_service_client() -> Optional[BlobServiceClient]:
    """Get Azure Blob Service Client"""
    if not settings.AZURE_STORAGE_CONNECTION_STRING:
        print("Azure Storage Connection String is not configured.", file=sys.stderr)
        return None
    
    try:
        client = BlobServiceClient.from_connection_string(
            settings.AZURE_STORAGE_CONNECTION_STRING
        )
        print("Azure Blob Service Client created successfully.", file=sys.stdout)
        return client
    except Exception as e:
        print(f"Error creating blob service client: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return None


def get_container_client() -> Optional[ContainerClient]:
    """Get Azure Container Client"""
    if not settings.AZURE_STORAGE_CONNECTION_STRING:
        print("Azure Storage Connection String is not configured.", file=sys.stderr)
        return None
    
    if not settings.AZURE_STORAGE_CONTAINER:
        print("Azure Storage Container Name is not configured.", file=sys.stderr)
        return None
    
    blob_service = get_blob_service_client()
    if not blob_service:
        print("Failed to get blob service client.", file=sys.stderr)
        return None
    
    try:
        container_client = blob_service.get_container_client(
            settings.AZURE_STORAGE_CONTAINER
        )
        # Create container if it doesn't exist with public blob access
        if not container_client.exists():
            print(f"Creating Azure Blob Storage container: {settings.AZURE_STORAGE_CONTAINER} with public blob access", file=sys.stdout)
            container_client.create_container(public_access=PublicAccess.Blob)
        else:
            print(f"Azure Blob Storage container '{settings.AZURE_STORAGE_CONTAINER}' already exists.", file=sys.stdout)
            # Try to set public access if container exists but doesn't have it
            try:
                # Get current container properties
                properties = container_client.get_container_properties()
                if properties.public_access != PublicAccess.Blob:
                    print(f"Container exists but doesn't have public blob access. Attempting to set it...", file=sys.stdout)
                    container_client.set_container_access_policy(public_access=PublicAccess.Blob)
                    print(f"Set public blob access on existing container.", file=sys.stdout)
                else:
                    print(f"Container already has public blob access configured.", file=sys.stdout)
            except Exception as e:
                error_msg = str(e)
                if "PublicAccessNotPermitted" in error_msg or "anonymous access is disabled" in error_msg.lower():
                    print(f"ERROR: Cannot enable public access - anonymous access is disabled on the storage account.", file=sys.stderr)
                    print(f"Please enable 'Allow Blob public access' in Azure Portal:", file=sys.stderr)
                    print(f"  1. Go to Azure Portal → Storage Account (mkhubstorage01)", file=sys.stderr)
                    print(f"  2. Settings → Configuration → Enable 'Allow Blob public access'", file=sys.stderr)
                    print(f"  3. Containers → {settings.AZURE_STORAGE_CONTAINER} → Change access level → 'Blob'", file=sys.stderr)
                else:
                    print(f"Warning: Could not set public access on container: {e}", file=sys.stderr)
        return container_client
    except Exception as e:
        print(f"Error getting container client: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return None


def upload_to_blob(file_content: bytes, filename: str, content_type: str = "image/jpeg") -> Optional[str]:
    """Upload file to Azure Blob Storage and return public URL"""
    print(f"Attempting to upload {filename} to Azure Blob Storage...", file=sys.stdout)
    
    container_client = get_container_client()
    if not container_client:
        print("Container client is None, cannot upload to Azure.", file=sys.stderr)
        return None
    
    try:
        # Generate unique filename
        file_ext = Path(filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        
        print(f"Uploading blob with name: {unique_filename}, size: {len(file_content)} bytes", file=sys.stdout)
        
        # Upload blob
        blob_client = container_client.get_blob_client(unique_filename)
        content_settings = ContentSettings(content_type=content_type)
        blob_client.upload_blob(
            file_content,
            overwrite=True,
            content_settings=content_settings
        )
        
        print(f"Blob uploaded successfully: {unique_filename}", file=sys.stdout)
        
        # Return public URL
        # Extract account name from connection string
        account_name = None
        for part in settings.AZURE_STORAGE_CONNECTION_STRING.split(";"):
            if part.startswith("AccountName="):
                account_name = part.split("AccountName=")[1]
                break
        
        if account_name:
            blob_url = f"https://{account_name}.blob.core.windows.net/{settings.AZURE_STORAGE_CONTAINER}/{unique_filename}"
            print(f"Generated Azure Blob URL: {blob_url}", file=sys.stdout)
            return blob_url
        else:
            # Fallback: try to get from blob_client
            blob_url = blob_client.url
            print(f"Using blob_client.url: {blob_url}", file=sys.stdout)
            return blob_url
    except Exception as e:
        print(f"Error uploading to blob: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
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

