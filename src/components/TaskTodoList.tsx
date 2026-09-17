// @ts-nocheck
// src/components/TaskTodoList.tsx
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
    { id: 1, title: "Analisis Peta Belajar", category: "Review", completed: true },
    { id: 2, title: "Menyelesaikan Topik Array", category: "Materi", completed: false },
    { id: 3, title: "Mengikuti Kuis Logika", category: "Evaluasi", completed: false },
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
      { id: Date.now(), title: newTaskTitle, category: "Umum", completed: false },
    ]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border-t border-indigo-500/30 bg-indigo-950/20 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/50 rounded-xl flex items-center justify-center text-indigo-400 text-xl shadow-inner shadow-indigo-500/30">
          📝
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Catatan Harian</h2>
      </div>
      <p className="text-indigo-200/70 font-light text-xs mb-6 pb-6 border-b border-white/10 relative z-10">
        Daftar tugas pintar yang terhubung dengan algoritma NexedAI.
      </p>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-6 relative z-10">
        <input
          type="text"
          placeholder="Tugas baru..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
        >
          Add
        </button>
      </form>

      <div className="flex gap-2 mb-4 relative z-10 p-1 bg-black/30 rounded-xl inline-flex border border-white/5 mx-auto">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === f
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {f === "all" ? "Semua" : f === "active" ? "Aktif" : "Selesai"}
          </button>
        ))}
      </div>

      <ul className="space-y-3 m-0 p-0 relative z-10 overflow-y-auto flex-1 hide-scrollbar">
        {filteredTasks.length === 0 ? (
          <li className="text-center py-6 text-slate-500 text-sm">
            Tidak ada tugas dalam kategori ini.
          </li>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-3 rounded-xl border backdrop-blur-sm transition-all ${
                task.completed
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 flex-shrink-0 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                    task.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-500 bg-transparent hover:border-indigo-400"
                  }`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div className="truncate">
                  <span
                    className={`block text-sm font-bold transition-all truncate ${task.completed ? "line-through text-emerald-200/50" : "text-slate-200"}`}
                  >
                    {task.title}
                  </span>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
