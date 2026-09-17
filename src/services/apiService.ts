// src/services/apiService.ts
import {
  type AiResponse,
  AiResponseSchema,
  type LearningNode,
  LearningNodeSchema,
  type StudentMastery,
  StudentMasterySchema,
} from "../schemas/taskSchema";

// === DATABASE SIMULASI (Mock Data) ===
const studentMasteryDb: StudentMastery[] = [
  { id: 101, name: "Ucik Dika Maharani", topic: "Looping & Iterasi", mastery: 92, status: "Aman" },
  { id: 102, name: "Budi Santoso", topic: "Struktur Array", mastery: 45, status: "Berisiko" },
  {
    id: 103,
    name: "Siti Aminah",
    topic: "Pengantar Algoritma",
    mastery: 78,
    status: "Perlu Perhatian",
  },
  { id: 104, name: "Zam Zam Zahrina", topic: "Looping & Iterasi", mastery: 88, status: "Aman" },
  {
    id: 105,
    name: "Rita Tri Rahmawati",
    topic: "Struktur Kondisional",
    mastery: 30,
    status: "Berisiko",
  },
];

const rawLearningNodes = [
  {
    id: 1,
    title: "Pengantar Algoritma",
    description: "Pemahaman dasar struktur logika dan algoritma sekuensial.",
    status: "completed",
    xp: 50,
  },
  {
    id: 2,
    title: "Struktur Kondisional",
    description: "Mempelajari percabangan IF-ELSE dan Switch Case.",
    status: "completed",
    xp: 75,
  },
  {
    id: 3,
    title: "Looping & Iterasi",
    description:
      "Kamu butuh penguatan di bagian ini. Mari pelajari FOR dan WHILE loop bersama NEXED Bot!",
    status: "recommended",
    xp: 100,
  },
  {
    id: 4,
    title: "Struktur Data Array",
    description:
      "Menyimpan banyak data dalam satu variabel. (Terkunci, selesaikan materi sebelumnya)",
    status: "locked",
    xp: 0,
  },
];

// === ASYNC API SERVICES ===

export async function fetchLearningNodesApi(): Promise<LearningNode[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return rawLearningNodes.map((item) => LearningNodeSchema.parse(item));
}

export async function fetchStudentMasteryApi(): Promise<StudentMastery[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return studentMasteryDb.map((item) => StudentMasterySchema.parse(item));
}

export async function fetchAIExplanationApi(text: string): Promise<AiResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerText = text.toLowerCase();
  let message = `Konsep "${text}" ini sangat krusial dalam algoritma. Ini sering dipakai untuk memanipulasi banyak data sekaligus secara otomatis. Tetap semangat belajarnya!`;

  if (lowerText.includes("infinite loop")) {
    message =
      "Infinite Loop terjadi bila batas kondisi (seperti i < 10) tidak pernah tercapai, biasanya karena kamu lupa menambahkan increment (i++). Program akan terus berjalan sampai kehabisan memori. Harus sangat berhati-hati!";
  } else if (lowerText.includes("for loop")) {
    message =
      "FOR Loop ibarat kamu disuruh berlari keliling lapangan sebanyak 5 putaran. Kamu sudah tahu persis jumlah akhirnya (5) sebelum mulai.";
  } else if (lowerText.includes("while loop")) {
    message =
      "WHILE Loop ibarat kamu disuruh berlari keliling lapangan sampai kamu capek. Kamu tidak tahu berapa putaran pastinya, tapi tahu persis kapan harus berhenti (saat capek).";
  }

  const rawResponse = {
    status: "success",
    message: message,
    timestamp: new Date().toISOString(),
  };

  return AiResponseSchema.parse(rawResponse);
}
