from fastapi import APIRouter
from app.models.schemas import UserProfile

router = APIRouter()

@router.get("/auth/me", response_model=UserProfile)
def get_current_user():
    return {
        "id": "usr_mhs_001",
        "name": "Muhammad Hariz Lazuardi",
        "email": "mahasiswa@nexed.ai",
        "role": "mahasiswa",
        "nim_or_nip": "V3922001",
        "semester": 4,
        "prodi": "D3 Teknik Informatika SV UNS",
    }
