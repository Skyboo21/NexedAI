from fastapi import APIRouter
from app.models.schemas import HealthCheckResponse

router = APIRouter()

@router.get("/health", response_model=HealthCheckResponse)
def health_endpoint():
    return {"status": "ok"}
