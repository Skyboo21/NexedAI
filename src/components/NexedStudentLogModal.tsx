// src/components/NexedStudentLogModal.tsx
"use client";

import { useMemo, useState } from "react";
import {
  initialStudentLogs,
  type StudentInterventionRecord,
  type StudentLogDetail,
} from "../lib/studentLogData";

interface NexedStudentLogModalProps {
  studentName: string | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (
    studentName: string,
    newStatus: "Belum Ditangani" | "Dalam Penanganan" | "Selesai Ditinjau",
  ) => void;
}

export default function NexedStudentLogModal({
  studentName,
  isOpen,
  onClose,
  onStatusChange,
}: NexedStudentLogModalProps) {
  const [activeTab, setActiveTab] = useState<"logs" | "diagnosis" | "intervention">("logs");
  const [categoryFilter, setCategoryFilter] = useState<string>("Semua");
  const [interventionsMap, setInterventionsMap] = useState<
    Record<string, StudentInterventionRecord[]>
  >({});
  const [statusMap, setStatusMap] = useState<
    Record<string, "Belum Ditangani" | "Dalam Penanganan" | "Selesai Ditinjau">
  >({});

  // Form Intervensi Dosen State
  const [interventionType, setInterventionType] = useState<
    "Catatan Dosen" | "Penugasan Remedial" | "Jadwal Asistensi Lab"
  >("Penugasan Remedial");
  const [interventionMessage, setInterventionMessage] = useState<string>("");
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Retrieve current student profile
  const studentData: StudentLogDetail | undefined = useMemo(() => {
    if (!studentName) return undefined;
    const baseData = initialStudentLogs[studentName];
    if (!baseData) {
      // Fallback for names in table not in initial list
      return {
        id: 999,
        name: studentName,
        nim: "202401099",
        email: `${studentName.toLowerCase().replace(/\s+/g, ".")}@student.uns.ac.id`,
        classGroup: "TI-2A (D3 Teknik Informatika SV UNS)",
        topic: "Algoritma & Struktur Data",
        mastery: 65,
        status: "Perlu Perhatian",
        riskLevel: "Sedang",
        interventionStatus: statusMap[studentName] || "Belum Ditangani",
        riskSummary: "Monitoring aktivitas belajar dan evaluasi berkala oleh sistem AI.",
        averageQuizScore: 65,
        totalStudyHours: 12.0,
        aiHelpFrequency: 10,
        aiDiagnosis: {
          rootCause: "Perlu penguatan pada konsep pemrograman dasar dan latihan terstruktur.",
          cognitiveProfile: "Pembelajar reguler, aktif bertanya saat praktikum lab.",
          strugglingConcepts: ["Dasar Algoritma", "Logika Sintaks"],
          recommendedPedagogy: "Beri latihan bertahap dengan feedback otomatis.",
          suggestedRemedial: "Latihan mandiri 3 studi kasus.",
        },
        activityLogs: [
          {
            id: `log-fallback-1`,
            timestamp: "19 Sep 2026 • 10:00 WIB",
            category: "Kuis",
            title: "Kuis Active Recall Mandiri",
            score: "65 / 100",
            duration: "25 Menit",
            status: "Berhasil",
            logDetail: "Menyelesaikan evaluasi materi secara mandiri.",
          },
        ],
        interventions: interventionsMap[studentName] || [],
      };
    }

    const currentInterventions = interventionsMap[studentName] || baseData.interventions;
    const currentStatus = statusMap[studentName] || baseData.interventionStatus;

    return {
      ...baseData,
      interventionStatus: currentStatus,
      interventions: currentInterventions,
    };
  }, [studentName, statusMap, interventionsMap]);

  if (!isOpen || !studentData) return null;

  const handleStatusUpdate = (
    newStatus: "Belum Ditangani" | "Dalam Penanganan" | "Selesai Ditinjau",
  ) => {
    setStatusMap((prev) => ({ ...prev, [studentData.name]: newStatus }));
    if (onStatusChange) {
      onStatusChange(studentData.name, newStatus);
    }
    setToastNotification(`Status mahasiswa berhasil diubah ke: ${newStatus}`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  const handleSendIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interventionMessage.trim()) return;

    const newRecord: StudentInterventionRecord = {
      id: `int-${Date.now()}`,
      date: "19 Sep 2026 • Baru Saja",
      lecturerName: "Dr. Ir. Hendra Wijaya, M.T.",
      type: interventionType,
      message: interventionMessage.trim(),
      status: "Terkirim",
    };

    setInterventionsMap((prev) => ({
      ...prev,
      [studentData.name]: [newRecord, ...(prev[studentData.name] || studentData.interventions)],
    }));

    // Auto update status to "Dalam Penanganan"
    if (studentData.interventionStatus === "Belum Ditangani") {
      handleStatusUpdate("Dalam Penanganan");
    }

    setInterventionMessage("");
    setToastNotification("Pesan intervensi berhasil dikirim ke portal mahasiswa!");
    setTimeout(() => setToastNotification(null), 3500);
  };

  const applyPresetMessage = (
    msg: string,
    type: "Catatan Dosen" | "Penugasan Remedial" | "Jadwal Asistensi Lab",
  ) => {
    setInterventionType(type);
    setInterventionMessage(msg);
  };

  const filteredLogs = studentData.activityLogs.filter((log) => {
    if (categoryFilter === "Semua") return true;
    return log.category === categoryFilter;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-log-title"
    >
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto text-slate-900 font-['Outfit']">
        {/* Toast Alert */}
        {toastNotification && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 flex items-center justify-between transition-all animate-in slide-in-from-top duration-300">
            <span className="flex items-center gap-2">
              <span>✅</span>
              <span>{toastNotification}</span>
            </span>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {studentData.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="student-log-title"
                  className="text-xl font-extrabold text-slate-900 tracking-tight"
                >
                  {studentData.name}
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-slate-200/80 text-slate-700 font-bold">
                  NIM: {studentData.nim}
                </span>
                {studentData.riskLevel === "Tinggi" ? (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    ⚠️ Risiko Tinggi
                  </span>
                ) : studentData.riskLevel === "Sedang" ? (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    ⚡ Perlu Atensi
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    ● Performa Aman
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {studentData.classGroup} &bull; Topik:{" "}
                <strong className="text-indigo-600 font-semibold">{studentData.topic}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Status Penanganan Dropdown/Picker */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">
                Status:
              </span>
              {(["Belum Ditangani", "Dalam Penanganan", "Selesai Ditinjau"] as const).map((st) => {
                const isActive = studentData.interventionStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusUpdate(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? st === "Selesai Ditinjau"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : st === "Dalam Penanganan"
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-rose-600 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-white">
          <div className="p-4 border-r border-b sm:border-b-0 border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Tingkat Penguasaan
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{studentData.mastery}%</span>
              <span
                className={`text-xs font-semibold ${
                  studentData.mastery >= 75 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {studentData.mastery >= 75 ? "Tuntas KKM" : "Di Bawah KKM"}
              </span>
            </div>
          </div>

          <div className="p-4 border-r border-b sm:border-b-0 border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Rata-rata Kuis
            </span>
            <div className="text-xl font-black text-indigo-600">
              {studentData.averageQuizScore} / 100
            </div>
          </div>

          <div className="p-4 border-r border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Waktu Belajar
            </span>
            <div className="text-xl font-black text-slate-900">
              {studentData.totalStudyHours} Jam
            </div>
          </div>

          <div className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Interaksi AI Tutor
            </span>
            <div className="text-xl font-black text-slate-900">
              {studentData.aiHelpFrequency} Sesi Tanya
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "logs"
                ? "border-indigo-600 text-indigo-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>📜</span>
            <span>Audit Trail & Log Aktivitas ({filteredLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("diagnosis")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "diagnosis"
                ? "border-indigo-600 text-indigo-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>🧠</span>
            <span>Diagnostik AI & Hambatan Konsep</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("intervention")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "intervention"
                ? "border-indigo-600 text-indigo-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>✍️</span>
            <span>Tindakan Intervensi Dosen ({studentData.interventions.length})</span>
          </button>
        </div>

        {/* Modal Body Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: AUDIT TRAIL LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Kronologi Interaksi Mahasiswa dengan Sistem Nexed
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rekaman log telemetri kuis, durasi praktikum lab, dan riwayat pertanyaan AI.
                  </p>
                </div>

                {/* Filter Kategori */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  {(["Semua", "Kuis", "Praktikum", "AI Chat", "Modul"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        categoryFilter === cat
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-2xl block mb-1">🔍</span>
                  <span className="text-xs font-bold text-slate-600">
                    Tidak ada log untuk kategori terpilih.
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log) => {
                    let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                    let statusIndicator = "bg-slate-400";
                    if (log.status === "Gagal") {
                      badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                      statusIndicator = "bg-rose-500";
                    } else if (log.status === "Peringatan") {
                      badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                      statusIndicator = "bg-amber-500";
                    } else if (log.status === "Berhasil") {
                      badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                      statusIndicator = "bg-emerald-500";
                    } else if (log.status === "Info") {
                      badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
                      statusIndicator = "bg-indigo-500";
                    }

                    return (
                      <div
                        key={log.id}
                        className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-indigo-200 transition-all flex flex-col sm:flex-row items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${statusIndicator}`}
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-xs text-slate-900">
                                {log.title}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                              >
                                {log.category} • {log.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {log.logDetail}
                            </p>

                            {/* Telemetri Info */}
                            {log.telemetry && (
                              <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-500">
                                {log.telemetry.attempts && (
                                  <span>Percobaan: {log.telemetry.attempts}x</span>
                                )}
                                {log.telemetry.codeErrorCount && (
                                  <span className="text-rose-600 font-semibold">
                                    Error Kompilasi: {log.telemetry.codeErrorCount}x
                                  </span>
                                )}
                                {log.telemetry.aiQueriesCount && (
                                  <span className="text-indigo-600 font-semibold">
                                    Pertanyaan AI: {log.telemetry.aiQueriesCount}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0 sm:self-center">
                          {log.score !== "-" && (
                            <div className="text-xs font-black text-slate-900">
                              Skor: <span className="text-indigo-600">{log.score}</span>
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 font-medium">
                            ⏱️ {log.duration}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{log.timestamp}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI DIAGNOSTICS */}
          {activeTab === "diagnosis" && (
            <div className="space-y-5">
              {/* Root Cause Card */}
              <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider mb-2">
                  <span>🚨</span>
                  <span>Akar Masalah Utama (Root Cause Analysis)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {studentData.aiDiagnosis.rootCause}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profil Kognitif */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-2">
                    🎯 Profil Gaya Belajar
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {studentData.aiDiagnosis.cognitiveProfile}
                  </p>
                </div>

                {/* Rekomendasi Pedagogis */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-2">
                    💡 Strategi Bimbingan Dosen
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {studentData.aiDiagnosis.recommendedPedagogy}
                  </p>
                </div>
              </div>

              {/* Konsep yang Masih Jadi Kendala */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  ⚠️ Konsep Kritis yang Belum Dikuasai
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {studentData.aiDiagnosis.strugglingConcepts.map((c) => (
                    <div
                      key={c}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"
                    >
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usulan Remedial */}
              <div className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                    📦 Usulan Materi & Remedial Adaptif
                  </span>
                  <p className="text-xs text-slate-800 font-medium">
                    {studentData.aiDiagnosis.suggestedRemedial}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("intervention");
                    applyPresetMessage(
                      `Tugas Remedial Resmi: ${studentData.aiDiagnosis.suggestedRemedial}. Harap kumpulkan sebelum perkuliahan pekan depan.`,
                      "Penugasan Remedial",
                    );
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  Gunakan untuk Intervensi &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LECTURER INTERVENTION */}
          {activeTab === "intervention" && (
            <div className="space-y-6">
              {/* Form Kirim Intervensi */}
              <form
                onSubmit={handleSendIntervention}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Kirim Arahan Bimbingan & Tindakan Remedial
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Otomatis dikirimkan ke Dashboard {studentData.name}
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Template Tindakan Cepat Dosen:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        applyPresetMessage(
                          `Halo ${studentData.name}, silakan pelajari kembali materi tracing table pada modul Looping. Fokus pada pemahaman kondisi while sebelum kuis remedial dibuka.`,
                          "Penugasan Remedial",
                        )
                      }
                      className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    >
                      📘 Modul Tracing Table
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        applyPresetMessage(
                          `Jadwal Asistensi Lab: Silakan hadir di Lab Komputer 2 (Gedung D3 TI SV UNS) hari Kamis, pukul 13:30 WIB untuk pendampingan step-by-step debugging.`,
                          "Jadwal Asistensi Lab",
                        )
                      }
                      className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    >
                      📅 Jadwal Konsultasi Lab SV UNS
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        applyPresetMessage(
                          `Pertahankan motivasi belajarmu. Coba gunakan fitur analogi di chatbot Nexed AI untuk memahami konsep nested loop yang masih membingungkan.`,
                          "Catatan Dosen",
                        )
                      }
                      className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    >
                      💬 Catatan Motivasi Dosen
                    </button>
                  </div>
                </div>

                {/* Jenis Tindakan & Textarea */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="intervention-type-select"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1"
                    >
                      Tipe Intervensi
                    </label>
                    <select
                      id="intervention-type-select"
                      value={interventionType}
                      onChange={(e) =>
                        setInterventionType(
                          e.target.value as
                            | "Catatan Dosen"
                            | "Penugasan Remedial"
                            | "Jadwal Asistensi Lab",
                        )
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-semibold"
                    >
                      <option value="Penugasan Remedial">Penugasan Remedial</option>
                      <option value="Jadwal Asistensi Lab">Jadwal Asistensi Lab</option>
                      <option value="Catatan Dosen">Catatan Bimbingan Dosen</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="intervention-message-input"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1"
                    >
                      Pesan atau Instruksi Intervensi
                    </label>
                    <textarea
                      id="intervention-message-input"
                      rows={3}
                      value={interventionMessage}
                      onChange={(e) => setInterventionMessage(e.target.value)}
                      placeholder="Tuliskan catatan, tautan modul, atau instruksi tatap muka..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={!interventionMessage.trim()}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                      interventionMessage.trim()
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                        : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <span>🚀</span>
                    <span>Kirim Intervensi ke {studentData.name}</span>
                  </button>
                </div>
              </form>

              {/* Riwayat Intervensi Sebelumnya */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span>📜</span>
                  <span>Riwayat Intervensi & Bimbingan Tercatat</span>
                </h4>

                {studentData.interventions.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500">
                      Belum ada catatan intervensi untuk mahasiswa ini.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {studentData.interventions.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg">
                              {inv.type}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              oleh {inv.lecturerName}
                            </span>
                            <span className="text-[11px] text-slate-400">&bull; {inv.date}</span>
                          </div>
                          <p className="text-xs text-slate-700 pt-1 leading-relaxed">
                            {inv.message}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center shrink-0">
                          ✓ {inv.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <span>🖨️</span>
              <span>Cetak / Ekspor Log Transkrip</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStatusUpdate("Selesai Ditinjau")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              ✓ Tandai Selesai Ditinjau
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
