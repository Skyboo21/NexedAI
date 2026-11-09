// src/lib/aiModuleServer.ts
import Groq from "groq-sdk";
import type {
  AnalyzedModuleResult,
  LearningStageItem,
  RecommendedDoc,
  RecommendedVideo,
} from "../components/NexedAiModuleHub";
import {
  analyzeModuleContent,
  cleanModuleRawText,
  extractSalientTitle,
  generateChatResponse,
} from "./aiModuleAnalyzer";
import {
  resolveCuratedResources,
  sanitizeDocumentation,
} from "./curatedResources";
import {
  normalizeLearningStages,
  resolveValidatedTopicVideos,
} from "./videoRecommendationPipeline";


/**
 * Server-side AI Module Analysis using Groq LLM
 * Menganalisis dokumen modul yang diunggah secara autentik menggunakan LLM,
 * menghasilkan Ringkasan Eksekutif Terstruktur, Istilah & Konsep Esensial, Peta Belajar 4 Tahap,
 * dan Kuis Active Recall yang 100% spesifik untuk isi dokumen yang diunggah.
 */
export async function generateAiModuleAnalysis(
  content: string,
  fileName?: string,
  fallbackTitle?: string,
  options?: {
    forceRefresh?: boolean;
    userLearningGoal?: string;
    userFocus?: string;
    strictGrounded?: boolean;
  },
): Promise<AnalyzedModuleResult> {
  const apiKey = process.env.GROQ_API_KEY;
  const userFocus = (options?.userFocus || options?.userLearningGoal || "").trim() || undefined;
  // Bersihkan teks modul sebelum diproses
  const cleanContent = cleanModuleRawText(content);

  // Jika API key tidak ada, gunakan fallback cerdas lokal + pipeline validasi video (Prisma Cache + yt-dlp)
  if (!apiKey) {
    const localResult = analyzeModuleContent({
      title:
        fallbackTitle ||
        fileName?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") ||
        "Modul Pembelajaran",
      content: cleanContent,
      fileName,
      sourceType: "file",
      userFocus,
    });

    const videoPipeline = await resolveValidatedTopicVideos({
      topic: localResult.title,
      detectedTopic: localResult.detectedTopic,
      extractedText: cleanContent,
      contentSample: cleanContent.slice(0, 2000),
      userFocus,
      userLearningGoal: userFocus,
      coreKeywords: localResult.coreKeywords,
      existingNeedsSummary: localResult.userNeedsSummary,
      existingQueries: localResult.recommendedQueries,
      existingWebReferences: localResult.webReferences || localResult.recommendedDocs,
      existingLearningStages: localResult.learningStages,
      forceRefresh: options?.forceRefresh,
    });

    const finalStages =
      videoPipeline.learningStages && videoPipeline.learningStages.length > 0
        ? videoPipeline.learningStages
        : localResult.learningStages || [];

    const syncedRoadmap =
      finalStages.length > 0
        ? finalStages.map((s, idx) => ({
            step: idx + 1,
            stage: s.phaseLabel,
            title: s.title,
            description: s.shortSummary,
            actionItem: s.selfAction,
            understood: false,
            keyConcepts: s.keyConcepts,
            detailedGuide: s.detailedMaterial,
            practiceScenario: s.practiceScenario,
            checkQuestion: s.comprehensionQuestion,
          }))
        : localResult.roadmap;

    return {
      ...localResult,
      detectedTopic: videoPipeline.detectedTopic || localResult.detectedTopic,
      coreKeywords:
        videoPipeline.coreKeywords.length > 0
          ? videoPipeline.coreKeywords
          : localResult.coreKeywords,
      learningStages: finalStages,
      roadmap: syncedRoadmap,
      videos: videoPipeline.videos,
      validatedVideos: videoPipeline.videos,
      recommendedVideos: videoPipeline.videos,
      webReferences:
        videoPipeline.webReferences.length > 0
          ? videoPipeline.webReferences
          : localResult.webReferences || localResult.recommendedDocs,
      recommendedDocs:
        videoPipeline.webReferences.length > 0
          ? videoPipeline.webReferences
          : localResult.recommendedDocs,
      userNeedsSummary: videoPipeline.userNeedsSummary,
      recommendedQueries: videoPipeline.recommendedQueries,
      videoCacheHit: videoPipeline.cacheHit,
      videoValidationSource: videoPipeline.source,
    };
  }

  try {
    const groq = new Groq({ apiKey });
    // Ambil sampel representatif dokumen (hingga 12.000 karakter)
    const textSample = cleanContent.slice(0, 12000);

    const prompt = `Kamu adalah Asisten Akademik Adaptif dan Principal Academic Curriculum Architect di NEXED AI.
Susun 'detectedTopic', 'userNeedsSummary', dan 'learningStages' (4-5 tahap) HANYA berdasarkan fakta, istilah, langkah kerja, dan konsep yang benar-benar tertulis di dalam 'extractedText', serta sesuaikan penekanannya dengan 'userFocus' dari user.
DILARANG KERAS menggunakan contoh materi umum di luar dokumen (seperti tipe data integer/float/boolean jika tidak ada di dokumen) dan DILARANG menebak dari singkatan nama file.

ATURAN MUTLAK (STRICT GROUNDING):
- DILARANG MENEBAK TOPIK DARI SINGKATAN NAMA FILE. Seluruh analisis, kata kunci, tahapan belajar ('learningStages'), kueri YouTube, dan referensi web WAJIB 100% bersumber dari isi teks materi (extractedText) dan fokus kebutuhan belajar yang diminta user.
- Contoh: Jika nama file memuat singkatan "PMI" namun isi teks membahas Unity, Vuforia, dan Augmented Reality, topik adalah Pemrograman Multimedia Interaktif (Unity & Vuforia AR), BUKAN Project Management atau Palang Merah!
- Fokus Kebutuhan Belajar User (userFocus): "${userFocus || "Memahami konsep inti dan langkah praktik sesuai isi modul secara menyeluruh"}"

PRINSIP UTAMA:
1. ZERO IRRELEVANT BIAS: Dilarang keras memunculkan konsep Tipe Data Numerik/Karakter/Logika, JavaScript, Flowchart, atau Pemrograman Web jika dokumen membahas topik lain (seperti Game Engine Unity, Vuforia AR, Sistem Tertanam, dsb).
2. PEMBAHASAN MENDALAM (DEEP-DIVE): Tahap 1 Konseptual TIDAK BOLEH berupa ringkasan dangkal. Wajib mencakup:
   - Intisari & Konteks Industri: Mengapa materi ini penting dan bagaimana penerapannya di dunia nyata.
   - Terminologi & Konsep Inti (minimal 4-6 konsep): Berikan definisi teknis mendalam dan analogi yang jelas dari dokumen.
   - Prosedur Teknis / Best Practices: Langkah-langkah atau protokol penting sesuai isi modul.
   - Analisis Kesalahan Umum (Common Pitfalls): 2-3 kesalahan yang sering dilakukan pemula pada materi ini.
3. LEARNING STAGES & PETA BELAJAR DINAMIS ('learningStages'):
   - Wajibkan mengembalikan array 'learningStages' (4 sampai 5 tahapan belajar berurutan) yang disusun murni dari 'extractedText' dokumen dan diarahkan oleh 'userFocus'.
   - Setiap item di dalam 'learningStages' wajib memiliki:
     - stageNumber (number: 1, 2, 3, 4, ...)
     - phaseLabel (string: misal "Tahap 1: Fondasi Konseptual", "Tahap 2: Implementasi Teknis", dst.)
     - title (string: Judul spesifik sesuai isi dokumen & permintaan user)
     - shortSummary (string: 1-2 kalimat ringkasan tujuan tahap ini)
     - selfAction (string: Instruksi aksi mandiri konkret berdasarkan isi dokumen)
     - detailedMaterial (string: Penjelasan mendalam 1-2 paragraf dari isi dokumen)
     - keyConcepts (string[]: 3-4 istilah teknis dari dokumen pada tahap ini)
     - practiceScenario (string: Skenario latihan mandiri yang relevan dengan isi dokumen)
     - comprehensionQuestion (string: Pertanyaan uji pemahaman spesifik tahap ini)
     - searchQuery (string: Kueri pencarian video YouTube spesifik untuk tahap ini)
4. ANALISIS KEBUTUHAN VIDEO, CORE KEYWORDS & WEB REFERENCES DINAMIS:
   - Hasilkan 'detectedTopic': Topik spesifik hasil pembacaan isi dokumen.
   - Hasilkan 'coreKeywords': Array 5–8 istilah teknis utama yang benar-benar ada di dalam teks materi.
   - Hasilkan 'userNeedsSummary': Penjelasan personal mengenai apa yang dibutuhkan user untuk menguasai materi ini, disesuaikan dengan userFocus jika diisi.
   - Hasilkan 'recommendedQueries': 3–4 kueri pencarian YouTube spesifik yang menyertakan istilah teknis utama dari 'coreKeywords' (DILARANG KERAS menebak 'videoId', 'embedId', atau 'videoUrl' YouTube).
   - Hasilkan 'webReferences': Array 3 referensi bacaan/dokumentasi web yang relevan dengan 'coreKeywords' berisi { title, source, url, description }.
   - Hasilkan 'moduleChapters': Ringkasan bab/langkah praktik yang sesuai dengan isi asli dokumen.

Struktur JSON yang WAJIB dipatuhi:
{
  "title": "Judul materi yang spesifik dan jelas dari isi dokumen",
  "detectedTopic": "Topik spesifik hasil pembacaan isi dokumen",
  "coreKeywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4", "Keyword5"],
  "domain": "Domain topik materi",
  "difficulty": "Dasar" ATAU "Menengah" ATAU "Lanjut",
  "estimatedTime": "45 Menit",
  "xpReward": 150,
  "summary": {
    "overview": "Ringkasan eksekutif 3-5 kalimat yang komprehensif, padat, dan akurat mencakup seluruh aspek penting dokumen ini",
    "industryContext": "Penjelasan mengapa materi ini krusial di industri dan penerapannya di dunia kerja nyata",
    "keyTakeaways": [
      "Poin pokok 1 dari dokumen",
      "Poin pokok 2 dari dokumen",
      "Poin pokok 3 dari dokumen"
    ],
    "keyPoints": [
      {
        "term": "Nama Konsep / Istilah 1 dari dokumen",
        "definition": "Penjelasan konsep teknis mendalam",
        "category": "Kategori konsep",
        "analogy": "Analogi intuitif yang memudahkan pemahaman"
      },
      {
        "term": "Nama Konsep / Istilah 2 dari dokumen",
        "definition": "Penjelasan konsep teknis mendalam",
        "category": "Kategori konsep",
        "analogy": "Analogi intuitif yang memudahkan pemahaman"
      },
      {
        "term": "Nama Konsep / Istilah 3 dari dokumen",
        "definition": "Penjelasan konsep teknis mendalam",
        "category": "Kategori konsep",
        "analogy": "Analogi intuitif yang memudahkan pemahaman"
      },
      {
        "term": "Nama Konsep / Istilah 4 dari dokumen",
        "definition": "Penjelasan konsep teknis mendalam",
        "category": "Kategori konsep",
        "analogy": "Analogi intuitif yang memudahkan pemahaman"
      }
    ],
    "technicalProcedures": [
      {
        "step": 1,
        "title": "Nama Langkah / Protokol",
        "description": "Deskripsi instruksi atau langkah teknis berdasarkan isi dokumen"
      },
      {
        "step": 2,
        "title": "Nama Langkah / Protokol",
        "description": "Deskripsi instruksi atau langkah teknis berdasarkan isi dokumen"
      },
      {
        "step": 3,
        "title": "Nama Langkah / Protokol",
        "description": "Deskripsi instruksi atau langkah teknis berdasarkan isi dokumen"
      }
    ],
    "commonPitfalls": [
      {
        "pitfall": "Kesalahan fatal / umum yang sering dilakukan pemula pada materi ini",
        "prevention": "Langkah mitigasi / pencegahan teknis terbaik sesuai modul"
      },
      {
        "pitfall": "Kesalahan fatal / umum yang sering dilakukan pemula pada materi ini",
        "prevention": "Langkah mitigasi / pencegahan teknis terbaik sesuai modul"
      }
    ],
    "proTips": "Tips belajar praktis dan peringatan kesalahan umum (common pitfalls) dari materi ini",
    "breakdownTime": {
      "concept": "15 Menit",
      "practice": "20 Menit",
      "quiz": "10 Menit"
    }
  },
  "learningStages": [
    {
      "stageNumber": 1,
      "phaseLabel": "Tahap 1: Fondasi Konseptual",
      "title": "Judul spesifik tahap 1 sesuai isi dokumen & permintaan user",
      "shortSummary": "1-2 kalimat ringkasan tujuan tahap 1",
      "selfAction": "Instruksi aksi mandiri konkret berdasarkan isi dokumen pada tahap 1",
      "detailedMaterial": "Penjelasan mendalam 1-2 paragraf dari isi dokumen untuk tahap 1",
      "keyConcepts": ["Istilah Teknis 1A", "Istilah Teknis 1B", "Istilah Teknis 1C"],
      "practiceScenario": "Skenario latihan mandiri yang relevan dengan isi dokumen pada tahap 1",
      "comprehensionQuestion": "Pertanyaan uji pemahaman spesifik tahap 1?",
      "searchQuery": "Kueri pencarian video YouTube spesifik untuk tahap 1"
    },
    {
      "stageNumber": 2,
      "phaseLabel": "Tahap 2: Implementasi Teknis",
      "title": "Judul spesifik tahap 2 sesuai isi dokumen & permintaan user",
      "shortSummary": "1-2 kalimat ringkasan tujuan tahap 2",
      "selfAction": "Instruksi aksi mandiri konkret berdasarkan isi dokumen pada tahap 2",
      "detailedMaterial": "Penjelasan mendalam 1-2 paragraf dari isi dokumen untuk tahap 2",
      "keyConcepts": ["Istilah Teknis 2A", "Istilah Teknis 2B", "Istilah Teknis 2C"],
      "practiceScenario": "Skenario latihan mandiri yang relevan dengan isi dokumen pada tahap 2",
      "comprehensionQuestion": "Pertanyaan uji pemahaman spesifik tahap 2?",
      "searchQuery": "Kueri pencarian video YouTube spesifik untuk tahap 2"
    },
    {
      "stageNumber": 3,
      "phaseLabel": "Tahap 3: Praktik & Skenario Terapan",
      "title": "Judul spesifik tahap 3 sesuai isi dokumen & permintaan user",
      "shortSummary": "1-2 kalimat ringkasan tujuan tahap 3",
      "selfAction": "Instruksi aksi mandiri konkret berdasarkan isi dokumen pada tahap 3",
      "detailedMaterial": "Penjelasan mendalam 1-2 paragraf dari isi dokumen untuk tahap 3",
      "keyConcepts": ["Istilah Teknis 3A", "Istilah Teknis 3B", "Istilah Teknis 3C"],
      "practiceScenario": "Skenario latihan mandiri yang relevan dengan isi dokumen pada tahap 3",
      "comprehensionQuestion": "Pertanyaan uji pemahaman spesifik tahap 3?",
      "searchQuery": "Kueri pencarian video YouTube spesifik untuk tahap 3"
    },
    {
      "stageNumber": 4,
      "phaseLabel": "Tahap 4: Evaluasi & Validasi",
      "title": "Judul spesifik tahap 4 sesuai isi dokumen & permintaan user",
      "shortSummary": "1-2 kalimat ringkasan tujuan tahap 4",
      "selfAction": "Instruksi aksi mandiri konkret berdasarkan isi dokumen pada tahap 4",
      "detailedMaterial": "Penjelasan mendalam 1-2 paragraf dari isi dokumen untuk tahap 4",
      "keyConcepts": ["Istilah Teknis 4A", "Istilah Teknis 4B", "Istilah Teknis 4C"],
      "practiceScenario": "Skenario latihan mandiri yang relevan dengan isi dokumen pada tahap 4",
      "comprehensionQuestion": "Pertanyaan uji pemahaman spesifik tahap 4?",
      "searchQuery": "Kueri pencarian video YouTube spesifik untuk tahap 4"
    }
  ],
  "quiz": [
    {
      "id": 1,
      "question": "Pertanyaan active recall nomor 1 yang relevan dengan dokumen?",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctIndex": 0,
      "explanation": "Penjelasan mengapa jawaban tersebut benar berdasarkan materi dokumen"
    },
    {
      "id": 2,
      "question": "Pertanyaan active recall nomor 2 yang relevan dengan dokumen?",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctIndex": 0,
      "explanation": "Penjelasan mengapa jawaban tersebut benar berdasarkan materi dokumen"
    },
    {
      "id": 3,
      "question": "Pertanyaan active recall nomor 3 yang relevan dengan dokumen?",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctIndex": 0,
      "explanation": "Penjelasan mengapa jawaban tersebut benar berdasarkan materi dokumen"
    }
  ],
  "moduleChapters": [
    {
      "step": 1,
      "title": "Judul Bab / Langkah Praktik 1 dari dokumen",
      "summary": "Ringkasan isi bab atau langkah praktik 1"
    },
    {
      "step": 2,
      "title": "Judul Bab / Langkah Praktik 2 dari dokumen",
      "summary": "Ringkasan isi bab atau langkah praktik 2"
    }
  ],
  "userNeedsSummary": "Penjelasan personal mengenai apa yang dibutuhkan user untuk menguasai materi ini, disesuaikan dengan userFocus jika diisi",
  "recommendedQueries": [
    "Kueri pencarian YouTube spesifik 1 yang menyertakan istilah teknis utama dari coreKeywords",
    "Kueri pencarian YouTube spesifik 2 sesuai fokus kebutuhan user",
    "Kueri pencarian YouTube spesifik 3 tutorial praktis"
  ],
  "webReferences": [
    {
      "title": "Judul Referensi / Dokumentasi Resmi 1",
      "source": "Sumber Resmi (misal: Unity Docs / Vuforia Developer Library / MDN)",
      "url": "https://docs.unity3d.com/Manual/index.html",
      "description": "Deskripsi konten dokumentasi yang relevan dengan coreKeywords"
    },
    {
      "title": "Judul Referensi / Dokumentasi Resmi 2",
      "source": "Sumber Resmi",
      "url": "https://developer.vuforia.com/library",
      "description": "Deskripsi konten dokumentasi yang relevan dengan coreKeywords"
    },
    {
      "title": "Judul Referensi / Dokumentasi Resmi 3",
      "source": "Sumber Resmi",
      "url": "https://learn.microsoft.com/en-us/dotnet/csharp/",
      "description": "Deskripsi konten dokumentasi yang relevan dengan coreKeywords"
    }
  ]
}

Teks Dokumen Modul Asli (extractedText) yang Diunggah Mahasiswa:
${textSample}`;

    // Model cascading: Utamakan model berkecepatan tinggi dengan token limit memadai
    const preferredModel = process.env.GROQ_MODEL?.trim();
    const candidateModels = [
      ...(preferredModel ? [{ name: preferredModel, maxTokens: 3600 }] : []),
      { name: "qwen/qwen3.8-27b", maxTokens: 3200 },
      { name: "openai/gpt-oss-20b", maxTokens: 3200 },
      { name: "openai/gpt-oss-120b", maxTokens: 3600 },
    ];

    let rawReply = "";
    for (const candidate of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: candidate.name,
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah Asisten Akademik Adaptif. Susun `detectedTopic`, `userNeedsSummary`, dan `learningStages` (4-5 tahap) HANYA berdasarkan fakta, istilah, langkah kerja, dan konsep yang benar-benar tertulis di dalam `extractedText`, serta sesuaikan penekanannya dengan `userFocus` dari user. DILARANG KERAS menggunakan contoh materi umum di luar dokumen (seperti tipe data integer/float/boolean jika tidak ada di dokumen) dan DILARANG menebak dari singkatan nama file. Berikan respons HANYA dalam format JSON valid tanpa tanda markdown (tanpa ```json).",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
          max_tokens: candidate.maxTokens,
        });

        const reply = completion.choices[0]?.message?.content?.trim();
        if (reply) {
          rawReply = reply;
          break;
        }
      } catch (modelErr) {
        console.warn(`Model ${candidate.name} dilewati karena limit/error:`, modelErr);
      }
    }

    if (!rawReply) {
      throw new Error("Respons kosong dari seluruh kandidat model LLM");
    }

    // Bersihkan format markdown jika model menyertakan code fence
    let cleanJson = rawReply;
    if (cleanJson.includes("```")) {
      const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match?.[1]) {
        cleanJson = match[1];
      }
    }
    const firstBrace = cleanJson.indexOf("{");
    const lastBrace = cleanJson.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    let parsed: Partial<AnalyzedModuleResult> = {};
    try {
      parsed = JSON.parse(cleanJson) as Partial<AnalyzedModuleResult>;
    } catch {
      return analyzeModuleContent({
        title:
          fallbackTitle ||
          fileName?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") ||
          "Modul Pembelajaran",
        content: cleanContent,
        fileName,
        sourceType: "file",
      });
    }

    // Sanitasi dan pastikan judul tidak memuat boilerplate institusi
    let sanitizedTitle =
      typeof parsed.title === "string" && parsed.title.trim().length > 3
        ? parsed.title.trim()
        : "";

    if (
      !sanitizedTitle ||
      /D3|Teknik Informatika|Universitas|Sekolah Vokasi|K\.?kab|Madiun/i.test(sanitizedTitle)
    ) {
      sanitizedTitle = extractSalientTitle(
        cleanContent,
        fallbackTitle ||
          fileName?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") ||
          "Modul Pembelajaran",
        fileName,
      );
    }

    const domain =
      typeof parsed.domain === "string" && parsed.domain.trim().length > 2
        ? cleanModuleRawText(parsed.domain.trim())
        : undefined;

    const difficulty: "Dasar" | "Menengah" | "Lanjut" =
      parsed.difficulty === "Dasar" || parsed.difficulty === "Lanjut"
        ? parsed.difficulty
        : "Menengah";

    const overview =
      typeof parsed.summary?.overview === "string" && parsed.summary.overview.trim().length > 10
        ? cleanModuleRawText(parsed.summary.overview.trim())
        : `Modul "${sanitizedTitle}" memuat konsep esensial yang dipelajari secara mendalam dalam kurikulum akademik.`;

    const industryContext =
      typeof parsed.summary?.industryContext === "string" && parsed.summary.industryContext.trim().length > 10
        ? cleanModuleRawText(parsed.summary.industryContext.trim())
        : undefined;

    const keyTakeaways =
      Array.isArray(parsed.summary?.keyTakeaways) && parsed.summary.keyTakeaways.length > 0
        ? parsed.summary.keyTakeaways.map((t) => cleanModuleRawText(String(t)).trim()).filter((t) => t.length > 5)
        : undefined;

    const keyPoints =
      Array.isArray(parsed.summary?.keyPoints) && parsed.summary.keyPoints.length > 0
        ? parsed.summary.keyPoints.map((kp) => ({
            term: cleanModuleRawText(String(kp.term || "Konsep Esensial")).replace(/^[•\-*\d.]+\s*/, "").trim(),
            definition: cleanModuleRawText(String(kp.definition || "Penjelasan konsep.")).replace(/^[;:,.-]+/, "").trim(),
            category: kp.category ? String(kp.category).trim() : "Konsep Inti",
            analogy: kp.analogy ? cleanModuleRawText(String(kp.analogy)).trim() : undefined,
          }))
        : [
            {
              term: "Fondasi Konseptual",
              definition: `Konsep dasar dari materi ${sanitizedTitle}.`,
              category: "Fondasi",
            },
            {
              term: "Struktur & Aliran",
              definition: "Pengorganisasian data dan logika pemrosesan sistem.",
              category: "Arsitektur",
            },
          ];

    const technicalProcedures =
      Array.isArray(parsed.summary?.technicalProcedures) && parsed.summary.technicalProcedures.length > 0
        ? parsed.summary.technicalProcedures
            .map((tp, idx) => ({
              step: typeof tp.step === "number" ? tp.step : idx + 1,
              title: cleanModuleRawText(String(tp.title || `Langkah ${idx + 1}`)).trim(),
              description: cleanModuleRawText(String(tp.description || "")).trim(),
            }))
            .filter((tp) => tp.description.length > 5)
        : undefined;

    const commonPitfalls =
      Array.isArray(parsed.summary?.commonPitfalls) && parsed.summary.commonPitfalls.length > 0
        ? parsed.summary.commonPitfalls
            .map((cp) => ({
              pitfall: cleanModuleRawText(String(cp.pitfall || "")).trim(),
              prevention: cleanModuleRawText(String(cp.prevention || "")).trim(),
            }))
            .filter((cp) => cp.pitfall.length > 5 && cp.prevention.length > 5)
        : undefined;

    const proTips =
      typeof parsed.summary?.proTips === "string" && parsed.summary.proTips.trim().length > 5
        ? cleanModuleRawText(parsed.summary.proTips.trim())
        : "Pahami perbedaan alur logika dan selalu uji kasus batas sebelum mengimplementasikan solusi.";

    const breakdownTime = {
      concept: parsed.summary?.breakdownTime?.concept || "15 Menit",
      practice: parsed.summary?.breakdownTime?.practice || "20 Menit",
      quiz: parsed.summary?.breakdownTime?.quiz || "10 Menit",
    };

    const isContentWeb = /html|css|javascript|react|dom|web/i.test(cleanContent);
    const isContentSql = /sql|database|basis\s+data|tabel\s+relasi/i.test(cleanContent);
    const isContentFlowchart = /flowchart|dfd|diagram\s+alir/i.test(cleanContent);
    const isContentDataType = /\btipe\s+data\b|\binteger\b|\bboolean\b/i.test(cleanContent);

    const detectedTopic =
      typeof parsed.detectedTopic === "string" && parsed.detectedTopic.trim().length > 4
        ? cleanModuleRawText(parsed.detectedTopic.trim())
        : `${domain || "Kurikulum"}: ${sanitizedTitle}`;

    const coreKeywords: string[] =
      Array.isArray(parsed.coreKeywords) && parsed.coreKeywords.length > 0
        ? parsed.coreKeywords
            .map((k) => String(k || "").trim())
            .filter((k) => k.length >= 2)
            .slice(0, 8)
        : keyPoints.map((kp) => kp.term).slice(0, 6);

    const normalizedStagesFromAi = normalizeLearningStages(
      parsed.learningStages,
      detectedTopic,
      coreKeywords,
    );

    const stagesAndRoadmapStr = JSON.stringify(
      parsed.learningStages || parsed.roadmap || {},
    ).toLowerCase();

    const isHallucinated =
      (!cleanContent.toLowerCase().includes("java") && stagesAndRoadmapStr.includes("java")) ||
      (!isContentWeb &&
        (stagesAndRoadmapStr.includes("javascript") ||
          stagesAndRoadmapStr.includes("html5") ||
          stagesAndRoadmapStr.includes("css grid"))) ||
      (!isContentSql && stagesAndRoadmapStr.includes("kueri sql")) ||
      (!isContentFlowchart && stagesAndRoadmapStr.includes("simbol ansi flowchart")) ||
      (!isContentDataType && stagesAndRoadmapStr.includes("klasifikasi tipe data numerik"));

    let learningStages: LearningStageItem[] = [];
    let roadmap: AnalyzedModuleResult["roadmap"] = [];

    if (normalizedStagesFromAi.length >= 3 && !isHallucinated) {
      learningStages = normalizedStagesFromAi;
      roadmap = learningStages.map((s, idx) => ({
        step: idx + 1,
        stage: s.phaseLabel,
        title: s.title,
        description: s.shortSummary,
        actionItem: s.selfAction,
        understood: false,
        keyConcepts: s.keyConcepts,
        detailedGuide: s.detailedMaterial,
        practiceScenario: s.practiceScenario,
        checkQuestion: s.comprehensionQuestion,
      }));
    } else if (
      Array.isArray(parsed.roadmap) &&
      parsed.roadmap.length >= 4 &&
      parsed.roadmap.length <= 6 &&
      !isHallucinated
    ) {
      roadmap = parsed.roadmap.map((item, idx) => ({
        step: idx + 1,
        stage: String(item.stage || `Tahap ${idx + 1}`),
        title: cleanModuleRawText(String(item.title || `Langkah ${idx + 1}`)),
        description: cleanModuleRawText(
          String(item.description || "Pelajari materi pada tahapan ini."),
        ),
        actionItem: cleanModuleRawText(
          String(item.actionItem || "Kerjakan latihan praktis terkait."),
        ),
        understood: false,
        keyConcepts: Array.isArray(item.keyConcepts)
          ? item.keyConcepts.map((k) => cleanModuleRawText(String(k)))
          : undefined,
        detailedGuide:
          typeof item.detailedGuide === "string" && item.detailedGuide.trim()
            ? cleanModuleRawText(item.detailedGuide.trim())
            : undefined,
        practiceScenario:
          typeof item.practiceScenario === "string" && item.practiceScenario.trim()
            ? cleanModuleRawText(item.practiceScenario.trim())
            : undefined,
        checkQuestion:
          typeof item.checkQuestion === "string" && item.checkQuestion.trim()
            ? cleanModuleRawText(item.checkQuestion.trim())
            : undefined,
      }));
      learningStages = roadmap.map((r, idx) => ({
        stageNumber: idx + 1,
        phaseLabel: r.stage,
        title: r.title,
        shortSummary: r.description,
        selfAction: r.actionItem,
        detailedMaterial: r.detailedGuide || r.description,
        keyConcepts: r.keyConcepts && r.keyConcepts.length > 0 ? r.keyConcepts : coreKeywords.slice(0, 3),
        practiceScenario:
          r.practiceScenario ||
          `Terapkan konsep "${r.title}" sesuai materi pada ${detectedTopic}.`,
        comprehensionQuestion:
          r.checkQuestion || `Apa konsep kunci pada tahap "${r.title}"?`,
        searchQuery: `${r.title} ${coreKeywords.slice(0, 2).join(" ")} tutorial`.trim(),
      }));
    } else {
      const fallbackData = analyzeModuleContent({
        title: sanitizedTitle,
        content: cleanContent,
        fileName,
        sourceType: "file",
        userFocus,
      });
      roadmap = fallbackData.roadmap;
      learningStages = fallbackData.learningStages || [];
    }

    const quiz =
      Array.isArray(parsed.quiz) && parsed.quiz.length >= 2
        ? parsed.quiz.map((q, idx) => ({
            id: idx + 1,
            question: String(q.question || `Pertanyaan pemahaman materi nomor ${idx + 1}`),
            options:
              Array.isArray(q.options) && q.options.length === 4
                ? q.options.map(String)
                : ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
            correctIndex:
              typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < 4
                ? q.correctIndex
                : 0,
            explanation: String(q.explanation || "Jawaban ini sesuai dengan pembahasan modul."),
          }))
        : [
            {
              id: 1,
              question: `Apa fokus utama yang dipelajari dalam modul "${sanitizedTitle}"?`,
              options: [
                `Penguasaan konsep dan metodologi terstruktur pada ${sanitizedTitle}`,
                "Menghafal kode tanpa memahami alur logika",
                "Mengabaikan standar notasi sistem",
                "Menghapus seluruh variabel pengujian",
              ],
              correctIndex: 0,
              explanation: `Modul ini menitikberatkan pada pemahaman menyeluruh terhadap ${sanitizedTitle}.`,
            },
          ];

    // Sanitasi & Resolusi Rekomendasi Video YouTube Tervalidasi (yt-dlp + oEmbed + Prisma Cache) & Web References Dinamis
    const curatedResources = resolveCuratedResources(
      `${detectedTopic} ${coreKeywords.join(" ")} ${cleanContent.slice(0, 1500)}`,
      detectedTopic,
    );

    const parsedQueries = Array.isArray(parsed.recommendedQueries)
      ? parsed.recommendedQueries
          .map((q) => String(q || "").trim())
          .filter((q) => q.length >= 3)
          .slice(0, 4)
      : [];

    const parsedNeedsSummary =
      typeof parsed.userNeedsSummary === "string" && parsed.userNeedsSummary.trim().length > 10
        ? cleanModuleRawText(parsed.userNeedsSummary.trim())
        : undefined;

    const rawWebRefs =
      Array.isArray(parsed.webReferences) && parsed.webReferences.length > 0
        ? parsed.webReferences
        : Array.isArray(parsed.recommendedDocs) && parsed.recommendedDocs.length > 0
          ? parsed.recommendedDocs
          : [];

    let recommendedDocs: RecommendedDoc[] = rawWebRefs
      .map((d) => sanitizeDocumentation(d as Partial<RecommendedDoc>, detectedTopic))
      .filter((d) => d.url.startsWith("http"));

    if (recommendedDocs.length < 2) {
      recommendedDocs = curatedResources.docs;
    }

    const moduleChapters =
      Array.isArray(parsed.moduleChapters) && parsed.moduleChapters.length > 0
        ? parsed.moduleChapters
        : roadmap.map((r) => ({
            step: r.step,
            title: r.title,
            summary: r.description,
          }));

    const videoPipeline = await resolveValidatedTopicVideos({
      topic: sanitizedTitle,
      detectedTopic,
      extractedText: cleanContent,
      contentSample: cleanContent.slice(0, 2000),
      userFocus,
      userLearningGoal: userFocus,
      coreKeywords,
      existingNeedsSummary: parsedNeedsSummary,
      existingQueries:
        parsedQueries.length > 0 ? parsedQueries : curatedResources.recommendedQueries,
      existingWebReferences: recommendedDocs,
      existingLearningStages: learningStages,
      forceRefresh: options?.forceRefresh,
    });

    const finalLearningStages =
      videoPipeline.learningStages && videoPipeline.learningStages.length > 0
        ? videoPipeline.learningStages
        : learningStages;

    const finalRoadmap =
      finalLearningStages.length > 0
        ? finalLearningStages.map((s, idx) => ({
            step: idx + 1,
            stage: s.phaseLabel,
            title: s.title,
            description: s.shortSummary,
            actionItem: s.selfAction,
            understood: false,
            keyConcepts: s.keyConcepts,
            detailedGuide: s.detailedMaterial,
            practiceScenario: s.practiceScenario,
            checkQuestion: s.comprehensionQuestion,
          }))
        : roadmap;

    const recommendedVideos: RecommendedVideo[] = videoPipeline.videos;
    const finalWebReferences: RecommendedDoc[] =
      videoPipeline.webReferences && videoPipeline.webReferences.length > 0
        ? videoPipeline.webReferences
        : recommendedDocs;

    return {
      title: sanitizedTitle,
      detectedTopic: videoPipeline.detectedTopic || detectedTopic,
      coreKeywords:
        videoPipeline.coreKeywords.length > 0 ? videoPipeline.coreKeywords : coreKeywords,
      domain,
      sourceType: "file",
      fileName,
      estimatedTime: typeof parsed.estimatedTime === "string" ? parsed.estimatedTime : "45 Menit",
      difficulty,
      xpReward: typeof parsed.xpReward === "number" ? parsed.xpReward : 150,
      summary: {
        overview,
        industryContext,
        keyTakeaways,
        keyPoints,
        technicalProcedures,
        commonPitfalls,
        proTips,
        breakdownTime,
      },
      learningStages: finalLearningStages,
      roadmap: finalRoadmap,
      moduleChapters,
      quiz,
      videos: recommendedVideos,
      validatedVideos: recommendedVideos,
      recommendedVideos,
      recommendedDocs: finalWebReferences,
      webReferences: finalWebReferences,
      userNeedsSummary: videoPipeline.userNeedsSummary,
      recommendedQueries: videoPipeline.recommendedQueries,
      videoCacheHit: videoPipeline.cacheHit,
      videoValidationSource: videoPipeline.source,
    };
  } catch (error) {
    console.warn("Gagal mengeksekusi analisis AI Groq, menggunakan ekstraksi dokumen langsung + validasi yt-dlp:", error);
    const localResult = analyzeModuleContent({
      title:
        fallbackTitle ||
        fileName?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") ||
        "Modul Pembelajaran",
      content: cleanContent,
      fileName,
      sourceType: "file",
      userFocus,
    });

    const videoPipeline = await resolveValidatedTopicVideos({
      topic: localResult.title,
      detectedTopic: localResult.detectedTopic,
      extractedText: cleanContent,
      contentSample: cleanContent.slice(0, 2000),
      userFocus,
      userLearningGoal: userFocus,
      coreKeywords: localResult.coreKeywords,
      existingNeedsSummary: localResult.userNeedsSummary,
      existingQueries: localResult.recommendedQueries,
      existingWebReferences: localResult.webReferences || localResult.recommendedDocs,
      existingLearningStages: localResult.learningStages,
      forceRefresh: options?.forceRefresh,
    });

    const finalStages =
      videoPipeline.learningStages && videoPipeline.learningStages.length > 0
        ? videoPipeline.learningStages
        : localResult.learningStages || [];

    const syncedRoadmap =
      finalStages.length > 0
        ? finalStages.map((s, idx) => ({
            step: idx + 1,
            stage: s.phaseLabel,
            title: s.title,
            description: s.shortSummary,
            actionItem: s.selfAction,
            understood: false,
            keyConcepts: s.keyConcepts,
            detailedGuide: s.detailedMaterial,
            practiceScenario: s.practiceScenario,
            checkQuestion: s.comprehensionQuestion,
          }))
        : localResult.roadmap;

    return {
      ...localResult,
      detectedTopic: videoPipeline.detectedTopic || localResult.detectedTopic,
      coreKeywords:
        videoPipeline.coreKeywords.length > 0
          ? videoPipeline.coreKeywords
          : localResult.coreKeywords,
      learningStages: finalStages,
      roadmap: syncedRoadmap,
      videos: videoPipeline.videos,
      validatedVideos: videoPipeline.videos,
      recommendedVideos: videoPipeline.videos,
      webReferences:
        videoPipeline.webReferences.length > 0
          ? videoPipeline.webReferences
          : localResult.webReferences || localResult.recommendedDocs,
      recommendedDocs:
        videoPipeline.webReferences.length > 0
          ? videoPipeline.webReferences
          : localResult.recommendedDocs,
      userNeedsSummary: videoPipeline.userNeedsSummary,
      recommendedQueries: videoPipeline.recommendedQueries,
      videoCacheHit: videoPipeline.cacheHit,
      videoValidationSource: videoPipeline.source,
    };
  }
}

export interface ChatTutorParams {
  message: string;
  moduleTitle: string;
  moduleOverview?: string;
  keyPoints?: Array<{ term: string; definition: string; category?: string }>;
  quizContext?: Array<{ question: string; explanation?: string }>;
  contentSample?: string;
}

/**
 * Server-side AI Chat Tutor using Groq LLM
 * Menjawab pertanyaan spesifik mahasiswa seputar modul perkuliahan secara akurat,
 * ramah, dan menerapkan guardrail anti-cheating (tidak membocorkan jawaban kuis active recall).
 */
export async function generateAiChatTutorResponse(params: ChatTutorParams): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return generateChatResponse({
      moduleTitle: params.moduleTitle,
      userQuestion: params.message,
      quizContext: params.quizContext,
    });
  }

  try {
    const groq = new Groq({ apiKey });

    // Format konteks modul
    let contextStr = `Judul Modul: ${params.moduleTitle}\n`;
    if (params.moduleOverview) {
      contextStr += `Ringkasan Eksekutif:\n${params.moduleOverview}\n`;
    }
    if (params.keyPoints && params.keyPoints.length > 0) {
      contextStr += `Istilah Kunci:\n${params.keyPoints.map((k) => `- ${k.term}: ${k.definition}`).join("\n")}\n`;
    }
    if (params.contentSample) {
      contextStr += `Kutipan Materi Dokumen:\n${params.contentSample.slice(0, 3000)}\n`;
    }

    const quizGuardrailStr =
      params.quizContext && params.quizContext.length > 0
        ? `Daftar Pertanyaan Kuis Active Recall pada Modul Ini:\n${params.quizContext
            .map(
              (q, idx) =>
                `Soal ${idx + 1}: "${q.question}" (Konsep Inti: ${q.explanation || "-"})`,
            )
            .join("\n")}\n`
        : "";

    const systemPrompt = `Anda adalah NexedAI Academic Tutor untuk mahasiswa vokasi D3 Teknik Informatika SV UNS.
Tugas Anda adalah mendampingi mahasiswa mempelajari materi modul: "${params.moduleTitle}" secara interaktif, ramah, komprehensif, dan sangat jelas.

Konteks Materi Modul:
${contextStr}

${quizGuardrailStr}

ATURAN WAJIB & PEDOMAN INTEGRITAS AKADEMIK:
1. JAWABAN RELEVAN & AKURAT:
   - Jawab TEPAT apa yang ditanyakan mahasiswa berdasarkan substansi modul.
   - Jangan menyimpang atau memberikan contoh kode yang tidak berhubungan dengan inti pertanyaan.
   - Jika mahasiswa menanyakan konsep (misalnya pseudocode, flowchart, binary search, tipe data), jelaskan esensi, fungsi, urgensi, dan perbedaannya secara mendalam.
2. PEDOMAN KUIS ACTIVE RECALL (ANTI-CHEATING):
   - Jika mahasiswa menanyakan jawaban langsung kuis active recall (misalnya: "apa jawaban nomor 1?", "kunci jawaban kuis", atau menyalin persis soal kuis):
     a. DILARANG KERAS memberikan opsi jawaban atau membocorkan jawaban benar (jangan sebut huruf opsi A/B/C/D atau kalimat jawaban kunci).
     b. Berikan bimbingan sokratik: jelaskan konsep dasar yang diuji, berikan petunjuk/clue arah berpikir (hints), dan dorong mahasiswa untuk menganalisis serta memilih jawabannya sendiri di tab kuis!
3. FORMAT TAMPILAN RAPI & BERSIH:
   - Gunakan format Markdown yang rapi dengan heading (###), bullet points (-), dan penekanan tebal (**bold**).
   - Jika menyertakan contoh kode, WAJIB gunakan code block berlabel bahasa (contoh: \`\`\`python ... \`\`\`).
   - Gunakan bahasa Indonesia yang baik, akademis namun santun dan menyemangati mahasiswa.`;

    // Chat model cascading: Utamakan model berlatensi ultra-rendah (qwen & 20b ~0.4s)
    const preferredModel = process.env.GROQ_MODEL?.trim();
    const candidateModels = [
      ...(preferredModel ? [{ name: preferredModel, maxTokens: 850 }] : []),
      { name: "qwen/qwen3.8-27b", maxTokens: 800 },
      { name: "openai/gpt-oss-20b", maxTokens: 850 },
      { name: "openai/gpt-oss-120b", maxTokens: 1000 },
    ];

    for (const model of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: model.name,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: params.message },
          ],
          temperature: 0.3,
          max_tokens: model.maxTokens,
        });

        const reply = completion.choices[0]?.message?.content?.trim();
        if (reply) {
          return reply;
        }
      } catch (err) {
        console.warn(`Chat model ${model.name} gagal, mencoba alternatif:`, err);
      }
    }

    return generateChatResponse({
      moduleTitle: params.moduleTitle,
      userQuestion: params.message,
      quizContext: params.quizContext,
    });
  } catch (err) {
    console.warn("AI Chat Tutor gagal menggunakan Groq, beralih ke fallback cerdas:", err);
    return generateChatResponse({
      moduleTitle: params.moduleTitle,
      userQuestion: params.message,
      quizContext: params.quizContext,
    });
  }
}
