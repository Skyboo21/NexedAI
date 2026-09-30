// src/lib/aiModuleServer.ts
import Groq from "groq-sdk";
import type { AnalyzedModuleResult } from "../components/NexedAiModuleHub";
import {
  analyzeModuleContent,
  cleanModuleRawText,
  extractSalientTitle,
  generateChatResponse,
} from "./aiModuleAnalyzer";

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
): Promise<AnalyzedModuleResult> {
  const apiKey = process.env.GROQ_API_KEY;
  // Bersihkan teks modul sebelum diproses
  const cleanContent = cleanModuleRawText(content);

  // Jika API key tidak ada, gunakan fallback cerdas lokal
  if (!apiKey) {
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

  try {
    const groq = new Groq({ apiKey });
    // Ambil sampel representatif dokumen (hingga 12.000 karakter)
    const textSample = cleanContent.slice(0, 12000);

    const prompt = `Anda adalah asisten kurikulum akademik AI NexedAI. Analisis dokumen modul pembelajaran berikut secara mendalam, lalu hasilkan ringkasan akademik dan silabus pembelajaran lengkap dalam format JSON murni.

PEDOMAN PENTING:
1. 'title': Judul modul/materi pelajaran sesungguhnya yang rapi dan profesional. DILARANG KERAS menggunakan nama universitas, fakultas, jurusan, prodi, atau header slide (seperti 'D3 Teknik Informatika', 'Universitas Sebelas Maret', 'Sekolah Vokasi', 'K.kab Madiun', 'Halaman 1'). Contoh judul yang benar: 'Pertemuan 4: Tipe Data, Variabel & Operator' atau 'Bab 5: Pemodelan Proses Bisnis (Flowchart & DFD)'.
2. 'summary.overview': Ringkasan eksekutif komprehensif dan mendalam (minimal 3-5 kalimat terstruktur rapi) yang menjelaskan konteks/urgensi materi, klasifikasi pokok bahasan utama dalam modul, serta relevansi praktisnya bagi kompetensi mahasiswa. DILARANG memotong teks dengan '...'.
3. 'summary.keyTakeaways': Array berisi 3-4 poin pokok penting / capaian utama dari materi ini (tiap poin 1-2 kalimat lugas).
4. 'summary.keyPoints': Array berisi 4-6 konsep/istilah esensial yang bersih tanpa nomor halaman atau header kampus. Setiap item wajib memiliki 'term', 'definition', dan 'category'.
5. 'summary.proTips': Tips belajar praktis dan peringatan jebakan kesalahan umum (common pitfalls) dari materi ini.
6. 'roadmap': 4 Tahap Peta Belajar Adaptif yang WAJIB 100% SESUAI DENGAN MATERI MODUL!
   - DILARANG KERAS berhalusinasi atau mencantumkan bahasa pemrograman / teknologi yang TIDAK ADA dalam modul (Contoh: JANGAN mencantumkan Java/JDK/JVM jika modul adalah tentang Algoritma, Flowchart, DFD, atau Tipe Data umum).
   - Setiap tahap WAJIB merefleksikan bab/sub-topik nyata dari dokumen secara bertahap:
     * Tahap 1: Fondasi Konseptual (terminologi dasar & prinsip pertama dari dokumen)
     * Tahap 2: Struktur Komponen & Logika (struktur data, sintaks, atau perancangan logika dari dokumen)
     * Tahap 3: Praktik & Implementasi Kasus (studi kasus / penerapan nyata yang ada di dokumen)
     * Tahap 4: Pengujian & Validasi Integritas (pengecekan kesalahan umum, validasi integritas, atau debugging)
   - Setiap item tahap WAJIB menyertakan: 'step', 'stage', 'title', 'description', 'keyConcepts', 'detailedGuide', 'actionItem', 'practiceScenario', dan 'checkQuestion'.

Struktur JSON yang WAJIB dipatuhi:
{
  "title": "Judul materi yang spesifik dan jelas dari dokumen",
  "difficulty": "Dasar" ATAU "Menengah" ATAU "Lanjut",
  "estimatedTime": "45 Menit",
  "xpReward": 130,
  "summary": {
    "overview": "Ringkasan eksekutif 3-5 kalimat yang komprehensif, padat, dan akurat mencakup seluruh aspek penting dokumen ini",
    "keyTakeaways": [
      "Poin pokok 1 dari dokumen",
      "Poin pokok 2 dari dokumen",
      "Poin pokok 3 dari dokumen"
    ],
    "keyPoints": [
      {
        "term": "Nama Konsep / Istilah 1 dari dokumen",
        "definition": "Penjelasan konsep yang lugas dan informatif tanpa artefak halaman",
        "category": "Kategori konsep (contoh: Tipe Data, Arsitektur, Logika, Operator)"
      },
      {
        "term": "Nama Konsep / Istilah 2 dari dokumen",
        "definition": "Penjelasan konsep yang lugas dan informatif tanpa artefak halaman",
        "category": "Kategori konsep"
      },
      {
        "term": "Nama Konsep / Istilah 3 dari dokumen",
        "definition": "Penjelasan konsep yang lugas dan informatif tanpa artefak halaman",
        "category": "Kategori konsep"
      },
      {
        "term": "Nama Konsep / Istilah 4 dari dokumen",
        "definition": "Penjelasan konsep yang lugas dan informatif tanpa artefak halaman",
        "category": "Kategori konsep"
      }
    ],
    "proTips": "Tips belajar praktis dan peringatan kesalahan umum (common pitfalls) dari materi ini",
    "breakdownTime": {
      "concept": "15 Menit",
      "practice": "20 Menit",
      "quiz": "10 Menit"
    }
  },
  "roadmap": [
    {
      "step": 1,
      "stage": "Tahap 1: Fondasi Konseptual",
      "title": "Judul materi langkah 1 yang diambil langsung dari topik modul",
      "description": "Deskripsi materi yang harus dikuasai di langkah 1 (2-3 kalimat lugas)",
      "keyConcepts": ["Konsep Kunci 1A", "Konsep Kunci 1B"],
      "detailedGuide": "Uraian materi mendalam dan panduan belajar langkah demi langkah untuk tahap 1 berdasarkan dokumen",
      "actionItem": "Aksi latihan konkret untuk mahasiswa di langkah 1",
      "practiceScenario": "Skenario studi kasus atau contoh konkret penerapan materi tahap 1",
      "checkQuestion": "Pertanyaan refleksi diri untuk menguji pemahaman tahap 1",
      "understood": false
    },
    {
      "step": 2,
      "stage": "Tahap 2: Struktur Komponen & Logika",
      "title": "Judul materi langkah 2 yang diambil langsung dari topik modul",
      "description": "Deskripsi materi yang harus dikuasai di langkah 2 (2-3 kalimat lugas)",
      "keyConcepts": ["Konsep Kunci 2A", "Konsep Kunci 2B"],
      "detailedGuide": "Uraian materi mendalam dan panduan belajar langkah demi langkah untuk tahap 2 berdasarkan dokumen",
      "actionItem": "Aksi latihan konkret untuk mahasiswa di langkah 2",
      "practiceScenario": "Skenario studi kasus atau contoh konkret penerapan materi tahap 2",
      "checkQuestion": "Pertanyaan refleksi diri untuk menguji pemahaman tahap 2",
      "understood": false
    },
    {
      "step": 3,
      "stage": "Tahap 3: Praktik & Implementasi Kasus",
      "title": "Judul materi langkah 3 yang diambil langsung dari topik modul",
      "description": "Deskripsi materi yang harus dikuasai di langkah 3 (2-3 kalimat lugas)",
      "keyConcepts": ["Konsep Kunci 3A", "Konsep Kunci 3B"],
      "detailedGuide": "Uraian materi mendalam dan panduan belajar langkah demi langkah untuk tahap 3 berdasarkan dokumen",
      "actionItem": "Aksi latihan konkret untuk mahasiswa di langkah 3",
      "practiceScenario": "Skenario studi kasus atau contoh konkret penerapan materi tahap 3",
      "checkQuestion": "Pertanyaan refleksi diri untuk menguji pemahaman tahap 3",
      "understood": false
    },
    {
      "step": 4,
      "stage": "Tahap 4: Pengujian & Validasi Integritas",
      "title": "Judul materi langkah 4 yang diambil langsung dari topik modul",
      "description": "Deskripsi materi yang harus dikuasai di langkah 4 (2-3 kalimat lugas)",
      "keyConcepts": ["Konsep Kunci 4A", "Konsep Kunci 4B"],
      "detailedGuide": "Uraian materi mendalam dan panduan belajar langkah demi langkah untuk tahap 4 berdasarkan dokumen",
      "actionItem": "Aksi latihan konkret untuk mahasiswa di langkah 4",
      "practiceScenario": "Skenario studi kasus atau contoh konkret penerapan materi tahap 4",
      "checkQuestion": "Pertanyaan refleksi diri untuk menguji pemahaman tahap 4",
      "understood": false
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
  ]
}

Teks Dokumen Modul yang Diunggah Mahasiswa:
${textSample}`;

    // Model cascading: Coba openai/gpt-oss-120b dulu (kapasitas token besar), jika gagal gunakan alternatif
    const candidateModels = [
      { name: "openai/gpt-oss-120b", maxTokens: 1800 },
      { name: "openai/gpt-oss-20b", maxTokens: 1200 },
      { name: "qwen/qwen3.8-27b", maxTokens: 950 },
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
                "Anda adalah AI Curriculum Analyzer NexedAI. Analisis teks modul secara teliti. Berikan respons HANYA dalam format JSON valid tanpa tanda markdown (tanpa ```json).",
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

    const difficulty: "Dasar" | "Menengah" | "Lanjut" =
      parsed.difficulty === "Dasar" || parsed.difficulty === "Lanjut"
        ? parsed.difficulty
        : "Menengah";

    const overview =
      typeof parsed.summary?.overview === "string" && parsed.summary.overview.trim().length > 10
        ? cleanModuleRawText(parsed.summary.overview.trim())
        : `Modul "${sanitizedTitle}" memuat konsep esensial yang dipelajari secara mendalam dalam kurikulum akademik.`;

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

    const proTips =
      typeof parsed.summary?.proTips === "string" && parsed.summary.proTips.trim().length > 5
        ? cleanModuleRawText(parsed.summary.proTips.trim())
        : "Pahami perbedaan alur logika dan selalu uji kasus batas sebelum mengimplementasikan solusi.";

    const breakdownTime = {
      concept: parsed.summary?.breakdownTime?.concept || "15 Menit",
      practice: parsed.summary?.breakdownTime?.practice || "20 Menit",
      quiz: parsed.summary?.breakdownTime?.quiz || "10 Menit",
    };

    const isJavaHallucinated =
      !cleanContent.toLowerCase().includes("java") &&
      JSON.stringify(parsed.roadmap || {}).toLowerCase().includes("java");

    let roadmap: AnalyzedModuleResult["roadmap"];
    if (
      Array.isArray(parsed.roadmap) &&
      parsed.roadmap.length === 4 &&
      !isJavaHallucinated
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
    } else {
      const fallbackData = analyzeModuleContent({
        title: sanitizedTitle,
        content: cleanContent,
        fileName,
        sourceType: "file",
      });
      roadmap = fallbackData.roadmap;
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

    return {
      title: sanitizedTitle,
      sourceType: "file",
      fileName,
      estimatedTime: typeof parsed.estimatedTime === "string" ? parsed.estimatedTime : "45 Menit",
      difficulty,
      xpReward: typeof parsed.xpReward === "number" ? parsed.xpReward : 130,
      summary: {
        overview,
        keyTakeaways,
        keyPoints,
        proTips,
        breakdownTime,
      },
      roadmap,
      quiz,
    };
  } catch (error) {
    console.warn("Gagal mengeksekusi analisis AI Groq, menggunakan fallback lokal:", error);
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

    const candidateModels = [
      { name: "openai/gpt-oss-120b", maxTokens: 1200 },
      { name: "openai/gpt-oss-20b", maxTokens: 1000 },
      { name: "qwen/qwen3.8-27b", maxTokens: 900 },
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
