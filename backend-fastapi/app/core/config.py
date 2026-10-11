import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Muat variabel environment dari .env di backend-fastapi atau .env.local di root repo
_backend_dir = Path(__file__).resolve().parent.parent.parent
_env_backend = _backend_dir / ".env"
_env_root = _backend_dir.parent / ".env.local"

if _env_backend.exists():
    load_dotenv(dotenv_path=_env_backend)
if _env_root.exists():
    load_dotenv(dotenv_path=_env_root, override=False)

class Settings:
    PROJECT_NAME: str = "NexedAI Backend API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Origins Next.js yang diizinkan untuk CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ]
    
    # Konfigurasi AI & RAG
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

settings = Settings()

