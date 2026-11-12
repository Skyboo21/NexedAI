import io
import re
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from fastapi import APIRouter, File, Form, UploadFile
from app.models.schemas import (
    AdaptiveLearningResponse,
    AdaptiveRecommendationRequest,
    AiChatResponse,
    ChatPromptRequest,
    ModulItem,
    StageQuizRequest,
    StageQuizResponse,
    YouTubeValidateSearchRequest,
    YouTubeValidateSearchResponse,
)
from app.services.recommender_service import generate_adaptive_recommendations
from app.services.youtube_validator_service import (
    generate_stage_quiz_service,
    validate_and_search_youtube_videos_async,
)

try:
    from pypdf import PdfReader  # type: ignore
except ImportError:
    PdfReader = None  # type: ignore


router = APIRouter()


def _extract_clean_document_text(filename: str, content: bytes) -> Tuple[str, int]:
    """
    Mengekstrak teks asli dari dokumen PDF (via pypdf.PdfReader), TXT/MD, atau Office XML.
    Mengembalikan tuple (clean_extracted_text, page_count).
    """
    lower_name = (filename or "dokumen.pdf").lower()
    raw_text = ""
    page_count = 1

    if lower_name.endswith(".pdf"):
        if PdfReader is not None:
            try:
                reader = PdfReader(io.BytesIO(content))
                page_count = len(reader.pages)
                pages_text: List[str] = []
                for idx, page in enumerate(reader.pages):
                    try:
                        page_str = page.extract_text() or ""
                    except Exception:
                        page_str = ""
                    if page_str.strip():
                        pages_text.append(f"[Halaman {idx + 1}]\n{page_str.strip()}")
                raw_text = "\n\n".join(pages_text)
            except Exception as exc:
                print(f"[extract-text] pypdf extraction error on {filename}: {exc}")

        # Fallback stream ekstraksi teks terbaca jika PDF memiliki encoding khusus
        if len(raw_text.strip()) < 30:
            decoded_latin = content.decode("latin-1", errors="ignore")
            matches = re.findall(r"\(([^()]{3,200})\)", decoded_latin)
            if matches:
                filtered = [
                    m for m in matches if re.search(r"[A-Za-z]{3,}", m) and not m.startswith("/")
                ]
                raw_text = " ".join(filtered)
    elif lower_name.endswith((".docx", ".pptx", ".odt")):
        decoded_latin = content.decode("latin-1", errors="ignore")
        xml_matches = re.findall(r"<(?:w|a):t[^>]*>([^<]+)</(?:w|a):t>", decoded_latin)
        if xml_matches:
            raw_text = " ".join(xml_matches)
        else:
            raw_text = content.decode("utf-8", errors="ignore")
    else:
        raw_text = content.decode("utf-8", errors="replace")

    # Bersihkan spasi dan newline berlebih tanpa merusak struktur paragraf
    cleaned = re.sub(r"[ \t]+", " ", raw_text)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    return cleaned[:15000], max(1, page_count)


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


@router.post("/modul/extract-text")
async def extract_module_text_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    content = await file.read()
    fname = file.filename or "dokumen.pdf"
    extracted_text, page_count = _extract_clean_document_text(fname, content)
    preview_snippet = extracted_text[:300].replace("\n", " ").strip()

    return {
        "success": True,
        "filename": fname,
        "pageCount": page_count,
        "extractedText": extracted_text,
        "previewSnippet": preview_snippet,
    }


@router.post("/modul/upload")
async def upload_modul(
    moduleId: str = Form("modul-upload"),
    file: UploadFile = File(...),
) -> Dict[str, Any]:
    content = await file.read()
    fname = file.filename or "dokumen.pdf"
    extracted_text, page_count = _extract_clean_document_text(fname, content)
    total_words = len(extracted_text.split()) if extracted_text else 0
    chunk_count = max(1, (total_words + 449) // 450)

    return {
        "success": True,
        "filename": fname,
        "moduleId": moduleId,
        "pageCount": page_count,
        "bytesRead": len(content),
        "chunkCount": chunk_count,
        "totalWords": total_words,
        "extractedText": extracted_text,
        "rawText": extracted_text,
        "previewSnippet": extracted_text[:300].replace("\n", " ").strip(),
        "message": f"Modul '{fname}' ({page_count} halaman) berhasil diekstrak.",
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


@router.post("/youtube/validate", response_model=YouTubeValidateSearchResponse)
@router.post("/youtube/validate-search", response_model=YouTubeValidateSearchResponse)
async def validate_and_search_youtube_endpoint(payload: YouTubeValidateSearchRequest):
    effective_keywords = (
        payload.core_keywords if payload.core_keywords else payload.coreKeywords
    )
    return await validate_and_search_youtube_videos_async(
        topic=payload.topic,
        user_needs_summary=payload.userNeedsSummary,
        queries=payload.queries,
        core_keywords=effective_keywords,
        candidate_urls=payload.candidateUrls,
        max_results=payload.maxResults,
    )


@router.post("/youtube/stage-quiz", response_model=StageQuizResponse)
def get_stage_video_quiz_endpoint(payload: StageQuizRequest):
    return generate_stage_quiz_service(
        video_id=payload.videoId,
        video_title=payload.videoTitle or "",
        stage_title=payload.stageTitle or "",
        stage_material=payload.stageMaterial or "",
        topic=payload.topic or "",
    )
