// tests/services/services.test.ts
import { describe, expect, it } from "vitest";
import {
  fetchAIExplanationApi,
  fetchLearningNodesApi,
  fetchStudentMasteryApi,
} from "../../src/services/apiService";

describe("API Services (Business Logic & AI Responses)", () => {
  it("should fetch learning nodes matching LearningNodeSchema", async () => {
    const nodes = await fetchLearningNodesApi();
    expect(Array.isArray(nodes)).toBe(true);
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes[0]).toBeDefined();
    expect(nodes[0]).toHaveProperty("title");
    expect(nodes[0]).toHaveProperty("xp");
    expect(["completed", "recommended", "locked"]).toContain(nodes[0]?.status);
  });

  it("should fetch student mastery records matching StudentMasterySchema", async () => {
    const masteryList = await fetchStudentMasteryApi();
    expect(Array.isArray(masteryList)).toBe(true);
    expect(masteryList.length).toBeGreaterThan(0);
    expect(masteryList[0]).toBeDefined();
    expect(masteryList[0]).toHaveProperty("name");
    expect(masteryList[0]).toHaveProperty("mastery");
    expect(["Aman", "Perlu Perhatian", "Berisiko"]).toContain(masteryList[0]?.status);
  });

  it("should return tailored AI explanation for 'infinite loop'", async () => {
    const res = await fetchAIExplanationApi("Bagaimana infinite loop terjadi?");
    expect(res.status).toBe("success");
    expect(res.message).toContain("Infinite Loop terjadi bila batas kondisi");
  });

  it("should return tailored AI explanation for 'for loop'", async () => {
    const res = await fetchAIExplanationApi("Jelaskan cara kerja for loop");
    expect(res.status).toBe("success");
    expect(res.message).toContain("FOR Loop ibarat kamu disuruh berlari");
  });

  it("should return tailored AI explanation for 'while loop'", async () => {
    const res = await fetchAIExplanationApi("Apa itu while loop?");
    expect(res.status).toBe("success");
    expect(res.message).toContain("WHILE Loop ibarat kamu disuruh berlari keliling");
  });

  it("should return generic helpful response for other programming topics", async () => {
    const res = await fetchAIExplanationApi("Binary Search Tree");
    expect(res.status).toBe("success");
    expect(res.message).toContain("Binary Search Tree");
  });
});
