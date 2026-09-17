import { useQuery } from "@tanstack/react-query";
import type { StudentMastery } from "../schemas/taskSchema";
import { fetchStudentMasteryApi } from "./apiService";

// Modul 7: Custom Hook for Server State Management using TanStack Query
export function useStudentMastery() {
  return useQuery<StudentMastery[], Error>({
    queryKey: ["studentMastery"],
    queryFn: async () => {
      // Simulate network latency
      await new Promise((res) => setTimeout(res, 800));
      return fetchStudentMasteryApi();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes caching strategy
  });
}
