from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import health, auth, modul, tasks

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup Middleware CORS untuk Next.js Frontend (http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root-level welcome & service info: GET /
@app.get("/", tags=["Root"])
def root_index():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "auth_me": "/api/auth/me",
            "modul": "/api/modul",
            "tasks": "/api/tasks/nodes",
            "mastery": "/api/mastery",
        },
    }

# Root-level health check: GET /health -> {"status": "ok"}
@app.get("/health", tags=["Health"])
def root_health():
    return {"status": "ok"}

# Mount API Endpoints di bawah prefix /api
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(modul.router, prefix="/api", tags=["Modul & RAG"])
app.include_router(tasks.router, prefix="/api", tags=["Tasks & Mastery"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
