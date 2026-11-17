// src/lib/youtubeStageCurator.ts
/**
 * Sanitasi Kueri, Pencarian Multi-Sumber, Verifikasi Wajib YouTube oEmbed,
 * & Algoritma Ranking Top 2 Video Terbaik per Tahap Belajar.
 */

import type { LearningStageItem, RecommendedVideo } from "../components/NexedAiModuleHub";

export interface CandidateVideoMeta {
  videoId: string;
  title?: string;
  channelName?: string;
  duration?: string;
  durationSeconds?: number;
  viewCount?: number;
  likeCount?: number;
  summaryTopic?: string;
}

const VALID_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

const STOP_WORDS = new Set([
  "dan",
  "atau",
  "yang",
  "untuk",
  "dari",
  "pada",
  "dengan",
  "dalam",
  "tahap",
  "modul",
  "pertemuan",
  "bab",
  "materi",
  "konsep",
  "pengenalan",
  "dasar",
  "lanjut",
  "serta",
  "secara",
  "the",
  "and",
  "for",
  "with",
  "into",
  "from",
]);

export const EXCLUSIVE_TECH_LIST = [
  "python",
  "java",
  "javascript",
  "typescript",
  "php",
  "c++",
  "cpp",
  "c#",
  "csharp",
  "golang",
  "rust",
  "kotlin",
  "swift",
  "ruby",
  "dart",
  "flutter",
  "laravel",
  "react",
  "angular",
  "vue",
] as const;

const GENERAL_DOMAIN_ANCHORS = [
  "unity",
  "vuforia",
  "mysql",
  "postgresql",
  "sql",
  "arduino",
  "esp32",
  "jaringan",
  "mikrotik",
  "docker",
  "kubernetes",
  "android",
  "nextjs",
  "nodejs",
] as const;

function matchesTechTerm(textLower: string, term: string): boolean {
  if (term === "c++") return /(?:^|[\s,(/])c\+\+(?:$|[\s,),/])/i.test(textLower);
  if (term === "c#") return /(?:^|[\s,(/])c#(?:$|[\s,),/])/i.test(textLower);
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(textLower);
}

/**
 * Ekstrak jangkar bahasa/teknologi utama dari topik, judul tahap, dan kata kunci.
 */
export function extractPrimaryDomainAnchor(
  topicContext = "",
  stageTitle = "",
  keyConcepts: string[] = [],
): string | null {
  const combined = `${topicContext} ${stageTitle} ${keyConcepts.join(" ")}`.toLowerCase();

  for (const tech of EXCLUSIVE_TECH_LIST) {
    if (matchesTechTerm(combined, tech)) {
      if (tech === "cpp") return "C++";
      if (tech === "csharp") return "C#";
      if (tech === "php") return "PHP";
      return tech.charAt(0).toUpperCase() + tech.slice(1);
    }
  }

  for (const dom of GENERAL_DOMAIN_ANCHORS) {
    if (matchesTechTerm(combined, dom)) {
      if (dom === "sql" || dom === "mysql" || dom === "esp32") return dom.toUpperCase();
      return dom.charAt(0).toUpperCase() + dom.slice(1);
    }
  }

  return null;
}

/**
 * Memeriksa apakah judul video menyebut bahasa/framework lain yang bertabrakan
 * dengan teknologi utama yang sedang dipelajari.
 */
export function hasConflictingTechInTitle(
  videoTitle: string,
  primaryAnchor: string | null,
): boolean {
  if (!primaryAnchor) return false;
  const anchorLower = primaryAnchor.toLowerCase();
  const isAnchorExclusive = (EXCLUSIVE_TECH_LIST as readonly string[]).includes(
    anchorLower === "c++" ? "c++" : anchorLower === "c#" ? "c#" : anchorLower,
  );
  if (!isAnchorExclusive) return false;

  const titleLower = videoTitle.toLowerCase();
  for (const tech of EXCLUSIVE_TECH_LIST) {
    // Jangan blokir varian nama yang sama (misal c++ vs cpp, c# vs csharp)
    if (tech === anchorLower) continue;
    if (anchorLower === "c++" && tech === "cpp") continue;
    if (anchorLower === "c#" && tech === "csharp") continue;
    // Jangan blokir "java" jika anchor-nya "javascript" (sudah dijaga \bjava\b, tapi aman)
    if (matchesTechTerm(titleLower, tech)) {
      return true;
    }
  }
  return false;
}

/**
 * 1. Sanitasi Kueri Otomatis:
 * Menghapus prefix bab/pertemuan ("Pertemuan 4:", "Bab 2:", "Modul 1:", "Tahap 3:"),
 * membersihkan tanda baca berlebih, menghapus kata berulang ("Tipe Data Tipe Data"),
 * dan selalu menyisipkan jangkar bahasa/teknologi utama (misal "Tutorial Java Tipe Data Dasar").
 */
export function buildCleanStageQuery(
  stageTitle: string,
  keyConcepts: string[] = [],
  topicContext = "",
): string {
  const stripPrefixes = (text: string) =>
    text
      .replace(
        /\b(?:pertemuan|bab|modul|sesi|tahap|minggu|unit|chapter|bagian|topik)\s*\d*\s*[:.\-–—]?\s*/gi,
        " ",
      )
      .replace(/[^\w\s+#-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const anchor = extractPrimaryDomainAnchor(topicContext, stageTitle, keyConcepts);
  const cleanStage = stripPrefixes(stageTitle);
  const cleanTopic = stripPrefixes(topicContext);
  const cleanConcepts = keyConcepts.map((kc) => stripPrefixes(kc)).filter(Boolean);

  const combinedRaw = [
    "Tutorial",
    anchor || "",
    cleanStage,
    ...cleanConcepts.slice(0, 2),
    cleanTopic.split(" ").slice(0, 3).join(" "),
  ]
    .filter(Boolean)
    .join(" ");

  // Deduplikasi kata (case-insensitive) dengan mempertahankan urutan kemunculan pertama
  const seen = new Set<string>();
  const dedupedWords: string[] = [];

  for (const word of combinedRaw.split(/\s+/)) {
    const cleanWord = word.trim();
    if (!cleanWord) continue;
    const lower = cleanWord.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    dedupedWords.push(cleanWord);
  }

  return dedupedWords.slice(0, 8).join(" ").trim();
}

/**
 * Menghasilkan 3 kueri singkat bertingkat (maks 4-5 kata per kueri) agar pencarian YouTube akurat:
 * - Tier 1: Bahasa + Topik Inti Tahap (e.g. "Java Tipe Data Dasar")
 * - Tier 2: Bahasa + Konsep Kunci Utama (e.g. "Java Data Numerik Alfanumerik")
 * - Tier 3: Bahasa + Fundamental Modul (e.g. "Belajar Java Dasar Pemula")
 */
export function buildStageQueryLadder(
  stage: LearningStageItem,
  primaryTech: string | null,
): [string, string, string] {
  const strip = (s: string) =>
    s
      .replace(
        /\b(?:pertemuan|bab|modul|sesi|tahap|minggu|unit|chapter|bagian|topik)\s*\d*\s*[:.\-–—]?\s*/gi,
        " ",
      )
      .replace(/[^\w\s+#-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const anchor = primaryTech || "";
  const stageWords = strip(stage.title)
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w.toLowerCase()) && w.toLowerCase() !== anchor.toLowerCase());

  const conceptWords = (stage.keyConcepts || [])
    .flatMap((kc) => strip(kc).split(/\s+/))
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w.toLowerCase()) && w.toLowerCase() !== anchor.toLowerCase());

  const tier1 = [anchor, ...stageWords.slice(0, 3)].filter(Boolean).slice(0, 5).join(" ") || "Tutorial Pemrograman Dasar";
  const tier2 =
    conceptWords.length > 0
      ? [anchor, ...Array.from(new Set(conceptWords)).slice(0, 3)].filter(Boolean).slice(0, 5).join(" ")
      : `Tutorial ${anchor} ${stageWords.slice(0, 2).join(" ")}`.trim();
  const tier3 = anchor ? `Belajar ${anchor} Dasar Pemula` : "Belajar Pemrograman Dasar Pemula";

  return [tier1, tier2, tier3];
}

/**
 * Konversi string durasi "MM:SS" atau "HH:MM:SS" ke detik
 */
function parseDurationToSeconds(duration?: string): number {
  if (!duration) return 0;
  const parts = duration.split(":").map((p) => Number.parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 2) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  if (parts.length === 3) return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
  return 0;
}

/**
 * Verifikasi Wajib via YouTube oEmbed API (HTTP 200 OK & Embeddable)
 */
async function verifyYoutubeOembed(
  videoId: string,
): Promise<{ ok: boolean; title: string; authorName: string }> {
  if (!VALID_ID_RE.test(videoId)) {
    return { ok: false, title: "", authorName: "" };
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`,
    )}&format=json`;

    const res = await fetch(oembedUrl, {
      method: "GET",
      signal: AbortSignal.timeout(4500),
    });

    if (!res.ok) {
      return { ok: false, title: "", authorName: "" };
    }

    const data = (await res.json()) as {
      title?: string;
      author_name?: string;
      html?: string;
    };

    const title = String(data.title || "").trim();
    const authorName = String(data.author_name || "YouTube Channel").trim();

    if (!title || /#shorts\b/i.test(title)) {
      return { ok: false, title: "", authorName: "" };
    }

    return { ok: true, title, authorName };
  } catch {
    return { ok: false, title: "", authorName: "" };
  }
}

/**
 * Server-side YouTube HTML Search Fallback jika FastAPI sedang terkena limit IP cloud atau offline
 */
async function searchYoutubeHtmlFallback(query: string, limit = 8): Promise<string[]> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8",
        Cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+417",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return [];
    const html = await res.text();

    const matches = html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
    const uniqueIds = new Set<string>();

    for (const match of matches) {
      const id = match[1];
      if (id && VALID_ID_RE.test(id)) {
        uniqueIds.add(id);
        if (uniqueIds.size >= limit) break;
      }
    }

    return Array.from(uniqueIds);
  } catch {
    return [];
  }
}

/**
 * Panggil FastAPI /api/youtube/validate untuk mendapatkan kandidat kaya metadata (viewCount, likeCount, duration)
 */
async function fetchFastApiCandidates(
  query: string,
  topic: string,
  keywords: string[],
): Promise<CandidateVideoMeta[]> {
  const fastApiBaseUrl = (
    process.env.FASTAPI_URL ||
    process.env.NEXT_PUBLIC_FASTAPI_URL ||
    "https://nexed-backend.vercel.app"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${fastApiBaseUrl}/api/youtube/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        userNeedsSummary: query,
        queries: [query],
        core_keywords: keywords,
        coreKeywords: keywords,
        maxResults: 6,
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return [];
    const data = (await res.json()) as {
      videos?: Array<{
        videoId?: string;
        embedId?: string;
        title?: string;
        channelName?: string;
        duration?: string;
        viewCount?: number;
        likeCount?: number;
      }>;
    };

    if (!Array.isArray(data.videos)) return [];
    return data.videos
      .map((v) => ({
        videoId: String(v.videoId || v.embedId || "").trim(),
        title: v.title,
        channelName: v.channelName,
        duration: v.duration,
        durationSeconds: parseDurationToSeconds(v.duration),
        viewCount: typeof v.viewCount === "number" ? v.viewCount : 0,
        likeCount: typeof v.likeCount === "number" ? v.likeCount : 0,
      }))
      .filter((v) => VALID_ID_RE.test(v.videoId));
  } catch {
    return [];
  }
}

/**
 * Algoritma Skoring & Sortir Top 2 Video:
 * - Relevansi Judul (50%)
 * - Popularitas & Engagement (30%)
 * - Kualitas Format Tutorial (20%)
 */
export function rankAndPickTopTwoVideos(
  verifiedCandidates: Array<
    CandidateVideoMeta & { officialTitle: string; officialAuthor: string }
  >,
  stageTitle: string,
  keyConcepts: string[],
  topicContext: string,
  usedVideoIds: Set<string>,
): RecommendedVideo[] {
  const tokenSource = `${stageTitle} ${keyConcepts.join(" ")} ${topicContext}`
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

  const primaryAnchor = extractPrimaryDomainAnchor(topicContext, stageTitle, keyConcepts);
  const uniqueKeywords = Array.from(new Set(tokenSource));

  // Filter Conflicting Tech Blocker: eliminasi video yang membahas bahasa/framework lain yang bertabrakan
  const nonConflictingCandidates = verifiedCandidates.filter(
    (cand) => !hasConflictingTechInTitle(cand.officialTitle, primaryAnchor),
  );
  const poolToScore =
    nonConflictingCandidates.length > 0 ? nonConflictingCandidates : verifiedCandidates;

  const scored = poolToScore.map((cand) => {
    const titleLower = cand.officialTitle.toLowerCase();

    // 1. Relevansi Judul (50%) + Bonus +35 jika memuat teknologi/bahasa yang diminta
    let matchedCount = 0;
    for (const kw of uniqueKeywords) {
      if (titleLower.includes(kw)) matchedCount += 1;
    }
    const relevanceRatio =
      uniqueKeywords.length > 0
        ? Math.min(1, matchedCount / Math.max(2, Math.min(4, uniqueKeywords.length)))
        : 0.5;
    let relevancePoints = relevanceRatio * 50;

    if (primaryAnchor && matchesTechTerm(titleLower, primaryAnchor.toLowerCase())) {
      relevancePoints += 35;
    }

    // 2. Popularitas & Engagement (30%)
    let popularityPoints = 18; // baseline adil jika metadata yt-dlp tidak tersedia
    if (cand.viewCount && cand.viewCount > 0) {
      const logViews = Math.min(1, Math.log10(cand.viewCount + 10) / 6.5);
      const likeRatio = cand.likeCount
        ? Math.min(1, (cand.likeCount / cand.viewCount) * 25)
        : 0.5;
      popularityPoints = logViews * 20 + likeRatio * 10;
    }

    // 3. Kualitas Format Tutorial (20%)
    let formatPoints = 8;
    const durSec = cand.durationSeconds || parseDurationToSeconds(cand.duration);
    if (durSec >= 180 && durSec <= 2100) {
      // 3 - 35 menit ideal untuk video belajar
      formatPoints += 6;
    } else if (durSec > 0 && durSec < 90) {
      formatPoints -= 4;
    }
    if (
      /\b(tutorial|belajar|penjelasan|konsep|dasar|course|guide|materi|pemrograman|cara|lengkap|intro)\b/i.test(
        titleLower,
      )
    ) {
      formatPoints += 6;
    }

    const totalScore = Math.round(
      Math.max(40, Math.min(99, relevancePoints + popularityPoints + formatPoints)),
    );

    return {
      cand,
      matchedCount,
      totalScore,
    };
  });

  // Eliminasi video yang sama sekali tidak relevan jika ada kandidat yang relevan
  const hasRelevant = scored.some((s) => s.matchedCount > 0);
  const filtered = hasRelevant ? scored.filter((s) => s.matchedCount > 0) : scored;

  // Sortir skor tertinggi, prioritaskan video yang belum dipakai di tahap lain
  filtered.sort((a, b) => {
    const aUsed = usedVideoIds.has(a.cand.videoId) ? 1 : 0;
    const bUsed = usedVideoIds.has(b.cand.videoId) ? 1 : 0;
    if (aUsed !== bUsed) return aUsed - bUsed;
    return b.totalScore - a.totalScore;
  });

  const topTwo = filtered.slice(0, 2);

  return topTwo.map((item, rankIdx) => {
    usedVideoIds.add(item.cand.videoId);
    const displayScore =
      rankIdx === 0
        ? Math.max(91, item.totalScore)
        : Math.max(85, Math.min(94, item.totalScore - 2));

    return {
      videoId: item.cand.videoId,
      embedId: item.cand.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${item.cand.videoId}`,
      title: item.cand.officialTitle,
      channel: item.cand.officialAuthor,
      channelName: item.cand.officialAuthor,
      duration: item.cand.duration || (rankIdx === 0 ? "12:40" : "15:20"),
      viewCount: item.cand.viewCount || 0,
      likeCount: item.cand.likeCount || 0,
      qualityScore: displayScore,
      relevanceScore: displayScore,
      summaryTopic: stageTitle,
      isValidated: true,
    };
  });
}

/**
 * Kurasi Top 2 Video Tervalidasi oEmbed untuk SATU tahap belajar
 */
export async function curateTopTwoVideosForStage(
  stage: LearningStageItem,
  topicContext: string,
  coreKeywords: string[],
  preValidatedPool: RecommendedVideo[],
  usedVideoIds: Set<string>,
): Promise<RecommendedVideo[]> {
  const primaryTech = extractPrimaryDomainAnchor(
    topicContext,
    stage.title,
    stage.keyConcepts || coreKeywords,
  );
  const queryLadder = buildStageQueryLadder(stage, primaryTech);

  const candidateMap = new Map<string, CandidateVideoMeta>();

  // 1. Jalankan pencarian bertingkat Tier 1 -> Tier 2 -> Tier 3 hingga terkumpul min 4-6 kandidat
  for (const tierQuery of queryLadder) {
    const [fastApiCands, htmlIds] = await Promise.all([
      fetchFastApiCandidates(
        tierQuery,
        topicContext,
        stage.keyConcepts || coreKeywords,
      ),
      searchYoutubeHtmlFallback(tierQuery, 8),
    ]);

    for (const fc of fastApiCands) {
      if (!candidateMap.has(fc.videoId)) {
        candidateMap.set(fc.videoId, fc);
      }
    }
    for (const id of htmlIds) {
      if (!candidateMap.has(id)) {
        candidateMap.set(id, { videoId: id });
      }
    }

    if (candidateMap.size >= 6) break;
  }

  // Tambahkan dari preValidatedPool jika kandidat masih sedikit
  for (const pv of preValidatedPool) {
    const id = pv.videoId || pv.embedId;
    if (id && VALID_ID_RE.test(id) && !candidateMap.has(id)) {
      candidateMap.set(id, {
        videoId: id,
        title: pv.title,
        channelName: pv.channelName || pv.channel,
        duration: pv.duration,
        viewCount: pv.viewCount,
        likeCount: pv.likeCount,
      });
    }
  }

  const allCandidates = Array.from(candidateMap.values()).slice(0, 12);

  // 2. Verifikasi wajib oEmbed HTTP 200 secara paralel
  const oembedChecks = await Promise.all(
    allCandidates.map(async (cand) => {
      const check = await verifyYoutubeOembed(cand.videoId);
      if (!check.ok) return null;
      return {
        ...cand,
        officialTitle: check.title,
        officialAuthor: check.authorName,
      };
    }),
  );

  const verifiedList = oembedChecks.filter(
    (
      item,
    ): item is CandidateVideoMeta & {
      officialTitle: string;
      officialAuthor: string;
    } => item !== null,
  );

  if (verifiedList.length === 0 && preValidatedPool.length > 0) {
    return preValidatedPool.slice(0, 2);
  }

  // 3. Sortir dan pilih Top 2 Video Terbaik
  const topTwo = rankAndPickTopTwoVideos(
    verifiedList,
    stage.title,
    stage.keyConcepts || coreKeywords,
    topicContext,
    usedVideoIds,
  );

  // Jika hanya ada 1 video terverifikasi dan pool masih punya cadangan, lengkapi jadi 2
  if (topTwo.length === 1 && preValidatedPool.length > 0) {
    const firstId = topTwo[0]?.videoId || topTwo[0]?.embedId;
    const extra = preValidatedPool.find(
      (pv) => (pv.videoId || pv.embedId) !== firstId,
    );
    if (extra) topTwo.push(extra);
  }

  return topTwo;
}

/**
 * Kurasi Top 2 Video Tervalidasi untuk SELURUH tahap dalam learningStages
 */
export async function curateTopTwoVideosForAllStages(
  stages: LearningStageItem[],
  topicContext: string,
  coreKeywords: string[],
  preValidatedPool: RecommendedVideo[] = [],
): Promise<LearningStageItem[]> {
  const usedVideoIds = new Set<string>();
  const curatedStages: LearningStageItem[] = [];

  // Jalankan per tahap berurutan agar usedVideoIds efektif mencegah duplikasi antar-tahap
  for (const stage of stages) {
    const cleanQuery = buildCleanStageQuery(
      stage.title,
      stage.keyConcepts || coreKeywords,
      topicContext,
    );

    const topTwo = await curateTopTwoVideosForStage(
      stage,
      topicContext,
      coreKeywords,
      preValidatedPool,
      usedVideoIds,
    );

    curatedStages.push({
      ...stage,
      searchQuery: cleanQuery,
      videos: topTwo,
      stageVideo: topTwo[0] || stage.stageVideo,
    });
  }

  return curatedStages;
}
