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


class TopCommentItem(BaseModel):
    author: str
    text: str
    likes: int = 0


class ValidatedYouTubeVideo(BaseModel):
    videoId: str
    videoUrl: str
    embedId: str
    title: str
    channelName: str
    duration: str
    viewCount: int
    likeCount: int
    qualityScore: float
    relevanceScore: float = 0.0
    summaryTopic: str
    topComments: List[TopCommentItem] = []
    isValidated: bool = True


class VideoValidateRequest(BaseModel):
    topic: str = "Algoritma & Pemrograman"
    userNeedsSummary: Optional[str] = None
    queries: List[str] = []
    core_keywords: List[str] = []
    coreKeywords: List[str] = []
    candidateUrls: List[str] = []
    maxResults: int = 4


YouTubeValidateSearchRequest = VideoValidateRequest


class YouTubeValidateSearchResponse(BaseModel):
    topic: str
    userNeedsSummary: str
    recommendedQueries: List[str]
    videos: List[ValidatedYouTubeVideo]
    source: str = "yt-dlp"


class StageQuizQuestion(BaseModel):
    question: str
    options: List[str]
    correctIndex: int = 0
    explanation: str = ""


class StageQuizRequest(BaseModel):
    videoId: str
    videoTitle: Optional[str] = ""
    stageTitle: str = ""
    stageMaterial: Optional[str] = ""
    topic: Optional[str] = ""


class StageQuizResponse(BaseModel):
    videoId: str
    hasTranscript: bool
    transcriptSnippet: str
    manualSearchUrl: str
    quizQuestions: List[StageQuizQuestion]


