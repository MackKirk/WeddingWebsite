from pydantic_settings import BaseSettings
from typing import List, Union
import json
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./wedding.db"
    
    # JWT
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Admin
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"  # Will be hashed in database
    
    # CORS - pode vir como string JSON do ambiente
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Environment
    ENVIRONMENT: str = "dev"
    
    # Static files
    STATIC_DIR: str = "static/uploads"
    
    # Azure Blob Storage
    AZURE_STORAGE_CONNECTION_STRING: str = ""
    AZURE_STORAGE_CONTAINER: str = "biancaswedding"
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore"
    }
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS_ORIGINS se vier como string
        if isinstance(self.CORS_ORIGINS, str):
            try:
                self.CORS_ORIGINS = json.loads(self.CORS_ORIGINS)
            except:
                # Se não for JSON válido, usa como lista com um item
                self.CORS_ORIGINS = [self.CORS_ORIGINS] if self.CORS_ORIGINS else ["*"]


settings = Settings()

