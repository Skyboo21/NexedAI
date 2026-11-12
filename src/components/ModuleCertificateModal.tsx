// src/components/ModuleCertificateModal.tsx
"use client";

import React, { useRef } from "react";
import {
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
  Printer,
  Sparkles,
  X,
  ShieldCheck,
  QrCode,
  GraduationCap,
} from "lucide-react";
import type { ModuleCertificateRecord } from "../lib/progressStorage";

interface ModuleCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: ModuleCertificateRecord | null;
  moduleTitle: string;
}

export default function ModuleCertificateModal({
  isOpen,
  onClose,
  certificate,
  moduleTitle,
}: ModuleCertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Container Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden my-auto">
        {/* Top Action Bar (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-400/20 text-amber-300 rounded-lg">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold tracking-tight">E-Sertifikat Kelulusan Resmi</h3>
              <p className="text-[11px] text-slate-400">
                Terverifikasi secara kriptografis • Siap cetak atau simpan sebagai PDF A4 Landscape
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Tutup pratinjau sertifikat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-4 sm:p-8 bg-[#F8FAFC] overflow-x-auto">
          <div
            ref={printRef}
            id="nexed-certificate-printable"
            className="w-full min-w-[700px] max-w-[860px] mx-auto bg-white rounded-2xl border-[10px] border-double border-slate-800 p-8 sm:p-12 relative shadow-lg text-slate-900 select-none print:shadow-none print:border-8 print:p-8 print:max-w-none print:w-full"
          >
            {/* Watermark Background Decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <GraduationCap className="w-96 h-96 text-slate-950" />
            </div>

            {/* Corner Ornamental Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-amber-400 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest mb-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>NEXED AI • ADAPTIVE LEARNING PLATFORM</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-slate-900 uppercase">
                Sertifikat Kelulusan & Penguasaan Kompetensi
              </h1>
              <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">
                Certificate of Academic Mastery & Technical Competence
              </p>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
            </div>

            {/* Awarded Statement */}
            <div className="text-center space-y-3 mb-6">
              <p className="text-xs text-slate-600 italic">
                Dengan ini menyatakan secara resmi bahwa mahasiswa:
              </p>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-serif underline decoration-amber-500/80 decoration-2 underline-offset-4">
                  {certificate.studentName}
                </div>
                <div className="text-xs font-mono font-bold text-slate-600 bg-slate-100 inline-block px-3 py-1 rounded-full border border-slate-200">
                  NIM / Identitas: {certificate.studentNim}
                </div>
              </div>
              <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
                Telah berhasil menyelesaikan 100% simpul pembelajaran terstruktur, memvalidasi seluruh kuis video mandiri, dan mendemonstrasikan penguasaan materi komprehensif pada modul:
              </p>
              <div className="text-lg sm:text-xl font-bold text-indigo-900 bg-indigo-50/80 border border-indigo-200/80 py-2.5 px-6 rounded-2xl max-w-2xl mx-auto shadow-2xs">
                {certificate.topicTitle || moduleTitle}
              </div>
            </div>

            {/* Competency Badges Grid */}
            <div className="mb-8">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
                Simpul Kompetensi yang Dikuasai:
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {certificate.competencies.map((comp, idx) => (
                  <span
                    key={`cert-comp-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/90 rounded-full text-[11px] font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{comp}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Signatures, QR & Security Code */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-center gap-4">
              {/* Left Column: Verification Code */}
              <div className="text-left space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Kode Verifikasi Resmi</span>
                </div>
                <div className="text-xs font-mono font-black text-slate-900 tracking-wider">
                  {certificate.id}
                </div>
                <div className="text-[10px] text-slate-500">
                  Tanggal Terbit: {certificate.completionDate}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold">
                  Predikat: {certificate.grade}
                </div>
              </div>

              {/* Middle Column: Official Seal Stamp */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex flex-col items-center justify-center bg-amber-50/70 p-1 shadow-2xs rotate-[-6deg]">
                  <Award className="w-6 h-6 text-amber-600" />
                  <span className="text-[8px] font-black text-amber-800 uppercase tracking-tighter text-center">
                    VERIFIED PASS
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">Nexed AI Security Seal</span>
              </div>

              {/* Right Column: Signature Simulation */}
              <div className="text-right space-y-1">
                <div className="text-xs font-serif italic text-slate-700 font-bold">
                  Dr. Ir. Hendra Wijaya, M.T.
                </div>
                <div className="w-32 h-0.5 bg-slate-300 ml-auto" />
                <div className="text-[10px] font-bold text-slate-800 uppercase">
                  Direktur Pembelajaran Digital
                </div>
                <div className="text-[9px] text-slate-500 font-medium">
                  NEXED AI Intelligent Tutoring System
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Helper Notice (Hidden in Print) */}
        <div className="print:hidden px-6 py-4 bg-slate-50 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Selamat! +250 XP telah ditambahkan ke akun Anda beserta lencana{" "}
              <strong className="text-black">Mastery Achiever</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-full font-semibold transition-colors cursor-pointer text-xs"
          >
            Tutup Jendela
          </button>
        </div>
      </div>

      {/* Embedded Print Styling */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #nexed-certificate-printable,
          #nexed-certificate-printable * {
            visibility: visible;
          }
          #nexed-certificate-printable {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            padding: 32px !important;
            box-shadow: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}

