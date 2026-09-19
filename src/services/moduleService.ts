// src/services/moduleService.ts
import {
  type Module,
  ModuleSchema,
  type ModuleTopic,
  ModuleTopicSchema,
} from "../lib/validations/moduleSchema";
import {
  type ClassAnalytics,
  ClassAnalyticsSchema,
  type CourseProgress,
  CourseProgressSchema,
  type StudentTask,
} from "../lib/validations/progressSchema";

// Database Simulasi Adaptif (BFF / Mock REST Layer)
const MOCK_TOPICS: ModuleTopic[] = [
  {
    id: 1,
    slug: "pengantar-algoritma",
    title: "Pengantar Algoritma & Logika Pemrograman",
    category: "Dasar Pemrograman",
    difficulty: "Beginner",
    estimatedMinutes: 25,
    xpReward: 50,
    status: "completed",
    summary:
      "Pemahaman konsep dasar struktur algoritma sekuensial, flowchart logika, dan penulisan pseudocode standar.",
    learningObjectives: [
      "Memahami definisi algoritma dan karakteristiknya",
      "Mampu menyusun diagram alir (flowchart) terstruktur",
      "Menulis pseudocode yang efisien sebelum implementasi",
    ],
    theoryContent: `Algoritma adalah serangkaian instruksi terstruktur dan terhingga untuk memecahkan masalah komputasi tertentu. Dalam rekayasa perangkat lunak modern, efisiensi logika algoritma menentukan kompleksitas waktu (Time Complexity) dan ruang (Space Complexity).

Karakteristik Utama Algoritma:
1. Finiteness: Algoritma harus berakhir setelah sejumlah langkah terhingga.
2. Definiteness: Setiap langkah instruksi harus didefinisikan dengan jelas dan tidak ambigu.
3. Input & Output: Menerima nol atau lebih masukan serta menghasilkan minimal satu luaran terukur.`,
    codeSnippet: {
      language: "javascript",
      code: `// Contoh Algoritma Sekuensial: Menghitung Luas & Keliling
function hitungLingkaran(radius) {
  const PI = 3.14159;
  const luas = PI * radius * radius;
  const keliling = 2 * PI * radius;
  return { luas, keliling };
}

console.log(hitungLingkaran(7));`,
      expectedOutput: "{ luas: 153.93791, keliling: 43.98226 }",
      explanation: "Fungsi menerima radius dan menghitung parameter lingkaran secara sekuensial.",
    },
    quizzes: [
      {
        id: 101,
        question: "Manakah yang BUKAN merupakan karakteristik algoritma menurut Donald Knuth?",
        options: [
          { id: 1, text: "Finiteness (Keterhinggaan)", isCorrect: false },
          {
            id: 2,
            text: "Infinite Loop (Pengulangan Tanpa Akhir)",
            isCorrect: true,
            explanation: "Algoritma harus berhenti setelah langkah terhingga.",
          },
          { id: 3, text: "Definiteness (Kepastian langkah)", isCorrect: false },
          { id: 4, text: "Effectiveness (Efektivitas)", isCorrect: false },
        ],
        correctOptionId: 2,
      },
    ],
    aiPromptSuggestion: "Jelaskan perbedaan mendasar antara pseudocode dan kode program nyata!",
  },
  {
    id: 2,
    slug: "struktur-kondisional",
    title: "Struktur Kondisional & Percabangan Logika",
    category: "Dasar Pemrograman",
    difficulty: "Beginner",
    estimatedMinutes: 30,
    xpReward: 75,
    status: "completed",
    summary:
      "Penguasaan seleksi kondisi menggunakan IF-ELSE bertingkat, ternary operator, dan switch-case ekspresi.",
    learningObjectives: [
      "Menguasai alur percabangan boolean (Truth table)",
      "Menghindari deep nested IF dengan early exit guard clauses",
      "Menerapkan pattern matching menggunakan switch statements",
    ],
    theoryContent: `Struktur percabangan memungkinkan program membuat keputusan logis berdasarkan evaluasi kondisi boolean. Praktik industri terbaik menyarankan penggunaan *Guard Clauses* (Early Return) daripada struktur *Nested If* yang dalam untuk mempermudah pembacaan kode (Cognitive Complexity).`,
    codeSnippet: {
      language: "javascript",
      code: `// Contoh Clean Code: Guard Clauses
function evaluasiKelulusan(nilai, kehadiranPersen) {
  if (kehadiranPersen < 75) return "Tidak Lulus (Kehadiran Kurang)";
  if (nilai >= 85) return "Lulus (Grade A)";
  if (nilai >= 70) return "Lulus (Grade B)";
  return "Perlu Remedial";
}

console.log(evaluasiKelulusan(88, 90));`,
      expectedOutput: "Lulus (Grade A)",
      explanation: "Pengecekan prasyarat kehadiran dilakukan di awal untuk mengeliminasi nesting.",
    },
    quizzes: [
      {
        id: 201,
        question: "Apa keuntungan utama menerapkan pola Guard Clause dibandingkan Nested IF?",
        options: [
          { id: 1, text: "Mempercepat waktu kompilasi CSS", isCorrect: false },
          {
            id: 2,
            text: "Mengurangi kedalaman indentasi dan kompleksitas kognitif",
            isCorrect: true,
          },
          { id: 3, text: "Menghilangkan kebutuhan variabel", isCorrect: false },
          { id: 4, text: "Menjamin tidak ada bug memori", isCorrect: false },
        ],
        correctOptionId: 2,
      },
    ],
    aiPromptSuggestion: "Berikan contoh refaktor kode nested IF menjadi Guard Clause!",
  },
  {
    id: 3,
    slug: "looping-iterasi",
    title: "Looping & Iterasi: Optimasi Perulangan Algoritma",
    category: "Algoritma Lanjut",
    difficulty: "Intermediate",
    estimatedMinutes: 40,
    xpReward: 100,
    status: "recommended",
    summary:
      "Analisis perulangan for, while, do-while, serta functional array iteration (map, filter, reduce) yang bebas efek samping.",
    learningObjectives: [
      "Menentukan kapan menggunakan for loop vs while loop",
      "Mencegah bug off-by-one dan infinite loop condition",
      "Memahami perbedaan mutasi imperatif vs declarative pipeline",
    ],
    theoryContent: `Looping adalah inti dari pemrosesan data volume besar. Pengembang front-end modern umumnya lebih menyukai pendekatan deklaratif (seperti .map(), .filter(), .reduce()) karena menghasilkan kode murni (*pure functions*) yang lebih mudah diuji dan didebug.

Pencegahan Masalah Umum:
1. Infinite Loop: Selalu pastikan kondisi terminator pasti tercapai pada setiap siklus.
2. Off-by-one Error: Periksa batas kondisi iterasi (< vs <=).
3. Memory Leak: Hindari alokasi closure di dalam perulangan intensif.`,
    codeSnippet: {
      language: "javascript",
      code: `// Pipeline Deklaratif vs Loop Imperatif Tradisional
const angka = [12, 45, 68, 23, 89, 90, 34];

// Filter genap dan kalikan dua secara deklaratif
const hasil = angka
  .filter((n) => n % 2 === 0)
  .map((n) => n * 2);

console.log("Hasil:", hasil);`,
      expectedOutput: "Hasil: [ 24, 136, 180, 68 ]",
      explanation: "Metode fungsional merangkai operasi tanpa memutasi array asli.",
    },
    quizzes: [
      {
        id: 301,
        question: "Kapan while loop lebih direkomendasikan daripada for loop?",
        options: [
          {
            id: 1,
            text: "Ketika jumlah iterasi sudah diketahui secara pasti sejak awal",
            isCorrect: false,
          },
          {
            id: 2,
            text: "Ketika penghentian perulangan bergantung pada kondisi dinamis yang belum tentu terukur jumlahnya",
            isCorrect: true,
          },
          { id: 3, text: "Hanya saat memproses data JSON", isCorrect: false },
          { id: 4, text: "Tidak pernah digunakan lagi di JavaScript", isCorrect: false },
        ],
        correctOptionId: 2,
      },
    ],
    aiPromptSuggestion: "Bagaimana cara mendeteksi kompleksitas O(n^2) pada nested loops?",
  },
  {
    id: 4,
    slug: "struktur-data-array",
    title: "Struktur Data Array & Matriks Terstruktur",
    category: "Struktur Data",
    difficulty: "Intermediate",
    estimatedMinutes: 35,
    xpReward: 120,
    status: "locked",
    summary:
      "Pengelolaan memori kontigu, manipulasi matriks multi-dimensi, dan pencarian elemen berbasis hash map.",
    learningObjectives: [
      "Menguasai representasi memori contiguous array",
      "Memahami time complexity akses O(1) vs pencarian linear O(n)",
      "Manipulasi array dua dimensi untuk pemodelan tabel & matriks",
    ],
    theoryContent: `Array adalah struktur data dasar yang menyimpan elemen-elemen sejenis pada lokasi memori yang bersebelahan. Indeks numerik memungkinkan akses instan O(1), namun operasi penyisipan atau penghapusan di tengah memiliki kompleksitas O(n) karena membutuhkan pergeseran elemen.`,
    quizzes: [],
    aiPromptSuggestion: "Jelaskan mengapa array JavaScript dapat menampung tipe data heterogen!",
  },
  {
    id: 5,
    slug: "fungsi-rekursi",
    title: "Fungsi Modular & Konsep Rekursif",
    category: "Algoritma Lanjut",
    difficulty: "Advanced",
    estimatedMinutes: 45,
    xpReward: 150,
    status: "locked",
    summary:
      "Modularisasi kode dengan parameter murni, call stack frame, base case rekursif, dan optimasi memoization.",
    learningObjectives: [
      "Mendesain pure functions yang deterministik",
      "Menentukan base case rekursif untuk mencegah Call Stack Overflow",
      "Penerapan teknik memoization untuk efisiensi komputasi",
    ],
    theoryContent: `Rekursi adalah teknik di mana sebuah fungsi memanggil dirinya sendiri untuk menyelesaikan sub-masalah yang lebih kecil. Setiap pemanggilan menambahkan frame baru ke dalam Call Stack memori. Tanpa base case yang tepat, rekursi akan menyebabkan 'Maximum call stack size exceeded'.`,
    quizzes: [],
    aiPromptSuggestion: "Berikan analogi sederhana untuk memahami cara kerja Call Stack!",
  },
];

const MOCK_MODULES: Module[] = [
  {
    id: 1,
    slug: "algoritma-pemrograman-dasar",
    code: "IF2026-01",
    title: "Algoritma & Pemrograman Berkelanjutan",
    description:
      "Kurikulum inti logika komputasi, struktur kendali, optimasi perulangan, dan pemodelan data adaptif.",
    topics: MOCK_TOPICS,
    totalXp: 495,
    badgeName: "Algorithmic Master",
    order: 1,
  },
];

// Layanan API Asinkron Type-Safe
export async function fetchModulesApi(): Promise<Module[]> {
  // Simulasi latency jaringan realistis
  await new Promise((resolve) => setTimeout(resolve, 80));
  return ModuleSchema.array().parse(MOCK_MODULES);
}

export async function fetchTopicDetailApi(topicId: number): Promise<ModuleTopic | null> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const topic = MOCK_TOPICS.find((t) => t.id === topicId);
  if (!topic) return null;
  return ModuleTopicSchema.parse(topic);
}

export async function fetchStudentProgressApi(): Promise<CourseProgress> {
  await new Promise((resolve) => setTimeout(resolve, 90));

  const rawTasks: StudentTask[] = [
    {
      id: "tsk-01",
      title: "Tuntaskan Kuis Looping & Iterasi",
      category: "Kuis",
      complexity: "Intermediate",
      status: "In Progress",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "tsk-02",
      title: "Implementasikan Algoritma Sorting Dasar",
      category: "Proyek",
      complexity: "Intermediate",
      status: "In Progress",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "tsk-03",
      title: "Pelajari Pseudocode Struktur Kondisional",
      category: "Materi",
      complexity: "Beginner",
      status: "Completed",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  const progressData: CourseProgress = {
    studentId: "mhs-2024-001",
    totalXp: 125,
    currentLevel: 2,
    completedModulesCount: 2,
    totalModulesCount: 5,
    recommendedTopicId: 3,
    recommendedTopicTitle: "Looping & Iterasi: Optimasi Perulangan Algoritma",
    tasks: rawTasks,
    recentQuizScores: [
      { quizTitle: "Logika Dasar", score: 95, completedAt: "15 Sep 2026" },
      { quizTitle: "Struktur IF-ELSE", score: 88, completedAt: "16 Sep 2026" },
    ],
  };

  return CourseProgressSchema.parse(progressData);
}

export async function fetchClassAnalyticsApi(): Promise<ClassAnalytics> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const analyticsData: ClassAnalytics = {
    totalStudents: 42,
    averageScore: 84.6,
    atRiskCount: 2,
    masteryRate: 78.5,
    gradeDistribution: {
      gradeA: 18,
      gradeB: 16,
      gradeC: 6,
      gradeD: 2,
      gradeE: 0,
    },
    atRiskStudents: [
      {
        id: 102,
        name: "Budi Santoso",
        nim: "202401048",
        topic: "Looping & Iterasi",
        score: 35,
        masteryPercentage: 35,
        status: "Berisiko",
        lastActive: "15 menit lalu",
        quizAttempts: 3,
      },
      {
        id: 103,
        name: "Siti Aminah",
        nim: "202401092",
        topic: "Struktur Array",
        score: 52,
        masteryPercentage: 52,
        status: "Perlu Perhatian",
        lastActive: "1 jam lalu",
        quizAttempts: 2,
      },
      {
        id: 101,
        name: "Muhammad Hariz",
        nim: "202401001",
        topic: "Looping & Iterasi",
        score: 92,
        masteryPercentage: 92,
        status: "Aman",
        lastActive: "Sekarang",
        quizAttempts: 1,
      },
      {
        id: 104,
        name: "Ucik Dika Maharani",
        nim: "202401015",
        topic: "Pengantar Algoritma",
        score: 96,
        masteryPercentage: 96,
        status: "Aman",
        lastActive: "35 menit lalu",
        quizAttempts: 1,
      },
      {
        id: 105,
        name: "Zam Zam Zahrina",
        nim: "202401027",
        topic: "Struktur Kondisional",
        score: 89,
        masteryPercentage: 89,
        status: "Aman",
        lastActive: "2 jam lalu",
        quizAttempts: 1,
      },
    ],
  };

  return ClassAnalyticsSchema.parse(analyticsData);
}
