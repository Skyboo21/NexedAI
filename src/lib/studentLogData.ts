// src/lib/studentLogData.ts

export interface StudentActivityLogItem {
  id: string;
  timestamp: string;
  category: "Kuis" | "Praktikum" | "Modul" | "AI Chat" | "Login";
  title: string;
  score: string;
  duration: string;
  status: "Gagal" | "Peringatan" | "Berhasil" | "Info";
  logDetail: string;
  telemetry?: {
    attempts?: number;
    codeErrorCount?: number;
    aiQueriesCount?: number;
  };
}

export interface StudentInterventionRecord {
  id: string;
  date: string;
  lecturerName: string;
  type: "Catatan Dosen" | "Penugasan Remedial" | "Jadwal Asistensi Lab";
  message: string;
  status: "Terkirim" | "Selesai";
}

export interface StudentLogDetail {
  id: number;
  name: string;
  nim: string;
  email: string;
  classGroup: string;
  topic: string;
  mastery: number;
  status: "Berisiko" | "Perlu Perhatian" | "Aman";
  riskLevel: "Tinggi" | "Sedang" | "Rendah";
  interventionStatus: "Belum Ditangani" | "Dalam Penanganan" | "Selesai Ditinjau";
  riskSummary: string;
  averageQuizScore: number;
  totalStudyHours: number;
  aiHelpFrequency: number;
  aiDiagnosis: {
    rootCause: string;
    cognitiveProfile: string;
    strugglingConcepts: string[];
    recommendedPedagogy: string;
    suggestedRemedial: string;
  };
  activityLogs: StudentActivityLogItem[];
  interventions: StudentInterventionRecord[];
}

export const initialStudentLogs: Record<string, StudentLogDetail> = {
  "Budi Santoso": {
    id: 102,
    name: "Budi Santoso",
    nim: "202401048",
    email: "budi.santoso@student.uns.ac.id",
    classGroup: "TI-2A (D3 Teknik Informatika SV UNS)",
    topic: "Looping & Iterasi",
    mastery: 35,
    status: "Berisiko",
    riskLevel: "Tinggi",
    interventionStatus: "Belum Ditangani",
    riskSummary:
      "Gagal menyelesaikan Kuis Modul Looping & Iterasi 3 kali berturut-turut. Skor kuis terakhir: 35/100 dengan indikasi kebingungan kondisi terminasi.",
    averageQuizScore: 42,
    totalStudyHours: 14.5,
    aiHelpFrequency: 18,
    aiDiagnosis: {
      rootCause:
        "Mahasiswa mengalami kebingungan mendasar terkait kondisi terminasi loop (loop condition) dan manipulasi variabel counter. Kerap membuat kode mengalami Infinite Loop atau Off-By-One error saat menangani batas n vs n-1.",
      cognitiveProfile:
        "Tipe pembelajar visual praktikal; kesulitan membaca trace tabel mental tanpa visualisasi eksekusi baris-per-baris.",
      strugglingConcepts: [
        "While loop termination condition",
        "Nested loop index variable shadowing (variabel i tertimpa di inner loop)",
        "Off-by-one errors (0-based vs 1-based indexing)",
        "Kapan menggunakan Break vs Continue",
      ],
      recommendedPedagogy:
        "Berikan latihan tracing manual menggunakan tabel baris variabel dan analogi mekanik (misal: jarum speedometer putaran) sebelum menulis kode di IDE.",
      suggestedRemedial:
        "Modul Suplemen: Tracing Visual Looping & 5 Soal Latihan Mandiri Bertingkat (Level 1 - 3).",
    },
    activityLogs: [
      {
        id: "log-budi-1",
        timestamp: "19 Sep 2026 • 14:15 WIB",
        category: "Kuis",
        title: "Kuis Evaluasi Modul: Looping & Iterasi (Percobaan 3)",
        score: "35 / 100",
        duration: "38 Menit",
        status: "Gagal",
        logDetail:
          "Menjawab salah pada 4 dari 6 soal. Gagal mengidentifikasi output dari nested loop dan kompleksitas waktu O(N^2).",
        telemetry: { attempts: 3, codeErrorCount: 6 },
      },
      {
        id: "log-budi-2",
        timestamp: "19 Sep 2026 • 11:20 WIB",
        category: "AI Chat",
        title: "Sesi Diskusi dengan Nexed AI Tutor",
        score: "-",
        duration: "24 Menit",
        status: "Info",
        logDetail:
          "Mengajukan 5 pertanyaan: 'Mengapa while(i <= n) saya freeze?', 'Bagaimana cara trace tabel loop', 'Contoh kode segitiga bintang dengan for'.",
        telemetry: { aiQueriesCount: 5 },
      },
      {
        id: "log-budi-3",
        timestamp: "18 Sep 2026 • 16:45 WIB",
        category: "Praktikum",
        title: "Praktikum Lab: Algoritma Pencarian Linear & Iteratif",
        score: "50 / 100",
        duration: "95 Menit",
        status: "Peringatan",
        logDetail:
          "Durasi pengerjaan melebihi standar waktu lab (standar: 45 menit). Terjadi Runtime Timeout error sebanyak 8 kali akibat loop tak terbatas.",
        telemetry: { codeErrorCount: 8 },
      },
      {
        id: "log-budi-4",
        timestamp: "17 Sep 2026 • 10:05 WIB",
        category: "Kuis",
        title: "Kuis Evaluasi Modul: Looping & Iterasi (Percobaan 2)",
        score: "40 / 100",
        duration: "35 Menit",
        status: "Gagal",
        logDetail:
          "Gagal pada soal evaluasi kondisi while. Nilai belum memenuhi Kriteria Ketuntasan Minimal (KKM 75).",
        telemetry: { attempts: 2 },
      },
      {
        id: "log-budi-5",
        timestamp: "15 Sep 2026 • 09:30 WIB",
        category: "Modul",
        title: "Membaca Materi: Konsep Dasar Pengulangan For dan While",
        score: "-",
        duration: "20 Menit",
        status: "Berhasil",
        logDetail: "Membaca 4 halaman modul teori dan mengunduh berkas template kode materi.",
      },
    ],
    interventions: [
      {
        id: "int-budi-1",
        date: "17 Sep 2026 • 16:00 WIB",
        lecturerName: "Dr. Ir. Hendra Wijaya, M.T.",
        type: "Catatan Dosen",
        message:
          "Peringatan sistem dikirim otomatis via AI: Mahasiswa disarankan mengulang latihan dasar loop di rumah.",
        status: "Selesai",
      },
    ],
  },

  "Siti Aminah": {
    id: 103,
    name: "Siti Aminah",
    nim: "202401092",
    email: "siti.aminah@student.uns.ac.id",
    classGroup: "TI-2A (D3 Teknik Informatika SV UNS)",
    topic: "Struktur Data Array",
    mastery: 58,
    status: "Perlu Perhatian",
    riskLevel: "Sedang",
    interventionStatus: "Belum Ditangani",
    riskSummary:
      "Durasi pengerjaan praktikum Struktur Data Array melebihi rata-rata kelas 200%. Belum mencatatkan target mandiri dan ragu saat eksekusi kode.",
    averageQuizScore: 68,
    totalStudyHours: 19.2,
    aiHelpFrequency: 24,
    aiDiagnosis: {
      rootCause:
        "Mahasiswa menguasai konsep dasar teori dengan baik, namun mengalami 'analysis paralysis' dan keraguan berlebih saat mengimplementasikan array dinamis serta manipulasi indeks matriks 2 dimensi.",
      cognitiveProfile:
        "Perfeksionis dan teliti; sering merombak kode dari nol jika menemukan pesan peringatan kecil (warning), mengakibatkan durasi praktikum membengkak.",
      strugglingConcepts: [
        "Akses elemen array 2 dimensi (baris vs kolom)",
        "Alokasi memori array statis vs dinamis",
        "Pencarian nilai ekstrem (Maksimum/Minimum dalam koleksi)",
      ],
      recommendedPedagogy:
        "Demonstrasikan teknik 'incremental development': tulis kode 3 baris lalu jalankan print/debug, jangan menulis 50 baris sekaligus sebelum di-run.",
      suggestedRemedial:
        "Sesi asistensi tatap muka lab 15 menit dengan asisten lab atau dosen untuk hands-on debugging.",
    },
    activityLogs: [
      {
        id: "log-siti-1",
        timestamp: "19 Sep 2026 • 09:15 WIB",
        category: "Praktikum",
        title: "Praktikum Lab: Manipulasi Matriks 2D & Penjumlahan Vektor",
        score: "70 / 100",
        duration: "110 Menit",
        status: "Peringatan",
        logDetail:
          "Durasi pengerjaan 110 menit (rata-rata kelas: 42 menit). Program berhasil compile namun alokasi loop traversal terbalik [j][i].",
        telemetry: { attempts: 5, codeErrorCount: 4 },
      },
      {
        id: "log-siti-2",
        timestamp: "18 Sep 2026 • 15:30 WIB",
        category: "Kuis",
        title: "Kuis Active Recall: Dasar Array & Pengalamatan Memori",
        score: "68 / 100",
        duration: "25 Menit",
        status: "Berhasil",
        logDetail:
          "Lolos sebagian besar soal teori, namun keliru pada soal pointer aritmatika indeks ke-n.",
        telemetry: { attempts: 1 },
      },
      {
        id: "log-siti-3",
        timestamp: "17 Sep 2026 • 13:40 WIB",
        category: "AI Chat",
        title: "Tanya AI: Bagaimana Urutan Perulangan Baris dan Kolom",
        score: "-",
        duration: "18 Menit",
        status: "Info",
        logDetail:
          "Konsultasi perbedaan looping for baris di luar vs kolom di luar pada matriks 3x3.",
        telemetry: { aiQueriesCount: 6 },
      },
    ],
    interventions: [],
  },

  "Rita Tri Rahmawati": {
    id: 105,
    name: "Rita Tri Rahmawati",
    nim: "202401033",
    email: "rita.tri@student.uns.ac.id",
    classGroup: "TI-2A (D3 Teknik Informatika SV UNS)",
    topic: "Struktur Kondisional",
    mastery: 30,
    status: "Berisiko",
    riskLevel: "Tinggi",
    interventionStatus: "Belum Ditangani",
    riskSummary:
      "Tingkat penguasaan 30% pada Struktur Kondisional. Belum mengumpulkan penugasan kasus IF-ELSE bersarang dan alur percabangan kompleks.",
    averageQuizScore: 35,
    totalStudyHours: 8.0,
    aiHelpFrequency: 7,
    aiDiagnosis: {
      rootCause:
        "Kesenjangan logika aljabar boolean (tabel kebenaran AND, OR, NOT) yang belum mantap sehingga sering salah mengevaluasi kondisi percabangan majemuk.",
      cognitiveProfile:
        "Membutuhkan panduan visual flowchart bercabang sebelum diterjemahkan ke kode pemrograman.",
      strugglingConcepts: [
        "Evaluasi operator logika gabungan (&& vs ||)",
        "Nested if-else depth lebih dari 2 tingkat",
        "Fallthrough pada switch-case statement",
      ],
      recommendedPedagogy:
        "Gunakan pendekatan visual flowchart algoritma dan penyelesaian tabel kebenaran secara manual.",
      suggestedRemedial:
        "Tugas Latihan Terbimbing: 3 Studi Kasus Diskon Bertingkat dengan Diagram Alur.",
    },
    activityLogs: [
      {
        id: "log-rita-1",
        timestamp: "18 Sep 2026 • 11:00 WIB",
        category: "Kuis",
        title: "Kuis Evaluasi Modul: Logika Percabangan Majemuk",
        score: "30 / 100",
        duration: "20 Menit",
        status: "Gagal",
        logDetail:
          "Gagal menyelesaikan 70% soal evaluasi boolean condition. Kuis disubmit cepat sebelum waktu habis.",
        telemetry: { attempts: 2 },
      },
      {
        id: "log-rita-2",
        timestamp: "16 Sep 2026 • 14:00 WIB",
        category: "Modul",
        title: "Akses Materi Percabangan IF-ELSE & Switch",
        score: "-",
        duration: "12 Menit",
        status: "Info",
        logDetail: "Akses modul singkat tanpa menyelesaikan simulasi interaktif.",
      },
    ],
    interventions: [],
  },

  "Ucik Dika Maharani": {
    id: 101,
    name: "Ucik Dika Maharani",
    nim: "202401012",
    email: "ucik.dika@student.uns.ac.id",
    classGroup: "TI-2A (D3 Teknik Informatika SV UNS)",
    topic: "Looping & Iterasi",
    mastery: 92,
    status: "Aman",
    riskLevel: "Rendah",
    interventionStatus: "Selesai Ditinjau",
    riskSummary:
      "Performa sangat konsisten. Telah menuntaskan seluruh latihan modul dasar dan lanjut dengan nilai di atas 90.",
    averageQuizScore: 94,
    totalStudyHours: 28.5,
    aiHelpFrequency: 35,
    aiDiagnosis: {
      rootCause: "Tidak ditemukan kendala konsep. Siap untuk materi pengayaan tingkat lanjut.",
      cognitiveProfile:
        "Pemahaman algoritmik abstrak tinggi, cepat memecahkan masalah rekursi dan optimasi memori.",
      strugglingConcepts: [],
      recommendedPedagogy:
        "Berikan tantangan Competitive Programming dan penugasan proyek tingkat madya.",
      suggestedRemedial: "Pengayaan: Modul Optimasi Kompleksitas Algoritma O(log N).",
    },
    activityLogs: [
      {
        id: "log-ucik-1",
        timestamp: "19 Sep 2026 • 15:30 WIB",
        category: "Kuis",
        title: "Kuis Active Recall Komprehensif: Looping & Rekursi",
        score: "96 / 100",
        duration: "18 Menit",
        status: "Berhasil",
        logDetail: "Menyelesaikan seluruh soal dengan waktu tercepat di kelas. Sempurna.",
      },
      {
        id: "log-ucik-2",
        timestamp: "18 Sep 2026 • 10:00 WIB",
        category: "Praktikum",
        title: "Praktikum Lab: Quick Sort & Binary Search",
        score: "95 / 100",
        duration: "32 Menit",
        status: "Berhasil",
        logDetail: "Implementasi kode bersih, dokumentasi lengkap dan lolos seluruh test case.",
      },
    ],
    interventions: [],
  },

  "Zam Zam Zahrina": {
    id: 104,
    name: "Zam Zam Zahrina",
    nim: "202401015",
    email: "zamzam@student.uns.ac.id",
    classGroup: "TI-2A (D3 Teknik Informatika SV UNS)",
    topic: "Looping & Iterasi",
    mastery: 88,
    status: "Aman",
    riskLevel: "Rendah",
    interventionStatus: "Selesai Ditinjau",
    riskSummary:
      "Perkembangan belajar sangat memuaskan, konsisten mengumpulkan praktikum tepat waktu.",
    averageQuizScore: 88,
    totalStudyHours: 24.0,
    aiHelpFrequency: 20,
    aiDiagnosis: {
      rootCause: "Pemahaman materi stabil.",
      cognitiveProfile: "Konsisten dan tekun.",
      strugglingConcepts: [],
      recommendedPedagogy: "Pertahankan ritme belajar mandiri saat ini.",
      suggestedRemedial: "Tidak diperlukan remedial.",
    },
    activityLogs: [
      {
        id: "log-zam-1",
        timestamp: "19 Sep 2026 • 13:00 WIB",
        category: "Kuis",
        title: "Kuis Modul Looping",
        score: "90 / 100",
        duration: "22 Menit",
        status: "Berhasil",
        logDetail: "Memahami struktur perulangan bertingkat dengan baik.",
      },
    ],
    interventions: [],
  },
};
