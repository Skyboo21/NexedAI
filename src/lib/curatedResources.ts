// src/lib/curatedResources.ts
/**
 * Kamus Kurasi Dokumentasi Teknis & Kueri Pencarian Topik
 * TIDAK ADA LAGI video ID statis/hardcoded/palsu di sini.
 * Seluruh video YouTube WAJIB divalidasi secara live melalui FastAPI (yt-dlp + YouTube oEmbed).
 */

export interface VideoTopComment {
  author: string;
  text: string;
  likes?: number;
}

export interface RecommendedVideo {
  title: string;
  channel: string;
  channelName?: string;
  duration: string;
  videoUrl: string;
  embedId: string;
  videoId?: string;
  summaryTopic: string;
  viewCount?: number;
  likeCount?: number;
  qualityScore?: number;
  topComments?: VideoTopComment[];
  isValidated?: boolean;
}

export interface RecommendedDoc {
  title: string;
  source: string;
  url: string;
  docUrl?: string;
  description: string;
}

export interface CuratedTopicCluster {
  id: string;
  name: string;
  keywords: string[];
  recommendedQueries: string[];
  videos: RecommendedVideo[];
  docs: RecommendedDoc[];
}

/**
 * Ekstraksi presisi ID YouTube 11 karakter dari berbagai variasi URL
 */
export function extractYoutubeId(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2] && /^[a-zA-Z0-9_-]{11}$/.test(match[2]) ? match[2] : "";
}

export const CURATED_TOPIC_CLUSTERS: CuratedTopicCluster[] = [
  {
    id: "web-html-semantic",
    name: "Pemrograman Web: HTML5 Semantic & Struktur Dokumen",
    keywords: ["html", "html5", "semantic", "semantik", "heading", "paragraf", "form", "tabel", "tag", "markup", "web dasar"],
    recommendedQueries: [
      "tutorial html5 semantic bahasa indonesia",
      "html5 semantic elements tutorial",
      "struktur dokumen html dasar",
    ],
    videos: [],
    docs: [
      {
        title: "Panduan Dasar HTML untuk Pemula",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Learn/Getting_started_with_the_web/HTML_basics",
        docUrl: "https://developer.mozilla.org/id/docs/Learn/Getting_started_with_the_web/HTML_basics",
        description: "Dokumentasi standar MDN mengenai anatomi elemen HTML, atribut, dan struktur dokumen web semantik.",
      },
      {
        title: "HTML5 Semantic Elements Reference",
        source: "W3Schools",
        url: "https://www.w3schools.com/html/html5_semantic_elements.asp",
        docUrl: "https://www.w3schools.com/html/html5_semantic_elements.asp",
        description: "Spesifikasi dan contoh implementasi tag semantik untuk aksesibilitas dan optimasi SEO mesin pencari.",
      },
    ],
  },
  {
    id: "web-css-layout",
    name: "Pemrograman Web: CSS Grid, Flexbox & Responsive Design",
    keywords: ["css", "grid", "flexbox", "responsive", "media query", "box model", "layout", "flex", "display", "align-items", "justify-content"],
    recommendedQueries: [
      "css flexbox dan css grid tutorial indonesia",
      "responsive web design css flexbox grid tutorial",
      "belajar css layouting",
    ],
    videos: [],
    docs: [
      {
        title: "Panduan CSS Flexible Box Layout (Flexbox)",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox",
        docUrl: "https://developer.mozilla.org/id/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox",
        description: "Konsep dasar flex container, flex item, perataan elemen, dan distribusi ruang proporsional.",
      },
      {
        title: "CSS Grid Layout Complete Guide",
        source: "W3Schools",
        url: "https://www.w3schools.com/css/css_grid.asp",
        docUrl: "https://www.w3schools.com/css/css_grid.asp",
        description: "Tutorial interaktif modul grid CSS untuk pembangunan struktur antarmuka halaman dua dimensi.",
      },
    ],
  },
  {
    id: "web-javascript-es6",
    name: "Pemrograman Web: JavaScript Modern (ES6+)",
    keywords: ["javascript", "js", "es6", "arrow function", "destructuring", "let", "const", "template literal", "spread operator", "modular js"],
    recommendedQueries: [
      "tutorial javascript modern es6 bahasa indonesia",
      "javascript es6 arrow function destructuring tutorial",
      "belajar javascript dasar sampai mahir",
    ],
    videos: [],
    docs: [
      {
        title: "Panduan Komprehensif JavaScript",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Guide",
        docUrl: "https://developer.mozilla.org/id/docs/Web/JavaScript/Guide",
        description: "Dokumentasi sintaks inti bahasa JavaScript, struktur kontrol, ekspresi, dan fungsi modern.",
      },
      {
        title: "JavaScript ES6 Features & Syntax",
        source: "W3Schools",
        url: "https://www.w3schools.com/js/js_es6.asp",
        docUrl: "https://www.w3schools.com/js/js_es6.asp",
        description: "Rangkuman lengkap fitur standar ECMAScript 2015 beserta contoh runnable code.",
      },
    ],
  },
  {
    id: "web-dom-manipulation",
    name: "Pemrograman Web: DOM Manipulation & Event Interaktif",
    keywords: ["dom", "manipulasi dom", "event", "event listener", "queryselector", "click", "innerhtml", "classlist", "elemen html"],
    recommendedQueries: [
      "javascript dom manipulation tutorial indonesia",
      "belajar javascript dom event listener",
      "javascript dom crash course",
    ],
    videos: [],
    docs: [
      {
        title: "Pengenalan Document Object Model (DOM)",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/API/Document_Object_Model/Introduction",
        docUrl: "https://developer.mozilla.org/id/docs/Web/API/Document_Object_Model/Introduction",
        description: "Arsitektur pohon hierarki DOM, node elemen, dan manipulasi antarmuka peramban di sisi klien.",
      },
      {
        title: "HTML DOM Methods & Events Reference",
        source: "W3Schools",
        url: "https://www.w3schools.com/js/js_htmldom.asp",
        docUrl: "https://www.w3schools.com/js/js_htmldom.asp",
        description: "Panduan interaktif menyeleksi elemen, mengubah style CSS dinamis, dan menangani user interaction.",
      },
    ],
  },
  {
    id: "web-fetch-async",
    name: "Pemrograman Web: Fetch API, Promise & Asynchronous JavaScript",
    keywords: ["fetch", "fetch api", "async", "await", "promise", "asynchronous", "ajax", "json", "api", "request", "http"],
    recommendedQueries: [
      "asynchronous javascript promise async await indonesia",
      "fetch api javascript tutorial indonesia",
      "javascript async await fetch api tutorial",
    ],
    videos: [],
    docs: [
      {
        title: "Menggunakan Fetch API (Using Fetch)",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/API/Fetch_API/Using_Fetch",
        docUrl: "https://developer.mozilla.org/id/docs/Web/API/Fetch_API/Using_Fetch",
        description: "Dokumentasi standar pengiriman HTTP request berbasis Promise, header, credentials, dan body stream.",
      },
      {
        title: "JavaScript Async / Await & Promises",
        source: "W3Schools",
        url: "https://www.w3schools.com/js/js_async.asp",
        docUrl: "https://www.w3schools.com/js/js_async.asp",
        description: "Tutorial sintaks pengelolaan fungsi asynchronous, try-catch error boundary, dan response parsing.",
      },
    ],
  },
  {
    id: "web-rest-api",
    name: "Pemrograman Web: RESTful API (PHP & Node.js)",
    keywords: ["rest api", "rest", "api", "endpoint", "crud api", "backend", "postman", "http method", "status code", "json response", "express"],
    recommendedQueries: [
      "apa itu rest api tutorial bahasa indonesia",
      "membuat restful api nodejs express tutorial",
      "restful api concepts and examples",
    ],
    videos: [],
    docs: [
      {
        title: "HTTP Request Methods & Status Codes",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/HTTP/Methods",
        docUrl: "https://developer.mozilla.org/id/docs/Web/HTTP/Methods",
        description: "Spesifikasi resmi metode HTTP (GET, POST, PUT, DELETE) dan standar respon kode status 200/400/500.",
      },
      {
        title: "RESTful Web Services Guidelines",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/rest-api-introduction/",
        docUrl: "https://www.geeksforgeeks.org/rest-api-introduction/",
        description: "Prinsip arsitektural REST, perancangan skema URL resource-oriented, dan transmisi data JSON terstruktur.",
      },
    ],
  },
  {
    id: "db-relational-concept",
    name: "Basis Data: Konsep Relasional & Model Data (ERD)",
    keywords: ["relasional", "rdbms", "erd", "entitas", "relasi", "primary key", "foreign key", "kardinalitas", "one to many", "basis data konseptual"],
    recommendedQueries: [
      "cara membuat erd entity relationship diagram bahasa indonesia",
      "konsep basis data relasional primary key foreign key",
      "database design erd tutorial",
    ],
    videos: [],
    docs: [
      {
        title: "Pengenalan Basis Data Relasional & Arsitektur",
        source: "PostgreSQL Docs",
        url: "https://www.postgresql.org/docs/current/tutorial-arch.html",
        docUrl: "https://www.postgresql.org/docs/current/tutorial-arch.html",
        description: "Arsitektur sistem manajemen basis data relasional, model relasional objek, dan pengelolaan tabel.",
      },
      {
        title: "Database Relational Concepts & Keys",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/introduction-of-database-management-system-set-1/",
        docUrl: "https://www.geeksforgeeks.org/introduction-of-database-management-system-set-1/",
        description: "Uraian teoritis primary key, foreign key, candidate key, serta integritas data referensial.",
      },
    ],
  },
  {
    id: "db-ddl-dml-sql",
    name: "Basis Data: DDL & DML SQL (Sintaks Kueri)",
    keywords: ["ddl", "dml", "sql", "create table", "alter", "drop", "insert", "update", "delete", "select", "where", "database query"],
    recommendedQueries: [
      "belajar sql dasar ddl dml bahasa indonesia",
      "sql tutorial for beginners full course",
      "perintah dasar sql create insert select update",
    ],
    videos: [],
    docs: [
      {
        title: "Dokumentasi Resmi PostgreSQL: Kueri & Manipulasi Data",
        source: "PostgreSQL Docs",
        url: "https://www.postgresql.org/docs/current/dml.html",
        docUrl: "https://www.postgresql.org/docs/current/dml.html",
        description: "Panduan standar perintah INSERT, UPDATE, DELETE, dan pengambilan data dengan kueri SQL.",
      },
      {
        title: "SQL Syntax & Commands Reference",
        source: "W3Schools",
        url: "https://www.w3schools.com/sql/default.asp",
        docUrl: "https://www.w3schools.com/sql/default.asp",
        description: "Referensi interaktif sintaks DDL/DML, fungsi bawaan SQL, dan manipulasi basis data terstruktur.",
      },
    ],
  },
  {
    id: "db-normalization",
    name: "Basis Data: Normalisasi (1NF, 2NF, 3NF)",
    keywords: ["normalisasi", "1nf", "2nf", "3nf", "anomali", "redundansi", "ketergantungan fungsional", "bcnf", "dekomposisi", "bentuk normal"],
    recommendedQueries: [
      "normalisasi database 1nf 2nf 3nf bahasa indonesia",
      "database normalization 1nf 2nf 3nf explained",
      "cara normalisasi tabel basis data",
    ],
    videos: [],
    docs: [
      {
        title: "Prinsip Dasar Normalisasi Database Relasional",
        source: "Microsoft Learn",
        url: "https://learn.microsoft.com/id-id/office/troubleshoot/access/database-normalization-description",
        docUrl: "https://learn.microsoft.com/id-id/office/troubleshoot/access/database-normalization-description",
        description: "Penjelasan mendalam aturan 1NF, 2NF, 3NF, serta pemisahan tabel untuk integritas data tinggi.",
      },
      {
        title: "Database Normalization (1NF, 2NF, 3NF, BCNF)",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/introduction-of-database-normalization/",
        docUrl: "https://www.geeksforgeeks.org/introduction-of-database-normalization/",
        description: "Analisis ketergantungan fungsional atribut dan teknik dekomposisi tabel lossless join.",
      },
    ],
  },
  {
    id: "db-sql-join",
    name: "Basis Data: SQL JOIN & Subqueries",
    keywords: ["join", "inner join", "left join", "right join", "full join", "subquery", "subqueries", "relasi tabel", "gabung tabel"],
    recommendedQueries: [
      "belajar sql join inner join left join bahasa indonesia",
      "sql joins tutorial for beginners",
      "sql subquery dan join tabel",
    ],
    videos: [],
    docs: [
      {
        title: "Dokumentasi Resmi PostgreSQL: Tabel Kueri & JOIN",
        source: "PostgreSQL Docs",
        url: "https://www.postgresql.org/docs/current/queries-table-expressions.html",
        docUrl: "https://www.postgresql.org/docs/current/queries-table-expressions.html",
        description: "Spesifikasi formal operasi JOIN: INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER, dan Cross Join.",
      },
      {
        title: "SQL JOIN Complete Tutorial & Interactive Simulator",
        source: "W3Schools",
        url: "https://www.w3schools.com/sql/sql_join.asp",
        docUrl: "https://www.w3schools.com/sql/sql_join.asp",
        description: "Contoh kode langsung dan simulasi kueri penggabungan beberapa tabel data relasional.",
      },
    ],
  },
  {
    id: "db-index-acid",
    name: "Basis Data: Indeks & Transaksi ACID",
    keywords: ["indeks", "index", "b-tree", "transaksi", "acid", "atomicity", "consistency", "isolation", "durability", "commit", "rollback", "locking"],
    recommendedQueries: [
      "database indexing dan acid transaction tutorial",
      "database transaction acid explained",
      "optimasi query database index",
    ],
    videos: [],
    docs: [
      {
        title: "Dokumentasi PostgreSQL: Transaksi & Konkurensi Data",
        source: "PostgreSQL Docs",
        url: "https://www.postgresql.org/docs/current/tutorial-transactions.html",
        docUrl: "https://www.postgresql.org/docs/current/tutorial-transactions.html",
        description: "Panduan resmi penjaminan konsistensi data transaksi, isolasi level, dan pencegahan deadlock.",
      },
      {
        title: "Database Indexes Explained",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/indexing-in-databases-set-1/",
        docUrl: "https://www.geeksforgeeks.org/indexing-in-databases-set-1/",
        description: "Struktur data indeks (B-Tree, Hash), clustered vs non-clustered index, dan trade-off performa write.",
      },
    ],
  },
  {
    id: "algo-flowchart-pseudocode",
    name: "Algoritma & Pemrograman: Flowchart & Pseudocode",
    keywords: ["flowchart", "pseudocode", "diagram alir", "notasi ansi", "logika", "komputasi", "algoritma sekuensial", "terminator", "proses", "io", "dfd", "data flow diagram"],
    recommendedQueries: [
      "tutorial flowchart dan dfd data flow diagram bahasa indonesia",
      "belajar algoritma flowchart dan pseudocode",
      "perbedaan flowchart dan dfd sistem informasi",
    ],
    videos: [],
    docs: [
      {
        title: "Standar Notasi & Simbol Flowchart",
        source: "Lucidchart",
        url: "https://www.lucidchart.com/pages/flowchart-symbols-meaning-explained",
        docUrl: "https://www.lucidchart.com/pages/flowchart-symbols-meaning-explained",
        description: "Pedoman bentuk geometris standar ISO/ANSI untuk diagram alur pemecahan masalah algoritma.",
      },
      {
        title: "Panduan Penulisan Pseudocode dalam Ilmu Komputer",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/how-to-write-a-pseudo-code/",
        docUrl: "https://www.geeksforgeeks.org/how-to-write-a-pseudo-code/",
        description: "Format penulisan pseudocode, representasi algoritma sekuensial, percabangan, dan perulangan.",
      },
    ],
  },
  {
    id: "algo-conditional-branching",
    name: "Algoritma & Pemrograman: Percabangan (IF/ELSE, Switch-Case)",
    keywords: ["if", "else", "if else", "switch", "switch case", "kondisional", "percabangan", "nested if", "boolean", "kondisi", "operator logika"],
    recommendedQueries: [
      "percabangan if else switch case pemrograman indonesia",
      "belajar logika percabangan if else",
      "conditional statements programming tutorial",
    ],
    videos: [],
    docs: [
      {
        title: "Pernyataan Kondisional: if...else & switch",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Statements/if...else",
        docUrl: "https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Statements/if...else",
        description: "Dokumentasi sintaks IF, ELSE IF, operator ternary, dan eksekusi kondisional program.",
      },
      {
        title: "Control Flow: Conditional Statements Reference",
        source: "W3Schools",
        url: "https://www.w3schools.com/js/js_if_else.asp",
        docUrl: "https://www.w3schools.com/js/js_if_else.asp",
        description: "Contoh implementasi evaluasi multi-kondisi dan penanganan alternatif cabang logika program.",
      },
    ],
  },
  {
    id: "algo-looping-control",
    name: "Algoritma & Pemrograman: Looping (FOR, WHILE) & Guard Infinite Loop",
    keywords: ["loop", "looping", "perulangan", "for", "while", "do while", "infinite loop", "counter", "break", "continue", "iterasi"],
    recommendedQueries: [
      "perulangan for while do while pemrograman indonesia",
      "belajar looping algoritma pemrograman",
      "for loop while loop programming tutorial",
    ],
    videos: [],
    docs: [
      {
        title: "Pengulangan & Iterasi Algoritma Komputasi",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Guide/Loops_and_iteration",
        docUrl: "https://developer.mozilla.org/id/docs/Web/JavaScript/Guide/Loops_and_iteration",
        description: "Uraian mendalam perulangan for, while, do-while, for...of, dan teknik terminasi loop aman.",
      },
      {
        title: "Loops & Iteration in Programming Languages",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/loops-in-c-and-cpp/",
        docUrl: "https://www.geeksforgeeks.org/loops-in-c-and-cpp/",
        description: "Konsep dasar iterasi alur kendali, diagram alir perulangan, dan analisis kompleksitas waktu putaran.",
      },
    ],
  },
  {
    id: "algo-array-string",
    name: "Algoritma & Pemrograman: Array & Manipulasi String",
    keywords: ["array", "string", "matriks", "matrix", "indeks", "panjang string", "substring", "traversal", "vektor", "multidimensi", "koleksi"],
    recommendedQueries: [
      "struktur data array dan string pemrograman indonesia",
      "array 1 dimensi dan 2 dimensi matriks tutorial",
      "array data structure tutorial",
    ],
    videos: [],
    docs: [
      {
        title: "Array Data Structure & Methods Specification",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Global_Objects/Array",
        docUrl: "https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Global_Objects/Array",
        description: "Spesifikasi method bawaan array, pengurutan, penambahan elemen push/pop, dan manipulasi slice.",
      },
      {
        title: "String Manipulation Algorithms",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/string-data-structure/",
        docUrl: "https://www.geeksforgeeks.org/string-data-structure/",
        description: "Kompilasi algoritma pemrosesan string, penghitungan frekuensi karakter, dan konversi format.",
      },
    ],
  },
  {
    id: "algo-function-recursion",
    name: "Algoritma & Pemrograman: Fungsi Modular & Rekursif",
    keywords: ["fungsi", "rekursif", "rekursi", "base case", "call stack", "modular", "parameter", "return", "stack overflow", "faktorial", "fibonacci"],
    recommendedQueries: [
      "fungsi dan rekursif algoritma pemrograman indonesia",
      "recursion in programming explained",
      "konsep fungsi parameter dan return value",
    ],
    videos: [],
    docs: [
      {
        title: "Panduan Fungsi & Rekursi Pemrograman",
        source: "MDN Web Docs",
        url: "https://developer.mozilla.org/id/docs/Web/JavaScript/Guide/Functions",
        docUrl: "https://developer.mozilla.org/id/docs/Web/JavaScript/Guide/Functions",
        description: "Deklarasi fungsi, eksekusi pemanggilan berantai, rekursi, dan closure dalam memori.",
      },
      {
        title: "Recursive Functions & Base Cases Explained",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/recursion/",
        docUrl: "https://www.geeksforgeeks.org/recursion/",
        description: "Prinsip induksi matematis, diagram pohon rekursif, dan analisis kompleksitas ruang stack memori.",
      },
    ],
  },
  {
    id: "algo-search-sort",
    name: "Algoritma & Pemrograman: Searching & Sorting",
    keywords: ["searching", "sorting", "binary search", "linear search", "bubble sort", "insertion sort", "merge sort", "quick sort", "big o", "pengurutan", "pencarian"],
    recommendedQueries: [
      "algoritma binary search dan sorting bahasa indonesia",
      "binary search algorithm tutorial",
      "sorting and searching algorithms explained",
    ],
    videos: [],
    docs: [
      {
        title: "Sorting Algorithms Complexity & Visualizations",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/sorting-algorithms/",
        docUrl: "https://www.geeksforgeeks.org/sorting-algorithms/",
        description: "Perbandingan performa best case, average case, dan worst case algoritma pengurutan data.",
      },
      {
        title: "Binary Search Algorithm Specification",
        source: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/binary-search/",
        docUrl: "https://www.geeksforgeeks.org/binary-search/",
        description: "Strategi divide and conquer pada pencarian biner dan implementasi iteratif serta rekursif.",
      },
    ],
  },
  {
    id: "unity-vuforia-ar",
    name: "Pemrograman Multimedia Interaktif: Augmented Reality (AR) dengan Unity & Vuforia",
    keywords: [
      "vuforia",
      "augmented reality",
      "virtual reality",
      "ar camera",
      "arcamera",
      "image target",
      "imagetarget",
      "multimedia interaktif",
      "pemrograman multimedia interaktif",
      "marker based",
      "markerless",
      "ar foundation",
      "tata surya",
      "3d object",
    ],
    recommendedQueries: [
      "tutorial augmented reality unity vuforia bahasa indonesia",
      "cara membuat aplikasi ar unity vuforia image target",
      "unity vuforia augmented reality tutorial c#",
    ],
    videos: [],
    docs: [
      {
        title: "Vuforia Engine Developer Portal & Unity SDK Guide",
        source: "Vuforia Developer Library",
        url: "https://developer.vuforia.com/library/getting-started/getting-started-vuforia-engine-unity",
        docUrl: "https://developer.vuforia.com/library/getting-started/getting-started-vuforia-engine-unity",
        description: "Dokumentasi resmi integrasi Vuforia Engine pada Unity, konfigurasi ARCamera, License Key, Target Manager Database, dan Image Target.",
      },
      {
        title: "Unity User Manual & XR / AR Development Reference",
        source: "Unity Documentation",
        url: "https://docs.unity3d.com/Manual/XR.html",
        docUrl: "https://docs.unity3d.com/Manual/XR.html",
        description: "Panduan resmi pengembangan aplikasi interaktif 3D, XR/AR, manajemen GameObject, rotasi Transform, dan C# Scripting di Unity.",
      },
      {
        title: "Unity Scripting API: Transform & MonoBehaviour",
        source: "Unity Scripting API",
        url: "https://docs.unity3d.com/ScriptReference/Transform.Rotate.html",
        docUrl: "https://docs.unity3d.com/ScriptReference/Transform.Rotate.html",
        description: "Referensi teknis pemrograman C# untuk animasi rotasi objek 3D, interaksi UI Canvas, dan kontrol kamera AR.",
      },
    ],
  },
  {
    id: "unity-csharp-gamedev",
    name: "Game Development: Unity 3D & Scripting C#",
    keywords: [
      "unity",
      "unity 3d",
      "unity3d",
      "game engine",
      "game dev",
      "game development",
      "c#",
      "csharp",
      "rigidbody",
      "monobehaviour",
      "gameobject",
      "prefab",
      "transform",
      "collider",
      "scene",
      "render pipeline",
    ],
    recommendedQueries: [
      "unity 3d beginner tutorial c# scripting",
      "belajar membuat game unity 3d bahasa indonesia",
      "unity gameobject component rigidbody tutorial",
    ],
    videos: [],
    docs: [
      {
        title: "Unity User Manual & Scripting Reference",
        source: "Unity Documentation",
        url: "https://docs.unity3d.com/Manual/index.html",
        docUrl: "https://docs.unity3d.com/Manual/index.html",
        description: "Dokumentasi standar industri Unity Technologies untuk arsitektur scene, sistem fisika, rendering, dan scripting API.",
      },
      {
        title: "Panduan Pemrograman C# & .NET",
        source: "Microsoft Learn",
        url: "https://learn.microsoft.com/id-id/dotnet/csharp/tour-of-csharp/",
        docUrl: "https://learn.microsoft.com/id-id/dotnet/csharp/tour-of-csharp/",
        description: "Dokumentasi resmi bahasa C#, tipe data strongly-typed, class, interface, dan pemrograman berorientasi objek.",
      },
    ],
  },
  {
    id: "pertolongan-pertama-pmi",
    name: "Kesehatan & Kemanusiaan: Pertolongan Pertama (P3K) & PMI",
    keywords: [
      "palang merah",
      "pertolongan pertama",
      "first aid",
      "p3k",
      "resusitasi",
      "rjp",
      "cpr",
      "bhd",
      "fraktur",
      "balut",
      "bidai",
      "perdarahan",
      "triase",
      "evakuasi",
      "gawat darurat",
    ],
    recommendedQueries: [
      "pertolongan pertama p3k palang merah indonesia",
      "bantuan hidup dasar rjp cpr kemenkes",
      "first aid training basic life support",
    ],
    videos: [],
    docs: [
      {
        title: "Pedoman Pertolongan Pertama Berbasis Masyarakat (CBFA)",
        source: "Palang Merah Indonesia (PMI)",
        url: "https://pmi.or.id/",
        docUrl: "https://pmi.or.id/",
        description: "Buku pedoman resmi PMI untuk penanganan luka bakar, fraktur tulang, pembalutan luka, dan penanganan korban bencana.",
      },
      {
        title: "WHO Emergency & Trauma Care Guidelines",
        source: "World Health Organization (WHO)",
        url: "https://www.who.int/emergencies/first-aid",
        docUrl: "https://www.who.int/emergencies/first-aid",
        description: "Standar medis global WHO untuk protokol penyelamatan trauma fisik, keselamatan kerja, dan respon darurat.",
      },
    ],
  },
  {
    id: "python-data-ai",
    name: "Artificial Intelligence: Python, Data Science & Machine Learning",
    keywords: [
      "python",
      "pandas",
      "numpy",
      "machine learning",
      "deep learning",
      "data science",
      "scikit-learn",
      "tensorflow",
      "pytorch",
      "regresi",
      "klasifikasi",
      "neural network",
    ],
    recommendedQueries: [
      "python machine learning data science tutorial",
      "belajar python dasar dan data science indonesia",
      "scikit learn machine learning course",
    ],
    videos: [],
    docs: [
      {
        title: "Dokumentasi Resmi Python Tutorial",
        source: "Python Software Foundation",
        url: "https://docs.python.org/3/tutorial/",
        docUrl: "https://docs.python.org/3/tutorial/",
        description: "Dokumentasi standar pustaka bawaan Python, fungsi bawaan, struktur data, dan penanganan exception.",
      },
      {
        title: "Scikit-Learn Machine Learning Documentation",
        source: "Scikit-Learn",
        url: "https://scikit-learn.org/stable/user_guide.html",
        docUrl: "https://scikit-learn.org/stable/user_guide.html",
        description: "Panduan algoritma klasifikasi, clustering, reduksi dimensi, dan pipeline pemrosesan data ilmiah.",
      },
    ],
  },
  {
    id: "mobile-flutter-dart",
    name: "Mobile App Development: Flutter & Dart",
    keywords: [
      "flutter",
      "dart",
      "mobile app",
      "widget",
      "stateless",
      "stateful",
      "cross-platform",
      "android studio",
      "ios",
      "bloc",
      "provider",
    ],
    recommendedQueries: [
      "flutter tutorial for beginners dart",
      "belajar flutter bahasa indonesia dasar",
      "flutter stateless vs stateful widget tutorial",
    ],
    videos: [],
    docs: [
      {
        title: "Flutter Official Documentation",
        source: "Flutter Dev",
        url: "https://docs.flutter.dev/",
        docUrl: "https://docs.flutter.dev/",
        description: "Panduan resmi pembuatan aplikasi multi-platform, arsitektur UI deklaratif, dan integrasi API.",
      },
      {
        title: "A Tour of the Dart Language",
        source: "Dart Dev",
        url: "https://dart.dev/guides/language/language-tour",
        docUrl: "https://dart.dev/guides/language/language-tour",
        description: "Spesifikasi bahasa Dart: sound null safety, asynchronous programming (Future & Stream), dan kelas OOP.",
      },
    ],
  },
  {
    id: "manajemen-bisnis-proyek",
    name: "Manajemen & Bisnis: Manajemen Proyek, Agile & Organisasi",
    keywords: [
      "manajemen",
      "bisnis",
      "manajemen proyek",
      "project management",
      "sdm",
      "organisasi",
      "agile",
      "scrum",
      "sprint",
      "keuangan",
      "akuntansi",
      "pemasaran",
      "kepemimpinan",
      "tata kelola",
    ],
    recommendedQueries: [
      "project management agile scrum tutorial",
      "manajemen proyek perangkat lunak agile scrum",
      "scrum framework explained",
    ],
    videos: [],
    docs: [
      {
        title: "The Scrum Guide (Panduan Resmi Scrum)",
        source: "Scrum Guides",
        url: "https://scrumguides.org/scrum-guide.html",
        docUrl: "https://scrumguides.org/scrum-guide.html",
        description: "Definisi definitif aturan main Scrum, nilai-nilai ketangkasan, dan artefak transparansi kerja tim.",
      },
      {
        title: "Project Management Institute (PMI) Standards",
        source: "Project Management Institute",
        url: "https://www.pmi.org/pmbok-guide-standards",
        docUrl: "https://www.pmi.org/pmbok-guide-standards",
        description: "Standar global PMBOK Guide untuk pengelolaan ruang lingkup, waktu, anggaran, kualitas, dan stakeholder.",
      },
    ],
  },
  {
    id: "iot-embedded-systems",
    name: "Sistem Tertanam & IoT: Arduino, ESP32 & Mikrokontroler",
    keywords: [
      "iot",
      "internet of things",
      "arduino",
      "esp32",
      "esp8266",
      "mikrokontroler",
      "microcontroller",
      "raspberry pi",
      "sensor",
      "actuator",
      "aktuator",
      "gpio",
      "embedded",
      "sistem tertanam",
      "pwm",
      "i2c",
      "spi",
      "uart",
    ],
    recommendedQueries: [
      "tutorial arduino esp32 iot bahasa indonesia",
      "esp32 arduino sensor tutorial",
      "belajar internet of things mikrokontroler",
    ],
    videos: [],
    docs: [
      {
        title: "Arduino Language Reference & Programming Guide",
        source: "Arduino Official Docs",
        url: "https://docs.arduino.cc/programming/",
        docUrl: "https://docs.arduino.cc/programming/",
        description: "Dokumentasi standar bahasa C/C++ Arduino, fungsi kontrol pin pinMode, digitalRead, analogWrite, dan pustaka antarmuka.",
      },
      {
        title: "ESP32 Documentation & IoT Programming Guide",
        source: "Espressif Systems",
        url: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/",
        docUrl: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/",
        description: "Dokumentasi arsitektur chip ESP32, sistem operasi real-time FreeRTOS, manajemen daya sleep mode, dan jaringan nirkabel.",
      },
    ],
  },
];

export const DEFAULT_FALLBACK_CLUSTER: CuratedTopicCluster = {
  id: "general-cs",
  name: "Dasar Pemikiran Komputasi & Pemrograman",
  keywords: [],
  recommendedQueries: [
    "algoritma dan pemrograman dasar bahasa indonesia",
    "computer science fundamentals tutorial",
  ],
  videos: [],
  docs: [
    {
      title: "Panduan Pemula Ilmu Komputer & Pemrograman",
      source: "MDN Web Docs",
      url: "https://developer.mozilla.org/id/docs/Learn/Getting_started_with_the_web",
      docUrl: "https://developer.mozilla.org/id/docs/Learn/Getting_started_with_the_web",
      description: "Panduan arsitektur dasar perangkat lunak, peramban, server, dan alur kerja rekayasa kode.",
    },
    {
      title: "Standar Referensi Algoritma & Pemecahan Masalah",
      source: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
      docUrl: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
      description: "Kamus metodologi perancangan algoritma terstruktur dan pembuktian kebenaran logika.",
    },
  ],
};

/**
 * Mencocokkan teks topik/dokumen terhadap kamus kurasi dokumentasi & kueri pencarian.
 * TIDAK mengembalikan video palsu/statis; video HANYA boleh berasal dari pipeline validasi FastAPI.
 */
export function resolveCuratedResources(
  topicOrContent: string,
  explicitTitle?: string,
): {
  videos: RecommendedVideo[];
  docs: RecommendedDoc[];
  recommendedVideos: RecommendedVideo[];
  recommendedDocs: RecommendedDoc[];
  recommendedQueries: string[];
} {
  const text = `${explicitTitle || ""} ${topicOrContent || ""}`.toLowerCase();

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

  if (bestCluster && maxScore >= 2) {
    const sanitizedDocs = bestCluster.docs.map((d) => ({
      ...d,
      docUrl: d.docUrl || d.url,
    }));

    return {
      videos: [],
      docs: sanitizedDocs,
      recommendedVideos: [],
      recommendedDocs: sanitizedDocs,
      recommendedQueries: bestCluster.recommendedQueries,
    };
  }

  const rawSubject =
    explicitTitle ||
    topicOrContent.slice(0, 80).replace(/\n/g, " ").trim() ||
    "Materi Pembelajaran";
  const cleanSubject = rawSubject
    .replace(/[^\w\s\u00C0-\u024F\-_/]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const subjectWords = cleanSubject
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 4)
    .join(" ");
  const displaySubject = subjectWords || "Materi Kurikulum Terkait";

  const dynamicDocs: RecommendedDoc[] = [
    {
      title: `Dokumentasi Resmi & Landasan Teori: ${displaySubject}`,
      source: "Pustaka Standar Ilmiah",
      url: `https://id.wikipedia.org/wiki/${encodeURIComponent(displaySubject.replace(/\s+/g, "_"))}`,
      docUrl: `https://id.wikipedia.org/wiki/${encodeURIComponent(displaySubject.replace(/\s+/g, "_"))}`,
      description: `Rujukan komprehensif, definisi terminologi baku, dan taksonomi materi pembelajaran ${displaySubject}.`,
    },
    {
      title: `Panduan Kurikulum & Praktik Lapangan: ${displaySubject}`,
      source: "Open Education Consortium",
      url: `https://id.wikipedia.org/wiki/Spesial:Pencarian?search=${encodeURIComponent(displaySubject)}`,
      docUrl: `https://id.wikipedia.org/wiki/Spesial:Pencarian?search=${encodeURIComponent(displaySubject)}`,
      description: `Kumpulan panduan implementasi nyata, metodologi terstruktur, dan studi kasus pengayaan ${displaySubject}.`,
    },
  ];

  return {
    videos: [],
    docs: dynamicDocs,
    recommendedVideos: [],
    recommendedDocs: dynamicDocs,
    recommendedQueries: [
      `${displaySubject} tutorial bahasa indonesia`,
      `${displaySubject} practical tutorial`,
    ],
  };
}

/**
 * Sanitasi objek video YouTube yang sudah divalidasi backend.
 * TIDAK PERNAH memberikan fallback ID palsu jika video tidak valid.
 */
export function sanitizeYoutubeVideo(
  video: Partial<RecommendedVideo>,
  fallbackTopic = "Pemrograman",
): RecommendedVideo | null {
  const rawId =
    video.videoId ||
    video.embedId ||
    extractYoutubeId(video.videoUrl || "");
  if (!rawId || !/^[a-zA-Z0-9_-]{11}$/.test(rawId)) {
    return null;
  }

  return {
    title:
      video.title && video.title.trim().length > 2
        ? video.title.trim()
        : `Tutorial ${fallbackTopic}`,
    channel:
      video.channelName ||
      video.channel ||
      "Kanal Edukasi YouTube",
    channelName:
      video.channelName ||
      video.channel ||
      "Kanal Edukasi YouTube",
    duration: video.duration || "15:00",
    videoId: rawId,
    embedId: rawId,
    videoUrl: `https://www.youtube.com/watch?v=${rawId}`,
    summaryTopic:
      video.summaryTopic ||
      `Materi visual terverifikasi untuk ${fallbackTopic}.`,
    viewCount: video.viewCount,
    likeCount: video.likeCount,
    qualityScore: video.qualityScore,
    topComments: video.topComments,
    isValidated: Boolean(video.isValidated),
  };
}

/**
 * Sanitasi link dokumentasi / referensi web dinamis hasil AI:
 * Memastikan URL valid (https://...) dan sesuai topik/kata kunci materi (BUKAN data statis lama).
 */
export function sanitizeDocumentation(
  doc: Partial<RecommendedDoc>,
  fallbackTopic = "Materi Pembelajaran",
): RecommendedDoc {
  const cleanTopic = fallbackTopic.trim() || "Materi Pembelajaran";
  const title =
    doc.title && doc.title.trim().length > 3
      ? doc.title.trim()
      : `Dokumentasi & Panduan Teknis: ${cleanTopic}`;
  const source =
    doc.source && doc.source.trim().length > 2
      ? doc.source.trim()
      : "Dokumentasi Teknis & Referensi Resmi";
  const description =
    doc.description && doc.description.trim().length > 5
      ? doc.description.trim()
      : `Referensi teknis dan panduan implementasi terkait ${title}.`;
  const rawUrl = (doc.url || doc.docUrl || "").trim();

  const url =
    rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://scholar.google.com/scholar?q=${encodeURIComponent(`${cleanTopic} ${title}`)}`;

  return {
    title,
    source,
    url,
    docUrl: url,
    description,
  };
}
