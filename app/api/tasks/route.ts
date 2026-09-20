import { NextResponse } from "next/server";
import { z } from "zod";

const TaskInputSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  courseName: z.string().optional().default("Algoritma & Pemrograman"),
  category: z.enum(["Modul", "Kuis", "Praktikum", "Review"]).optional().default("Modul"),
  priority: z.string().default("Sedang"),
  dueDate: z.string().optional(),
  targetDate: z.string().optional(),
});

export interface TaskRecord {
  id: string;
  title: string;
  category: "Modul" | "Kuis" | "Praktikum" | "Review";
  priority: "Tinggi" | "Sedang" | "Rendah";
  targetDate: string;
  completed: boolean;
  createdAt: string;
}

const TASKS_STORE: TaskRecord[] = [
  {
    id: "task-1",
    title: "Selesaikan Latihan Kuis: Looping & Iterasi",
    category: "Kuis",
    priority: "Tinggi",
    targetDate: "2026-09-22",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Baca Modul 4: Struktur Data Pohon (Tree Traversal)",
    category: "Modul",
    priority: "Sedang",
    targetDate: "2026-09-24",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Praktikum Lab: Implementasi Binary Search Tree",
    category: "Praktikum",
    priority: "Tinggi",
    targetDate: "2026-09-26",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: TASKS_STORE,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = TaskInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Data target belajar tidak valid.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const category: TaskRecord["category"] =
      parsed.data.category === "Kuis" ||
      parsed.data.category === "Praktikum" ||
      parsed.data.category === "Review"
        ? parsed.data.category
        : "Modul";

    const priority: TaskRecord["priority"] =
      parsed.data.priority === "HIGH" || parsed.data.priority === "Tinggi"
        ? "Tinggi"
        : parsed.data.priority === "LOW" || parsed.data.priority === "Rendah"
          ? "Rendah"
          : "Sedang";

    const newTask: TaskRecord = {
      id: `task-${Date.now()}`,
      title: parsed.data.title,
      category,
      priority,
      targetDate: String(
        parsed.data.dueDate || parsed.data.targetDate || new Date().toISOString().split("T")[0],
      ),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    TASKS_STORE.unshift(newTask);

    return NextResponse.json(
      {
        success: true,
        message: "Target belajar berhasil ditambahkan ke rencana studi!",
        data: newTask,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambahkan target belajar.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
