from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional
from datetime import datetime
from app.models.schemas import (
    ModulItem,
    ChatPromptRequest,
    AiChatResponse,
    AdaptiveLearningResponse,
    AdaptiveRecommendationRequest,
)
from app.services.recommender_service import generate_adaptive_recommendations

router = APIRouter()

@router.get("/modul", response_model=List[ModulItem])
def get_modul_list():
    return [
        {
            "id": "modul-1",
            "title": "Pengantar Algoritma & Logika Pemrograman",
            "category": "Informatika Dasar",
            "total_chunks": 12,
            "difficulty": "Dasar",
            "status": "ready",
        },
        {
            "id": "modul-2",
            "title": "Struktur Data & Kompleksitas Algoritma",
            "category": "Algoritma",
            "total_chunks": 18,
            "difficulty": "Menengah",
            "status": "ready",
        },
        {
            "id": "modul-3",
            "title": "Pemrograman Java Lanjut & OOP",
            "category": "Pemrograman",
            "total_chunks": 24,
            "difficulty": "Lanjut",
            "status": "ready",
        },
    ]

@router.post("/modul/upload")
async def upload_modul(moduleId: str = Form(...), file: UploadFile = File(...)):
    content = await file.read()
    return {
        "success": True,
        "filename": file.filename,
        "moduleId": moduleId,
        "bytesRead": len(content),
        "chunkCount": 6,
        "totalWords": 1250,
        "message": f"Modul '{file.filename}' berhasil diindeks ke vector store.",
    }

@router.post("/modul/chat", response_model=AiChatResponse)
def chat_modul(payload: ChatPromptRequest):
    user_query = payload.prompt or payload.message or "Pertanyaan materi"
    lower_query = user_query.lower()

    if "infinite loop" in lower_query:
        msg = "Infinite Loop terjadi bila batas kondisi (seperti i < 10) tidak pernah tercapai, biasanya karena kamu lupa menambahkan increment (i++). Program akan terus berjalan sampai kehabisan memori. Harus sangat berhati-hati!"
    elif "for loop" in lower_query:
        msg = "FOR Loop ibarat kamu disuruh berlari keliling lapangan sebanyak 5 putaran. Kamu sudah tahu persis jumlah akhirnya (5) sebelum mulai."
    elif "while loop" in lower_query:
        msg = "WHILE Loop ibarat kamu disuruh berlari keliling lapangan sampai kamu capek. Kamu tidak tahu berapa putaran pastinya, tapi tahu persis kapan harus berhenti (saat capek)."
    else:
        msg = f"NEXED AI Tutor (FastAPI Engine): Penjelasan interaktif terkait '{user_query}' berhasil dirangkum berdasarkan materi modul."

    return {
        "status": "success",
        "message": msg,
        "timestamp": datetime.now().isoformat(),
    }

@router.post("/modul/{id}/adaptive-recommendations", response_model=AdaptiveLearningResponse)
def get_module_adaptive_recommendations_post(
    id: str,
    payload: Optional[AdaptiveRecommendationRequest] = None,
):
    topic = payload.topic if (payload and payload.topic) else id.replace("-", " ").title()
    summary = payload.summary if payload else None
    return generate_adaptive_recommendations(topic=topic, summary=summary)

@router.get("/modul/{id}/adaptive-recommendations", response_model=AdaptiveLearningResponse)
def get_module_adaptive_recommendations_get(id: str):
    topic = id.replace("-", " ").title()
    return generate_adaptive_recommendations(topic=topic)

