// src/schemas/taskSchema.ts
import { z } from "zod";

// Branded Types untuk Integritas Domain
export type Brand<T, B> = T & { readonly __brand: B };
export type TaskId = Brand<string, "TaskId">;
export type StudentId = Brand<string, "StudentId">;

// Skema Zod untuk Validasi Data Tugas Mahasiswa
export const TaskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const CreateTaskSchema = z.object({
  title: z.string().min(3, "Judul tugas minimal 3 karakter").max(80, "Judul maksimal 80 karakter"),
  courseName: z.string().min(2, "Nama mata kuliah wajib diisi"),
  priority: TaskPriorityEnum,
  dueDate: z.string().refine((val: string) => !Number.isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid (YYYY-MM-DD)",
  }),
});

export const TaskSchema = CreateTaskSchema.extend({
  id: z.string().uuid(),
  isCompleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type StudentTask = z.infer<typeof TaskSchema>;

export type FetchTasksState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: StudentTask[] }
  | { status: "error"; message: string };

// Skema untuk Mahasiswa (Portal Dosen)
export const StudentMasterySchema = z.object({
  id: z.number(),
  name: z.string(),
  topic: z.string(),
  mastery: z.number().min(0).max(100),
  status: z.enum(["Aman", "Perlu Perhatian", "Berisiko"]),
});
export type StudentMastery = z.infer<typeof StudentMasterySchema>;

// Skema untuk Peta Belajar (Student Path)
export const NodeStatusEnum = z.enum(["completed", "recommended", "locked"]);
export const LearningNodeSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: NodeStatusEnum,
  xp: z.number().min(0),
});
export type LearningNode = z.infer<typeof LearningNodeSchema>;

// Skema untuk AI Chatbot
export const AiResponseSchema = z.object({
  status: z.literal("success").or(z.literal("error")),
  message: z.string(),
  timestamp: z.string().optional(),
});
export type AiResponse = z.infer<typeof AiResponseSchema>;
