from fastapi import APIRouter, UploadFile, File, Form
from typing import List
from datetime import datetime
from app.models.schemas import ModulItem, ChatPromptRequest, AiChatResponse

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
    return {
        "status": "success",
        "message": f"NEXED AI Tutor (FastAPI Engine): Penjelasan interaktif terkait '{user_query}' berhasil dirangkum berdasarkan materi modul.",
        "timestamp": datetime.now().isoformat(),
    }
