// src/hooks/useModules.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchClassAnalyticsApi,
  fetchModulesApi,
  fetchStudentProgressApi,
  fetchTopicDetailApi,
} from "../services/moduleService";

// Standard TanStack Query Cache Configuration (Bab 8 Proyek Akhir)
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 menit
const DEFAULT_GC_TIME = 1000 * 60 * 30; // 30 menit (garbage collection)

/**
 * Hook untuk mengambil seluruh modul pembelajaran
 */
export function useModules() {
  return useQuery({
    queryKey: ["modules", "list"],
    queryFn: fetchModulesApi,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
}

/**
 * Hook untuk mengambil rincian topik materi spesifik
 */
export function useTopicDetail(topicId: number) {
  return useQuery({
    queryKey: ["modules", "topic", topicId],
    queryFn: () => fetchTopicDetailApi(topicId),
    enabled: topicId > 0,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
}

/**
 * Hook untuk mengambil data progress belajar mahasiswa (Client/Student View)
 */
export function useStudentProgress() {
  return useQuery({
    queryKey: ["student", "progress"],
    queryFn: fetchStudentProgressApi,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
}

/**
 * Hook untuk mengambil analitik performa kelas (Dosen View)
 */
export function useClassAnalytics() {
  return useQuery({
    queryKey: ["dosen", "analytics"],
    queryFn: fetchClassAnalyticsApi,
    staleTime: 1000 * 60 * 2, // 2 menit untuk analitik dosen
    gcTime: DEFAULT_GC_TIME,
  });
}
