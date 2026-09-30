// tests/ai/aiModuleAnalyzer.test.ts
import { describe, expect, it } from "vitest";
import {
  analyzeModuleContent,
  extractSalientTitle,
  generateChatResponse,
} from "../../src/lib/aiModuleAnalyzer";

describe("Nexed AI Module Analyzer & Reasoning Engine", () => {
  it("should extract binary search domain accurately", () => {
    const input = {
      title: "Pencarian Biner",
      content: "Materi kuliah binary search algorithm dan kompleksitas O(log N). Array harus terurut.",
      sourceType: "text" as const,
      presetKey: "binary_search",
    };
    const result = analyzeModuleContent(input);

    expect(result.title).toContain("Pencarian Biner");
    expect(result.summary.overview).toBeDefined();
    expect(result.summary.keyPoints.length).toBeGreaterThanOrEqual(4);
    expect(result.roadmap.length).toBe(4);
    expect(result.quiz.length).toBeGreaterThanOrEqual(3);

    // Verify quiz structure
    const firstQuiz = result.quiz[0];
    expect(firstQuiz).toBeDefined();
    expect(firstQuiz?.options.length).toBe(4);
    expect(typeof firstQuiz?.correctIndex).toBe("number");
    expect(firstQuiz?.explanation).toBeDefined();
  });

  it("should extract tree data structures domain accurately", () => {
    const input = {
      title: "Struktur Pohon (Tree)",
      content: "Struktur data Pohon Biner, Node hierarkis, Inorder, Preorder, dan Postorder traversal rekursif.",
      sourceType: "text" as const,
      presetKey: "tree_traversal",
    };
    const result = analyzeModuleContent(input);

    expect(result.title).toContain("Pohon");
    expect(result.summary.keyPoints.some((k) => k.term.includes("BST") || k.term.includes("Traversal"))).toBe(true);
  });

  it("should extract Business Process Modeling (Flowchart & DFD) accurately when user uploads university lab module", () => {
    const input = {
      title: "Praktikum Analis Perancangan Sistem",
      content: `
        MODUL PRAKTIKUM MATA KULIAH ANALIS PERANCANGAN SISTEM
        BAB 5 PEMODELAN PROSES BISNIS (FLOWCHART & DFD)
        I TUJUAN PRAKTIKUM
        1. Memahami konsep Pemodelan Proses Bisnis dan perannya.
        2. Merancang alur logika menggunakan Flowchart Sistem.
        3. Memetakan pergerakan data menggunakan Data Flow Diagram (DFD).
        II DASAR TEORI
        As-Is System dan To-Be System.
        Perbedaan Fundamental Flowchart vs DFD.
        Simbol Standar Flowchart ISO/ANSI (Terminator, Process, Decision, Data).
        4 Komponen Utama DFD: Entitas Eksternal, Proses, Data Store, Data Flow.
        Dosa Besar DFD: Black Hole, Miracle, Gray Hole.
        Diagram Konteks (DFD Level 0) dan Balancing.
        Studi Kasus Kasir Toko Kelontong Sinar Makmur.
      `,
      fileName: "modul_bab5_flowchart_dfd.pdf",
      sourceType: "file" as const,
    };
    const result = analyzeModuleContent(input);

    // Judul harus relevan dengan Pemodelan Proses Bisnis / Flowchart & DFD, BUKAN Pohon Biner
    expect(result.title.toLowerCase()).toContain("pemodelan proses bisnis");
    expect(result.title.toLowerCase()).toContain("flowchart");

    // Ringkasan harus relevan dengan flowchart dan data flow diagram
    expect(result.summary.overview.toLowerCase()).toContain("pemodelan proses bisnis");
    expect(result.summary.overview.toLowerCase()).toContain("flowchart");
    expect(result.summary.overview.toLowerCase()).toContain("data flow diagram");

    // Istilah esensial harus memuat konsep DFD & Flowchart
    const terms = result.summary.keyPoints.map((k) => k.term.toLowerCase()).join(" ");
    expect(terms).toContain("flowchart");
    expect(terms).toContain("dfd");
    expect(terms).toContain("as-is");

    // Roadmap harus mencakup perancangan flowchart dan diagram konteks
    expect(result.roadmap.length).toBe(4);
    const roadmapTitles = result.roadmap.map((r) => r.title.toLowerCase()).join(" ");
    expect(roadmapTitles).toContain("flowchart");
    expect(roadmapTitles).toContain("data flow diagram");

    // Kuis harus menguji konsep Flowchart & DFD
    expect(result.quiz.length).toBeGreaterThanOrEqual(3);
    const quizQuestions = result.quiz.map((q) => q.question.toLowerCase()).join(" ");
    expect(quizQuestions).toContain("flowchart");
  });

  it("should extract salient title correctly from raw module text", () => {
    const rawText = `
      PRAKTIKUM ANALIS PERANCANGAN SISTEM
      UNIVERSITAS SEBELAS MARET
      BAB 5 PEMODELAN PROSES BISNIS (FLOWCHART & DFD)
      NAMA MAHASISWA
    `;
    const title = extractSalientTitle(rawText, "Fallback Title");
    expect(title).toBe("Bab 5: Pemodelan Proses Bisnis (Flowchart & Dfd)");
  });

  it("should handle arbitrary custom modules dynamically without false matches", () => {
    const input = {
      title: "Teori Graf",
      content: `
        Modul Pembelajaran Teori Graf dan Jaringan.
        • Graf Berarah: Graf di mana setiap sisi memiliki orientasi arah tertentu dari simpul asal ke simpul tujuan.
        • Algoritma Dijkstra: Algoritma pencarian jalur terpendek dari satu simpul awal menuju seluruh simpul lainnya.
        • Matriks Ketetanggaan: Representasi graf dalam bentuk tabel dua dimensi yang menyimpan relasi ketetanggaan.
        • Graf planar adalah graf yang dapat digambar pada bidang datar tanpa ada sisi yang saling berpotongan.
      `,
      sourceType: "text" as const,
    };
    const result = analyzeModuleContent(input);

    expect(result.title).toBeDefined();
    // Tidak boleh salah mencocokkan ke Pohon Biner
    expect(result.title).not.toContain("Pohon Biner");
    expect(result.roadmap.length).toBe(4);
    expect(result.quiz.length).toBeGreaterThanOrEqual(3);
    expect(result.summary.keyPoints.length).toBeGreaterThanOrEqual(3);
  });

  it("should provide contextual tutor chat responses for Flowchart & DFD", () => {
    const resp1 = generateChatResponse({
      moduleTitle: "Bab 5: Pemodelan Proses Bisnis (Flowchart & DFD)",
      userQuestion: "Apa perbedaan fundamental antara Flowchart dan DFD?",
    });
    expect(resp1.toLowerCase()).toContain("waktu");
    expect(resp1.toLowerCase()).toContain("aliran data");

    const resp2 = generateChatResponse({
      moduleTitle: "Bab 5: Pemodelan Proses Bisnis (Flowchart & DFD)",
      userQuestion: "Apa itu Black Hole dan Miracle pada DFD?",
    });
    expect(resp2.toLowerCase()).toContain("black hole");
    expect(resp2.toLowerCase()).toContain("miracle");

    const resp3 = generateChatResponse({
      moduleTitle: "Pencarian Biner (Binary Search)",
      userQuestion: "Berikan contoh kode implementasi dan sintaks dasarnya!",
    });
    expect(resp3).toContain("def binary_search");
  });

  it("should answer pseudocode purpose questions conceptually without dumping cashier discount code", () => {
    const resp = generateChatResponse({
      moduleTitle: "Algoritma Pemrograman: Flowchart, Pseudocode, dan Langkah Penyelesaian Masalah",
      userQuestion: "Apa tujuan utama membuat pseudocode sebelum menulis kode program?",
    });

    expect(resp.toLowerCase()).toContain("pseudocode");
    expect(resp.toLowerCase()).toContain("logika");
    // Must NOT inappropriately return cashier discount python code
    expect(resp).not.toContain("hitung_transaksi_kasir");
    expect(resp).not.toContain("total_belanja > 50000");
  });

  it("should enforce strict anti-cheating guardrail on active recall quiz queries", () => {
    const mockQuiz = [
      {
        id: "q1",
        question: "Simbol flowchart apa yang digunakan untuk menyatakan percabangan atau pengambilan keputusan?",
        options: ["Oval / Terminator", "Belah Ketupat (Decision)", "Persegi Panjang (Process)", "Jajaran Genjang (Input/Output)"],
        correctIndex: 1,
        explanation: "Belah Ketupat (Diamond/Decision) dipakai untuk kondisi boolean logika.",
      },
    ];

    const resp = generateChatResponse({
      moduleTitle: "Algoritma Pemrograman",
      userQuestion: "Apa jawaban kuis active recall nomor 1? Kasih tahu jawabannya ya",
      quizContext: mockQuiz,
    });

    // Guardrail: must NEVER give the direct letter or exact answer
    expect(resp.toLowerCase()).toContain("petunjuk");
    expect(resp).not.toMatch(/jawabannya adalah\s*(B|Belah Ketupat)/i);
    expect(resp).not.toContain("Pilihan yang benar adalah");
  });

  it("should extract clean title, rich executive summary, and artifact-free key points from university slide PDFs (Alpro 4)", () => {
    const rawSlideText = `
      1 D3 Teknik Informatika K.kab Madiun
      PERTEMUAN 4
      A. Tipe Data
      Bahasa komputer paling tidak memiliki tiga kelompok besar tipe data, yaitu :
      1. Data Numerik
      Digunakan untuk operasi aritmatika seperti penjumlahan, perkalian. Data numerik dapat dibagi menjadi dua kelompok besar, yaitu data bilangan bulat dan data bilangan real / pecahan.
      Contoh sebuah karakter yaitu A, f, 9, atau *
      -- 1 of 9 --
      2 D3 Teknik Informatika K.kab Madiun
      B. Variabel dan Konstanta
      Variabel adalah wadah penyimpanan di memori komputer yang nilainya dapat dimodifikasi selama program berjalan.
      Konstanta merupakan identifier yang nilainya tetap sejak dideklarasikan hingga akhir program.
    `;

    const input = {
      title: "",
      content: rawSlideText,
      fileName: "Alpro - 4.pdf",
      sourceType: "file" as const,
    };

    const result = analyzeModuleContent(input);

    // Judul TIDAK BOLEH mengandung nama kampus atau nomor halaman slide
    expect(result.title).not.toContain("D3 Teknik Informatika");
    expect(result.title).not.toContain("K.kab Madiun");
    expect(result.title.toLowerCase()).toContain("tipe data");

    // Ringkasan Eksekutif harus kaya, mendalam, dan terstruktur
    expect(result.summary.overview.length).toBeGreaterThan(150);
    expect(result.summary.overview.toLowerCase()).toContain("tipe data");
    expect(result.summary.overview).not.toContain("-- 1 of 9 --");
    expect(result.summary.overview).not.toContain("1 D3 Teknik Informatika");

    // Key takeaways harus ada
    expect(result.summary.keyTakeaways).toBeDefined();
    expect(result.summary.keyTakeaways?.length).toBeGreaterThanOrEqual(2);

    // Istilah esensial harus bersih dari noise penanda halaman
    const termsAndDefs = result.summary.keyPoints.map((k) => `${k.term} ${k.definition}`).join(" ");
    expect(termsAndDefs).not.toContain("-- 1 of 9 --");
    expect(termsAndDefs).not.toContain("D3 Teknik Informatika");

    // Peta Belajar Adaptif HARUS sesuai modul (Tipe Data, Variabel, Konstanta) dan BUKAN Java/JDK/JVM
    expect(result.roadmap.length).toBe(4);
    const roadmapTitles = result.roadmap.map((s) => s.title.toLowerCase()).join(" ");
    expect(roadmapTitles).toContain("tipe data");
    expect(roadmapTitles).toContain("variabel");
    expect(roadmapTitles).toContain("konstanta");
    expect(roadmapTitles).not.toContain("java");
    expect(roadmapTitles).not.toContain("jdk");
    expect(roadmapTitles).not.toContain("jvm");

    // Setiap tahap harus memiliki isi materi yang bisa diakses (detailedGuide, keyConcepts, practiceScenario)
    for (const step of result.roadmap) {
      expect(step.detailedGuide).toBeDefined();
      expect(step.detailedGuide!.length).toBeGreaterThan(50);
      expect(step.keyConcepts).toBeDefined();
      expect(step.keyConcepts!.length).toBeGreaterThanOrEqual(2);
      expect(step.practiceScenario).toBeDefined();
      expect(step.checkQuestion).toBeDefined();
    }
  });
});
