// tests/services/moduleService.test.ts
import { describe, expect, it } from "vitest";
import {
  fetchClassAnalyticsApi,
  fetchModulesApi,
  fetchStudentProgressApi,
  fetchTopicDetailApi,
} from "../../src/services/moduleService";

describe("moduleService (Curriculum & Analytics Service)", () => {
  it("should fetch list of all modules with topics and rewards", async () => {
    const modules = await fetchModulesApi();
    expect(Array.isArray(modules)).toBe(true);
    expect(modules.length).toBeGreaterThan(0);
    expect(modules[0]).toBeDefined();
    expect(modules[0]).toHaveProperty("slug");
    expect(modules[0]).toHaveProperty("topics");
    expect(modules[0]?.topics.length).toBeGreaterThan(0);
  });

  it("should fetch topic detail by ID when found", async () => {
    const topic = await fetchTopicDetailApi(1);
    expect(topic).not.toBeNull();
    expect(topic?.id).toBe(1);
    expect(topic?.title).toContain("Pengantar Algoritma");
    expect(topic?.theoryContent).toBeDefined();
  });

  it("should return null for non-existent topic ID", async () => {
    const topic = await fetchTopicDetailApi(9999);
    expect(topic).toBeNull();
  });

  it("should fetch course progress for current student", async () => {
    const progress = await fetchStudentProgressApi();
    expect(progress).toHaveProperty("totalXp");
    expect(progress.studentId).toBe("mhs-2024-001");
    expect(Array.isArray(progress.tasks)).toBe(true);
    expect(progress.tasks.length).toBeGreaterThanOrEqual(1);
    expect(progress.recentQuizScores.length).toBeGreaterThan(0);
  });

  it("should fetch class analytics for lecturer dashboard", async () => {
    const analytics = await fetchClassAnalyticsApi();
    expect(analytics.totalStudents).toBe(42);
    expect(analytics.averageScore).toBeGreaterThan(0);
    expect(analytics.gradeDistribution).toHaveProperty("gradeA");
    expect(Array.isArray(analytics.atRiskStudents)).toBe(true);
    expect(analytics.atRiskStudents.length).toBeGreaterThan(0);
  });
});
