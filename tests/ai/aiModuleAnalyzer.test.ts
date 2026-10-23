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

  it("should analyze Unity 3D Game Engine module with strict zero-hallucination grounding", () => {
    const unityContent = `
      MODUL PRAKTIKUM PENGEMBANGAN GAME
      BAB 3: ARSITEKTUR UNITY 3D & SCRIPTING C#
      
      I. TUJUAN
      1. Memahami hierarki Scene, GameObject, dan Transform di Unity.
      2. Menerapkan komponen Rigidbody dan BoxCollider untuk simulasi fisika.
      3. Menulis skrip C# turunan MonoBehaviour untuk mendeteksi input pemain.
      
      II. DASAR TEORI
      • GameObject: Entitas dasar di dalam scene yang menampung berbagai komponen fungsional.
      • Transform: Komponen wajib pada setiap GameObject yang menyimpan posisi, rotasi, dan skala (X, Y, Z).
      • Rigidbody: Komponen fisika yang memungkinkan objek dipengaruhi oleh gaya gravitasi dan benturan.
      • MonoBehaviour: Kelas dasar dalam C# Unity yang menyediakan method siklus hidup Start() dan Update().
      
      III. PRAKTIKUM
      1. Buat Scene baru bernama 'Level1'.
      2. Tambahkan 3D Object Cube sebagai Player dan tambahkan Rigidbody.
      3. Buat skrip C# PlayerMovement.cs untuk menggerakkan kubus ke depan dengan kecepatan 10 unit per detik.
    `;

    const input = {
      title: "Arsitektur Unity 3D & Scripting C#",
      content: unityContent,
      fileName: "Modul_Unity_GameDev.pdf",
      sourceType: "file" as const,
    };

    const result = analyzeModuleContent(input);

    // Title should strictly be Unity / Game
    expect(result.title.toLowerCase()).toContain("unity");

    // Overview should mention Unity or Game development
    expect(result.summary.overview.toLowerCase()).toContain("unity");

    // Key points must contain GameObject and Rigidbody
    const terms = result.summary.keyPoints.map((k) => k.term.toLowerCase()).join(" ");
    expect(terms).toContain("gameobject");
    expect(terms).toContain("transform");

    // Roadmap stages MUST focus on Unity 3D and C# Game Development, NOT Web Programming / Flowchart / Tipe Data Alpro
    expect(result.roadmap.length).toBe(4);
    const roadmapText = JSON.stringify(result.roadmap).toLowerCase();
    expect(roadmapText).not.toContain("pemrograman web");
    expect(roadmapText).not.toContain("html5");
    expect(roadmapText).not.toContain("css grid");
    expect(roadmapText).not.toContain("kueri sql");

    // Recommended resources must be specific to Unity/C#, NOT Web Programming UNPAS HTML
    expect(result.recommendedVideos).toBeDefined();
    expect(result.recommendedVideos!.length).toBeGreaterThanOrEqual(2);
    const videoChannels = result.recommendedVideos!.map((v) => v.channel.toLowerCase()).join(" ");
    expect(videoChannels).toMatch(/brackeys|code monkey|akadem/i);

    expect(result.recommendedDocs).toBeDefined();
    const docSources = result.recommendedDocs!.map((d) => d.source.toLowerCase()).join(" ");
    expect(docSources).toMatch(/unity|microsoft|pustaka/i);
  });

  it("should analyze Pertolongan Pertama (PMI) module with zero IT-hallucination", () => {
    const pmiContent = `
      BUKU PANDUAN PELATIHAN PERTOLONGAN PERTAMA
      PALANG MERAH INDONESIA (PMI)
      
      BAB 1: PRINSIP DASAR PERTOLONGAN PERTAMA & PENILAIAN DINI
      • Penolong Pertama: Orang yang pertama kali tiba di lokasi kejadian yang memiliki kemampuan medis dasar.
      • Airway (Jalan Napas): Memastikan saluran pernapasan korban terbuka dan bebas dari sumbatan benda asing.
      • Resusitasi Jantung Paru (RJP): Tindakan pertolongan darurat henti jantung melalui kompresi dada ritmis 30 kali dan 2 kali bantuan napas.
      • Pembidaian: Prosedur imobilisasi tulang yang patah menggunakan bidai kaku untuk mencegah pergeseran fragmen tulang.
      
      LANGKAH PENANGANAN KEGAWATDARURATAN:
      1. Amankan diri penolong, amankan lokasi kejadian, amankan korban.
      2. Periksa kesadaran dengan metode ASNT (Awas, Suara, Nyeri, Tidak respon).
      3. Hubungi ambulans darurat PMI (021-7992325).
      4. Tangani perdarahan hebat dengan penekanan langsung dan balut tekan.
    `;

    const input = {
      title: "Pertolongan Pertama PMI",
      content: pmiContent,
      fileName: "Panduan_P3K_PMI.pdf",
      sourceType: "file" as const,
    };

    const result = analyzeModuleContent(input);

    expect(result.title.toLowerCase()).toContain("pertolongan pertama");
    expect(result.summary.overview.toLowerCase()).toContain("pertolongan pertama");

    // Key points must relate to first aid
    const terms = result.summary.keyPoints.map((k) => k.term.toLowerCase()).join(" ");
    expect(terms).toContain("penolong");

    // Roadmap must NOT contain IT concepts
    const roadmapText = JSON.stringify(result.roadmap).toLowerCase();
    expect(roadmapText).not.toContain("javascript");
    expect(roadmapText).not.toContain("database");
    expect(roadmapText).not.toContain("flowchart");

    // Resources must be PMI / Kemenkes / WHO
    const videoChannels = result.recommendedVideos!.map((v) => v.channel.toLowerCase()).join(" ");
    expect(videoChannels).toMatch(/palang merah|kementerian kesehatan|akadem/i);
  });
});

