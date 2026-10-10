import os
from typing import List

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

settings = Settings()
