// src/lib/validations/moduleSchema.ts
import { z } from "zod";

export const QuizOptionSchema = z.object({
  id: z.number(),
  text: z.string().min(1),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});

export const QuizQuestionSchema = z.object({
  id: z.number(),
  question: z.string().min(1),
  options: z.array(QuizOptionSchema).min(2),
  correctOptionId: z.number(),
});

export const CodeSnippetSchema = z.object({
  language: z.enum(["python", "javascript", "cpp", "pseudocode"]),
  code: z.string(),
  expectedOutput: z.string().optional(),
  explanation: z.string().optional(),
});

export const ModuleTopicSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string().min(1),
  category: z.string(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  estimatedMinutes: z.number(),
  xpReward: z.number(),
  status: z.enum(["completed", "recommended", "locked", "in_progress"]),
  summary: z.string(),
  learningObjectives: z.array(z.string()),
  theoryContent: z.string(),
  codeSnippet: CodeSnippetSchema.optional(),
  quizzes: z.array(QuizQuestionSchema).default([]),
  aiPromptSuggestion: z.string().optional(),
});

export const ModuleSchema = z.object({
  id: z.number(),
  slug: z.string(),
  code: z.string(),
  title: z.string().min(1),
  description: z.string(),
  topics: z.array(ModuleTopicSchema),
  totalXp: z.number(),
  badgeName: z.string(),
  order: z.number(),
});

export type QuizOption = z.infer<typeof QuizOptionSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type CodeSnippet = z.infer<typeof CodeSnippetSchema>;
export type ModuleTopic = z.infer<typeof ModuleTopicSchema>;
export type Module = z.infer<typeof ModuleSchema>;
