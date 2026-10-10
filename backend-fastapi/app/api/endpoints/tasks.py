from fastapi import APIRouter
from typing import List
from app.models.schemas import LearningNodeItem, StudentMasteryItem

router = APIRouter()

@router.get("/tasks/nodes", response_model=List[LearningNodeItem])
def get_learning_nodes():
    return [
        {
            "id": 1,
            "title": "Pengantar Algoritma",
            "description": "Pemahaman dasar struktur logika dan algoritma sekuensial.",
            "status": "completed",
            "xp": 50,
        },
        {
            "id": 2,
            "title": "Struktur Kondisional",
            "description": "Mempelajari percabangan IF-ELSE dan Switch Case.",
            "status": "completed",
            "xp": 75,
        },
        {
            "id": 3,
            "title": "Looping & Iterasi",
            "description": "Mempelajari FOR dan WHILE loop bersama NEXED AI Bot.",
            "status": "recommended",
            "xp": 100,
        },
        {
            "id": 4,
            "title": "Struktur Data Array",
            "description": "Menyimpan banyak data dalam satu variabel.",
            "status": "locked",
            "xp": 0,
        },
    ]

@router.get("/mastery", response_model=List[StudentMasteryItem])
def get_student_mastery():
    return [
        {"id": 101, "name": "Ucik Dika Maharani", "topic": "Looping & Iterasi", "mastery": 92, "status": "Aman"},
        {"id": 102, "name": "Budi Santoso", "topic": "Struktur Array", "mastery": 45, "status": "Berisiko"},
        {"id": 103, "name": "Siti Aminah", "topic": "Pengantar Algoritma", "mastery": 78, "status": "Perlu Perhatian"},
        {"id": 104, "name": "Zam Zam Zahrina", "topic": "Looping & Iterasi", "mastery": 88, "status": "Aman"},
        {"id": 105, "name": "Rita Tri Rahmawati", "topic": "Struktur Kondisional", "mastery": 30, "status": "Berisiko"},
    ]
