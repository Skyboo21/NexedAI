// @ts-nocheck
// src/components/TaskFormClient.tsx - Client Component Boundary ("use client")
"use client";

import React, { useState } from "react";
import { CreateTaskSchema, CreateTaskInput } from "../schemas/taskSchema";

export default function TaskFormClient() {
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: "",
    courseName: "",
    priority: "MEDIUM",
    dueDate: new Date().toISOString().split("T")[0] || "2026-09-30"
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setSuccess(null);

    // Validasi skema runtime Zod
    const result = CreateTaskSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.errors[0]?.message || "Input tidak valid.");
      return;
    }

    setSuccess(`✅ [Klien Validated] Tugas "${result.data.title}" divalidasi oleh Zod & siap dikirim ke Server Action!`);
    setFormData({ title: "", courseName: "", priority: "MEDIUM", dueDate: new Date().toISOString().split("T")[0] || "2026-09-30" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <span>➕</span> Tambah Tugas Baru (Client Component Boundary)
        </h3>
        <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-md">
          "use client" Isolated Leaf
        </span>
      </div>

      {errors && <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">⚠️ {errors}</div>}
      {success && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Judul Tugas (min. 3 karakter)..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500 transition-colors"
        />
        <input
          type="text"
          placeholder="Mata Kuliah..."
          value={formData.courseName}
          onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
          className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
        >
          ➕ Simpan Tugas (Zod Validated)
        </button>
      </div>
    </form>
  );
}
