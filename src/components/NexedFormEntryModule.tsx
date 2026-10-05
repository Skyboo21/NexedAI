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
    <div className="bg-white rounded-3xl border border-black/8 p-6 shadow-xs hover:border-black/20 transition-all duration-300 flex flex-col h-full">
      <div className="mb-5">
        <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-0.5 rounded-full inline-block mb-1.5">
          Rencana Mandiri
        </span>
        <h3 className="text-base font-light text-black tracking-tight">
          Target Belajar & Praktikum Tambahan
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Rencanakan target studi mandiri untuk pendalaman modul dan persiapan responsi praktikum.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Title Input */}
          <div>
            <label
              htmlFor="task-title-input"
              className="block text-neutral-500 font-mono text-xs uppercase tracking-wider mb-1"
            >
              Nama Topik / Capaian <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Contoh: Pemahaman Struktur Data Tree"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-black text-xs placeholder:text-neutral-400 focus:outline-none transition-colors ${
                errors.title
                  ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-black/10 focus:border-black focus:ring-1 focus:ring-black"
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
                className="block text-neutral-500 font-mono text-xs uppercase tracking-wider mb-1"
              >
                Kategori
              </label>
              <select
                id="task-category-select"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/10 text-neutral-800 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="Materi">Teori / Materi</option>
                <option value="Praktikum">Praktikum Lab</option>
                <option value="Kuis">Evaluasi Kuis</option>
                <option value="Proyek">Mini Proyek</option>
              </select>
            </div>

            {/* Complexity Select */}
            <div>
              <label
                htmlFor="task-complexity-select"
                className="block text-neutral-500 font-mono text-xs uppercase tracking-wider mb-1"
              >
                Tingkat Kesulitan
              </label>
              <select
                id="task-complexity-select"
                value={formData.complexity}
                onChange={(e) => handleInputChange("complexity", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/10 text-neutral-800 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="Beginner">Tingkat Dasar</option>
                <option value="Intermediate">Tingkat Menengah</option>
                <option value="Advanced">Tingkat Lanjut</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-black/5">
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>+</span>
            <span>Tambah Target Belajar</span>
          </button>

          {successMessage && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5">
              <span>✓</span> {successMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
