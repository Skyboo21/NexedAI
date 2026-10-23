// app/(mahasiswa)/peta-belajar/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Network,
  CheckCircle2,
  Lock,
  PlayCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Trophy,
  Zap,
  Clock,
  ChevronRight,
  X,
  Layers,
  AlertCircle,
  GraduationCap,
  Target,
  Check,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import {
  getCompletedTopicIds,
  getAllModuleProgress,
  getTotalUserXp,
  onProgressUpdate,
  markModuleCompleted,
} from "../../../src/lib/progressStorage";

interface CurriculumChapter {
  id: string; // e.g. "algo-1"
  numericId: number;
  chapterNumber: number;
  title: string;
  subtitle: string;
  duration: string;
  xpReward: number;
  prerequisiteChapterId?: string;
  prerequisiteTitle?: string;
  learningOutcomes: string[];
  keyTopics: string[];
  suggestedPreset?: string;
}

interface CourseCurriculum {
  id: string;
  name: string;
  code: string;
  semester: string;
  totalSks: number;
  instructor: string;
  description: string;
  chapters: CurriculumChapter[];
}

const COURSE_CURRICULA: Record<string, CourseCurriculum> = {
  "algoritma-pemrograman": {
    id: "algoritma-pemrograman",
    name: "Algoritma & Pemrograman",
    code: "TIF2101",
    semester: "Semester 2 / 4",
    totalSks: 3,
    instructor: "Dr. Ir. Hendra Wijaya, M.T.",
    description:
      "Membentuk pondasi logika komputasional, flowchart, struktur kendali perulangan, array matriks, serta perancangan fungsi rekursif yang efisien.",
    chapters: [
      {
        id: "algo-1",
        numericId: 1,
        chapterNumber: 1,
        title: "Pengantar Logika, Flowchart & Notasi Standar ANSI",
        subtitle: "Fondasi logika komputasi, simbol diagram alir, dan representasi pseudocode terstruktur.",
        duration: "90 Menit",
        xpReward: 100,
        learningOutcomes: [
          "Memahami definisi algoritma dan karakteristik finiteness serta definiteness.",
          "Menyusun diagram alir (flowchart) dengan simbol-simbol standar internasional ANSI/ISO.",
          "Mampu menulis pseudocode terstruktur untuk menyelesaikan persoalan aritmatika dan logika sekuensial.",
        ],
        keyTopics: [
          "Simbol ANSI Flowchart",
          "Logika Sekuensial",
          "Aturan Identifier & Pseudocode",
          "Kalkulasi Aritmatika",
        ],
        suggestedPreset: "binary_search",
      },
      {
        id: "algo-2",
        numericId: 2,
        chapterNumber: 2,
        title: "Struktur Kondisional & Percabangan (IF-ELSE & Switch)",
        subtitle: "Pengambilan keputusan logika, nested if bertingkat, dan optimasi seleksi multi-kondisi.",
        duration: "90 Menit",
        xpReward: 120,
        prerequisiteChapterId: "algo-1",
        prerequisiteTitle: "Bab 1: Pengantar Logika & Flowchart",
        learningOutcomes: [
          "Menguasai evaluasi ekspresi Boolean menggunakan operator AND, OR, dan NOT.",
          "Mampu mengimplementasikan percabangan bertingkat (nested if) dan pencegahan ambiguitas alur.",
          "Memahami batasan efisiensi Switch-Case dibanding rangkaian IF-ELSE.",
        ],
        keyTopics: [
          "Evaluasi Boolean",
          "Nested IF Logic",
          "Switch-Case Diskrit",
          "Guard Clause & Clean Code",
        ],
        suggestedPreset: "binary_search",
      },
      {
        id: "algo-3",
        numericId: 3,
        chapterNumber: 3,
        title: "Struktur Perulangan & Pencegahan Infinite Loop",
        subtitle: "Iterasi FOR, WHILE, mekanisme counter terhitung, dan terminasi break/continue yang aman.",
        duration: "100 Menit",
        xpReward: 130,
        prerequisiteChapterId: "algo-2",
        prerequisiteTitle: "Bab 2: Struktur Kondisional & Percabangan",
        learningOutcomes: [
          "Membedakan perulangan terhitung (definite loop) dan perulangan bersyarat (indefinite loop).",
          "Menerapkan pengamanan counter iterasi untuk mencegah terjadinya kondisi fatal Infinite Loop.",
          "Menguasai alur kendali instruksi break dan continue pada pemrosesan koleksi data.",
        ],
        keyTopics: [
          "FOR Loop Counter",
          "WHILE Loop Guard",
          "Pencegahan Infinite Loop",
          "Break & Continue Statement",
        ],
        suggestedPreset: "binary_search",
      },
      {
        id: "algo-4",
        numericId: 4,
        chapterNumber: 4,
        title: "Struktur Data Array, Matriks & Manipulasi String",
        subtitle: "Alokasi memori kontigu, zero-based indexing, traversal, dan iterasi matriks baris-kolom.",
        duration: "100 Menit",
        xpReward: 140,
        prerequisiteChapterId: "algo-3",
        prerequisiteTitle: "Bab 3: Struktur Perulangan & Iterasi",
        learningOutcomes: [
          "Memahami representasi memori fisik array linear dan aturan batas indeks (IndexOutOfBounds).",
          "Mampu melakukan operasi dasar: Insertion, Deletion, Searching, dan Traversal array.",
          "Mengimplementasikan matriks dua dimensi untuk pemodelan data tabel dan transformasi nilai.",
        ],
        keyTopics: [
          "Zero-based Indexing",
          "Array Traversal",
          "Matriks 2D (Baris & Kolom)",
          "Manipulasi Karakter String",
        ],
        suggestedPreset: "binary_search",
      },
      {
        id: "algo-5",
        numericId: 5,
        chapterNumber: 5,
        title: "Fungsi Modular, Algoritma Rekursif & Kompleksitas Big-O",
        subtitle: "Dekonstruksi program modular, alokasi Call Stack, Base Case rekursi, dan analisis efisiensi.",
        duration: "120 Menit",
        xpReward: 150,
        prerequisiteChapterId: "algo-4",
        prerequisiteTitle: "Bab 4: Struktur Data Array & Matriks",
        learningOutcomes: [
          "Mampu merancang fungsi modular mandiri dengan parameter passing dan return value terisolasi.",
          "Memahami alokasi frame pada Call Stack memori dan pentingnya Base Case untuk mencegah Stack Overflow.",
          "Menganalisis efisiensi algoritma pencarian biner dan sorting menggunakan notasi Big-O.",
        ],
        keyTopics: [
          "Modular Functions & Scope",
          "Call Stack & Base Case",
          "Rekursi Faktorial & Tree",
          "Analisis Big-O Complexity",
        ],
        suggestedPreset: "tree_traversal",
      },
    ],
  },

  "basis-data": {
    id: "basis-data",
    name: "Basis Data",
    code: "TIF2103",
    semester: "Semester 3 / 4",
    totalSks: 3,
    instructor: "Budi Santoso, M.Kom.",
    description:
      "Arsitektur basis data relasional modern, perancangan skema ERD, normalisasi data 1NF-3NF, optimasi kueri SQL JOIN, serta integritas transaksi ACID.",
    chapters: [
      {
        id: "db-1",
        numericId: 101,
        chapterNumber: 1,
        title: "Konsep Relasional & Pemodelan ERD (Entity Relationship)",
        subtitle: "Prinsip arsitektur RDBMS, entitas, atribut, kardinalitas 1:1, 1:N, M:N, dan integritas referensial.",
        duration: "90 Menit",
        xpReward: 100,
        learningOutcomes: [
          "Memahami model data relasional, konsep tabel terstruktur, tuple baris, dan domain kolom.",
          "Menyusun diagram relasi entitas (ERD) dengan notasi Crow's Foot dan Chen secara akurat.",
          "Menerapkan konsep Primary Key, Foreign Key, dan candidate key untuk menjaga relasi referensial.",
        ],
        keyTopics: [
          "Konsep RDBMS & Relasi",
          "Notasi Crow's Foot ERD",
          "Kardinalitas 1:N & M:N",
          "Primary & Foreign Key",
        ],
        suggestedPreset: "database_sql",
      },
      {
        id: "db-2",
        numericId: 102,
        chapterNumber: 2,
        title: "DDL & DML SQL: Definisi Skema & Manipulasi Data",
        subtitle: "Sintaks CREATE TABLE, ALTER, DROP, constraint NOT NULL/UNIQUE, serta operasi CRUD dengan WHERE.",
        duration: "90 Menit",
        xpReward: 120,
        prerequisiteChapterId: "db-1",
        prerequisiteTitle: "Bab 1: Konsep Relasional & Pemodelan ERD",
        learningOutcomes: [
          "Menguasai perintah Data Definition Language (DDL) untuk mendefinisikan tabel dan tipe data kolom.",
          "Mampu melakukan manipulasi Data Manipulation Language (DML): INSERT, SELECT, UPDATE, DELETE.",
          "Menerapkan klausul filter WHERE dengan operator relasional dan logika majemuk.",
        ],
        keyTopics: [
          "Sintaks DDL (CREATE, ALTER)",
          "Constraint Integritas Tabel",
          "Manipulasi DML (CRUD)",
          "Filtering WHERE & LIKE",
        ],
        suggestedPreset: "database_sql",
      },
      {
        id: "db-3",
        numericId: 103,
        chapterNumber: 3,
        title: "Normalisasi Basis Data (1NF, 2NF, 3NF & Anomali Data)",
        subtitle: "Eliminasi repeating group, dependensi fungsional parsial & transitif, dan dekomposisi tabel.",
        duration: "100 Menit",
        xpReward: 130,
        prerequisiteChapterId: "db-2",
        prerequisiteTitle: "Bab 2: DDL & DML SQL",
        learningOutcomes: [
          "Menganalisis anomali insert, update, dan delete pada tabel basis data yang tidak terstruktur.",
          "Menerapkan tahapan bentuk normal 1NF (nilai atomik), 2NF (dependensi parsial), dan 3NF (dependensi transitif).",
          "Melakukan dekomposisi tabel tanpa kehilangan relasi informasi (lossless-join decomposition).",
        ],
        keyTopics: [
          "Anomali Data Redundan",
          "Bentuk Normal Pertama (1NF)",
          "Dependensi Parsial (2NF)",
          "Dependensi Transitif (3NF)",
        ],
        suggestedPreset: "database_sql",
      },
      {
        id: "db-4",
        numericId: 104,
        chapterNumber: 4,
        title: "Kueri SQL Tingkat Lanjut: JOIN Multi-Tabel & Subqueries",
        subtitle: "Penggabungan INNER, LEFT, RIGHT JOIN, agregasi GROUP BY/HAVING, dan correlated subqueries.",
        duration: "100 Menit",
        xpReward: 140,
        prerequisiteChapterId: "db-3",
        prerequisiteTitle: "Bab 3: Normalisasi Basis Data",
        learningOutcomes: [
          "Memahami perbedaan semantik antara INNER JOIN, LEFT JOIN, RIGHT JOIN, dan FULL OUTER JOIN.",
          "Mampu merangkum metrik pelaporan menggunakan fungsi agregat COUNT, SUM, AVG, MIN, MAX dengan GROUP BY.",
          "Menyusun kueri bersarang (subqueries) pada klausul WHERE, FROM, dan SELECT.",
        ],
        keyTopics: [
          "Sintaks SQL JOIN Kompleks",
          "Klausul GROUP BY & HAVING",
          "Correlated Subqueries",
          "Klausul IN & EXISTS",
        ],
        suggestedPreset: "database_sql",
      },
      {
        id: "db-5",
        numericId: 105,
        chapterNumber: 5,
        title: "Indeks B-Tree, Transaksi ACID & Penanganan Konkurensi",
        subtitle: "Optimasi rencana eksekusi EXPLAIN, prinsip ACID, mekanisme COMMIT/ROLLBACK, dan lock data.",
        duration: "120 Menit",
        xpReward: 150,
        prerequisiteChapterId: "db-4",
        prerequisiteTitle: "Bab 4: Kueri SQL JOIN & Subqueries",
        learningOutcomes: [
          "Memahami cara kerja struktur indeks B-Tree dalam mengurangi biaya Full Table Scan.",
          "Menguasai empat pilar transaksi ACID (Atomicity, Consistency, Isolation, Durability).",
          "Mengelola siklus transaksi perbankan/e-commerce dengan COMMIT dan ROLLBACK untuk mencegah dirty read.",
        ],
        keyTopics: [
          "Struktur Indeks B-Tree",
          "Analisis EXPLAIN QUERY",
          "Prinsip Transaksi ACID",
          "Locking & Isolasi Level",
        ],
        suggestedPreset: "database_sql",
      },
    ],
  },

  "pemrograman-web": {
    id: "pemrograman-web",
    name: "Pemrograman Web",
    code: "TIF2105",
    semester: "Semester 3 / 4",
    totalSks: 3,
    instructor: "Dewi Anggraini, S.Kom., M.Cs.",
    description:
      "Pengembangan aplikasi web standar industri modern: HTML5 Semantic, CSS Grid/Flexbox responsif, JavaScript ES6+, manipulasi DOM, hingga integrasi Asynchronous REST API.",
    chapters: [
      {
        id: "web-1",
        numericId: 201,
        chapterNumber: 1,
        title: "HTML5 Semantic & Struktur Standar Dokumen W3C",
        subtitle: "Hierarki elemen semantik, formulir validasi modern, dan standar aksesibilitas web.",
        duration: "90 Menit",
        xpReward: 100,
        learningOutcomes: [
          "Menyusun struktur dokumen web menggunakan tag semantik (header, nav, main, section, article, footer).",
          "Membangun formulir interaktif dengan validasi bawaan HTML5 (pattern, required, type spesifik).",
          "Memahami prinsip web accessibility (a11y) dan struktur meta tag untuk optimasi mesin pencari (SEO).",
        ],
        keyTopics: [
          "Elemen Semantik HTML5",
          "Formulir & Validasi Input",
          "Struktur Dokumen W3C",
          "Aksesibilitas & Meta Tag",
        ],
        suggestedPreset: "oop_clean",
      },
      {
        id: "web-2",
        numericId: 202,
        chapterNumber: 2,
        title: "CSS3 Modern: Box Model, Flexbox & CSS Grid Layouting",
        subtitle: "Penataan tata letak dua dimensi, responsive design, media query mobile-first, dan flexbox alignment.",
        duration: "90 Menit",
        xpReward: 120,
        prerequisiteChapterId: "web-1",
        prerequisiteTitle: "Bab 1: HTML5 Semantic & Dokumen W3C",
        learningOutcomes: [
          "Menguasai prinsip CSS Box Model (margin, border, padding, content) dan box-sizing: border-box.",
          "Membangun tata letak satu dimensi dengan CSS Flexbox (main axis, cross axis, justify-content).",
          "Menyusun antarmuka kompleks dua dimensi dengan CSS Grid dan media query responsif multi-device.",
        ],
        keyTopics: [
          "Anatomi Box Model",
          "Flexbox Container & Item",
          "CSS Grid Template Columns",
          "Responsive Media Queries",
        ],
        suggestedPreset: "oop_clean",
      },
      {
        id: "web-3",
        numericId: 203,
        chapterNumber: 3,
        title: "JavaScript Modern (ES6+): Variabel, Scope & Arrow Functions",
        subtitle: "Deklarasi let/const, block scope, template literals, destructuring, dan rest/spread operator.",
        duration: "100 Menit",
        xpReward: 130,
        prerequisiteChapterId: "web-2",
        prerequisiteTitle: "Bab 2: CSS3 Modern & Layouting",
        learningOutcomes: [
          "Memahami perbedaan mendasar let, const, dan var serta aturan hoisting dan lexical scope.",
          "Menerapkan sintaks fungsi modern: Arrow Functions dengan implicit return.",
          "Memanfaatkan teknik modern destructuring assignment dan spread/rest operator pada objek dan array.",
        ],
        keyTopics: [
          "Lexical Scope & Let/Const",
          "Arrow Function Syntax",
          "Array & Object Destructuring",
          "Template Literals & Spread",
        ],
        suggestedPreset: "oop_clean",
      },
      {
        id: "web-4",
        numericId: 204,
        chapterNumber: 4,
        title: "DOM Manipulation & Penanganan Event Interaktif",
        subtitle: "Menyeleksi elemen HTML via querySelector, modifikasi class CSS dinamis, dan event propagation.",
        duration: "100 Menit",
        xpReward: 140,
        prerequisiteChapterId: "web-3",
        prerequisiteTitle: "Bab 3: JavaScript Modern (ES6+)",
        learningOutcomes: [
          "Memahami arsitektur pohon antarmuka Document Object Model (DOM) peramban web.",
          "Mampu melakukan manipulasi atribut, elemen dinamis, classList, dan innerHTML secara aman.",
          "Menguasai penanganan event listener interaktif, event delegation, dan pencegahan default behavior.",
        ],
        keyTopics: [
          "Arsitektur Pohon DOM",
          "Penyeleksian querySelector",
          "Event Listener (Click, Submit)",
          "Event Bubbling & Delegation",
        ],
        suggestedPreset: "oop_clean",
      },
      {
        id: "web-5",
        numericId: 205,
        chapterNumber: 5,
        title: "Asynchronous JS, Fetch API & Integrasi RESTful API",
        subtitle: "Mekanisme Event Loop, Promise, async/await, HTTP client fetch, dan integrasi backend data JSON.",
        duration: "120 Menit",
        xpReward: 150,
        prerequisiteChapterId: "web-4",
        prerequisiteTitle: "Bab 4: DOM Manipulation & Events",
        learningOutcomes: [
          "Memahami model asynchronous non-blocking, Call Stack, dan Task Queue pada JavaScript Engine.",
          "Menguasai penulisan kode asynchronous modern menggunakan keyword async/await dengan try-catch.",
          "Mengirim HTTP GET & POST request menggunakan Fetch API untuk konsumsi layanan backend RESTful API.",
        ],
        keyTopics: [
          "Asynchronous & Event Loop",
          "Resolusi Promise & Async/Await",
          "Fetch API HTTP Request",
          "Parsing Respon JSON & Error",
        ],
        suggestedPreset: "oop_clean",
      },
    ],
  },
};

type NodeStatus = "COMPLETED" | "RECOMMENDED" | "LOCKED";

export default function PetaBelajarPage() {
  const router = useRouter();

  // Selected Course Tab
  const [activeCourseId, setActiveCourseId] = useState<string>("algoritma-pemrograman");

  // Dynamic Uploaded Modules mapped as Course Curricula
  const [uploadedCourses, setUploadedCourses] = useState<Record<string, CourseCurriculum>>({});

  // Interactive Detail Drawer / Modal
  const [selectedChapter, setSelectedChapter] = useState<CurriculumChapter | null>(null);

  // Real-time synchronization state from progressStorage
  const [completedTopicIds, setCompletedTopicIds] = useState<number[]>([1, 2]);
  const [userTotalXp, setUserTotalXp] = useState<number>(225);

  // Load progress and subscribe to updates
  useEffect(() => {
    const refreshData = () => {
      try {
        setCompletedTopicIds(getCompletedTopicIds());
        setUserTotalXp(getTotalUserXp());
      } catch {
        // safe fallback
      }
    };

    const loadUploadedModules = () => {
      try {
        const rawUploaded = localStorage.getItem("nexed_uploaded_modules");
        const rawActive = localStorage.getItem("nexed_active_analyzed_module");

        const parsedUploaded: Array<{
          id: string;
          title: string;
          rawText?: string;
          filename?: string;
          chunkCount?: number;
          totalWords?: number;
          analyzedResult?: {
            title?: string;
            summary?: { overview?: string };
            roadmap?: Array<{
              step: number;
              stage: string;
              title: string;
              description: string;
              actionItem?: string;
              keyConcepts?: string[];
            }>;
          };
        }> = rawUploaded ? JSON.parse(rawUploaded) : [];

        if (rawActive) {
          const parsedActive = JSON.parse(rawActive);
          if (
            parsedActive &&
            parsedActive.id &&
            !parsedUploaded.some((u) => u.id === parsedActive.id)
          ) {
            parsedUploaded.unshift(parsedActive);
          }
        }

        const newUploadedMap: Record<string, CourseCurriculum> = {};

        parsedUploaded.forEach((mod) => {
          if (
            !mod.analyzedResult ||
            !Array.isArray(mod.analyzedResult.roadmap) ||
            mod.analyzedResult.roadmap.length === 0
          ) {
            return;
          }
          const courseId = `dok-${mod.id}`;
          const roadmap = mod.analyzedResult.roadmap;

          newUploadedMap[courseId] = {
            id: courseId,
            name: mod.analyzedResult.title || mod.title || "Modul Unggahan",
            code: "MOD-AI",
            semester: "Modul Dokumen Unggahan",
            totalSks: 2,
            instructor: "AI Curriculum Architect NexedAI",
            description:
              mod.analyzedResult.summary?.overview ||
              "Kurikulum adaptif yang diekstraksi secara presisi dari dokumen yang Anda unggah.",
            chapters: roadmap.map((step, idx) => ({
              id: `${courseId}-step-${step.step}`,
              numericId: 5000 + idx,
              chapterNumber: step.step,
              title: step.title || `Tahap ${step.step}`,
              subtitle: step.description || "Substansi materi tahap ini.",
              duration: "45 Menit",
              xpReward: 130,
              prerequisiteChapterId: idx > 0 ? `${courseId}-step-${idx}` : undefined,
              prerequisiteTitle:
                idx > 0
                  ? `Tahap ${idx}: ${(roadmap[idx - 1]?.title || "").slice(0, 30)}`
                  : undefined,
              learningOutcomes:
                Array.isArray(step.keyConcepts) && step.keyConcepts.length > 0
                  ? step.keyConcepts
                  : [step.actionItem || "Penguasaan konsep dan metodologi tahap ini."],
              keyTopics:
                Array.isArray(step.keyConcepts) && step.keyConcepts.length > 0
                  ? step.keyConcepts
                  : [step.title || "Konsep Inti"],
              suggestedPreset: undefined,
            })),
          };
        });

        setUploadedCourses(newUploadedMap);

        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const courseParam = params.get("course");
          if (courseParam && (newUploadedMap[courseParam] || COURSE_CURRICULA[courseParam])) {
            setActiveCourseId(courseParam);
          } else if (rawActive) {
            try {
              const parsedActive = JSON.parse(rawActive);
              if (parsedActive && parsedActive.id) {
                const activeId = `dok-${parsedActive.id}`;
                if (newUploadedMap[activeId]) {
                  setActiveCourseId(activeId);
                }
              }
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Gagal memuat modul unggahan di peta belajar:", err);
      }
    };

    refreshData();
    loadUploadedModules();

    const cleanup = onProgressUpdate(refreshData);
    if (typeof window !== "undefined") {
      window.addEventListener("nexed_modules_updated", loadUploadedModules);
    }

    return () => {
      cleanup();
      if (typeof window !== "undefined") {
        window.removeEventListener("nexed_modules_updated", loadUploadedModules);
      }
    };
  }, []);

  const allCourses: Record<string, CourseCurriculum> = {
    ...COURSE_CURRICULA,
    ...uploadedCourses,
  };

  const defaultCourse = COURSE_CURRICULA["algoritma-pemrograman"]!;
  const activeCourse: CourseCurriculum = allCourses[activeCourseId] ?? defaultCourse;

  // Helper to determine node status for a chapter
  const getChapterStatus = (chapter: CurriculumChapter, index: number): NodeStatus => {
    // Check if directly completed in storage
    const isCompleted =
      completedTopicIds.includes(chapter.numericId) ||
      (chapter.id === "algo-1" && completedTopicIds.includes(1)) ||
      (chapter.id === "algo-2" && completedTopicIds.includes(2));

    if (isCompleted) {
      return "COMPLETED";
    }

    // If it's chapter 1 and not completed, it is recommended
    if (index === 0) {
      return "RECOMMENDED";
    }

    // If previous chapter is completed, this chapter is next recommended (IN_PROGRESS)
    const prevChapter = activeCourse.chapters[index - 1];
    const prevCompleted =
      prevChapter &&
      (completedTopicIds.includes(prevChapter.numericId) ||
        (prevChapter.id === "algo-1" && completedTopicIds.includes(1)) ||
        (prevChapter.id === "algo-2" && completedTopicIds.includes(2)));

    if (prevCompleted) {
      return "RECOMMENDED";
    }

    return "LOCKED";
  };

  // Calculations for Course Mastery
  const completedChaptersCount = activeCourse.chapters.filter(
    (c, i) => getChapterStatus(c, i) === "COMPLETED",
  ).length;
  const courseMasteryPercent = Math.round(
    (completedChaptersCount / activeCourse.chapters.length) * 100,
  );
  const courseTotalXp = activeCourse.chapters.reduce((acc, c) => acc + c.xpReward, 0);
  const courseEarnedXp = activeCourse.chapters
    .filter((c, i) => getChapterStatus(c, i) === "COMPLETED")
    .reduce((acc, c) => acc + c.xpReward, 0);

  // Global Semester Mastery (Across all standard and custom courses)
  const totalSemesterChapters = 15;
  const globalCompletedCount =
    completedChaptersCount +
    (activeCourseId === "algoritma-pemrograman" ? 1 : 2);
  const globalMasteryPercent = Math.min(
    100,
    Math.round((globalCompletedCount / totalSemesterChapters) * 100),
  );

  const handleStartLearning = (chapter: CurriculumChapter) => {
    // If it's an uploaded course, activate that module in localStorage and navigate
    if (activeCourseId.startsWith("dok-")) {
      const origId = activeCourseId.replace(/^dok-/, "");
      try {
        const rawUploaded = localStorage.getItem("nexed_uploaded_modules");
        const parsed = rawUploaded ? JSON.parse(rawUploaded) : [];
        const found = parsed.find((p: { id: string }) => p.id === origId);
        if (found) {
          localStorage.setItem("nexed_active_analyzed_module", JSON.stringify(found));
        }
      } catch {}
      router.push(`/modul`);
      return;
    }

    // Navigate to module hub with recommended preset
    const preset = chapter.suggestedPreset || "binary_search";
    router.push(`/modul?preset=${preset}&topic=${encodeURIComponent(chapter.title)}`);
  };

  const handleManualMarkDone = (chapter: CurriculumChapter) => {
    markModuleCompleted(chapter.id, chapter.title, chapter.xpReward, 100);
    // Also mark numeric topic for compatibility
    try {
      const existing = getCompletedTopicIds();
      if (!existing.includes(chapter.numericId)) {
        const next = [...existing, chapter.numericId];
        localStorage.setItem("completed_topics", JSON.stringify(next));
      }
    } catch {}
    setCompletedTopicIds(getCompletedTopicIds());
    setUserTotalXp(getTotalUserXp());
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-black font-['Inter',sans-serif] antialiased">
      {/* Top Header & Breadcrumb */}
      <header className="bg-white/90 backdrop-blur-md border-b border-black/8 sticky top-0 z-20 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
              <span>Portal Mahasiswa</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span>D3 TI SV UNS</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-black font-semibold">Peta Belajar</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Network className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                Peta Belajar & Visual Skill Tree
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/modul"
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-semibold border border-black/10 transition-colors shadow-2xs"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Katalog Modul Adaptif</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* BENTO HERO: METRIK PENGUASAAN GLOBAL & STATUS SEMESTER */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Card 1: Penguasaan Kurikulum Mata Kuliah (Span 2) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-black/8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-mono font-semibold text-indigo-700">
                    {activeCourse.code} • {activeCourse.semester}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {activeCourse.totalSks} SKS
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  {courseMasteryPercent}% Dikuasai
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-black mb-1">
                {activeCourse.name}
              </h2>
              <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                {activeCourse.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between text-xs text-neutral-600 font-medium mb-1.5">
                <span>Progres Bab Kurikulum</span>
                <span className="font-mono text-black font-bold">
                  {completedChaptersCount} dari {activeCourse.chapters.length} Bab Tuntas
                </span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${courseMasteryPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Total Akumulasi XP Pengguna */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                Akumulasi Belajar
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>

            <div className="my-2">
              <div className="text-3xl font-extrabold text-black font-mono tracking-tight">
                {userTotalXp.toLocaleString()} <span className="text-sm font-sans font-medium text-neutral-500">XP</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                +150 XP per bab tuntas dikuasai
              </p>
            </div>

            <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-medium">Target Mata Kuliah</span>
              <span className="font-mono font-bold text-indigo-700">
                {courseEarnedXp} / {courseTotalXp} XP
              </span>
            </div>
          </div>

          {/* Card 3: Semester Mastery & Status Mahasiswa */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                Kompetensi Vokasi
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>

            <div className="my-2">
              <div className="text-lg font-bold text-black flex items-center gap-2">
                <span>Pemrogram Madya</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Tingkat Semester 4 • D3 TI SV UNS
              </p>
            </div>

            <div className="pt-3 border-t border-black/5">
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span>Mastery Semester</span>
                <span className="font-mono font-bold text-emerald-700">{globalMasteryPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${globalMasteryPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* TAB PILIHAN MATA KULIAH (COURSE FILTER SWITCHER) */}
        <section className="bg-white rounded-3xl p-3 sm:p-4 border border-black/8 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {Object.values(allCourses).map((course) => {
                const isActive = course.id === activeCourseId;
                const isCustom = course.id.startsWith("dok-");
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setActiveCourseId(course.id)}
                    className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "bg-[#F4F4F6] text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {isCustom && (
                      <Sparkles
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? "text-amber-300" : "text-indigo-600"
                        }`}
                      />
                    )}
                    <span>{course.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white text-neutral-600 border border-black/5"
                      }`}
                    >
                      {isCustom ? "Dokumen Anda" : `${course.chapters.length} Bab`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* STATUS LEGEND TRACKER */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-neutral-600 flex-wrap px-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shrink-0" />
                <span>Tuntas Dikuasai</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block shrink-0 animate-pulse" />
                <span>Rekomendasi AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300 inline-block shrink-0" />
                <span>Terkunci</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SKILL TREE FLOW (VISUAL NODES GRAPH) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-black/8 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {activeCourseId.startsWith("dok-")
                    ? "Peta Belajar Adaptif Hasil Ekstraksi AI Dokumen"
                    : "Alur Prasyarat & Roadmap Pembelajaran Adaptif"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black">
                {activeCourse.name} — Pohon Kompetensi
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto mt-1">
                {activeCourseId.startsWith("dok-")
                  ? "Daftar sub-topik terstruktur yang diekstrak langsung dari dokumen asli Anda. Selesaikan tahapan untuk menguasai seluruh materi."
                  : "Selesaikan materi secara bertahap dari Bab 1 untuk membuka kunci simpul bab berikutnya. Klik kartu simpul untuk meninjau detail capaian."}
              </p>

              {activeCourseId.startsWith("dok-") && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Link
                    href="/modul"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-medium transition-all shadow-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Detail Modul di Hub</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Vertical Chained Graph */}
            <div className="relative space-y-8 before:absolute before:inset-0 before:left-6 sm:before:left-8 before:top-8 before:bottom-8 before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:via-indigo-400 before:to-slate-200 before:z-0">
              {activeCourse.chapters.map((chapter, index) => {
                const status = getChapterStatus(chapter, index);
                const isSelected = selectedChapter?.id === chapter.id;

                return (
                  <div key={chapter.id} className="relative z-10 flex items-start gap-4 sm:gap-6 group">
                    {/* Node Anchor Pin */}
                    <div className="shrink-0 pt-3">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-sm sm:text-base border-2 shadow-sm transition-all duration-300 ${
                          status === "COMPLETED"
                            ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-200"
                            : status === "RECOMMENDED"
                              ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-300 ring-4 ring-indigo-100 animate-pulse"
                              : "bg-slate-100 border-slate-300 text-slate-400"
                        }`}
                      >
                        {status === "COMPLETED" ? (
                          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                        ) : status === "RECOMMENDED" ? (
                          <PlayCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                        ) : (
                          <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                    </div>

                    {/* Interactive Node Card */}
                    <div
                      onClick={() => setSelectedChapter(chapter)}
                      className={`flex-1 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                          ? "ring-2 ring-indigo-600 shadow-md"
                          : "hover:shadow-md hover:-translate-y-0.5"
                      } ${
                        status === "COMPLETED"
                          ? "bg-emerald-50/40 border-emerald-300/80 hover:border-emerald-400"
                          : status === "RECOMMENDED"
                            ? "bg-white border-indigo-500 shadow-sm hover:border-indigo-600"
                            : "bg-[#FAFAFA] border-slate-200 hover:border-slate-300 opacity-80"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider ${
                              status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : status === "RECOMMENDED"
                                  ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                  : "bg-slate-200 text-slate-700 border border-slate-300"
                            }`}
                          >
                            Bab {chapter.chapterNumber}
                          </span>

                          <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{chapter.duration}</span>
                          </span>

                          <span className="text-[11px] font-mono font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            +{chapter.xpReward} XP
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {status === "COMPLETED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>100/100 Tuntas</span>
                            </span>
                          )}
                          {status === "RECOMMENDED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold font-mono animate-pulse">
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Rekomendasi Belajar</span>
                            </span>
                          )}
                          {status === "LOCKED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[11px] font-mono">
                              <Lock className="w-3 h-3" />
                              <span>Terkunci</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-black mb-1">
                        {chapter.title}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-2 mb-3">
                        {chapter.subtitle}
                      </p>

                      {/* Pill Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {chapter.keyTopics.slice(0, 3).map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-black/8 text-neutral-600"
                          >
                            {topic}
                          </span>
                        ))}
                        {chapter.prerequisiteTitle && status === "LOCKED" && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>{chapter.prerequisiteTitle}</span>
                          </span>
                        )}
                      </div>

                      {/* Card Action footer */}
                      <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                        <span className="text-neutral-500 text-[11px]">
                          {status === "COMPLETED"
                            ? "Materi telah dikuasai • Klik untuk tinjau ulang"
                            : status === "RECOMMENDED"
                              ? "Siap dipelajari sekarang • Klik untuk membuka detail"
                              : "Prasyarat belum terpenuhi"}
                        </span>
                        <span className="font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          <span>Detail</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* INTERACTIVE NODE DRAWER / DETAIL MODAL */}
      {selectedChapter && (() => {
        const chapterIndex = activeCourse.chapters.findIndex((c) => c.id === selectedChapter.id);
        const status = getChapterStatus(selectedChapter, chapterIndex >= 0 ? chapterIndex : 0);

        return (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
            onClick={() => setSelectedChapter(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Detail Bab: ${selectedChapter.title}`}
          >
            <div
              className="bg-white rounded-3xl border border-black/10 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 bg-white border-b border-black/8 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-black text-white text-[11px] font-mono font-bold uppercase tracking-wider">
                      Bab {selectedChapter.chapterNumber}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      {activeCourse.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                        status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : status === "RECOMMENDED"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {status === "COMPLETED"
                        ? "Tuntas Dikuasai"
                        : status === "RECOMMENDED"
                          ? "Rekomendasi Aktif"
                          : "Terkunci"}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-black">
                    {selectedChapter.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedChapter(null)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer shrink-0 font-bold"
                  aria-label="Tutup jendela detail"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content Area */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
                <p className="text-neutral-600 leading-relaxed">
                  {selectedChapter.subtitle}
                </p>

                {/* Meta Attributes Bento Row */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-black/5 text-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block">Estimasi Waktu</span>
                    <span className="font-bold text-black font-mono mt-0.5 block flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {selectedChapter.duration}
                    </span>
                  </div>
                  <div className="border-x border-black/5">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block">Bobot XP</span>
                    <span className="font-bold text-amber-600 font-mono mt-0.5 block flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                      +{selectedChapter.xpReward} XP
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block">Pengajar</span>
                    <span className="font-semibold text-black truncate mt-0.5 block">
                      {activeCourse.instructor.split(",")[0]}
                    </span>
                  </div>
                </div>

                {/* Prasyarat Materi Warning/Notice */}
                {selectedChapter.prerequisiteTitle && (
                  <div
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      status === "LOCKED"
                        ? "bg-amber-50/80 border-amber-200 text-amber-900"
                        : "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <span className="font-bold block text-xs">
                        {status === "LOCKED" ? "Prasyarat Belum Terpenuhi" : "Prasyarat Terpenuhi"}
                      </span>
                      <p className="text-[11px] mt-0.5">
                        {status === "LOCKED"
                          ? `Untuk membuka simpul materi ini, Anda harus menyelesaikan ${selectedChapter.prerequisiteTitle} terlebih dahulu.`
                          : `Anda telah menyelesaikan materi prasyarat (${selectedChapter.prerequisiteTitle}).`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Capaian Pembelajaran (Learning Outcomes) */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Capaian Pembelajaran (Learning Outcomes)</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedChapter.learningOutcomes.map((outcome, oIdx) => (
                      <li
                        key={oIdx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-black/8 text-neutral-700"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-xs leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pokok Bahasan Kunci */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Pokok Bahasan Materi</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChapter.keyTopics.map((topic, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-3 py-1.5 rounded-xl bg-[#F4F4F6] border border-black/8 text-xs font-mono font-medium text-neutral-800"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 sm:p-6 bg-[#FAFAFA] border-t border-black/8 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {status === "COMPLETED" && (
                    <button
                      type="button"
                      onClick={() => handleManualMarkDone(selectedChapter)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-black/10 text-neutral-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Segarkan Progres</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  {status === "LOCKED" ? (
                    <button
                      type="button"
                      disabled
                      className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Prasyarat Belum Terpenuhi</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartLearning(selectedChapter)}
                      className="min-h-[44px] w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {status === "COMPLETED" ? "Tinjau / Pelajari Ulang" : "Mulai Belajar Sekarang"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
