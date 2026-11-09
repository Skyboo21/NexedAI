"""
Service: Quota-Free YouTube Video Validation, Relevance & Quality Filtering Pipeline (yt-dlp + YouTube oEmbed)
Alur 3 Tahap Cepat & Anti-Gagal:
1. Tahap 1 — Fast Flat Search (ytsearch4:{query} secara paralel untuk maks 3-4 query -> maks 8 kandidat videoId unik).
2. Tahap 2 — Live Verification via YouTube oEmbed (https://www.youtube.com/oembed) -> 100% video dipastikan menyala & judul/channel resmi.
3. Tahap 3 — Parallel Metadata, Likes, Top Comments & Core Keyword Relevance Filtering (asyncio.gather).
"""
import asyncio
import json
import math
import re
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

try:
    import yt_dlp  # type: ignore
except ImportError:
    yt_dlp = None  # type: ignore

try:
    from app.models.schemas import (
        TopCommentItem,
        ValidatedYouTubeVideo,
        YouTubeValidateSearchResponse,
    )
except ImportError:
    from ..models.schemas import (  # type: ignore
        TopCommentItem,
        ValidatedYouTubeVideo,
        YouTubeValidateSearchResponse,
    )

VALID_VIDEO_ID_RE = re.compile(r"^[a-zA-Z0-9_-]{11}$")


def _format_duration(seconds: Optional[Any]) -> str:
    if isinstance(seconds, str) and ":" in seconds:
        return seconds.strip()
    if not seconds or not isinstance(seconds, (int, float)) or seconds <= 0:
        return "15:00"
    total_sec = int(seconds)
    hours = total_sec // 3600
    minutes = (total_sec % 3600) // 60
    secs = total_sec % 60
    if hours > 0:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"


def _extract_video_id(url_or_id: str) -> str:
    if not url_or_id:
        return ""
    cleaned = url_or_id.strip()
    if len(cleaned) == 11 and VALID_VIDEO_ID_RE.match(cleaned):
        return cleaned
    match = re.search(
        r"(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|v/|shorts/))([a-zA-Z0-9_-]{11})",
        cleaned,
    )
    return match.group(1) if match else ""


def _compute_keyword_matches(
    title: str,
    description: str,
    core_keywords: List[str],
    topic: str,
) -> Tuple[int, float]:
    """
    Menghitung jumlah kecocokan kata kunci teknis (core_keywords) pada title atau description video
    (case-insensitive), serta mengembalikan (matched_count, relevance_score 0..100).
    """
    haystack = f"{title} {description}".lower()
    title_lower = title.lower()

    cleaned_keywords = [kw.strip().lower() for kw in core_keywords if kw and kw.strip()]
    if not cleaned_keywords:
        # Jika core_keywords kosong, ekstrak token bermakna dari topic
        cleaned_keywords = [
            t.lower() for t in re.split(r"[^\w#+]+", topic) if len(t) >= 3
        ]

    if not cleaned_keywords:
        return 1, 75.0

    matched_count = 0
    weighted_hits = 0.0

    for kw in cleaned_keywords:
        if kw in haystack:
            matched_count += 1
            weighted_hits += 2.0 if kw in title_lower else 1.2
            continue
        # Cek sub-token untuk frasa multi-kata (misal "Augmented Reality" -> "augmented", "reality")
        sub_tokens = [tok for tok in re.split(r"[^\w#+]+", kw) if len(tok) >= 3]
        if sub_tokens and any(tok in haystack for tok in sub_tokens):
            matched_count += 1
            weighted_hits += 1.4 if any(tok in title_lower for tok in sub_tokens) else 0.8

    if matched_count == 0:
        return 0, 0.0

    ratio = min(1.0, weighted_hits / max(len(cleaned_keywords) * 1.2, 1.0))
    relevance_score = round(min(100.0, 55.0 + ratio * 45.0), 1)
    return matched_count, relevance_score


def _compute_quality_score(
    view_count: int,
    like_count: int,
    duration_sec: int,
    relevance_score: float,
    comments_count: int,
) -> float:
    # 1. Relevance score weight (up to 45 pts) — prioritas tertinggi agar topik akurat
    rel_pts = (relevance_score / 100.0) * 45.0

    # 2. Popularity score based on viewCount (up to 25 pts)
    views_score = min(25.0, math.log10(max(view_count, 100)) * 4.2)

    # 3. Like-to-view engagement ratio: likeCount / max(viewCount, 1) (up to 18 pts)
    ratio = like_count / max(view_count, 1)
    engagement_score = min(18.0, ratio * 380.0) if like_count > 0 else 9.0

    # 4. Duration score & comments bonus (up to 12 pts)
    if 180 <= duration_sec <= 5400:
        duration_score = 8.0
    elif duration_sec > 5400:
        duration_score = 6.5
    elif 60 <= duration_sec < 180:
        duration_score = 4.5
    else:
        duration_score = 3.0

    comment_bonus = min(4.0, comments_count * 1.3)

    total = rel_pts + views_score + engagement_score + duration_score + comment_bonus
    return round(max(65.0, min(99.5, total)), 1)


def _flat_search_single_query(query: str) -> List[str]:
    """
    Tahap 1 Worker: Fast Flat Search untuk satu query menggunakan ytsearch4:{query}
    tanpa mengunduh metadata berat.
    """
    if yt_dlp is None or not query.strip():
        return []

    flat_opts: Dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": "in_playlist",
        "ignoreerrors": True,
        "skip_download": True,
        "socket_timeout": 5,
    }

    found_ids: List[str] = []
    try:
        with yt_dlp.YoutubeDL(flat_opts) as ydl:
            info = ydl.extract_info(f"ytsearch4:{query.strip()}", download=False)
            if not info or not isinstance(info, dict):
                return found_ids
            entries = info.get("entries") or []
            for entry in entries:
                if not entry or not isinstance(entry, dict):
                    continue
                vid = _extract_video_id(str(entry.get("id") or entry.get("url") or ""))
                if vid and len(vid) == 11 and vid not in found_ids:
                    dur = entry.get("duration")
                    if isinstance(dur, (int, float)) and 0 < dur < 60:
                        continue
                    found_ids.append(vid)
    except Exception as exc:
        print(f"[youtube_validator_service] Flat search error on '{query}': {exc}")

    return found_ids


def _verify_oembed_sync(video_id: str) -> Optional[Dict[str, str]]:
    """
    Worker sinkron untuk mengecek YouTube oEmbed endpoint.
    """
    if not video_id or not VALID_VIDEO_ID_RE.match(video_id):
        return None

    watch_url = f"https://www.youtube.com/watch?v={video_id}"
    oembed_url = (
        f"https://www.youtube.com/oembed?url={urllib.parse.quote(watch_url, safe='')}&format=json"
    )
    req = urllib.request.Request(
        oembed_url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            )
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=4.0) as resp:
            if resp.status != 200:
                return None
            raw = resp.read().decode("utf-8", errors="replace")
            data = json.loads(raw)
            title = str(data.get("title") or "").strip()
            author_name = str(data.get("author_name") or "").strip()
            if not title or title.lower() in {"deleted video", "private video"}:
                return None
            return {
                "videoId": video_id,
                "title": title,
                "author_name": author_name or "Kanal Edukasi YouTube",
            }
    except Exception:
        return None


async def verify_youtube_oembed(video_id: str) -> Optional[Dict[str, str]]:
    """
    Tahap 2 — Live Verification via YouTube oEmbed (Quota-Free & Cepat).
    Jika HTTP status != 200 atau gagal, langsung buang video_id tersebut.
    """
    return await asyncio.to_thread(_verify_oembed_sync, video_id)


def _extract_video_metadata_sync(
    oembed_info: Dict[str, str],
    topic: str,
    core_keywords: List[str],
) -> Optional[ValidatedYouTubeVideo]:
    """
    Tahap 3 Worker: Mengekstrak view_count, like_count, duration, 3 komentar teratas,
    serta memfilter relevansi terhadap core_keywords untuk video yang lolos YouTube oEmbed.
    """
    vid = oembed_info["videoId"]
    official_title = oembed_info["title"]
    official_channel = oembed_info["author_name"]
    watch_url = f"https://www.youtube.com/watch?v={vid}"

    view_count = 0
    like_count = 0
    duration_sec = 0
    duration_str = "15:00"
    description_raw = ""
    top_comments: List[TopCommentItem] = []
    summary_topic = f"Pembahasan materi dan demonstrasi praktis mengenai {official_title} oleh {official_channel}."

    if yt_dlp is not None:
        ydl_opts: Dict[str, Any] = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
            "ignoreerrors": True,
            "socket_timeout": 5,
            "getcomments": True,
            "extractor_args": {
                "youtube": {
                    "max_comments": ["3", "3", "0", "0"],
                    "comment_sort": ["top"],
                }
            },
        }
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(watch_url, download=False)
                if info and isinstance(info, dict):
                    availability = str(info.get("availability") or "public").lower()
                    if availability in {"private", "needs_auth", "subscriber_only", "unavailable"}:
                        return None

                    duration_sec = int(info.get("duration") or 0)
                    if 0 < duration_sec < 45:
                        return None
                    duration_str = _format_duration(
                        duration_sec if duration_sec > 0 else info.get("duration_string")
                    )

                    view_count = int(info.get("view_count") or 0)
                    like_count = int(info.get("like_count") or 0)

                    yt_title = str(info.get("title") or "").strip()
                    if yt_title and yt_title.lower() not in {"deleted video", "private video"}:
                        official_title = yt_title

                    yt_channel = str(info.get("channel") or info.get("uploader") or "").strip()
                    if yt_channel:
                        official_channel = yt_channel

                    raw_comments = info.get("comments") or []
                    if isinstance(raw_comments, list) and len(raw_comments) > 0:
                        valid_comments = [
                            c
                            for c in raw_comments
                            if isinstance(c, dict) and str(c.get("text") or "").strip()
                        ]
                        valid_comments.sort(
                            key=lambda c: int(c.get("like_count") or 0),
                            reverse=True,
                        )
                        for c in valid_comments[:3]:
                            text_clean = str(c.get("text") or "").strip()
                            if len(text_clean) > 220:
                                text_clean = text_clean[:217] + "..."
                            top_comments.append(
                                TopCommentItem(
                                    author=str(c.get("author") or "@penonton_youtube"),
                                    text=text_clean,
                                    likes=int(c.get("like_count") or 0),
                                )
                            )

                    description_raw = str(info.get("description") or "").strip()
                    first_line = (
                        description_raw.split("\n")[0].strip() if description_raw else ""
                    )
                    if len(first_line) > 25:
                        summary_topic = first_line[:160]
        except Exception as exc:
            print(f"[youtube_validator_service] Metadata extraction warning for {vid}: {exc}")

    matched_kw_count, relevance_score = _compute_keyword_matches(
        title=official_title,
        description=f"{description_raw} {official_channel}",
        core_keywords=core_keywords,
        topic=topic,
    )

    # Jika core_keywords tersedia dan video sama sekali tidak memiliki kecocokan (0 match)
    # di judul maupun deskripsi, eliminasi video agar tidak salah topik!
    if core_keywords and matched_kw_count == 0:
        return None

    quality_score = _compute_quality_score(
        view_count=view_count,
        like_count=like_count,
        duration_sec=duration_sec if duration_sec > 0 else 600,
        relevance_score=relevance_score,
        comments_count=len(top_comments),
    )

    return ValidatedYouTubeVideo(
        videoId=vid,
        videoUrl=watch_url,
        embedId=vid,
        title=official_title,
        channelName=official_channel,
        duration=duration_str,
        viewCount=view_count,
        likeCount=like_count,
        qualityScore=quality_score,
        relevanceScore=relevance_score,
        summaryTopic=summary_topic,
        topComments=top_comments,
        isValidated=True,
    )


async def validate_and_search_youtube_videos_async(
    topic: str,
    user_needs_summary: Optional[str] = None,
    queries: Optional[List[str]] = None,
    core_keywords: Optional[List[str]] = None,
    candidate_urls: Optional[List[str]] = None,
    max_results: int = 4,
) -> YouTubeValidateSearchResponse:
    """
    Pipeline 3 Tahap Asinkron:
    1. Fast Flat Search (ytsearch4:{query} untuk maks 3-4 query -> maks 8 kandidat videoId unik)
    2. Live Verification via YouTube oEmbed (wajib HTTP 200) + Pre-ranking relevansi judul
    3. Parallel Metadata, Likes, Top Comments & Core Keyword Filtering (asyncio.gather)
    """
    clean_topic = (topic or "Algoritma & Pemrograman").strip()
    needs_summary = (
        user_needs_summary
        or f"Mahasiswa membutuhkan penjelasan visual terstruktur dan studi kasus praktik untuk menguasai {clean_topic}."
    ).strip()

    effective_keywords = [
        kw.strip() for kw in (core_keywords or []) if kw and kw.strip()
    ]

    effective_queries = [q.strip() for q in (queries or []) if q and q.strip()][:4]
    if not effective_queries:
        if effective_keywords:
            kw_prefix = " ".join(effective_keywords[:3])
            effective_queries = [
                f"{kw_prefix} tutorial bahasa indonesia",
                f"{kw_prefix} practical tutorial",
                f"{clean_topic} {effective_keywords[0]} tutorial",
            ]
        else:
            effective_queries = [
                f"{clean_topic} tutorial indonesia",
                f"{clean_topic} practical tutorial",
                f"{clean_topic} course",
            ]

    # =========================================================================
    # TAHAP 1: Fast Flat Search (Tanpa Download Metadata Berat)
    # =========================================================================
    candidate_ids: List[str] = []

    if yt_dlp is not None:
        search_lists = await asyncio.gather(
            *(asyncio.to_thread(_flat_search_single_query, q) for q in effective_queries[:4]),
            return_exceptions=True,
        )
        for res in search_lists:
            if isinstance(res, list):
                for vid in res:
                    if vid and VALID_VIDEO_ID_RE.match(vid) and vid not in candidate_ids:
                        candidate_ids.append(vid)
                        if len(candidate_ids) >= 8:
                            break
            if len(candidate_ids) >= 8:
                break

    for url in (candidate_urls or []):
        if len(candidate_ids) >= 8:
            break
        vid = _extract_video_id(url)
        if vid and VALID_VIDEO_ID_RE.match(vid) and vid not in candidate_ids:
            candidate_ids.append(vid)

    candidate_ids = candidate_ids[:8]

    if not candidate_ids:
        return YouTubeValidateSearchResponse(
            topic=clean_topic,
            userNeedsSummary=needs_summary,
            recommendedQueries=effective_queries,
            videos=[],
            source="yt-dlp-empty",
        )

    # =========================================================================
    # TAHAP 2: Live Verification via YouTube oEmbed (Quota-Free & Cepat)
    # =========================================================================
    oembed_results = await asyncio.gather(
        *(verify_youtube_oembed(vid) for vid in candidate_ids),
        return_exceptions=True,
    )

    verified_oembed_list: List[Dict[str, str]] = []
    for item in oembed_results:
        if isinstance(item, dict) and item.get("videoId") and item.get("title"):
            verified_oembed_list.append(item)

    if not verified_oembed_list:
        return YouTubeValidateSearchResponse(
            topic=clean_topic,
            userNeedsSummary=needs_summary,
            recommendedQueries=effective_queries,
            videos=[],
            source="oembed-filtered-empty",
        )

    # Urutkan kandidat lolos oEmbed berdasarkan kecocokan judul dengan core_keywords terlebih dahulu
    if effective_keywords:
        verified_oembed_list.sort(
            key=lambda x: _compute_keyword_matches(
                x.get("title", ""),
                x.get("author_name", ""),
                effective_keywords,
                clean_topic,
            )[1],
            reverse=True,
        )

    # =========================================================================
    # TAHAP 3: Parallel Metadata, Likes, Top Comments & Keyword Relevance Filtering
    # =========================================================================
    metadata_results = await asyncio.gather(
        *(
            asyncio.to_thread(
                _extract_video_metadata_sync,
                oembed_item,
                clean_topic,
                effective_keywords,
            )
            for oembed_item in verified_oembed_list[:5]
        ),
        return_exceptions=True,
    )

    validated_videos: List[ValidatedYouTubeVideo] = []
    for item in metadata_results:
        if isinstance(item, ValidatedYouTubeVideo):
            validated_videos.append(item)

    # Urutkan berdasarkan kombinasi relevanceScore dan qualityScore tertinggi
    validated_videos.sort(
        key=lambda v: (v.relevanceScore, v.qualityScore),
        reverse=True,
    )
    limit = max(1, min(max_results, 4))

    return YouTubeValidateSearchResponse(
        topic=clean_topic,
        userNeedsSummary=needs_summary,
        recommendedQueries=effective_queries,
        videos=validated_videos[:limit],
        source="yt-dlp-oembed-verified",
    )


def validate_and_search_youtube_videos(
    topic: str,
    user_needs_summary: Optional[str] = None,
    queries: Optional[List[str]] = None,
    core_keywords: Optional[List[str]] = None,
    candidate_urls: Optional[List[str]] = None,
    max_results: int = 4,
) -> YouTubeValidateSearchResponse:
    """
    Wrapper sinkron untuk kompatibilitas pemanggilan non-async.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        import concurrent.futures

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
            future = pool.submit(
                asyncio.run,
                validate_and_search_youtube_videos_async(
                    topic=topic,
                    user_needs_summary=user_needs_summary,
                    queries=queries,
                    core_keywords=core_keywords,
                    candidate_urls=candidate_urls,
                    max_results=max_results,
                ),
            )
            return future.result()

    return asyncio.run(
        validate_and_search_youtube_videos_async(
            topic=topic,
            user_needs_summary=user_needs_summary,
            queries=queries,
            core_keywords=core_keywords,
            candidate_urls=candidate_urls,
            max_results=max_results,
        )
    )
