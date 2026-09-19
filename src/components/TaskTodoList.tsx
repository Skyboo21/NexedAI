// src/components/TaskTodoList.tsx
"use client";

import type React from "react";
import { useState } from "react";

export interface TaskItem {
  id: number;
  title: string;
  category: string;
  completed: boolean;
}

export default function TaskTodoList() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, title: "Review Konsep Algoritma & Peta Belajar", category: "Review", completed: true },
    { id: 2, title: "Latihan Soal Looping & Percabangan", category: "Materi", completed: false },
    {
      id: 3,
      title: "Kerjakan Kuis Evaluasi Mandiri Bab 3",
      category: "Evaluasi",
      completed: false,
    },
  ]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), title: newTaskTitle.trim(), category: "Umum", completed: false },
    ]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full mb-1">
            Checklist Harian
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Daftar Aktivitas Belajar
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
          {tasks.filter((t) => t.completed).length} / {tasks.length} Selesai
        </span>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tulis rencana aktivitas baru..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0"
        >
          Tambah
        </button>
      </form>

      <div
        className="flex gap-1.5 mb-4 p-1 bg-slate-100/80 rounded-xl border border-slate-200 self-start"
        role="tablist"
      >
        {(["all", "active", "completed"] as const).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f === "all" ? "Semua" : f === "active" ? "Aktif" : "Selesai"}
            </button>
          );
        })}
      </div>

      <ul
        className="space-y-2.5 flex-1 overflow-y-auto max-h-72 pr-1"
        aria-label="Daftar aktivitas"
      >
        {filteredTasks.length === 0 ? (
          <li className="text-center py-6 text-slate-400 text-xs">
            Belum ada aktivitas pada kategori ini.
          </li>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                task.completed
                  ? "bg-slate-50/70 border-slate-200/60 opacity-80"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    task.completed
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-slate-300 bg-white hover:border-indigo-500"
                  }`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Completed</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`text-xs truncate ${
                    task.completed ? "line-through text-slate-400" : "text-slate-800 font-medium"
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Hapus tugas ${task.title}`}
                className="text-slate-400 hover:text-rose-600 text-xs p-1 rounded transition-colors shrink-0"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
