// src/components/NexedFormEntryModule.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { z } from "zod";

const FormTaskSchema = z.object({
  title: z.string().min(3, "Judul target minimal 3 karakter").max(80, "Judul maksimal 80 karakter"),
  category: z.enum(["Materi", "Praktikum", "Kuis", "Proyek"]),
  complexity: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export type FormTaskInput = z.infer<typeof FormTaskSchema>;

export interface CreatedStudentTarget extends FormTaskInput {
  id: string;
  status: "In Progress" | "Completed";
  createdAt: string;
}

interface NexedFormEntryProps {
  onTaskCreated?: (newTask: CreatedStudentTarget) => void;
}

export default function NexedFormEntryModule({ onTaskCreated }: NexedFormEntryProps) {
  const [formData, setFormData] = useState<FormTaskInput>({
    title: "",
    category: "Materi",
    complexity: "Beginner",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormTaskInput, string>>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field: keyof FormTaskInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setSuccessMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationResult = FormTaskSchema.safeParse(formData);

    if (!validationResult.success) {
      const formattedErrors: Partial<Record<keyof FormTaskInput, string>> = {};
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof FormTaskInput;
        if (fieldName) {
          formattedErrors[fieldName] = issue.message;
        }
      }
      setErrors(formattedErrors);
      return;
    }

    const validData = validationResult.data;
    const newTask: CreatedStudentTarget = {
      id: Date.now().toString(),
      ...validData,
      status: "In Progress",
      createdAt: new Date().toISOString(),
    };

    setSuccessMessage(`Target "${validData.title}" berhasil ditambahkan!`);
    if (onTaskCreated) onTaskCreated(newTask);

    // Reset Form
    setFormData({ title: "", category: "Materi", complexity: "Beginner" });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="mb-5">
        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full mb-1.5">
          Target Planner
        </span>
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Input Target Belajar Mandiri
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Rencanakan target studi Anda dengan validasi kriteria terstruktur.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Title Input */}
          <div>
            <label
              htmlFor="task-title-input"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Nama Topik / Capaian <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Contoh: Pemahaman Struktur Data Tree"
              className={`w-full px-3.5 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                errors.title
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
            />
            {errors.title && (
              <p className="text-rose-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category Select */}
            <div>
              <label
                htmlFor="task-category-select"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Kategori
              </label>
              <select
                id="task-category-select"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
              >
                <option value="Materi">📚 Teori / Materi</option>
                <option value="Praktikum">💻 Praktikum</option>
                <option value="Kuis">📝 Evaluasi Kuis</option>
                <option value="Proyek">🚀 Mini Proyek</option>
              </select>
            </div>

            {/* Complexity Select */}
            <div>
              <label
                htmlFor="task-complexity-select"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Tingkat Kesulitan
              </label>
              <select
                id="task-complexity-select"
                value={formData.complexity}
                onChange={(e) => handleInputChange("complexity", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
              >
                <option value="Beginner">🌱 Dasar</option>
                <option value="Intermediate">🌟 Menengah</option>
                <option value="Advanced">🔥 Lanjut</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>+</span>
            <span>Tambah Target Belajar</span>
          </button>

          {successMessage && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5">
              <span>✅</span> {successMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
