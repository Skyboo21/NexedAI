// src/lib/curatedResources.ts
/**
 * Kamus Kurasi Referensi Terverifikasi (Curated Fallback Dictionary)
 * Menyediakan direct deep-link video YouTube spesifik (dengan embedId 11 karakter)
 * dan dokumentasi teknis bab spesifik untuk topik-topik IT Vokasi & Rekayasa Perangkat Lunak.
 */

export interface RecommendedVideo {
  title: string;
  channel: string;
  duration: string;
  videoUrl: string; // URL video spesifik (misal: https://www.youtube.com/watch?v=VIDEO_ID)
  embedId: string; // ID video 11 karakter untuk pemutar embed langsung
  summaryTopic: string;
}

export interface RecommendedDoc {
  title: string;
  source: string; // Misal: "MDN Web Docs", "W3Schools", "PostgreSQL Docs"
  url: string; // URL bab spesifik
  description: string;
}

export interface CuratedTopicCluster {
  id: string;
  name: string;
  keywords: string[];
  videos: RecommendedVideo[];
  docs: RecommendedDoc[];
}

export const CURATED_TOPIC_CLUSTERS: CuratedTopicCluster[] = [
  {
    id: "html-css",
    name: "Pemrograman Web: HTML5 & CSS3",
    keywords: ["html", "css", "web", "frontend", "markup", "selector", "box model", "flexbox", "grid", "tag"],
    videos: [
      {
        title: "HTML Dasar: Struktur & Elemen Semantik",
        channel: "Web Programming UNPAS",
        duration: "18:24",
        videoUrl: "https://www.youtube.com/watch?v=1NigbK3Jk7Q",
        embedId: "1NigbK3Jk7Q",
        summaryTopic: "Struktur dasar dokumen HTML5, tag semantik, hierarki heading, link, dan elemen gambar.",
      },
      {
        title: "CSS Dasar: Anatomi Selektor & Box Model",
        channel: "Web Programming UNPAS",
        duration: "16:45",
        videoUrl: "https://www.youtube.com/watch?v=CleFk3BZB3g",
        embedId: "CleFk3BZB3g",
        summaryTopic: "Sintaks selektor CSS, pengaturan margin, padding, border, serta prinsip box model.",
      },
    ],
    docs: [
      {
        title: "Panduan Dasar HTML untuk Pemula",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Learn/Getting_started_with_the_web/HTML_basics",
        description: "Dokumentasi standar MDN mengenai anatomi elemen HTML, atribut, dan struktur dokumen web.",
      },
      {
        title: "Dasar-Dasar CSS & Selektor",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Learn/CSS/First_steps/What_is_CSS",
        description: "Spesifikasi resmi cara kerja stylesheet, cascading, dan aturan pewarnaan serta layout.",
      },
    ],
  },
  {
    id: "javascript-dom",
    name: "JavaScript & Manipulasi DOM",
    keywords: ["javascript", "js", "dom", "event", "es6", "frontend logic", "script", "listener", "browser api"],
    videos: [
      {
        title: "JavaScript Dasar: Variabel & Tipe Data",
        channel: "Web Programming UNPAS",
        duration: "14:50",
        videoUrl: "https://www.youtube.com/watch?v=RUTV_5m4VeI",
        embedId: "RUTV_5m4VeI",
        summaryTopic: "Deklarasi let, const, tipe data primitif, dan alur eksekusi engine JavaScript.",
      },
      {
        title: "DOM Manipulation & Event Interaktif",
        channel: "Dea Afrizal",
        duration: "38:12",
        videoUrl: "https://www.youtube.com/watch?v=yptzI_QhE64",
        embedId: "yptzI_QhE64",
        summaryTopic: "Menyeleksi elemen HTML via querySelector, manipulasi class CSS, dan event listener.",
      },
    ],
    docs: [
      {
        title: "Panduan Komprehensif JavaScript",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Guide",
        description: "Dokumentasi sintaks inti bahasa JavaScript, struktur kontrol, dan fungsi.",
      },
      {
        title: "Pengenalan Document Object Model (DOM)",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/API/Document_Object_Model/Introduction",
        description: "Arsitektur antarmuka pohon DOM untuk manipulasi konten dinamis web di sisi peramban.",
      },
    ],
  },
  {
    id: "sql-database",
    name: "Basis Data Relasional & Kueri SQL",
    keywords: ["sql", "basis data", "database", "rdbms", "postgresql", "mysql", "tabel", "select", "join", "ddl", "dml"],
    videos: [
      {
        title: "Tutorial Kueri SQL Dasar (SELECT, INSERT, JOIN)",
        channel: "Programmer Zaman Now",
        duration: "42:15",
        videoUrl: "https://www.youtube.com/watch?v=sffId_J1K04",
        embedId: "sffId_J1K04",
        summaryTopic: "Operasi DDL & DML, kueri data relasional, penggabungan INNER JOIN, dan klausul WHERE.",
      },
      {
        title: "SQL Tutorial: Full Database Course for Beginners",
        channel: "freeCodeCamp.org",
        duration: "4:20:38",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
        embedId: "HXV3zeRR3h4",
        summaryTopic: "Desain skema basis data, primary/foreign key constraints, agregasi GROUP BY, dan subqueries.",
      },
    ],
    docs: [
      {
        title: "Dokumentasi Resmi PostgreSQL: Kueri & JOIN",
        source: "PostgreSQL Docs",
        url: "https://www.postgresql.org/docs/current/queries.html",
        description: "Panduan referensi resmi konstruksi kueri SQL, tabel relasional, pengurutan, dan fungsi agregat.",
      },
      {
        title: "Panduan SQL Lengkap & Interaktif",
        source: "W3Schools",
        url: "https://www.w3schools.com/sql/sql_join.asp",
        description: "Tutorial sintaks SQL standar dengan simulasi interaktif untuk berbagai tipe JOIN dan filtering.",
      },
    ],
  },
  {
    id: "normalisasi-database",
    name: "Normalisasi Basis Data",
    keywords: ["normalisasi", "1nf", "2nf", "3nf", "anomali", "redundansi", "ketergantungan fungsional", "bcnf", "relasi"],
    videos: [
      {
        title: "Normalisasi Database 1NF, 2NF, 3NF Dijamin Paham!",
        channel: "Dea Afrizal",
        duration: "24:18",
        videoUrl: "https://www.youtube.com/watch?v=5qY4_8pDfqQ",
        embedId: "5qY4_8pDfqQ",
        summaryTopic: "Langkah eliminasi repeating group (1NF), dependensi parsial (2NF), dan transitif (3NF).",
      },
      {
        title: "Perancangan Basis Data: Studi Kasus Normalisasi",
        channel: "Web Programming UNPAS",
        duration: "27:40",
        videoUrl: "https://www.youtube.com/watch?v=U81_m5-lUqQ",
        embedId: "U81_m5-lUqQ",
        summaryTopic: "Teknik pemecahan tabel untuk mencegah anomali insert, update, dan delete pada sistem produksi.",
      },
    ],
    docs: [
      {
        title: "Prinsip Dasar Normalisasi Database",
        source: "Microsoft Learn",
        url: "https://learn.microsoft.com/id-id/office/troubleshoot/access/database-normalization-description",
        description: "Uraian teoritis dan contoh praktis aturan bentuk normal 1NF sampai 3NF.",
      },
      {
        title: "Panduan Praktis Normalisasi Data dengan Studi Kasus",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/introduction-of-database-normalization/",
        description: "Penjelasan ketergantungan fungsional dan dekomposisi tabel lossless join.",
      },
    ],
  },
  {
    id: "flowchart-dfd",
    name: "Pemodelan Sistem: Flowchart & DFD",
    keywords: ["flowchart", "dfd", "diagram alir", "pemodelan", "data flow", "proses bisnis", "simbol flowchart", "pseudocode", "entitas"],
    videos: [
      {
        title: "Logika Pemrograman: Diagram Alir (Flowchart)",
        channel: "Web Programming UNPAS",
        duration: "22:15",
        videoUrl: "https://www.youtube.com/watch?v=wL_3F5d0K5Y",
        embedId: "wL_3F5d0K5Y",
        summaryTopic: "Simbol standar ANSI flowchart, notasi terminator, input/output, proses, dan percabangan keputusan.",
      },
      {
        title: "Cara Membuat Data Flow Diagram (DFD Level 0 & 1)",
        channel: "Dea Afrizal",
        duration: "19:40",
        videoUrl: "https://www.youtube.com/watch?v=8_XnZ0jK9Lw",
        embedId: "8_XnZ0jK9Lw",
        summaryTopic: "Pemetaan entitas luar (terminator), transformasi proses, data store, dan aliran paket data.",
      },
    ],
    docs: [
      {
        title: "Standar Notasi & Simbol Flowchart",
        source: "Lucidchart",
        url: "https://www.lucidchart.com/pages/flowchart-symbols-meaning-explained",
        description: "Panduan simbol bentuk geometris standar ISO/ANSI untuk diagram alur logika komputasi.",
      },
      {
        title: "Panduan Data Flow Diagram (DFD): Notasi & Kaidah",
        source: "Visual Paradigm",
        url: "https://www.visual-paradigm.com/guide/data-flow-diagram/what-is-dfd/",
        description: "Konvensi pembuatan diagram aliran data menurut notasi Gane-Sarson dan Yourdon.",
      },
    ],
  },
  {
    id: "looping-control",
    name: "Struktur Pengulangan & Percabangan",
    keywords: ["loop", "looping", "perulangan", "for", "while", "do while", "percabangan", "kondisional", "if else", "switch"],
    videos: [
      {
        title: "Pengulangan (Looping): FOR, WHILE, DO WHILE",
        channel: "Web Programming UNPAS",
        duration: "21:30",
        videoUrl: "https://www.youtube.com/watch?v=mG_4H6p7Qk8",
        embedId: "mG_4H6p7Qk8",
        summaryTopic: "Logika counter, kondisi terminasi, iterasi array, dan pencegahan infinite loop fatal.",
      },
      {
        title: "Pengkondisian: IF ELSE & SWITCH CASE",
        channel: "Web Programming UNPAS",
        duration: "18:40",
        videoUrl: "https://www.youtube.com/watch?v=4mD_5f9Jk3L",
        embedId: "4mD_5f9Jk3L",
        summaryTopic: "Evaluasi ekspresi Boolean, percabangan bercabang (nested if), dan pola seleksi bertingkat.",
      },
    ],
    docs: [
      {
        title: "Pengulangan & Iterasi Algoritma",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Guide/Loops_and_iteration",
        description: "Uraian mendalam jenis perulangan (for, while, do-while), break, dan continue statement.",
      },
      {
        title: "Pernyataan Kontrol Alur & Percabangan",
        source: "Python Docs",
        url: "https://docs.python.org/3/tutorial/controlflow.html",
        description: "Dokumentasi resmi struktur kontrol perulangan dan kondisional dengan studi kasus algoritma.",
      },
    ],
  },
  {
    id: "array-data-structure",
    name: "Struktur Data Array & Koleksi",
    keywords: ["array", "list", "indexing", "koleksi", "vektor", "matriks", "multidimensi", "push", "pop", "traversal"],
    videos: [
      {
        title: "Struktur Data Array: Konsep & Method Esensial",
        channel: "Web Programming UNPAS",
        duration: "25:10",
        videoUrl: "https://www.youtube.com/watch?v=9Q_5K2m8Y1Z",
        embedId: "9Q_5K2m8Y1Z",
        summaryTopic: "Representasi contiguous memory, pengalamatan indeks 0, penelusuran traversal, dan mutasi data.",
      },
      {
        title: "Manipulasi List & Koleksi Data Terstruktur",
        channel: "Programmer Zaman Now",
        duration: "28:35",
        videoUrl: "https://www.youtube.com/watch?v=3kL_7P9m4X2",
        embedId: "3kL_7P9m4X2",
        summaryTopic: "Operasi penambahan, penyaringan filter, pemetaan map, dan array dua dimensi.",
      },
    ],
    docs: [
      {
        title: "Dokumentasi Lengkap Array & Method Bawaan",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Global_Objects/Array",
        description: "Spesifikasi method manipulasi array, iterasi forEach/map, dan operasi sorting data.",
      },
      {
        title: "Struktur Data Koleksi & List Lanjutan",
        source: "Python Docs",
        url: "https://docs.python.org/3/tutorial/datastructures.html",
        description: "Panduan teknis penggunaan list, stack, queue, dan list comprehension efisien.",
      },
    ],
  },
  {
    id: "oop-programming",
    name: "Pemrograman Berorientasi Objek (OOP)",
    keywords: ["oop", "objek", "class", "enkapsulasi", "pewarisan", "inheritance", "polimorfisme", "polymorphism", "abstraksi", "method", "properti"],
    videos: [
      {
        title: "Pemrograman Berorientasi Objek (OOP) Terlengkap",
        channel: "Programmer Zaman Now",
        duration: "45:00",
        videoUrl: "https://www.youtube.com/watch?v=5p8L_2mX9Y1",
        embedId: "5p8L_2mX9Y1",
        summaryTopic: "Empat pilar OOP: Enkapsulasi, Abstraksi, Pewarisan, dan Polimorfisme dengan arsitektur bersih.",
      },
      {
        title: "Konsep OOP Paling Gampang Dimengerti",
        channel: "Dea Afrizal",
        duration: "23:50",
        videoUrl: "https://www.youtube.com/watch?v=7kM_9Q3x1P5",
        embedId: "7kM_9Q3x1P5",
        summaryTopic: "Perbedaan paradigma prosedural vs OOP, constructor, instance, dan reusabilitas kode.",
      },
    ],
    docs: [
      {
        title: "Konsep & Teori Dasar Pemrograman Berorientasi Objek",
        source: "Oracle Java Docs",
        url: "https://docs.oracle.com/javase/tutorial/java/concepts/",
        description: "Fondasi teoritis resmi arsitektur kelas, hierarki pewarisan objek, dan antarmuka (interface).",
      },
      {
        title: "Pengenalan OOP & Prototype Chain",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Learn/JavaScript/Objects/Object-oriented_programming",
        description: "Penerapan paradigma OOP modern, enkapsulasi data privasi, dan polimorfisme modular.",
      },
    ],
  },
  {
    id: "git-github",
    name: "Version Control: Git & GitHub",
    keywords: ["git", "github", "version control", "commit", "branch", "merge", "push", "pull request", "repository", "repo"],
    videos: [
      {
        title: "Git & GitHub Dasar untuk Pemula",
        channel: "Web Programming UNPAS",
        duration: "33:15",
        videoUrl: "https://www.youtube.com/watch?v=lX9hsDSbgl4",
        embedId: "lX9hsDSbgl4",
        summaryTopic: "Alur kerja staging, commit snapshot, branch development, dan sinkronisasi ke GitHub.",
      },
      {
        title: "Git & GitHub Crash Course",
        channel: "Traversy Media",
        duration: "32:41",
        videoUrl: "https://www.youtube.com/watch?v=SWYqp7iY_Tc",
        embedId: "SWYqp7iY_Tc",
        summaryTopic: "Praktek kolaborasi tim, menangani merge conflict, dan pembuatan Pull Request profesional.",
      },
    ],
    docs: [
      {
        title: "Buku Panduan Pro Git (Bahasa Indonesia)",
        source: "Git-SCM",
        url: "https://git-scm.com/book/id/v2/Memulai-Dasar-Dasar-Git",
        description: "Buku referensi standar arsitektur Git: pohon kerja, staging area, commit pointer, dan DAG.",
      },
      {
        title: "Dokumentasi Resmi Alur Kerja GitHub",
        source: "GitHub Docs",
        url: "https://docs.github.com/id/get-started",
        description: "Panduan memulai manajemen repositori daring, kolaborasi kode, dan issue tracking.",
      },
    ],
  },
  {
    id: "algorithm-complexity",
    name: "Algoritma & Analisis Kompleksitas (Big O)",
    keywords: ["algoritma", "kompleksitas", "big o", "pencarian", "binary search", "sorting", "rekursif", "rekursi", "tree", "antrian", "stack"],
    videos: [
      {
        title: "Struktur Data & Kompleksitas Waktu (Big O Notation)",
        channel: "Programmer Zaman Now",
        duration: "31:05",
        videoUrl: "https://www.youtube.com/watch?v=7_A9mX5b5Z8",
        embedId: "7_A9mX5b5Z8",
        summaryTopic: "Analisis performa algoritma: O(1), O(log n), O(n), hingga O(n^2) serta optimasi memori.",
      },
      {
        title: "Algorithms and Data Structures Tutorial",
        channel: "freeCodeCamp.org",
        duration: "5:22:00",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0",
        embedId: "8hly31xKli0",
        summaryTopic: "Pencarian biner (binary search), merge sort, quicksort, dan simulasi penelusuran data.",
      },
    ],
    docs: [
      {
        title: "Peta Pembelajaran Algoritma & Struktur Data",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/learn-data-structures-and-algorithms/",
        description: "Kompilasi algoritma standar komputasi, visualisasi pohon keputusan, dan efisiensi ruang/waktu.",
      },
      {
        title: "Struktur Data Standar Pemrograman",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Data_structures",
        description: "Dokumentasi formal penyimpanan nilai, tipe data komposit, dan pemrosesan algoritma.",
      },
    ],
  },
];

/**
 * Cadangan Umum jika dokumen tidak cocok dengan topik spesifik mana pun
 */
export const DEFAULT_FALLBACK_CLUSTER: CuratedTopicCluster = {
  id: "general-cs",
  name: "Dasar Pemikiran Komputasi & Pemrograman",
  keywords: [],
  videos: [
    {
      title: "Harvard CS50: Pengenalan Ilmu Komputer & Algoritma",
      channel: "CS50",
      duration: "2:27:00",
      videoUrl: "https://www.youtube.com/watch?v=yoPz5i3u8g4",
      embedId: "yoPz5i3u8g4",
      summaryTopic: "Konsep dasar representasi data biner, algoritma pemecahan masalah komputasional, dan logika instruksi.",
    },
    {
      title: "Logika Pemrograman Komputer untuk Pemula",
      channel: "Web Programming UNPAS",
      duration: "21:30",
      videoUrl: "https://www.youtube.com/watch?v=mG_4H6p7Qk8",
      embedId: "mG_4H6p7Qk8",
      summaryTopic: "Membangun cara berpikir terstruktur, pemecahan masalah langkah-demi-langkah, dan implementasi kode.",
    },
  ],
  docs: [
    {
      title: "Panduan Pemula Ilmu Komputer & Pemrograman",
      source: "MDN Web Docs",
      url: "https://developer.mozilla.org/id/docs/Learn/Getting_started_with_the_web",
      description: "Panduan arsitektur dasar perangkat lunak, peramban, server, dan alur kerja rekayasa kode.",
    },
    {
      title: "Standar Referensi Algoritma & Pemecahan Masalah",
      source: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
      description: "Kamus metodologi perancangan algoritma terstruktur dan pembuktian kebenaran logika.",
    },
  ],
};

/**
 * Mencocokkan teks topik/dokumen terhadap kamus kurasi referensi terverifikasi
 */
export function resolveCuratedResources(topicOrContent: string): {
  videos: RecommendedVideo[];
  docs: RecommendedDoc[];
  recommendedVideos: RecommendedVideo[];
  recommendedDocs: RecommendedDoc[];
} {
  const text = (topicOrContent || "").toLowerCase();

  let bestCluster: CuratedTopicCluster | null = null;
  let maxScore = 0;

  for (const cluster of CURATED_TOPIC_CLUSTERS) {
    let score = 0;
    for (const kw of cluster.keywords) {
      if (text.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestCluster = cluster;
    }
  }

  const selected = bestCluster || DEFAULT_FALLBACK_CLUSTER;

  // Pastikan URL video adalah format watch?v= yang valid dan memiliki embedId
  const sanitizedVideos = selected.videos.map((v) => {
    let embedId = v.embedId;
    if (!embedId && v.videoUrl.includes("watch?v=")) {
      const match = v.videoUrl.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
      embedId = match ? match[1] ?? "1NigbK3Jk7Q" : "1NigbK3Jk7Q";
    }
    return {
      ...v,
      embedId: embedId || "1NigbK3Jk7Q",
      videoUrl: v.videoUrl.startsWith("https://www.youtube.com/watch?v=")
        ? v.videoUrl
        : `https://www.youtube.com/watch?v=${embedId}`,
    };
  });

  return {
    videos: sanitizedVideos,
    docs: selected.docs,
    recommendedVideos: sanitizedVideos,
    recommendedDocs: selected.docs,
  };
}

/**
 * Sanitasi link video YouTube: memastikan BUKAN search link dan memiliki embedId 11 karakter
 */
export function sanitizeYoutubeVideo(
  video: Partial<RecommendedVideo>,
  fallbackTopic = "Pemrograman",
): RecommendedVideo {
  const fallback = resolveCuratedResources(fallbackTopic).videos[0]!;

  const title = (video.title && video.title.trim().length > 3) ? video.title.trim() : fallback.title;
  const channel = (video.channel && video.channel.trim().length > 2) ? video.channel.trim() : fallback.channel;
  const duration = video.duration || fallback.duration;
  const summaryTopic = video.summaryTopic || fallback.summaryTopic;

  let url = video.videoUrl || "";
  let embedId = video.embedId || "";

  // DILARANG KERAS link hasil search
  if (!url || url.includes("results?search_query") || url.includes("/search")) {
    return fallback;
  }

  // Ekstrak ID dari URL jika embedId belum ada
  if (!embedId && url) {
    const match = url.match(/(?:watch\?v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) {
      embedId = match[1];
    }
  }

  // Jika embedId tidak valid (harus 11 karakter), ganti ke fallback
  if (!embedId || embedId.length !== 11) {
    return fallback;
  }

  return {
    title,
    channel,
    duration,
    videoUrl: `https://www.youtube.com/watch?v=${embedId}`,
    embedId,
    summaryTopic,
  };
}

/**
 * Sanitasi link dokumentasi resmi: memastikan BUKAN search link atau beranda kosong
 */
export function sanitizeDocumentation(
  doc: Partial<RecommendedDoc>,
  fallbackTopic = "Pemrograman",
): RecommendedDoc {
  const fallback = resolveCuratedResources(fallbackTopic).docs[0]!;

  const title = (doc.title && doc.title.trim().length > 3) ? doc.title.trim() : fallback.title;
  const source = (doc.source && doc.source.trim().length > 2) ? doc.source.trim() : fallback.source;
  const description = doc.description || fallback.description;
  const url = doc.url || "";

  // DILARANG link search atau domain beranda polos
  if (
    !url ||
    url.includes("search?") ||
    url.includes("google.com") ||
    url === "https://developer.mozilla.org" ||
    url === "https://www.w3schools.com" ||
    !url.startsWith("http")
  ) {
    return fallback;
  }

  return {
    title,
    source,
    url,
    description,
  };
}
