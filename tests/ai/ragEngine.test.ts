// tests/ai/ragEngine.test.ts
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as handleChatPost } from "../../app/api/modul/chat/route";
import {
  GET as handleUploadGet,
  POST as handleUploadPost,
} from "../../app/api/modul/upload/route";
import {
  chunkText,
  clearModuleStore,
  extractTextFromPdf,
  findRelevantChunks,
  generateRagResponse,
  getModule,
  hasModule,
  listModules,
  saveModule,
} from "../../src/lib/ragEngine";

// Mock Groq SDK
vi.mock("groq-sdk", () => {
  return {
    default: class MockGroq {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content:
                    "FOR loop digunakan saat jumlah perulangan sudah diketahui secara pasti sejak awal.",
                },
              },
            ],
          }),
        },
      };
    },
  };
});

describe("NexedAI RAG Engine & Module Retrieval", () => {
  beforeEach(() => {
    clearModuleStore();
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = "mock-groq-api-key";
  });

  describe("chunkText Function", () => {
    it("should return an empty array for empty or whitespace text", () => {
      expect(chunkText("")).toEqual([]);
      expect(chunkText("   \n\t  ")).toEqual([]);
    });

    it("should return a single chunk if word count is less than chunkSize", () => {
      const shortText =
        "Algoritma pengurutan cepat atau Quicksort bekerja dengan membagi masalah.";
      const chunks = chunkText(shortText, 500, 100);
      expect(chunks.length).toBe(1);
      expect(chunks[0]).toBe(shortText);
    });

    it("should create overlapping chunks when text exceeds chunkSize", () => {
      // Create 650 words text
      const words = Array.from({ length: 650 }, (_, i) => `kata-${i + 1}`);
      const text = words.join(" ");

      const chunks = chunkText(text, 500, 100);
      expect(chunks.length).toBe(2);

      // First chunk: words 1-500
      expect(chunks[0]?.split(" ").length).toBe(500);
      expect(chunks[0]?.startsWith("kata-1")).toBe(true);
      expect(chunks[0]?.endsWith("kata-500")).toBe(true);

      // Second chunk: starts at 400 (500 - 100 overlap) and ends at 650 (250 words)
      expect(chunks[1]?.split(" ").length).toBe(250);
      expect(chunks[1]?.startsWith("kata-401")).toBe(true);
      expect(chunks[1]?.endsWith("kata-650")).toBe(true);
    });
  });

  describe("findRelevantChunks Function", () => {
    const sampleChunks = [
      "Struktur kontrol perulangan FOR loop digunakan ketika jumlah iterasi diketahui pasti. Contohnya for (int i = 0; i < 10; i++).",
      "Struktur WHILE loop digunakan ketika perulangan bergantung pada kondisi boolean dinamis yang belum tentu diketahui jumlahnya.",
      "Algoritma Binary Search Tree (BST) memiliki kompleksitas waktu pencarian rata-rata O(log N) jika pohon seimbang.",
    ];

    it("should return empty array for empty input", () => {
      expect(findRelevantChunks("", sampleChunks)).toEqual([]);
      expect(findRelevantChunks("query", [])).toEqual([]);
    });

    it("should retrieve the most relevant chunk for FOR loop query", () => {
      const results = findRelevantChunks("kapan menggunakan for loop?", sampleChunks, 2);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toContain("perulangan FOR loop");
    });

    it("should retrieve the most relevant chunk for Binary Search query", () => {
      const results = findRelevantChunks("kompleksitas binary search tree bst", sampleChunks, 1);
      expect(results.length).toBe(1);
      expect(results[0]).toContain("Binary Search Tree");
    });

    it("should return empty array when query keywords have no relevance in the chunks", () => {
      const results = findRelevantChunks("resep memasak rendang daging sapi", sampleChunks, 3);
      expect(results).toEqual([]);
    });
  });

  describe("generateRagResponse Function", () => {
    it("should immediately return fallback message if relevantChunks is empty", async () => {
      const result = await generateRagResponse("apa itu recursion?", []);
      expect(result).toBe("Maaf, informasi tersebut tidak ditemukan di dalam modul ini.");
    });

    it("should call Groq with strict prompt and return LLM response when chunks are present", async () => {
      const chunks = [
        "FOR loop adalah struktur kontrol iterasi yang memerlukan inisialisasi, kondisi, dan increment.",
      ];
      const result = await generateRagResponse("Bagaimana cara kerja for loop?", chunks);

      expect(result).toContain("FOR loop");
    });

    it("should throw error if GROQ_API_KEY is not defined", async () => {
      delete process.env.GROQ_API_KEY;
      await expect(
        generateRagResponse("Pertanyaan?", ["konteks materi"]),
      ).rejects.toThrow("GROQ_API_KEY belum dikonfigurasi");
    });
  });

  describe("In-Memory Module Store", () => {
    it("should store and retrieve modules by moduleId", () => {
      expect(hasModule("modul-algo-1")).toBe(false);

      saveModule("modul-algo-1", "algoritma.pdf", ["chunk 1", "chunk 2"], 1200);

      expect(hasModule("modul-algo-1")).toBe(true);
      const retrieved = getModule("modul-algo-1");
      expect(retrieved).toBeDefined();
      expect(retrieved?.filename).toBe("algoritma.pdf");
      expect(retrieved?.chunks.length).toBe(2);
      expect(retrieved?.totalWords).toBe(1200);

      const all = listModules();
      expect(all.length).toBe(1);
      expect(all[0]?.moduleId).toBe("modul-algo-1");
    });
  });

  describe("extractTextFromPdf Helper", () => {
    it("should handle buffer input and extract or catch errors gracefully", async () => {
      const fakePdfBuffer = Buffer.from("%PDF-1.4\n%%EOF");
      try {
        const text = await extractTextFromPdf(fakePdfBuffer);
        expect(typeof text).toBe("string");
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("API Route: app/api/modul/upload/route.ts", () => {
    it("should return 400 if no file is provided", async () => {
      const formData = new FormData();
      const request = new NextRequest("http://localhost:3000/api/modul/upload", {
        method: "POST",
        body: formData,
      });

      const response = await handleUploadPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("File dokumen modul wajib diunggah");
    });

    it("should return 400 if file buffer is 0 bytes", async () => {
      const emptyFile = new File([], "kosong.txt", { type: "text/plain" });
      const formData = new FormData();
      formData.append("file", emptyFile);

      const mockRequest = {
        formData: async () => formData,
      } as unknown as NextRequest;

      const response = await handleUploadPost(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("0 bytes");
    });

    it("should return 422 if text is empty after trimming", async () => {
      const whitespaceFile = new File(["   \n\t  "], "spasi.txt", { type: "text/plain" });
      const formData = new FormData();
      formData.append("file", whitespaceFile);

      const mockRequest = {
        formData: async () => formData,
      } as unknown as NextRequest;

      const response = await handleUploadPost(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.error).toContain("Tidak ada teks terbaca");
    });

    it("should upload and chunk a plain text module successfully", async () => {
      const content = "Bab 1: Konsep Dasar Algoritma. Algoritma adalah urutan langkah logis penyelesaian masalah.";
      const file = new File([content], "bab1-algoritma.txt", { type: "text/plain" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("moduleId", "modul-teks-1");

      const mockRequest = {
        formData: async () => formData,
      } as unknown as NextRequest;

      const response = await handleUploadPost(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.moduleId).toBe("modul-teks-1");
      expect(data.chunkCount).toBe(1);
      expect(hasModule("modul-teks-1")).toBe(true);
    });

    it("should retrieve module status via GET request", async () => {
      saveModule("modul-cek", "cek.txt", ["isi chunk"], 50);

      const request = new NextRequest("http://localhost:3000/api/modul/upload?moduleId=modul-cek");
      const response = await handleUploadGet(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.found).toBe(true);
      expect(data.filename).toBe("cek.txt");
    });

    it("should return 400 on GET if moduleId query param is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/modul/upload");
      const response = await handleUploadGet(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("moduleId");
    });

    it("should return 404 on GET if module is not found", async () => {
      const request = new NextRequest("http://localhost:3000/api/modul/upload?moduleId=tidak-ada");
      const response = await handleUploadGet(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.found).toBe(false);
    });
  });

  describe("API Route: app/api/modul/chat/route.ts", () => {
    it("should return 400 if message is missing or empty", async () => {
      const request = new NextRequest("http://localhost:3000/api/modul/chat", {
        method: "POST",
        body: JSON.stringify({ moduleId: "modul-test", message: "" }),
      });

      const response = await handleChatPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Pesan pertanyaan tidak boleh kosong");
    });

    it("should return 400 if moduleId is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/modul/chat", {
        method: "POST",
        body: JSON.stringify({ moduleId: "", message: "Pertanyaan?" }),
      });

      const response = await handleChatPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Parameter 'moduleId' wajib disertakan");
    });

    it("should return 400 if JSON body is invalid", async () => {
      const request = {
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as NextRequest;

      const response = await handleChatPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("JSON yang valid");
    });

    it("should return upload reminder when module is not in store", async () => {
      const request = new NextRequest("http://localhost:3000/api/modul/chat", {
        method: "POST",
        body: JSON.stringify({
          moduleId: "modul-belum-ada",
          message: "Apa itu while loop?",
        }),
      });

      const response = await handleChatPost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.reply).toContain("Silakan unggah dokumen modul terlebih dahulu");
      expect(data.usedChunks).toBe(0);
    });

    it("should query RAG engine and return reply with usedChunks when module exists", async () => {
      saveModule(
        "modul-loop",
        "loop.txt",
        ["FOR loop mengulang eksekusi kode sampai kondisi batas tercapai."],
        100,
      );

      const request = new NextRequest("http://localhost:3000/api/modul/chat", {
        method: "POST",
        body: JSON.stringify({
          moduleId: "modul-loop",
          message: "Bagaimana cara kerja for loop?",
        }),
      });

      const response = await handleChatPost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.reply).toBeDefined();
      expect(data.usedChunks).toBe(1);
    });
  });
});
