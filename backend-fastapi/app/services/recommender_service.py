"""
Service: Adaptive Learning & External Resource Recommender
Membedakan NexedAI dari sekadar document-chat dengan menyajikan rekomendasi materi terkurasi
(YouTube & Dokumentasi Resmi) serta pertanyaan diagnostik berbasis LLM (Groq API).
"""
import os
import sys
import json
from pathlib import Path
from typing import Optional, List

# Pastikan root direktori backend-fastapi terdaftar di sys.path
_current_file = Path(__file__).resolve()
_backend_root = _current_file.parent.parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

try:
    from app.models.schemas import AdaptiveLearningResponse, ExternalResource
    from app.core.config import settings
except ImportError:
    from ..models.schemas import AdaptiveLearningResponse, ExternalResource  # type: ignore
    from ..core.config import settings  # type: ignore

try:
    from groq import Groq  # type: ignore # pyright: ignore[reportMissingImports]
except (ImportError, ModuleNotFoundError):
    Groq = None  # type: ignore

# Database Terkurasi Referensi Materi Eksternal Berdasarkan Topik
CURATED_RESOURCES_DB = {
    "java": {
        "summary": "Pemahaman paradigma Berorientasi Objek (OOP) Java, struktur kelas, memory management JVM, dan eksekusi bytecode.",
        "questions": [
            "Apa perbedaan mendasar antara stack memory dan heap memory dalam alokasi objek Java?",
            "Bagaimana mekanisme enkapsulasi dan modifier access (private, protected, public) melindungi integritas data?",
            "Kapan kita harus menggunakan interface dibandingkan abstract class?",
        ],
        "resources": [
            ExternalResource(
                title="Java Full Course for Beginners - OOP & Core Architecture",
                type="YouTube",
                url="https://www.youtube.com/watch?v=A74TOX803D0",
                duration="25 Menit",
                description="Penjelasan visual komprehensif mengenai konsep dasar Java, JVM, kelas, dan inheritance.",
            ),
            ExternalResource(
                title="Oracle Java SE Official Documentation & API Specification",
                type="Dokumentasi",
                url="https://docs.oracle.com/en/java/javase/17/docs/api/",
                duration="15 Min Read",
                description="Dokumentasi referensi standar kelas pustaka Java, best practices OOP, dan spesifikasi sintaks.",
            ),
        ],
    },
    "struktur data": {
        "summary": "Analisis efisiensi algoritma (Big-O notation) dan representasi memori struktur data linear maupun non-linear.",
        "questions": [
            "Mengapa pencarian pada Hash Table memiliki rata-rata O(1) sedangkan Linked List O(n)?",
            "Dalam skenario apa Binary Search Tree lebih diunggulkan dibandingkan Array terurut?",
            "Bagaimana cara mendeteksi siklus pada graf menggunakan algoritma DFS?",
        ],
        "resources": [
            ExternalResource(
                title="Data Structures and Algorithms in 15 Minutes - Visualized",
                type="YouTube",
                url="https://www.youtube.com/watch?v=bum_19dhSgu",
                duration="15 Menit",
                description="Visualisasi animasi interaktif dari Tree traversal, Graph, Stack, dan Queue.",
            ),
            ExternalResource(
                title="VisuAlgo - Visualising Data Structures and Algorithms Interactively",
                type="Dokumentasi",
                url="https://visualgo.net/en",
                duration="20 Min Read",
                description="Simulasi interaktif langsung untuk menguji operasi tree, balancing AVL, dan graph traversal.",
            ),
        ],
    },
    "algoritma": {
        "summary": "Pola perancangan algoritma efisien mencakup Divide and Conquer, Greedy, dan Dynamic Programming.",
        "questions": [
            "Apa syarat sebuah masalah dapat diselesaikan dengan pendekatan Greedy?",
            "Bagaimana memoization pada Dynamic Programming mencegah komputasi rekursif berulang?",
        ],
        "resources": [
            ExternalResource(
                title="Algorithms Course - Graph & Sorting Optimization",
                type="YouTube",
                url="https://www.youtube.com/watch?v=0IAPZzGSbME",
                duration="30 Menit",
                description="Bedah konsep kompleksitas waktu dan studi kasus optimasi algoritma pengurutan modern.",
            ),
            ExternalResource(
                title="GeeksforGeeks Algorithms Master Guide",
                type="Dokumentasi",
                url="https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
                duration="18 Min Read",
                description="Tutorial modular algoritma dengan contoh kode dalam berbagai bahasa pemrograman.",
            ),
        ],
    },
    "basis data": {
        "summary": "Perancangan skema relasional, normalisasi data (1NF - 3NF), indexing B-Tree, dan integritas transaksi ACID.",
        "questions": [
            "Bagaimana indexing B-Tree mempercepat query SELECT dengan klausa WHERE?",
            "Jelaskan skenario di mana denormalisasi data diperlukan untuk performa read-heavy.",
        ],
        "resources": [
            ExternalResource(
                title="Database Design & Relational Modeling Tutorial",
                type="YouTube",
                url="https://www.youtube.com/watch?v=ztHopE5Wnpc",
                duration="20 Menit",
                description="Panduan mendalam normalisasi database relasional dan relasi Foreign Key.",
            ),
            ExternalResource(
                title="PostgreSQL Official Documentation - Architecture & SQL",
                type="Dokumentasi",
                url="https://www.postgresql.org/docs/current/",
                duration="15 Min Read",
                description="Dokumentasi resmi standar SQL, indexing, transaksi concurrent, dan query planner.",
            ),
        ],
    },
    "web": {
        "summary": "Arsitektur client-server modern, RESTful API, asynchronous JavaScript/TypeScript, dan state management.",
        "questions": [
            "Apa perbedaan mendasar Server-Side Rendering (SSR) dan Client-Side Rendering (CSR)?",
            "Bagaimana browser mengelola Event Loop saat menjalankan asynchronous asynchronous Promises?",
        ],
        "resources": [
            ExternalResource(
                title="Modern Web Architecture & Asynchronous Patterns",
                type="YouTube",
                url="https://www.youtube.com/watch?v=8aGhZQkoFbQ",
                duration="22 Menit",
                description="Bedah tuntas mekanisme event loop, DOM rendering pipeline, dan async await.",
            ),
            ExternalResource(
                title="MDN Web Docs - Web Technology for Developers",
                type="Dokumentasi",
                url="https://developer.mozilla.org/en-US/",
                duration="15 Min Read",
                description="Referensi dokumentasi web paling otoritatif untuk HTML5, CSS3, JavaScript, dan Web APIs.",
            ),
        ],
    },
}

DEFAULT_FALLBACK = {
    "summary": "Pendalaman materi komputasi terapan, fondasi logika pemrograman, dan arsitektur perangkat lunak modern.",
    "questions": [
        "Bagaimana konsep ini dapat dihubungkan dengan proyek riil di industri software?",
        "Apa trade-off utama dari segi kompleksitas waktu dan ruang saat mengimplementasikan konsep ini?",
    ],
    "resources": [
        ExternalResource(
            title="Computer Science Fundamentals - Visual Guide",
            type="YouTube",
            url="https://www.youtube.com/watch?v=tpIctyqH29Q",
            duration="18 Menit",
            description="Video pengayaan visual untuk memperkuat intuisi logika pemrograman dan abstraksi sistem.",
        ),
        ExternalResource(
            title="Roadmap.sh - Developer Learning Paths & Best Practices",
            type="Dokumentasi",
            url="https://roadmap.sh/",
            duration="15 Min Read",
            description="Panduan kurikulum interaktif untuk keterampilan komputasi dan rekayasa perangkat lunak.",
        ),
    ],
}


def _clean_str(val: any) -> str:
    """Membersihkan karakter unicode tipografi khusus yang rentan memicu UnicodeEncodeError pada Windows cp1252."""
    if val is None:
        return ""
    text = str(val)
    return (
        text.replace("\u2011", "-")
        .replace("\u2012", "-")
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .strip()
    )


def get_curated_fallback(topic_query: str) -> AdaptiveLearningResponse:
    """Mengambil materi kurasi cerdas berdasarkan pencocokan kata kunci topik."""
    clean_query = _clean_str(topic_query)
    lower_query = clean_query.lower()
    matched_key = None
    for key in CURATED_RESOURCES_DB:
        if key in lower_query:
            matched_key = key
            break

    data = CURATED_RESOURCES_DB.get(matched_key, DEFAULT_FALLBACK)
    return AdaptiveLearningResponse(
        topic=clean_query or "Materi Terpilih",
        summary=_clean_str(data["summary"]),
        diagnostic_questions=[_clean_str(q) for q in data["questions"]],
        external_resources=data["resources"],
    )


def generate_adaptive_recommendations(
    topic: str,
    summary: Optional[str] = None
) -> AdaptiveLearningResponse:
    """
    Menghasilkan rekomendasi adaptif menggunakan Groq LLM API jika tersedia,
    dengan fallback deterministik ke repository materi terkurasi.
    """
    topic_clean = topic.strip() or "Pemrograman & Struktur Data"
    api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")

    if not api_key or Groq is None:
        return get_curated_fallback(topic_clean)

    # Memanggil Groq API untuk personalisasi LLM
    try:
        client = Groq(api_key=api_key)

        topic_encoded = topic_clean.replace(" ", "+")
        prompt = f"""
        Kamu adalah AI Academic Advisor untuk mahasiswa D3 Teknik Informatika SV UNS.
        Analisis topik/modul berikut dan berikan jalur pembelajaran adaptif terstruktur:
        Topik: {topic_clean}
        Ringkasan Materi: {summary or "Materi perkuliahan informatika dasar hingga lanjutan"}

        ATURAN KHUSUS EXTERNAL RESOURCES:
        - DILARANG KERAS menghasilkan link pencarian umum (/results?search_query= atau /search)!
        - Link YouTube HARUS direct link video spesifik (https://www.youtube.com/watch?v=VIDEO_ID) dari kreator terpercaya.
        - Link Dokumentasi HARUS direct link ke spesifikasi/bab/sub-bab resmi (misal MDN, W3Schools, PostgreSQL Docs, Oracle Docs).

        Format output HARUS berupa JSON valid dengan struktur:
        {{
            "topic": "{topic_clean}",
            "summary": "Ringkasan intisari adaptif dalam 2 kalimat berbobot",
            "diagnostic_questions": [
                "Pertanyaan diagnostik active recall 1",
                "Pertanyaan diagnostik active recall 2",
                "Pertanyaan diagnostik active recall 3"
            ],
            "external_resources": [
                {{
                    "title": "Judul Video YouTube spesifik",
                    "type": "YouTube",
                    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
                    "duration": "15-25 Menit",
                    "description": "Deskripsi singkat isi video dan topik yang dibahas"
                }},
                {{
                    "title": "Dokumentasi Resmi / Panduan Sub-Bab",
                    "type": "Dokumentasi",
                    "url": "https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Statements/for",
                    "duration": "10-20 Min Read",
                    "description": "Panduan resmi spesifikasi sintaks dan best practice"
                }}
            ]
        }}
        Berikan HANYA JSON tanpa format markdown pembungkus.
        """

        # Model cascading untuk kehandalan optimal
        candidate_models = [
            getattr(settings, "GROQ_MODEL", "openai/gpt-oss-120b"),
            "openai/gpt-oss-120b",
            "openai/gpt-oss-20b",
            "qwen/qwen3.8-27b",
        ]

        completion = None
        for model_name in candidate_models:
            if not model_name:
                continue
            try:
                completion = client.chat.completions.create(
                    model=model_name,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2,
                    response_format={"type": "json_object"},
                )
                if completion and completion.choices and completion.choices[0].message.content:
                    break
            except Exception as model_err:
                print(f"[recommender_service] Model {model_name} gagal, mencoba alternatif: {model_err}")
                continue

        if not completion or not completion.choices or not completion.choices[0].message.content:
            return get_curated_fallback(topic_clean)

        raw_json = completion.choices[0].message.content.strip()
        parsed = json.loads(raw_json)

        resources: List[ExternalResource] = []
        for res in parsed.get("external_resources", []):
            url_str = str(res.get("url", "#")).strip()
            # Tolak link pencarian umum atau link yang tidak diawali http
            if (
                "results?search_query" in url_str
                or "/search" in url_str
                or url_str == "#"
                or not url_str.startswith("http")
            ):
                continue
            resources.append(
                ExternalResource(
                    title=_clean_str(res.get("title", "Materi Pendukung")),
                    type=_clean_str(res.get("type", "Dokumentasi")),
                    url=url_str,
                    duration=_clean_str(res.get("duration", "15 Menit")),
                    description=_clean_str(res.get("description", "Materi pengayaan eksternal terkurasi.")),
                )
            )

        if len(resources) < 2:
            fallback = get_curated_fallback(topic_clean)
            resources = fallback.external_resources

        return AdaptiveLearningResponse(
            topic=_clean_str(parsed.get("topic", topic_clean)),
            summary=_clean_str(parsed.get("summary", get_curated_fallback(topic_clean).summary)),
            diagnostic_questions=[
                _clean_str(q)
                for q in parsed.get(
                    "diagnostic_questions",
                    get_curated_fallback(topic_clean).diagnostic_questions,
                )
            ],
            external_resources=resources,
        )
    except Exception as exc:
        print(f"[recommender_service] Groq API fallback triggered: {exc}")
        return get_curated_fallback(topic_clean)


if __name__ == "__main__":
    test_topic = "Pemrograman Java OOP"
    print(f"Menguji Recommender Service untuk topik: '{test_topic}'...")
    res = generate_adaptive_recommendations(test_topic)
    print("\n[Hasil Rekomendasi]")
    print(f"Topik: {res.topic}")
    print(f"Ringkasan: {res.summary}")
    print(f"Pertanyaan Diagnostik ({len(res.diagnostic_questions)}):")
    for q in res.diagnostic_questions:
        print(f" - {q}")
    print(f"Sumber Eksternal ({len(res.external_resources)}):")
    for r in res.external_resources:
        print(f" - [{r.type}] {r.title} ({r.duration}) -> {r.url}")

