from pydantic_settings import BaseSettings
from typing import List


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
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Environment
    ENVIRONMENT: str = "dev"
    
    # Static files
    STATIC_DIR: str = "static/uploads"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

