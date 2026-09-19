// src/lib/validations/progressSchema.ts
import { z } from "zod";

export const StudentTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Judul target minimal 3 karakter"),
  category: z.enum(["Materi", "Tugas", "Proyek", "Kuis"]),
  complexity: z.enum(["Beginner", "Intermediate", "Advanced"]),
  status: z.enum(["In Progress", "Completed", "Overdue"]).default("In Progress"),
  createdAt: z.string(),
  dueDate: z.string().optional(),
});

export const StudentMasterySchema = z.object({
  id: z.number(),
  name: z.string(),
  nim: z.string(),
  topic: z.string(),
  score: z.number().min(0).max(100),
  masteryPercentage: z.number().min(0).max(100),
  status: z.enum(["Aman", "Perlu Perhatian", "Berisiko"]),
  lastActive: z.string(),
  quizAttempts: z.number().default(1),
});

export const ClassAnalyticsSchema = z.object({
  totalStudents: z.number(),
  averageScore: z.number(),
  atRiskCount: z.number(),
  masteryRate: z.number(),
  gradeDistribution: z.object({
    gradeA: z.number(),
    gradeB: z.number(),
    gradeC: z.number(),
    gradeD: z.number(),
    gradeE: z.number(),
  }),
  atRiskStudents: z.array(StudentMasterySchema),
});

export const CourseProgressSchema = z.object({
  studentId: z.string(),
  totalXp: z.number(),
  currentLevel: z.number(),
  completedModulesCount: z.number(),
  totalModulesCount: z.number(),
  recommendedTopicId: z.number(),
  recommendedTopicTitle: z.string(),
  tasks: z.array(StudentTaskSchema),
  recentQuizScores: z.array(
    z.object({
      quizTitle: z.string(),
      score: z.number(),
      completedAt: z.string(),
    }),
  ),
});

export type StudentTask = z.infer<typeof StudentTaskSchema>;
export type StudentMastery = z.infer<typeof StudentMasterySchema>;
export type ClassAnalytics = z.infer<typeof ClassAnalyticsSchema>;
export type CourseProgress = z.infer<typeof CourseProgressSchema>;
