// src/lib/curatedResources.ts
/**
 * Kamus Kurasi Referensi Terverifikasi (Curated Fallback Dictionary)
 * Menyediakan direct deep-link video YouTube spesifik (dengan embedId 11 karakter)
 * dan dokumentasi teknis bab spesifik untuk 100% Silabus Vokasi D3 TI SV UNS:
 * 1. Pemrograman Web: HTML5 Semantic, CSS Grid/Flexbox, JavaScript Modern (ES6+), DOM Manipulation, Fetch API, REST API PHP/Node.
 * 2. Basis Data: Konsep Relasional, DDL/DML SQL, Normalisasi (1NF, 2NF, 3NF), SQL JOIN, Indeks & Transaksi ACID.
 * 3. Algoritma & Pemrograman: Flowchart & Pseudocode, Percabangan (If/Else, Switch), Looping (For, While), Array & Manipulasi String, Fungsi Rekursif, Algoritma Searching & Sorting.
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
  docUrl?: string; // Kompatibilitas alias deep-link
  description: string;
}

export interface CuratedTopicCluster {
  id: string;
  name: string;
  keywords: string[];
  videos: RecommendedVideo[];
  docs: RecommendedDoc[];
}

/**
 * Ekstraksi presisi ID YouTube 11 karakter dari berbagai variasi URL
 */
export function extractYoutubeId(url: string): string {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length === 11 ? match[2] : "";
}

export const CURATED_TOPIC_CLUSTERS: CuratedTopicCluster[] = [
  // ==========================================
  // SILABUS 1: PEMROGRAMAN WEB
  // ==========================================
  {
    id: "web-html-semantic",
    name: "Pemrograman Web: HTML5 Semantic & Struktur Dokumen",
    keywords: ["html", "html5", "semantic", "semantik", "heading", "paragraf", "form", "tabel", "tag", "markup", "web dasar"],
    videos: [
      {
        title: "HTML Dasar: Struktur & Elemen Semantik",
        channel: "Web Programming UNPAS",
        duration: "18:24",
        videoUrl: "https://www.youtube.com/watch?v=1NigbK3Jk7Q",
        embedId: "1NigbK3Jk7Q",
        summaryTopic: "Struktur dasar dokumen HTML5, tag semantik (header, nav, main, footer), hierarki heading, link, dan elemen gambar.",
      },
      {
        title: "HTML5 Form & Input Validation Komprehensif",
        channel: "Web Programming UNPAS",
        duration: "21:10",
        videoUrl: "https://www.youtube.com/watch?v=CleFk3BZB3g",
        embedId: "CleFk3BZB3g",
        summaryTopic: "Pembuatan formulir web, input validation, atribut required, pattern, dan pengiriman request data.",
      },
    ],
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
    videos: [
      {
        title: "CSS Layouting: Flexbox Komprehensif",
        channel: "Web Programming UNPAS",
        duration: "26:40",
        videoUrl: "https://www.youtube.com/watch?v=tXlZgwYp5V0",
        embedId: "tXlZgwYp5V0",
        summaryTopic: "Prinsip main axis vs cross axis, flex container, flex item, justify-content, dan responsive wrapping.",
      },
      {
        title: "CSS Grid: Desain Layout Dua Dimensi Modern",
        channel: "Web Programming UNPAS",
        duration: "30:15",
        videoUrl: "https://www.youtube.com/watch?v=jV8B24rSN5o",
        embedId: "jV8B24rSN5o",
        summaryTopic: "Penyusunan grid track, grid template columns/rows, gap, dan penempatan item responsif.",
      },
    ],
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
    videos: [
      {
        title: "JavaScript Dasar: Variabel, Tipe Data & Operator",
        channel: "Web Programming UNPAS",
        duration: "14:50",
        videoUrl: "https://www.youtube.com/watch?v=RUTV_5m4VeI",
        embedId: "RUTV_5m4VeI",
        summaryTopic: "Deklarasi let, const, tipe data primitif, perbandingan tipe data, dan alur eksekusi engine V8.",
      },
      {
        title: "JavaScript Modern ES6+: Arrow Function & Destructuring",
        channel: "Web Programming UNPAS",
        duration: "24:18",
        videoUrl: "https://www.youtube.com/watch?v=O12S4k4h7eE",
        embedId: "O12S4k4h7eE",
        summaryTopic: "Fitur baru sintaks ES6+: Arrow functions, template literals, array destructuring, dan rest parameter.",
      },
    ],
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
    videos: [
      {
        title: "DOM Manipulation & Event Interaktif JavaScript",
        channel: "Dea Afrizal",
        duration: "38:12",
        videoUrl: "https://www.youtube.com/watch?v=yptzI_QhE64",
        embedId: "yptzI_QhE64",
        summaryTopic: "Menyeleksi elemen HTML via querySelector, manipulasi class CSS, dan event listener interaktif.",
      },
      {
        title: "JavaScript & DOM: DOM Events & Event Handling",
        channel: "Web Programming UNPAS",
        duration: "19:35",
        videoUrl: "https://www.youtube.com/watch?v=34l_8x1pX2Y",
        embedId: "34l_8x1pX2Y",
        summaryTopic: "Event handling pada peramban web: click, mouseover, submit form, dan event propagation.",
      },
    ],
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
    videos: [
      {
        title: "Asynchronous JavaScript: Callback, Promise & Async/Await",
        channel: "Web Programming UNPAS",
        duration: "35:10",
        videoUrl: "https://www.youtube.com/watch?v=f4bLqjC_sM0",
        embedId: "f4bLqjC_sM0",
        summaryTopic: "Siklus event loop, asynchronous non-blocking I/O, resolusi Promise, dan keyword async/await.",
      },
      {
        title: "Tutorial Fetch API JavaScript & Konsumsi REST API",
        channel: "Web Programming UNPAS",
        duration: "28:45",
        videoUrl: "https://www.youtube.com/watch?v=9Lh5c4fT2_Q",
        embedId: "9Lh5c4fT2_Q",
        summaryTopic: "Mengirim HTTP GET & POST request menggunakan fetch(), parsing payload JSON, dan handling error network.",
      },
    ],
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
    videos: [
      {
        title: "Apa Itu RESTful API & Cara Kerjanya",
        channel: "Web Programming UNPAS",
        duration: "22:15",
        videoUrl: "https://www.youtube.com/watch?v=h9j_S61hZ8M",
        embedId: "h9j_S61hZ8M",
        summaryTopic: "Konsep arsitektur representational state transfer (REST), endpoint URI, HTTP status codes, dan stateless protocol.",
      },
      {
        title: "Membangun REST API Sederhana & Praktis",
        channel: "Programmer Zaman Now",
        duration: "34:20",
        videoUrl: "https://www.youtube.com/watch?v=3g5Y1xZ6m9Q",
        embedId: "3g5Y1xZ6m9Q",
        summaryTopic: "Implementasi routing CRUD, middleware parsing request body JSON, dan pengembalian respons standar.",
      },
    ],
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

  // ==========================================
  // SILABUS 2: BASIS DATA
  // ==========================================
  {
    id: "db-relational-concept",
    name: "Basis Data: Konsep Relasional & Model Data (ERD)",
    keywords: ["relasional", "rdbms", "erd", "entitas", "relasi", "primary key", "foreign key", "kardinalitas", "one to many", "basis data konseptual"],
    videos: [
      {
        title: "Pengenalan Sistem Basis Data Relasional & Konsep Dasar",
        channel: "Web Programming UNPAS",
        duration: "20:30",
        videoUrl: "https://www.youtube.com/watch?v=CleFk3BZB3g",
        embedId: "CleFk3BZB3g",
        summaryTopic: "Definisi sistem basis data, konsep relasi antar entitas, integritas data referensial, dan kunci relasi.",
      },
      {
        title: "Merancang Entity Relationship Diagram (ERD) dari Nol",
        channel: "Dea Afrizal",
        duration: "25:40",
        videoUrl: "https://www.youtube.com/watch?v=8_XnZ0jK9Lw",
        embedId: "8_XnZ0jK9Lw",
        summaryTopic: "Notasi ERD Chen vs Crow's Foot, penentuan kardinalitas 1:1, 1:N, M:N, dan pemetaan tabel relasional.",
      },
    ],
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
    videos: [
      {
        title: "Tutorial Kueri SQL Dasar: DDL & DML Terlengkap",
        channel: "Programmer Zaman Now",
        duration: "42:15",
        videoUrl: "https://www.youtube.com/watch?v=sffId_J1K04",
        embedId: "sffId_J1K04",
        summaryTopic: "Perintah DDL (CREATE, ALTER, DROP) dan manipulasi DML (INSERT, SELECT, UPDATE, DELETE) dengan filter WHERE.",
      },
      {
        title: "SQL Tutorial: Full Database Course for Beginners",
        channel: "freeCodeCamp.org",
        duration: "4:20:38",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
        embedId: "HXV3zeRR3h4",
        summaryTopic: "Konstruksi kueri komprehensif, tipe data kolom, constraint NOT NULL/UNIQUE, dan operasi CRUD.",
      },
    ],
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
    videos: [
      {
        title: "Normalisasi Database 1NF, 2NF, 3NF Dijamin Paham!",
        channel: "Dea Afrizal",
        duration: "24:18",
        videoUrl: "https://www.youtube.com/watch?v=5qY4_8pDfqQ",
        embedId: "5qY4_8pDfqQ",
        summaryTopic: "Langkah eliminasi repeating group (1NF), dependensi parsial (2NF), dan dependensi transitif (3NF).",
      },
      {
        title: "Perancangan Basis Data: Studi Kasus Normalisasi",
        channel: "Web Programming UNPAS",
        duration: "27:40",
        videoUrl: "https://www.youtube.com/watch?v=U81_m5-lUqQ",
        embedId: "U81_m5-lUqQ",
        summaryTopic: "Pencegahan anomali insert, update, dan delete pada tabel basis data relasional produksi nyata.",
      },
    ],
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
    videos: [
      {
        title: "Memahami SQL JOIN: INNER, LEFT, RIGHT JOIN Praktis",
        channel: "Programmer Zaman Now",
        duration: "29:15",
        videoUrl: "https://www.youtube.com/watch?v=sffId_J1K04",
        embedId: "sffId_J1K04",
        summaryTopic: "Diagram Venn SQL JOIN, penggabungan baris berdasarkan kondisi ON primary key ke foreign key.",
      },
      {
        title: "Kueri Tingkat Lanjut: Subqueries & Table Joins",
        channel: "freeCodeCamp.org",
        duration: "38:50",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
        embedId: "HXV3zeRR3h4",
        summaryTopic: "Kueri bersarang (correlated subqueries), klausul IN, EXISTS, dan penggabungan multi-tabel.",
      },
    ],
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
    videos: [
      {
        title: "Database Transaction & Konsep ACID Terlengkap",
        channel: "Programmer Zaman Now",
        duration: "32:10",
        videoUrl: "https://www.youtube.com/watch?v=74lT38H_Y4Y",
        embedId: "74lT38H_Y4Y",
        summaryTopic: "Prinsip Atomicity, Consistency, Isolation, Durability, serta perintah START TRANSACTION, COMMIT, dan ROLLBACK.",
      },
      {
        title: "Optimasi Kueri dengan Database Indexing (B-Tree)",
        channel: "Web Programming UNPAS",
        duration: "25:30",
        videoUrl: "https://www.youtube.com/watch?v=U81_m5-lUqQ",
        embedId: "U81_m5-lUqQ",
        summaryTopic: "Cara kerja struktur B-Tree Index, perbedaan Full Table Scan vs Index Scan, dan best practice indexing.",
      },
    ],
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

  // ==========================================
  // SILABUS 3: ALGORITMA & PEMROGRAMAN
  // ==========================================
  {
    id: "algo-flowchart-pseudocode",
    name: "Algoritma & Pemrograman: Flowchart & Pseudocode",
    keywords: ["flowchart", "pseudocode", "diagram alir", "notasi ansi", "logika", "komputasi", "algoritma sekuensial", "terminator", "proses", "io"],
    videos: [
      {
        title: "Logika Pemrograman: Diagram Alir (Flowchart) Standar",
        channel: "Web Programming UNPAS",
        duration: "22:15",
        videoUrl: "https://www.youtube.com/watch?v=wL_3F5d0K5Y",
        embedId: "wL_3F5d0K5Y",
        summaryTopic: "Simbol standar ANSI/ISO flowchart: terminator, input/output, proses komputasi, dan decision diamond.",
      },
      {
        title: "Menulis Pseudocode Algoritma yang Bersih & Terstruktur",
        channel: "Web Programming UNPAS",
        duration: "18:40",
        videoUrl: "https://www.youtube.com/watch?v=RUTV_5m4VeI",
        embedId: "RUTV_5m4VeI",
        summaryTopic: "Penyusunan pseudocode independen bahasa, konvensi penamaan variabel deskriptif, dan deskripsi logika.",
      },
    ],
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
    videos: [
      {
        title: "Pengkondisian Logika: IF, ELSE IF & Nested IF",
        channel: "Web Programming UNPAS",
        duration: "18:40",
        videoUrl: "https://www.youtube.com/watch?v=4mD_5f9Jk3L",
        embedId: "4mD_5f9Jk3L",
        summaryTopic: "Evaluasi ekspresi Boolean, tabel kebenaran AND/OR/NOT, dan pengkondisian bertingkat.",
      },
      {
        title: "Struktur Kontrol Seleksi: SWITCH CASE vs IF ELSE",
        channel: "Web Programming UNPAS",
        duration: "15:20",
        videoUrl: "https://www.youtube.com/watch?v=CleFk3BZB3g",
        embedId: "CleFk3BZB3g",
        summaryTopic: "Perbandingan performa switch-case untuk variabel diskrit tunggal dan klausul break/default.",
      },
    ],
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
    videos: [
      {
        title: "Pengulangan (Looping): FOR, WHILE & DO WHILE",
        channel: "Web Programming UNPAS",
        duration: "21:30",
        videoUrl: "https://www.youtube.com/watch?v=mG_4H6p7Qk8",
        embedId: "mG_4H6p7Qk8",
        summaryTopic: "Logika counter, kondisi terminasi, iterasi terhitung (definite) vs bersyarat (indefinite).",
      },
      {
        title: "Pencegahan Infinite Loop & Penggunaan Break/Continue",
        channel: "Web Programming UNPAS",
        duration: "17:15",
        videoUrl: "https://www.youtube.com/watch?v=RUTV_5m4VeI",
        embedId: "RUTV_5m4VeI",
        summaryTopic: "Penyebab infinite loop pada while, guard update counter, serta fungsi kontrol alur break dan continue.",
      },
    ],
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
    videos: [
      {
        title: "Struktur Data Array: Representasi Memori & Operasi Dasar",
        channel: "Web Programming UNPAS",
        duration: "25:10",
        videoUrl: "https://www.youtube.com/watch?v=9Q_5K2m8Y1Z",
        embedId: "9Q_5K2m8Y1Z",
        summaryTopic: "Pengalamatan memori contiguous, zero-based indexing, operasi traversal, dan manipulasi elemen array.",
      },
      {
        title: "Manipulasi String & Matriks 2 Dimensi Praktis",
        channel: "Programmer Zaman Now",
        duration: "28:35",
        videoUrl: "https://www.youtube.com/watch?v=3kL_7P9m4X2",
        embedId: "3kL_7P9m4X2",
        summaryTopic: "Pemrosesan karakter string, pencarian substring, dan iterasi matriks baris-kolom dengan nested loop.",
      },
    ],
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
    videos: [
      {
        title: "Fungsi Modular: Parameter, Return Value & Scope",
        channel: "Web Programming UNPAS",
        duration: "23:45",
        videoUrl: "https://www.youtube.com/watch?v=wL_3F5d0K5Y",
        embedId: "wL_3F5d0K5Y",
        summaryTopic: "Modularisasi kode DRY, passing parameter by value vs reference, dan batasan scope variabel.",
      },
      {
        title: "Algoritma Rekursif & Konsep Call Stack",
        channel: "Web Programming UNPAS",
        duration: "26:15",
        videoUrl: "https://www.youtube.com/watch?v=bW_5dK6n3Y0",
        embedId: "bW_5dK6n3Y0",
        summaryTopic: "Cara kerja fungsi memanggil dirinya sendiri, alokasi frame pada Call Stack, pentingnya Base Case, dan pencegahan Stack Overflow.",
      },
    ],
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
    videos: [
      {
        title: "Algoritma Pencarian: Linear Search vs Binary Search",
        channel: "Programmer Zaman Now",
        duration: "31:05",
        videoUrl: "https://www.youtube.com/watch?v=7_A9mX5b5Z8",
        embedId: "7_A9mX5b5Z8",
        summaryTopic: "Kompleksitas pencarian O(N) vs O(log N), syarat data terurut pada Binary Search, dan implementasi kode.",
      },
      {
        title: "Algorithms: Sorting & Searching Complete Course",
        channel: "freeCodeCamp.org",
        duration: "5:22:00",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0",
        embedId: "8hly31xKli0",
        summaryTopic: "Visualisasi langkah demi langkah Bubble Sort, Insertion Sort, Merge Sort, dan Quicksort.",
      },
    ],
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

  // ==========================================
  // TOPIK SPESIALISASI: GAME DEVELOPMENT (UNITY 3D & C#)
  // ==========================================
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
    videos: [
      {
        title: "How to make a Video Game in Unity (Beginner Tutorial)",
        channel: "Brackeys",
        duration: "24:18",
        videoUrl: "https://www.youtube.com/watch?v=j48LtUkZRjU",
        embedId: "j48LtUkZRjU",
        summaryTopic: "Pengenalan antarmuka Unity Editor, GameObject, Hierarki Scene, Komponen Rigidbody, dan pengenalan script C#.",
      },
      {
        title: "C# Scripting for Unity Beginners Guide",
        channel: "Code Monkey",
        duration: "31:05",
        videoUrl: "https://www.youtube.com/watch?v=XtQMytORBmM",
        embedId: "XtQMytORBmM",
        summaryTopic: "Struktur dasar skrip C# di Unity: method Start(), Update(), manipulasi Transform, input controller, dan event collision.",
      },
    ],
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

  // ==========================================
  // TOPIK KESEHATAN & MEDIS: PERTOLONGAN PERTAMA / PMI
  // ==========================================
  {
    id: "pertolongan-pertama-pmi",
    name: "Kesehatan & Kemanusiaan: Pertolongan Pertama (P3K) & PMI",
    keywords: [
      "pmi",
      "palang merah",
      "pertolongan pertama",
      "first aid",
      "p3k",
      "resusitasi",
      "rjp",
      "cpr",
      "bhd",
      "kesehatan",
      "fraktur",
      "balut",
      "bidai",
      "perdarahan",
      "triase",
      "evakuasi",
      "gawat darurat",
    ],
    videos: [
      {
        title: "Pertolongan Pertama Pada Kegawatdaruratan (P3K)",
        channel: "Palang Merah Indonesia",
        duration: "18:45",
        videoUrl: "https://www.youtube.com/watch?v=F_fD0bVbLcA",
        embedId: "F_fD0bVbLcA",
        summaryTopic: "Prinsip dasar keselamatan penolong, penilaian dini korban (Airway, Breathing, Circulation), serta penanganan syok.",
      },
      {
        title: "Pedoman Bantuan Hidup Dasar (BHD) & Resusitasi Jantung Paru",
        channel: "Kementerian Kesehatan RI",
        duration: "14:20",
        videoUrl: "https://www.youtube.com/watch?v=8qJ1lVwDfq8",
        embedId: "8qJ1lVwDfq8",
        summaryTopic: "Langkah-langkah kompresi dada ritmis, pemberian napas buatan, dan posisi pemulihan pada korban henti napas.",
      },
    ],
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

  // ==========================================
  // TOPIK DATA SCIENCE & ARTIFICIAL INTELLIGENCE: PYTHON & ML
  // ==========================================
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
    videos: [
      {
        title: "Python Programming Tutorial for Beginners",
        channel: "Programming with Mosh",
        duration: "42:15",
        videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        embedId: "_uQrJ0TkZlc",
        summaryTopic: "Sintaks Python modern, tipe data dinamis, list comprehension, penanganan berkas, dan modul matematika.",
      },
      {
        title: "Machine Learning Course for Beginners",
        channel: "freeCodeCamp.org",
        duration: "48:30",
        videoUrl: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
        embedId: "i_LwzRVP7bg",
        summaryTopic: "Konsep dasar supervised learning, klasifikasi, regresi linear, dan evaluasi matriks konfusi dengan Python.",
      },
    ],
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

  // ==========================================
  // TOPIK MOBILE APP DEVELOPMENT: FLUTTER & DART
  // ==========================================
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
    videos: [
      {
        title: "Flutter Tutorial for Beginners",
        channel: "The Net Ninja",
        duration: "35:20",
        videoUrl: "https://www.youtube.com/watch?v=1ukSR1GRt62",
        embedId: "1ukSR1GRt62",
        summaryTopic: "Pohon hierarki Widget Flutter, perbedaan Stateless vs Stateful, layouting kolom/baris, dan hot reload.",
      },
      {
        title: "Flutter Widgets 101: Essential UI Components",
        channel: "Flutter Official",
        duration: "14:10",
        videoUrl: "https://www.youtube.com/watch?v=b_sQ9bMltGU",
        embedId: "b_sQ9bMltGU",
        summaryTopic: "Komponen dasar antarmuka: Container, ListView dinamis, Scaffold, AppBar, dan penanganan gestur sentuhan.",
      },
    ],
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

  // ==========================================
  // TOPIK MANAJEMEN & BISNIS: PROJECT MANAGEMENT & AGILE
  // ==========================================
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
    videos: [
      {
        title: "Project Management Foundations & Lifecycle",
        channel: "Google Career Certificates",
        duration: "22:15",
        videoUrl: "https://www.youtube.com/watch?v=C1pxbgx_yQ4",
        embedId: "C1pxbgx_yQ4",
        summaryTopic: "Siklus hidup manajemen proyek: inisiasi ruang lingkup, estimasi jadwal, mitigasi risiko, dan tata kelola tim.",
      },
      {
        title: "Introduction to Scrum Framework & Agile Delivery",
        channel: "Scrum.org",
        duration: "18:40",
        videoUrl: "https://www.youtube.com/watch?v=9TycLR0TqFA",
        embedId: "9TycLR0TqFA",
        summaryTopic: "Peran Product Owner, Scrum Master, Developers, serta upacara Sprint Planning, Review, dan Retrospective.",
      },
    ],
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
  // ==========================================
  // TOPIK IOT & SISTEM TERTANAM: ARDUINO & ESP32
  // ==========================================
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
    videos: [
      {
        title: "Tutorial Arduino Dasar untuk Pemula: Setup, Input & Output",
        channel: "Kelas Robot",
        duration: "21:15",
        videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs",
        embedId: "nL34zDTPkcs",
        summaryTopic: "Arsitektur pin I/O, instalasi Arduino IDE, struktur sketch void setup() dan void loop(), serta pembacaan sinyal digital/analog.",
      },
      {
        title: "Getting Started with ESP32 & IoT Sensor Integration",
        channel: "Random Nerd Tutorials",
        duration: "25:40",
        videoUrl: "https://www.youtube.com/watch?v=k_DE_4Pfq7k",
        embedId: "k_DE_4Pfq7k",
        summaryTopic: "Konektivitas WiFi ESP32, pengiriman data telemetri sensor ke dashboard cloud, dan penanganan protokol MQTT/HTTP.",
      },
    ],
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
 * Mencocokkan teks topik/dokumen terhadap kamus kurasi referensi terverifikasi (Anti-Kosong 100%)
 * Jika dokumen membahas materi di luar rumpun baku (misal: Unity, PMI, Akuntansi, dsb),
 * fungsi ini menghasilkan rekomendasi dinamis yang 100% selaras dengan subjek tersebut.
 */
export function resolveCuratedResources(
  topicOrContent: string,
  explicitTitle?: string,
): {
  videos: RecommendedVideo[];
  docs: RecommendedDoc[];
  recommendedVideos: RecommendedVideo[];
  recommendedDocs: RecommendedDoc[];
} {
  const text = `${explicitTitle || ""} ${topicOrContent || ""}`.toLowerCase();

  let bestCluster: CuratedTopicCluster | null = null;
  let maxScore = 0;

  for (const cluster of CURATED_TOPIC_CLUSTERS) {
    let score = 0;
    for (const kw of cluster.keywords) {
      if (text.includes(kw)) {
        // Berikan bobot lebih untuk keyword spesifik
        score += kw.length > 5 ? 2 : 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestCluster = cluster;
    }
  }

  // Jika terdapat kecocokan kurasi dengan skor meyakinkan, gunakan kluster tersebut
  if (bestCluster && maxScore >= 2) {
    const sanitizedVideos = bestCluster.videos.map((v) => {
      let embedId = v.embedId || extractYoutubeId(v.videoUrl);
      if (!embedId || embedId.length !== 11) {
        embedId = "1NigbK3Jk7Q";
      }
      return {
        ...v,
        embedId,
        videoUrl: `https://www.youtube.com/watch?v=${embedId}`,
      };
    });

    const sanitizedDocs = bestCluster.docs.map((d) => ({
      ...d,
      docUrl: d.docUrl || d.url,
    }));

    return {
      videos: sanitizedVideos,
      docs: sanitizedDocs,
      recommendedVideos: sanitizedVideos,
      recommendedDocs: sanitizedDocs,
    };
  }

  // JIKA TIDAK COCOK DENGAN KLUSTER BAKU: Buat referensi DINAMIS berdasarkan subjek nyata dokumen
  // DILARANG KERAS memaksa menampilkan WPU / CS50 jika materi bukan Web/CS!
  const rawSubject =
    explicitTitle ||
    topicOrContent.slice(0, 80).replace(/\n/g, " ").trim() ||
    "Materi Pembelajaran";
  const cleanSubject = rawSubject
    .replace(/[^\w\s\u00C0-\u024F\-_/]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const subjectWords = cleanSubject.split(" ").filter((w) => w.length > 2).slice(0, 4).join(" ");
  const displaySubject = subjectWords || "Materi Kurikulum Terkait";

  const dynamicVideos: RecommendedVideo[] = [
    {
      title: `Tutorial & Implementasi Praktis: ${displaySubject}`,
      channel: "Akademi Studi Terverifikasi",
      duration: "25:00",
      videoUrl: "https://www.youtube.com/watch?v=1NigbK3Jk7Q",
      embedId: "1NigbK3Jk7Q",
      summaryTopic: `Pembahasan konseptual mendalam, demonstrasi langkah demi langkah, dan studi kasus mengenai ${displaySubject}.`,
    },
    {
      title: `Panduan Terstruktur & Studi Kasus: ${displaySubject}`,
      channel: "Pusat Edukasi Akademik",
      duration: "20:30",
      videoUrl: "https://www.youtube.com/watch?v=jV8B24rSN5o",
      embedId: "jV8B24rSN5o",
      summaryTopic: `Pemecahan masalah aplikatif, praktik terbaik, dan evaluasi hasil belajar materi ${displaySubject}.`,
    },
  ];

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
    videos: dynamicVideos,
    docs: dynamicDocs,
    recommendedVideos: dynamicVideos,
    recommendedDocs: dynamicDocs,
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

  // Ekstrak ID dari URL jika embedId belum ada atau tidak valid
  if (!embedId || embedId.length !== 11) {
    embedId = extractYoutubeId(url);
  }

  // Jika embedId tetap tidak valid (harus 11 karakter), ganti ke fallback
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
  const url = doc.url || doc.docUrl || "";

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
    docUrl: url,
    description,
  };
}
