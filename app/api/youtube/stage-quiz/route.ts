// app/api/youtube/stage-quiz/route.ts
import { NextResponse } from "next/server";

interface StageQuizRequest {
  videoId: string;
  videoTitle?: string;
  stageTitle?: string;
  stageMaterial?: string;
  topic?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StageQuizRequest;
    const { videoId, videoTitle = "", stageTitle = "", stageMaterial = "", topic = "" } = body;

    const cleanVideoId = (videoId || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 11);
    const effectiveStage = stageTitle.trim() || topic.trim() || "Materi Pembelajaran";
    const manualSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${effectiveStage} tutorial`,
    )}`;

    // 1. Coba hubungi FastAPI eksternal
    const fastApiUrl = (
      process.env.FASTAPI_URL ||
      process.env.NEXT_PUBLIC_FASTAPI_URL ||
      "https://nexed-backend.vercel.app"
    ).replace(/\/+$/, "");

    try {
      const response = await fetch(`${fastApiUrl}/api/youtube/stage-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: cleanVideoId,
          videoTitle,
          stageTitle: effectiveStage,
          stageMaterial,
          topic,
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.quizQuestions) && data.quizQuestions.length > 0) {
          return NextResponse.json(data);
        }
      }
    } catch {
      // Backend eksternal offline/timeout, gunakan fallback deterministic
    }

    // 2. Fallback cerdas Next.js (Zero downtime & crash-free)
    const tokens = (stageMaterial || effectiveStage)
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !/^(dan|yang|untuk|dari|pada|dengan|dalam|tahap|modul)$/i.test(w));

    const kw1 = tokens[0] || effectiveStage;
    const kw2 = tokens[1] || "Implementasi Terstruktur";

    const fallbackQuestions = [
      {
        question: `Berdasarkan tutorial video '${effectiveStage}', apa fungsi esensial dari '${kw1}' dalam alur kerja sistem?`,
        options: [
          `Menjadi fondasi logis dan acuan terstruktur agar proses berikutnya berjalan tanpa konflik runtime.`,
          `Menghapus seluruh alokasi variabel untuk menghemat komputasi memori server.`,
          `Melompati validasi data masukan dan langsung mengeksekusi proses utama.`,
          `Menonaktifkan pelaporan kesalahan (error log) pada peramban klien.`,
        ],
        correctIndex: 0,
        explanation: `Pemahaman mengenai '${kw1}' pada materi '${effectiveStage}' bertujuan memastikan alur program stabil dan terstruktur sebelum dilakukan implementasi tingkat lanjut.`,
      },
      {
        question: `Saat mempraktikkan materi '${kw2}' sebagaimana dicontohkan di dalam tutorial, tindakan apa yang direkomendasikan?`,
        options: [
          `Mengabaikan instruksi dokumentasi dan mengandalkan tebakan parameter.`,
          `Mengikuti langkah bertahap, melakukan pengujian output, dan memeriksa kesesuaian hasil.`,
          `Mengganti pustaka bawaan dengan kode eksperimental yang belum teruji.`,
          `Mematikan fungsi verifikasi tipe data untuk mempercepat waktu kompilasi.`,
        ],
        correctIndex: 1,
        explanation: `Praktik yang baik menuntut penerapan langkah berurutan dan validasi berkala terhadap output seperti yang dijelaskan pada tutorial.`,
      },
    ];

    return NextResponse.json({
      videoId: cleanVideoId,
      hasTranscript: false,
      transcriptSnippet: stageMaterial.slice(0, 300),
      manualSearchUrl,
      quizQuestions: fallbackQuestions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal memproses kuis video tahap.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

