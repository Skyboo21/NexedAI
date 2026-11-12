// src/views/DosenDashboard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Layers,
  RefreshCw,
  Search,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react";
import NexedStudentLogModal from "../components/NexedStudentLogModal";
import { useAuthStore } from "../store/authStore";

interface StudentProgressRow {
  id: string;
  name: string;
  nim: string;
  currentStageNumber: number;
  currentStageTitle: string;
  progressPercent: number;
  lastQuizScore: number;
  status: "Tuntas" | "Sedang Belajar" | "Tertinggal";
  lastActive: string;
}

const INITIAL_STUDENTS: StudentProgressRow[] = [
  {
    id: "mhs-1",
    name: "Muhammad Hariz Lazuardi",
    nim: "V3925010",
    currentStageNumber: 4,
    currentStageTitle: "Tahap 4: Kuis Active Recall & Evaluasi",
    progressPercent: 100,
    lastQuizScore: 100,
    status: "Tuntas",
    lastActive: "1 menit lalu",
  },
  {
    id: "mhs-2",
    name: "Ahmad Rizky Pratama",
    nim: "V3925001",
    currentStageNumber: 3,
    currentStageTitle: "Tahap 3: Praktik & Pendampingan AI",
    progressPercent: 75,
    lastQuizScore: 88,
    status: "Sedang Belajar",
    lastActive: "3 menit lalu",
  },
  {
    id: "mhs-3",
    name: "Budi Santoso",
    nim: "202401048",
    currentStageNumber: 1,
    currentStageTitle: "Tahap 1: Fondasi Konseptual",
    progressPercent: 25,
    lastQuizScore: 35,
    status: "Tertinggal",
    lastActive: "2 hari lalu",
  },
  {
    id: "mhs-4",
    name: "Siti Aminah",
    nim: "202401092",
    currentStageNumber: 2,
    currentStageTitle: "Tahap 2: Komponen & Logika Peta Belajar",
    progressPercent: 50,
    lastQuizScore: 60,
    status: "Tertinggal",
    lastActive: "1 hari lalu",
  },
  {
    id: "mhs-5",
    name: "Dewi Anggraini",
    nim: "V3925015",
    currentStageNumber: 4,
    currentStageTitle: "Tahap 4: Kuis Active Recall & Evaluasi",
    progressPercent: 100,
    lastQuizScore: 95,
    status: "Tuntas",
    lastActive: "5 menit lalu",
  },
  {
    id: "mhs-6",
    name: "Fajar Nugraha",
    nim: "V3925022",
    currentStageNumber: 3,
    currentStageTitle: "Tahap 3: Praktik & Pendampingan AI",
    progressPercent: 75,
    lastQuizScore: 82,
    status: "Sedang Belajar",
    lastActive: "12 menit lalu",
  },
  {
    id: "mhs-7",
    name: "Rina Kusuma",
    nim: "V3925031",
    currentStageNumber: 4,
    currentStageTitle: "Tahap 4: Kuis Active Recall & Evaluasi",
    progressPercent: 100,
    lastQuizScore: 92,
    status: "Tuntas",
    lastActive: "15 menit lalu",
  },
  {
    id: "mhs-8",
    name: "Hendra Saputra",
    nim: "V3925044",
    currentStageNumber: 2,
    currentStageTitle: "Tahap 2: Komponen & Logika Peta Belajar",
    progressPercent: 50,
    lastQuizScore: 78,
    status: "Sedang Belajar",
    lastActive: "25 menit lalu",
  },
];

export default function DosenDashboard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Tuntas" | "Sedang Belajar" | "Tertinggal">("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Live Auto-Refresh State (15 Seconds Telemetry Interval)
  const [secondsUntilSync, setSecondsUntilSync] = useState<number>(15);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Baru saja");

  // Log Modal State
  const [selectedStudentForLog, setSelectedStudentForLog] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [studentStatuses, setStudentStatuses] = useState<
    Record<string, "Belum Ditangani" | "Dalam Penanganan" | "Selesai Ditinjau">
  >({
    "Budi Santoso": "Belum Ditangani",
    "Siti Aminah": "Belum Ditangani",
  });

  const handleOpenLog = (studentName: string) => {
    setSelectedStudentForLog(studentName);
    setIsLogModalOpen(true);
  };

  const handleCloseLog = () => {
    setIsLogModalOpen(false);
  };

  const handleStatusChange = (
    studentName: string,
    newStatus: "Belum Ditangani" | "Dalam Penanganan" | "Selesai Ditinjau",
  ) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentName]: newStatus,
    }));
  };

  // 15-second auto-refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilSync((prev) => {
        if (prev <= 1) {
          // Trigger instant refresh
          setIsRefreshing(true);
          setTimeout(() => {
            setIsRefreshing(false);
            setLastSyncedTime(new Date().toLocaleTimeString("id-ID"));
          }, 600);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setSecondsUntilSync(15);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncedTime(new Date().toLocaleTimeString("id-ID"));
    }, 600);
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ["Nama Mahasiswa", "NIM", "Simpul Mindmap", "Progres (%)", "Status", "Skor Kuis", "Aktivitas Terakhir"];
    const rows = INITIAL_STUDENTS.map((s) => [
      `"${s.name}"`,
      `"${s.nim}"`,
      `"${s.currentStageTitle}"`,
      s.progressPercent,
      `"${s.status}"`,
      s.lastQuizScore,
      `"${s.lastActive}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Analitik_Mahasiswa_NEXED_AI_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setMounted(true);
    if (user?.role && user.role !== "dosen") {
      if (user.role === "mahasiswa") {
        router.push("/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin-dashboard");
      }
    }
  }, [user, router]);

  const activeUser = (mounted ? user : null) ?? {
    email: "dosen@nexed.ai",
    role: "dosen" as const,
    name: "Dr. Ir. Hendra Wijaya, M.T.",
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return INITIAL_STUDENTS.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.currentStageTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "Semua" || item.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="bg-[#070B14] text-slate-100 min-h-screen flex flex-col font-['Inter',sans-serif] antialiased">
      {/* Top Header Navbar - Dark Slate Telemetry */}
      <header className="bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-20 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <span>Portal Pengajar & Pembimbing</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">Algoritma & Pemrograman (Kelas TI-A)</span>
            </div>
            <h1
              suppressHydrationWarning
              className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5"
            >
              <span>Live Report Analitik: {activeUser.name || activeUser.email.split("@")[0]}</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            {/* Live Monitoring Badge with Pulsing Ping */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>● LIVE MONITORING</span>
              <span className="text-slate-400 font-normal">({secondsUntilSync}s)</span>
            </div>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
              title="Segarkan data seketika"
              aria-label="Segarkan data seketika"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md hover:shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Laporan CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 w-full">
        {/* Quick Metric Cards - Dark Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-3xl shadow-lg hover:border-slate-700 transition-all duration-300">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">
                Total Mahasiswa
              </span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">42 Siswa</div>
            <p className="text-xs text-slate-400 mt-1.5 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>100% Terdaftar di Sistem</span>
            </p>
          </div>

          <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-3xl shadow-lg hover:border-slate-700 transition-all duration-300">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">
                Rata-rata Skor Kelas
              </span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">84.6%</div>
            <p className="text-xs text-emerald-400 mt-1.5 font-medium">Target Penguasaan: &gt;75% (Tercapai)</p>
          </div>

          <div className="p-6 bg-[#0F172A] border border-rose-900/40 rounded-3xl shadow-lg hover:border-rose-700/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-center mb-1">
              <span className="text-rose-300 font-medium text-xs uppercase tracking-wider">
                Perlu Intervensi Remedial
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold text-rose-400 tracking-tight">2 Mahasiswa</div>
            <p className="text-xs text-rose-300/80 mt-1.5 font-medium">Peringatan Dini Sistem (At-Risk)</p>
          </div>

          <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-3xl shadow-lg hover:border-slate-700 transition-all duration-300">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">
                Tingkat Ketuntasan
              </span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">78.5%</div>
            <p className="text-xs text-indigo-300 mt-1.5 font-medium">Kategori: Sangat Baik</p>
          </div>
        </div>

        {/* Section 1: Alert Mahasiswa Berisiko (Early Warning) */}
        <section id="alerts" aria-labelledby="alert-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              id="alert-heading"
              className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 tracking-tight"
            >
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Peringatan Dini Mahasiswa Berisiko (Early Warning Telemetry)</span>
            </h2>
            <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              2 Peringatan Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 bg-[#0F172A] border border-rose-500/30 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-base text-white">Budi Santoso</h3>
                  <span className="text-xs text-slate-400 font-mono">NIM: 202401048</span>
                </div>
                {studentStatuses["Budi Santoso"] === "Selesai Ditinjau" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Selesai Ditinjau
                  </span>
                ) : studentStatuses["Budi Santoso"] === "Dalam Penanganan" ? (
                  <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                    Dalam Bimbingan
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 rounded-full">
                    Risiko Tinggi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Gagal menyelesaikan Kuis Checkpoint Tahap 1 sebanyak 3 kali berturut-turut. Skor kuis terakhir: 35/100.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">
                  Rekomendasi: Berikan asistensi analogi modular Tahap 1
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenLog("Budi Santoso")}
                  className="font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
                >
                  <span>Tinjau Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#0F172A] border border-amber-500/30 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-base text-white">Siti Aminah</h3>
                  <span className="text-xs text-slate-400 font-mono">NIM: 202401092</span>
                </div>
                {studentStatuses["Siti Aminah"] === "Selesai Ditinjau" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Selesai Ditinjau
                  </span>
                ) : studentStatuses["Siti Aminah"] === "Dalam Penanganan" ? (
                  <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                    Dalam Bimbingan
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                    Perlu Atensi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Durasi pengerjaan praktikum Tahap 2 melebihi rata-rata kelas 200%. Belum mencatatkan target mandiri.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">
                  Rekomendasi: Jadwalkan asistensi tatap muka lab
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenLog("Siti Aminah")}
                  className="font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
                >
                  <span>Tinjau Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: LIVE REPORT TABEL PROGRES MAHASISWA PER SIMPUL MINDMAP */}
        <section aria-labelledby="live-table-heading" className="space-y-4">
          <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-block text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Real-Time Telemetry Table
                </span>
                <h2 id="live-table-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Tabel Progres Mahasiswa per Simpul Mindmap
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Menampilkan posisi simpul mindmap terkini, persentase penguasaan, dan skor kuis video mahasiswa.
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
                Sinkronisasi Terakhir: <strong className="text-white">{lastSyncedTime}</strong>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {(["Semua", "Tuntas", "Sedang Belajar", "Tertinggal"] as const).map((tab) => {
                  const count = INITIAL_STUDENTS.filter(
                    (s) => tab === "Semua" || s.status === tab,
                  ).length;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        statusFilter === tab
                          ? "bg-cyan-500 text-slate-950 shadow-md font-extrabold"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      <span>{tab}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, NIM, atau simpul..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            {/* Live Data Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <th className="py-3.5 px-4 font-bold">Mahasiswa</th>
                    <th className="py-3.5 px-4 font-bold">Simpul Mindmap Saat Ini</th>
                    <th className="py-3.5 px-4 font-bold">Progres Modul</th>
                    <th className="py-3.5 px-4 font-bold">Skor Kuis Video</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold">Aktivitas Terakhir</th>
                    <th className="py-3.5 px-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Tidak ada mahasiswa yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-900/60 transition-colors"
                      >
                        {/* Student Name & NIM */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{student.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">NIM: {student.nim}</div>
                        </td>

                        {/* Current Mindmap Node */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                              {student.currentStageNumber}
                            </span>
                            <span className="font-medium text-slate-200 line-clamp-1">
                              {student.currentStageTitle}
                            </span>
                          </div>
                        </td>

                        {/* Progress Bar */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 w-32">
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>{student.progressPercent}%</span>
                              <span>Tahap {student.currentStageNumber}/4</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  student.progressPercent === 100
                                    ? "bg-emerald-400"
                                    : student.progressPercent < 40
                                      ? "bg-rose-500"
                                      : "bg-cyan-400"
                                }`}
                                style={{ width: `${student.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Last Quiz Score */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-md ${
                              student.lastQuizScore >= 85
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : student.lastQuizScore >= 60
                                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            }`}
                          >
                            {student.lastQuizScore}/100
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {student.status === "Tuntas" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Tuntas</span>
                            </span>
                          ) : student.status === "Sedang Belajar" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              <Zap className="w-3 h-3" />
                              <span>Sedang Belajar</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Tertinggal (At-Risk)</span>
                            </span>
                          )}
                        </td>

                        {/* Last Active */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{student.lastActive}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenLog(student.name)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                          >
                            Tinjau Log
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Tinjau Log Aktivitas & Intervensi Dosen */}
      <NexedStudentLogModal
        isOpen={isLogModalOpen}
        studentName={selectedStudentForLog}
        onClose={handleCloseLog}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
