// src/lib/videoRecommendationPipeline.ts
import crypto from "node:crypto";
import Groq from "groq-sdk";
import type { Prisma } from "@prisma/client";
import type {
  LearningStageItem,
  RecommendedDoc,
} from "../components/NexedAiModuleHub";
import {
  extractYoutubeId,
  resolveCuratedResources,
  sanitizeDocumentation,
  type VideoTopComment,
} from "./curatedResources";
import { isDatabaseConfigured, prisma } from "./server/db";

export interface ValidatedTopicVideoItem {
  videoId: string;
  videoUrl: string;
  embedId: string;
  title: string;
  channelName: string;
  channel: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  qualityScore: number;
  relevanceScore?: number;
  summaryTopic: string;
  topComments: VideoTopComment[];
  isValidated: boolean;
}

export interface TopicVideoPipelineResult {
  topicKey: string;
  detectedTopic: string;
  coreKeywords: string[];
  userNeedsSummary: string;
  recommendedQueries: string[];
  webReferences: RecommendedDoc[];
  learningStages: LearningStageItem[];
  videos: ValidatedTopicVideoItem[];
  cacheHit: boolean;
  source: "prisma-cache" | "memory-cache" | "fastapi-yt-dlp" | "fastapi-unavailable";
}

// Daftar ID video statis/legacy lama yang dilarang tampil atau di-cache
const LEGACY_BANNED_VIDEO_IDS = new Set([
  "U81_m5-lUqQ",
  "1NigbK3Jk7Q",
  "tXlZgwYp5V0",
  "jV8B24rSN5o",
  "CleFk3BZB3g",
  "RUTV_5m4VeI",
  "O12S4k4h7eE",
  "yptzI_QhE64",
  "34l_8x1pX2Y",
  "f4bLqjC_sM0",
  "9Lh5c4fT2_Q",
  "h9j_S61hZ8M",
  "3g5Y1xZ6m9Q",
  "8_XnZ0jK9Lw",
  "sffId_J1K04",
  "5qY4_8pDfqQ",
  "74lT38H_Y4Y",
  "wL_3F5d0K5Y",
  "4mD_5f9Jk3L",
  "mG_4H6p7Qk8",
  "9Q_5K2m8Y1Z",
  "3kL_7P9m4X2",
  "bW_5dK6n3Y0",
  "7_A9mX5b5Z8",
  "F_fD0bVbLcA",
  "8qJ1lVwDfq8",
  "1ukSR1GRt62",
  "C1pxbgx_yQ4",
  "k_DE_4Pfq7k",
  "yoPz5i3u8g4",
]);

export function isValidLiveYoutubeId(id?: string | null): boolean {
  if (!id || typeof id !== "string") return false;
  const trimmed = id.trim();
  if (!/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return false;
  if (LEGACY_BANNED_VIDEO_IDS.has(trimmed)) return false;
  return true;
}

// In-memory cache untuk mempercepat request berulang
const memoryVideoCache = new Map<string, TopicVideoPipelineResult>();

function slugifySegment(input: string, maxLen = 48): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
}

/**
 * Normalisasi deterministik untuk topicKey di Prisma TopicVideoCache:
 * Kombinasi slug dari detectedTopic/topic + hash dari extractedText.slice(0, 500) + slug userFocus.
 */
export function buildTopicKey(
  detectedTopicOrTitle: string,
  userFocus?: string,
  extractedTextSample?: string,
): string {
  const topicSlug = slugifySegment(detectedTopicOrTitle || "modul-umum", 48) || "modul-umum";
  const focusSlug = userFocus ? slugifySegment(userFocus, 32) : "default";
  const textSlice = (extractedTextSample || "").trim().slice(0, 500);
  const contentHash = textSlice
    ? crypto.createHash("sha1").update(textSlice).digest("hex").slice(0, 10)
    : "nohash";

  return `${topicSlug}-${contentHash}-${focusSlug}`.slice(0, 110);
}

/**
 * Normalisasi objek video yang SUDAH tervalidasi dari FastAPI yt-dlp + oEmbed.
 * Jika videoId tidak valid (bukan 11 karakter atau masuk daftar legacy), kembalikan null.
 */
export function normalizeValidatedVideo(
  raw: Partial<ValidatedTopicVideoItem>,
  topic: string,
): ValidatedTopicVideoItem | null {
  const vid =
    raw.videoId ||
    raw.embedId ||
    extractYoutubeId(raw.videoUrl || "");

  if (!isValidLiveYoutubeId(vid)) {
    return null;
  }

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title || title.toLowerCase() === "deleted video" || title.toLowerCase() === "private video") {
    return null;
  }

  const channelName =
    (typeof raw.channelName === "string" && raw.channelName.trim()) ||
    (typeof raw.channel === "string" && raw.channel.trim()) ||
    "Kanal Edukasi YouTube";

  const topComments: VideoTopComment[] = Array.isArray(raw.topComments)
    ? raw.topComments
        .filter((c) => c && typeof c.text === "string" && c.text.trim().length > 0)
        .slice(0, 3)
        .map((c) => ({
          author: String(c.author || "@penonton_youtube"),
          text: String(c.text).trim(),
          likes: typeof c.likes === "number" ? c.likes : 0,
        }))
    : [];

  return {
    videoId: vid,
    videoUrl: `https://www.youtube.com/watch?v=${vid}`,
    embedId: vid,
    title,
    channelName,
    channel: channelName,
    duration: typeof raw.duration === "string" && raw.duration.trim() ? raw.duration.trim() : "15:00",
    viewCount: typeof raw.viewCount === "number" ? raw.viewCount : 0,
    likeCount: typeof raw.likeCount === "number" ? raw.likeCount : 0,
    qualityScore: typeof raw.qualityScore === "number" ? raw.qualityScore : 85.0,
    relevanceScore: typeof raw.relevanceScore === "number" ? raw.relevanceScore : 80.0,
    summaryTopic:
      typeof raw.summaryTopic === "string" && raw.summaryTopic.trim().length > 10
        ? raw.summaryTopic.trim()
        : `Pembahasan materi ${title} oleh ${channelName} untuk topik ${topic}.`,
    topComments,
    isValidated: true,
  };
}

export function normalizeLearningStages(
  rawStages: unknown,
  fallbackTopic: string,
  fallbackKeywords: string[] = [],
): LearningStageItem[] {
  if (!Array.isArray(rawStages) || rawStages.length === 0) return [];
  return rawStages
    .map((item, idx) => {
      const r = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      const stageNumber =
        typeof r.stageNumber === "number"
          ? r.stageNumber
          : typeof r.step === "number"
            ? r.step
            : idx + 1;
      const phaseLabel = String(
        r.phaseLabel || r.stage || `Tahap ${stageNumber}: Pendalaman Materi`,
      ).trim();
      const title = String(r.title || `Sub-Topik ${stageNumber}`).trim();
      const shortSummary = String(
        r.shortSummary || r.description || `Memahami konsep dan penerapan ${title}.`,
      ).trim();
      const selfAction = String(
        r.selfAction || r.actionItem || `Pelajari dan praktikkan materi "${title}" dari dokumen.`,
      ).trim();
      const detailedMaterial = String(
        r.detailedMaterial || r.detailedGuide || shortSummary,
      ).trim();
      const keyConcepts = Array.isArray(r.keyConcepts)
        ? r.keyConcepts.map((k) => String(k || "").trim()).filter(Boolean)
        : fallbackKeywords.slice(0, 3);
      const practiceScenario = String(
        r.practiceScenario ||
          `Terapkan langkah-langkah pada tahap "${title}" sesuai panduan dokumen ${fallbackTopic}.`,
      ).trim();
      const comprehensionQuestion = String(
        r.comprehensionQuestion ||
          r.checkQuestion ||
          `Bagaimana konsep "${title}" diterapkan dalam konteks materi ${fallbackTopic}?`,
      ).trim();
      const searchQuery = String(
        r.searchQuery || `${fallbackTopic} ${title} tutorial`.trim(),
      ).trim();

      return {
        stageNumber,
        phaseLabel,
        title,
        shortSummary,
        selfAction,
        detailedMaterial,
        keyConcepts: keyConcepts.length > 0 ? keyConcepts : [title],
        practiceScenario,
        comprehensionQuestion,
        searchQuery,
      };
    })
    .filter((s) => s.title.length > 2);
}

/**
 * Analisis kebutuhan belajar pengguna + coreKeywords + kueri pencarian YouTube + webReferences + learningStages
 * yang 100% bersumber dari extractedText (isi asli dokumen) dan userFocus.
 */
export async function analyzeUserLearningNeedsAndQueries(params: {
  topic: string;
  detectedTopic?: string;
  contentSample?: string;
  userLearningGoal?: string;
  existingCoreKeywords?: string[];
  existingQueries?: string[];
  existingNeedsSummary?: string;
  existingWebReferences?: RecommendedDoc[];
  existingLearningStages?: LearningStageItem[];
}): Promise<{
  detectedTopic: string;
  coreKeywords: string[];
  userNeedsSummary: string;
  recommendedQueries: string[];
  webReferences: RecommendedDoc[];
  learningStages: LearningStageItem[];
}> {
  const goalText = params.userLearningGoal?.trim();

  // Jika data dari analisis AI modul sudah tersedia dan tidak ada perubahan userFocus baru, gunakan langsung
  if (
    !goalText &&
    params.existingNeedsSummary &&
    params.existingNeedsSummary.trim().length > 20 &&
    params.existingQueries &&
    params.existingQueries.length >= 2 &&
    params.existingCoreKeywords &&
    params.existingCoreKeywords.length >= 2
  ) {
    const curatedDocs = resolveCuratedResources(
      `${params.detectedTopic || params.topic} ${(params.contentSample || "").slice(0, 1500)}`,
      params.detectedTopic || params.topic,
    ).docs;

    return {
      detectedTopic: params.detectedTopic || params.topic,
      coreKeywords: params.existingCoreKeywords.slice(0, 8),
      userNeedsSummary: params.existingNeedsSummary.trim(),
      recommendedQueries: params.existingQueries.slice(0, 4),
      webReferences:
        params.existingWebReferences && params.existingWebReferences.length > 0
          ? params.existingWebReferences
          : curatedDocs,
      learningStages: normalizeLearningStages(
        params.existingLearningStages,
        params.detectedTopic || params.topic,
        params.existingCoreKeywords,
      ),
    };
  }

  const cleanTopic = (params.detectedTopic || params.topic || "Materi Pembelajaran").trim();
  const contentText = (params.contentSample || "").trim();
  const curated = resolveCuratedResources(
    `${cleanTopic} ${contentText.slice(0, 2000)}`,
    cleanTopic,
  );

  const fallbackKeywords =
    params.existingCoreKeywords && params.existingCoreKeywords.length > 0
      ? params.existingCoreKeywords.slice(0, 8)
      : cleanTopic
          .split(/[^A-Za-z0-9#+]+/)
          .filter((w) => w.length >= 3)
          .slice(0, 6);

  const fallbackNeeds = goalText
    ? `Berdasarkan isi dokumen "${cleanTopic}" dan fokus kebutuhan belajar Anda ("${goalText}"), Anda membutuhkan panduan visual langkah demi langkah serta implementasi praktis terkait ${fallbackKeywords.slice(0, 4).join(", ") || cleanTopic}.`
    : `Mahasiswa memerlukan visualisasi konsep inti, demonstrasi langkah teknis (${fallbackKeywords.slice(0, 4).join(", ") || cleanTopic}), dan pencegahan kesalahan umum pada materi ${cleanTopic}.`;

  const fallbackQueries = goalText
    ? [
        `${fallbackKeywords.slice(0, 2).join(" ") || cleanTopic} ${goalText} tutorial`.trim(),
        `${cleanTopic} ${goalText} bahasa indonesia`.trim(),
        ...(curated.recommendedQueries || []).slice(0, 2),
      ].slice(0, 4)
    : curated.recommendedQueries && curated.recommendedQueries.length >= 2
      ? curated.recommendedQueries.slice(0, 4)
      : [
          `${cleanTopic} tutorial bahasa indonesia`,
          `${cleanTopic} practical tutorial`,
        ];

  const fallbackWebRefs =
    params.existingWebReferences && params.existingWebReferences.length > 0
      ? params.existingWebReferences
      : curated.docs;

  const fallbackStages = normalizeLearningStages(
    params.existingLearningStages,
    cleanTopic,
    fallbackKeywords,
  );

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      detectedTopic: cleanTopic,
      coreKeywords: fallbackKeywords,
      userNeedsSummary: fallbackNeeds,
      recommendedQueries: fallbackQueries,
      webReferences: fallbackWebRefs,
      learningStages: fallbackStages,
    };
  }

  try {
    const groq = new Groq({ apiKey });
    const prompt = `Analisis isi teks materi dokumen dan fokus kebutuhan belajar mahasiswa berikut:
Judul / Topik Awal: ${cleanTopic}
Fokus Kebutuhan Spesifik User (userFocus): ${goalText || "Memahami konsep dasar hingga praktik langkah demi langkah sesuai isi modul"}
Isi Teks Dokumen Asli (extractedText):
${contentText.slice(0, 5000)}

ATURAN MUTLAK:
- Kamu adalah Asisten Akademik Adaptif. Susun \`detectedTopic\`, \`userNeedsSummary\`, dan \`learningStages\` (4-5 tahap) HANYA berdasarkan fakta, istilah, langkah kerja, dan konsep yang benar-benar tertulis di dalam \`extractedText\`, serta sesuaikan penekanannya dengan \`userFocus\` dari user.
- DILARANG KERAS menggunakan contoh materi umum di luar dokumen (seperti tipe data integer/float/boolean jika tidak ada di dokumen) dan DILARANG menebak dari singkatan nama file.
- DILARANG menghasilkan videoId atau videoUrl YouTube.

Keluarkan JSON valid dengan struktur:
{
  "detectedTopic": "Topik spesifik hasil pembacaan isi dokumen (contoh: Pemrograman Multimedia Interaktif: Aplikasi AR Tata Surya dengan Unity & Vuforia)",
  "coreKeywords": ["IstilahTeknis1", "IstilahTeknis2", "IstilahTeknis3", "IstilahTeknis4", "IstilahTeknis5"],
  "userNeedsSummary": "Penjelasan personal 2-3 kalimat mengenai apa yang dibutuhkan user untuk menguasai materi ini, disesuaikan dengan userFocus jika diisi",
  "recommendedQueries": [
    "kueri pencarian youtube spesifik 1 yang menyertakan istilah teknis utama dari coreKeywords",
    "kueri pencarian youtube spesifik 2 sesuai fokus user",
    "kueri pencarian youtube spesifik 3 tutorial praktis"
  ],
  "learningStages": [
    {
      "stageNumber": 1,
      "phaseLabel": "Tahap 1: Fondasi Konseptual",
      "title": "Judul spesifik tahap 1 sesuai isi dokumen & permintaan user",
      "shortSummary": "1-2 kalimat ringkasan tujuan tahap 1",
      "selfAction": "Instruksi aksi mandiri konkret berdasarkan isi dokumen",
      "detailedMaterial": "Penjelasan materi mendalam 1-2 paragraf dari isi dokumen",
      "keyConcepts": ["Istilah1", "Istilah2", "Istilah3"],
      "practiceScenario": "Skenario praktik mandiri yang relevan dengan isi dokumen",
      "comprehensionQuestion": "Pertanyaan uji pemahaman spesifik sesuai materi tahap 1",
      "searchQuery": "Kueri YouTube spesifik untuk tahap 1"
    },
    {
      "stageNumber": 2,
      "phaseLabel": "Tahap 2: Konfigurasi & Komponen Teknis",
      "title": "Judul spesifik tahap 2 sesuai isi dokumen & permintaan user",
      "shortSummary": "1-2 kalimat ringkasan tujuan tahap 2",
      "selfAction": "Instruksi aksi mandiri konkret berdasarkan isi dokumen",
      "detailedMaterial": "Penjelasan materi mendalam 1-2 paragraf dari isi dokumen",
      "keyConcepts": ["IstilahA", "IstilahB", "IstilahC"],
      "practiceScenario": "Skenario praktik mandiri yang relevan dengan isi dokumen",
      "comprehensionQuestion": "Pertanyaan uji pemahaman spesifik sesuai materi tahap 2",
      "searchQuery": "Kueri YouTube spesifik untuk tahap 2"
    },
    {
      "stageNumber": 3,
      "phaseLabel": "Tahap 3: Implementasi & Scripting",
      "title": "Judul spesifik tahap 3 sesuai isi dokumen & permintaan user",
      "shortSummary": "1-2 kalimat ringkasan tujuan tahap 3",
      "selfAction": "Instruksi aksi mandiri konkret berdasarkan isi dokumen",
      "detailedMaterial": "Penjelasan materi mendalam 1-2 paragraf dari isi dokumen",
      "keyConcepts": ["IstilahX", "IstilahY", "IstilahZ"],
      "practiceScenario": "Skenario praktik mandiri yang relevan dengan isi dokumen",
      "comprehensionQuestion": "Pertanyaan uji pemahaman spesifik sesuai materi tahap 3",
      "searchQuery": "Kueri YouTube spesifik untuk tahap 3"
    },
    {
      "stageNumber": 4,
      "phaseLabel": "Tahap 4: Pengujian & Evaluasi",
      "title": "Judul spesifik tahap 4 sesuai isi dokumen & permintaan user",
      "shortSummary": "1-2 kalimat ringkasan tujuan tahap 4",
      "selfAction": "Instruksi aksi mandiri konkret berdasarkan isi dokumen",
      "detailedMaterial": "Penjelasan materi mendalam 1-2 paragraf dari isi dokumen",
      "keyConcepts": ["IstilahM", "IstilahN", "IstilahO"],
      "practiceScenario": "Skenario praktik mandiri yang relevan dengan isi dokumen",
      "comprehensionQuestion": "Pertanyaan uji pemahaman spesifik sesuai materi tahap 4",
      "searchQuery": "Kueri YouTube spesifik untuk tahap 4"
    }
  ],
  "webReferences": [
    {
      "title": "Judul Referensi / Dokumentasi Resmi 1",
      "source": "Nama Sumber Resmi (misal: Unity Docs / Vuforia Developer Library / MDN)",
      "url": "https://docs.unity3d.com/Manual/index.html",
      "description": "Deskripsi singkat relevansi referensi dengan materi dan kebutuhan user"
    },
    {
      "title": "Judul Referensi / Dokumentasi Resmi 2",
      "source": "Nama Sumber Resmi",
      "url": "https://developer.vuforia.com/library",
      "description": "Deskripsi singkat relevansi referensi"
    },
    {
      "title": "Judul Referensi / Artikel Teknis 3",
      "source": "Nama Sumber Resmi",
      "url": "https://learn.microsoft.com/en-us/dotnet/csharp/",
      "description": "Deskripsi singkat relevansi referensi"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL?.trim() || "qwen/qwen3.8-27b",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah Asisten Akademik Adaptif. Susun `detectedTopic`, `userNeedsSummary`, dan `learningStages` (4-5 tahap) HANYA berdasarkan fakta, istilah, langkah kerja, dan konsep yang benar-benar tertulis di dalam `extractedText`, serta sesuaikan penekanannya dengan `userFocus` dari user. DILARANG KERAS menggunakan contoh materi umum di luar dokumen (seperti tipe data integer/float/boolean jika tidak ada di dokumen) dan DILARANG menebak dari singkatan nama file. Jawab hanya dalam JSON valid.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
      max_tokens: 1800,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (raw) {
      const parsed = JSON.parse(raw) as {
        detectedTopic?: string;
        coreKeywords?: string[];
        userNeedsSummary?: string;
        recommendedQueries?: string[];
        learningStages?: unknown[];
        webReferences?: Array<Partial<RecommendedDoc>>;
      };

      const detectedTopic =
        typeof parsed.detectedTopic === "string" && parsed.detectedTopic.trim().length > 4
          ? parsed.detectedTopic.trim()
          : cleanTopic;

      const coreKeywords =
        Array.isArray(parsed.coreKeywords) && parsed.coreKeywords.length > 0
          ? parsed.coreKeywords
              .map((k) => String(k).trim())
              .filter((k) => k.length >= 2)
              .slice(0, 8)
          : fallbackKeywords;

      const summary =
        typeof parsed.userNeedsSummary === "string" &&
        parsed.userNeedsSummary.trim().length > 15
          ? parsed.userNeedsSummary.trim()
          : fallbackNeeds;

      const queries =
        Array.isArray(parsed.recommendedQueries) &&
        parsed.recommendedQueries.length > 0
          ? parsed.recommendedQueries
              .map((q) => String(q).trim())
              .filter((q) => q.length > 3)
              .slice(0, 4)
          : fallbackQueries;

      const webReferences =
        Array.isArray(parsed.webReferences) && parsed.webReferences.length > 0
          ? parsed.webReferences
              .map((doc) => sanitizeDocumentation(doc, detectedTopic))
              .slice(0, 3)
          : fallbackWebRefs;

      const parsedStages = normalizeLearningStages(
        parsed.learningStages,
        detectedTopic,
        coreKeywords,
      );

      return {
        detectedTopic,
        coreKeywords: coreKeywords.length > 0 ? coreKeywords : fallbackKeywords,
        userNeedsSummary: summary,
        recommendedQueries: queries.length > 0 ? queries : fallbackQueries,
        webReferences,
        learningStages: parsedStages.length >= 3 ? parsedStages : fallbackStages,
      };
    }
  } catch {
    // Graceful fallback
  }

  return {
    detectedTopic: cleanTopic,
    coreKeywords: fallbackKeywords,
    userNeedsSummary: fallbackNeeds,
    recommendedQueries: fallbackQueries,
    webReferences: fallbackWebRefs,
    learningStages: fallbackStages,
  };
}

/**
 * Pipeline Utama:
 * 1. Buat topicKey dari kombinasi slug detectedTopic + hash extractedText.slice(0, 500) + slug userFocus
 * 2. Cek Prisma TopicVideoCache (atau Memory Cache) -> pastikan bebas ID legacy/kosong
 * 3. Analisis Kebutuhan Belajar User + coreKeywords + Kueri Pencarian + webReferences oleh AI
 * 4. Validasi Video Menyala + Filter Relevansi core_keywords via FastAPI (yt-dlp + YouTube oEmbed)
 * 5. Simpan ke Prisma TopicVideoCache HANYA jika videos.length > 0
 */
export async function resolveValidatedTopicVideos(params: {
  topic: string;
  detectedTopic?: string;
  extractedText?: string;
  contentSample?: string;
  userFocus?: string;
  userLearningGoal?: string;
  coreKeywords?: string[];
  existingNeedsSummary?: string;
  existingQueries?: string[];
  existingWebReferences?: RecommendedDoc[];
  existingLearningStages?: LearningStageItem[];
  forceRefresh?: boolean;
}): Promise<TopicVideoPipelineResult> {
  const effectiveTopic = (params.detectedTopic || params.topic || "Materi Pembelajaran").trim();
  const effectiveText = params.extractedText || params.contentSample;
  const effectiveFocus = params.userFocus || params.userLearningGoal;
  const topicKey = buildTopicKey(effectiveTopic, effectiveFocus, effectiveText);

  if (params.forceRefresh) {
    memoryVideoCache.delete(topicKey);
  }

  // 1. Cek Cache di Prisma Database terlebih dahulu (kecuali forceRefresh)
  if (!params.forceRefresh) {
    if (isDatabaseConfigured()) {
      try {
        const cached = await prisma.topicVideoCache.findUnique({
          where: { topicKey },
        });
        if (cached && Array.isArray(cached.videos) && cached.videos.length > 0) {
          const validCachedVideos = (
            cached.videos as unknown as Array<Partial<ValidatedTopicVideoItem>>
          )
            .map((v) => normalizeValidatedVideo(v, effectiveTopic))
            .filter((v): v is ValidatedTopicVideoItem => v !== null);

          if (validCachedVideos.length > 0) {
            const cachedQueries = Array.isArray(cached.recommendedQueries)
              ? cached.recommendedQueries.map((q) => String(q))
              : [];
            const fallbackWebRefs =
              params.existingWebReferences && params.existingWebReferences.length > 0
                ? params.existingWebReferences
                : resolveCuratedResources(
                    `${effectiveTopic} ${(effectiveText || "").slice(0, 1500)}`,
                    effectiveTopic,
                  ).docs;

            const cachedRawStages = (cached as unknown as { learningStages?: unknown }).learningStages;
            const cachedStages = normalizeLearningStages(
              cachedRawStages || params.existingLearningStages,
              effectiveTopic,
              params.coreKeywords,
            );

            const result: TopicVideoPipelineResult = {
              topicKey,
              detectedTopic: effectiveTopic,
              coreKeywords: params.coreKeywords || [],
              userNeedsSummary: cached.userNeedsSummary,
              recommendedQueries: cachedQueries,
              webReferences: fallbackWebRefs,
              learningStages: cachedStages,
              videos: validCachedVideos,
              cacheHit: true,
              source: "prisma-cache",
            };
            memoryVideoCache.set(topicKey, result);
            return result;
          }

          await prisma.topicVideoCache
            .delete({ where: { topicKey } })
            .catch(() => {});
        }
      } catch (dbErr) {
        console.warn("[TopicVideoCache] Gagal membaca cache Prisma:", dbErr);
      }
    }

    const memCached = memoryVideoCache.get(topicKey);
    if (memCached && memCached.videos.length > 0) {
      return {
        ...memCached,
        cacheHit: true,
        source: "memory-cache",
      };
    }
  }

  // 2. Analisis Kebutuhan Belajar User + coreKeywords + Kueri Pencarian + webReferences + learningStages oleh AI
  const {
    detectedTopic,
    coreKeywords,
    userNeedsSummary,
    recommendedQueries,
    webReferences,
    learningStages,
  } = await analyzeUserLearningNeedsAndQueries({
    topic: params.topic,
    detectedTopic: params.detectedTopic,
    contentSample: effectiveText,
    userLearningGoal: effectiveFocus,
    existingCoreKeywords: params.coreKeywords,
    existingNeedsSummary: params.existingNeedsSummary,
    existingQueries: params.existingQueries,
    existingWebReferences: params.existingWebReferences,
    existingLearningStages: params.existingLearningStages,
  });

  // 3. Validasi Video via FastAPI (https://nexed-backend.vercel.app/api/youtube/validate) dengan timeout 45000ms
  const fastApiBaseUrl = (
    process.env.FASTAPI_URL ||
    process.env.NEXT_PUBLIC_FASTAPI_URL ||
    "https://nexed-backend.vercel.app"
  ).replace(/\/+$/, "");

  let validatedVideos: ValidatedTopicVideoItem[] = [];
  let sourceUsed: TopicVideoPipelineResult["source"] = "fastapi-unavailable";

  try {
    const response = await fetch(`${fastApiBaseUrl}/api/youtube/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: detectedTopic,
        userNeedsSummary,
        queries: recommendedQueries,
        core_keywords: coreKeywords,
        coreKeywords,
        maxResults: 4,
      }),
      signal: AbortSignal.timeout(45000),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        videos?: Array<Partial<ValidatedTopicVideoItem>>;
      };
      if (Array.isArray(data.videos) && data.videos.length > 0) {
        validatedVideos = data.videos
          .map((v) => normalizeValidatedVideo(v, detectedTopic))
          .filter((v): v is ValidatedTopicVideoItem => v !== null);
        if (validatedVideos.length > 0) {
          sourceUsed = "fastapi-yt-dlp";
        }
      }
    }
  } catch (err) {
    console.warn("[videoRecommendationPipeline] FastAPI validator tidak aktif atau timeout:", err);
  }

  validatedVideos.sort(
    (a, b) =>
      (b.relevanceScore || 0) - (a.relevanceScore || 0) ||
      (b.qualityScore || 0) - (a.qualityScore || 0),
  );

  const finalResult: TopicVideoPipelineResult = {
    topicKey,
    detectedTopic,
    coreKeywords,
    userNeedsSummary,
    recommendedQueries,
    webReferences,
    learningStages,
    videos: validatedVideos,
    cacheHit: false,
    source: sourceUsed,
  };

  // 4. JANGAN simpan ke TopicVideoCache / memory cache jika array videos kosong (videos.length === 0)
  if (validatedVideos.length > 0) {
    memoryVideoCache.set(topicKey, finalResult);

    if (isDatabaseConfigured()) {
      try {
        const updatePayload: Record<string, unknown> = {
          userNeedsSummary,
          recommendedQueries: recommendedQueries as unknown as Prisma.InputJsonValue,
          videos: validatedVideos as unknown as Prisma.InputJsonValue,
          learningStages: learningStages as unknown as Prisma.InputJsonValue,
        };
        const createPayload: Record<string, unknown> = {
          topicKey,
          userNeedsSummary,
          recommendedQueries: recommendedQueries as unknown as Prisma.InputJsonValue,
          videos: validatedVideos as unknown as Prisma.InputJsonValue,
          learningStages: learningStages as unknown as Prisma.InputJsonValue,
        };
        await (prisma.topicVideoCache as unknown as {
          upsert: (args: {
            where: { topicKey: string };
            update: Record<string, unknown>;
            create: Record<string, unknown>;
          }) => Promise<unknown>;
        }).upsert({
          where: { topicKey },
          update: updatePayload,
          create: createPayload,
        });
      } catch {
        // Fallback jika kolom learningStages belum ter-push ke DB
        try {
          await prisma.topicVideoCache.upsert({
            where: { topicKey },
            update: {
              userNeedsSummary,
              recommendedQueries: recommendedQueries as unknown as Prisma.InputJsonValue,
              videos: validatedVideos as unknown as Prisma.InputJsonValue,
            },
            create: {
              topicKey,
              userNeedsSummary,
              recommendedQueries: recommendedQueries as unknown as Prisma.InputJsonValue,
              videos: validatedVideos as unknown as Prisma.InputJsonValue,
            },
          });
        } catch (dbWriteErr) {
          console.warn("[TopicVideoCache] Gagal menyimpan cache ke Prisma:", dbWriteErr);
        }
      }
    }
  }

  return finalResult;
}
