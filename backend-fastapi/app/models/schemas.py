from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HealthCheckResponse(BaseModel):
    status: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str
    nim_or_nip: Optional[str] = None
    semester: Optional[int] = None
    prodi: Optional[str] = None

class ModulItem(BaseModel):
    id: str
    title: str
    category: str
    total_chunks: int
    difficulty: str
    status: str

class ChatPromptRequest(BaseModel):
    prompt: Optional[str] = None
    message: Optional[str] = None
    moduleId: Optional[str] = None

class AiChatResponse(BaseModel):
    status: str
    message: str
    timestamp: str

class LearningNodeItem(BaseModel):
    id: int
    title: str
    description: str
    status: str
    xp: int

class StudentMasteryItem(BaseModel):
    id: int
    name: str
    topic: str
    mastery: int
    status: str

class ExternalResource(BaseModel):
    title: str
    type: str  # "YouTube" atau "Dokumentasi"
    url: str
    duration: str
    description: str

class AdaptiveLearningResponse(BaseModel):
    topic: str
    summary: str
    diagnostic_questions: List[str]
    external_resources: List[ExternalResource]

class AdaptiveRecommendationRequest(BaseModel):
    topic: Optional[str] = None
    summary: Optional[str] = None

