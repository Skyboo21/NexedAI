// tests/ai/aiModuleAnalyzer.test.ts
import { describe, expect, it } from "vitest";
import {
  analyzeModuleContent,
  generateChatResponse,
} from "../../src/lib/aiModuleAnalyzer";

describe("Nexed AI Module Analyzer & Reasoning Engine", () => {
  it("should extract binary search domain accurately", () => {
    const input = {
      title: "Pencarian Biner",
      content: "Materi kuliah binary search algorithm dan kompleksitas O(log N). Array harus terurut.",
      sourceType: "text" as const,
    };
    const result = analyzeModuleContent(input);

    expect(result.title).toContain("Pencarian Biner");
    expect(result.summary.overview).toBeDefined();
    expect(result.summary.keyPoints.length).toBeGreaterThanOrEqual(4);
    expect(result.roadmap.length).toBe(4);
    expect(result.quiz.length).toBeGreaterThanOrEqual(3);

    // Verify quiz structure
    const firstQuiz = result.quiz[0];
    expect(firstQuiz).toBeDefined();
    expect(firstQuiz?.options.length).toBe(4);
    expect(typeof firstQuiz?.correctIndex).toBe("number");
    expect(firstQuiz?.explanation).toBeDefined();
  });

  it("should extract tree data structures domain accurately", () => {
    const input = {
      title: "Struktur Pohon (Tree)",
      content: "Struktur data Pohon Biner, Node hierarkis, Inorder, Preorder, dan Postorder traversal rekursif.",
      sourceType: "text" as const,
    };
    const result = analyzeModuleContent(input);

    expect(result.title).toContain("Pohon");
    expect(result.summary.keyPoints.some((k) => k.term.includes("BST") || k.term.includes("Traversal"))).toBe(true);
  });

  it("should handle arbitrary custom modules gracefully", () => {
    const input = {
      title: "Teori Graf",
      content: "Pengantar Teori Graf dan Algoritma Dijkstra untuk mencari rute terpendek.",
      sourceType: "text" as const,
    };
    const result = analyzeModuleContent(input);

    expect(result.title).toBeDefined();
    expect(result.roadmap.length).toBe(4);
    expect(result.quiz.length).toBeGreaterThanOrEqual(3);
  });

  it("should provide contextual tutor chat responses", () => {
    const resp1 = generateChatResponse({
      moduleTitle: "Pencarian Biner (Binary Search)",
      userQuestion: "Berikan contoh kode implementasi dan sintaks dasarnya!",
    });
    expect(resp1).toContain("def binary_search");

    const resp2 = generateChatResponse({
      moduleTitle: "Pencarian Biner (Binary Search)",
      userQuestion: "Bisa jelaskan dengan analogi kehidupan nyata?",
    });
    expect(resp2.toLowerCase()).toContain("kamar");
  });
});
