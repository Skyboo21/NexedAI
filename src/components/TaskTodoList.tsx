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
    <div className="bg-white rounded-3xl border border-black/8 p-6 shadow-xs hover:border-black/20 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-0.5 rounded-full inline-block mb-1.5">
            Checklist Mandiri
          </span>
          <h3 className="text-base font-light text-black tracking-tight">
            Daftar Aktivitas Belajar
          </h3>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#F4F4F6] text-neutral-700 border border-black/10">
          {tasks.filter((t) => t.completed).length} / {tasks.length} Selesai
        </span>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tulis rencana aktivitas baru..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-black text-xs placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded-full transition-all shadow-xs shrink-0 cursor-pointer"
        >
          Tambah
        </button>
      </form>

      <div
        className="flex gap-1.5 mb-4 p-1 bg-[#F4F4F6] rounded-full border border-black/10 self-start"
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
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
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
          <li className="text-center py-6 text-neutral-400 text-xs">
            Belum ada aktivitas pada kategori ini.
          </li>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                task.completed
                  ? "bg-[#FAFAFA] border-black/5 opacity-70"
                  : "bg-white border-black/8 hover:border-black/20"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    task.completed
                      ? "bg-black border-black text-white"
                      : "border-black/20 bg-white hover:border-black"
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
                    task.completed ? "line-through text-neutral-400" : "text-black font-normal"
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Hapus tugas ${task.title}`}
                className="text-neutral-400 hover:text-rose-600 text-xs p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
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
