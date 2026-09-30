// tests/components/ModuleRagChat.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ModuleRagChat from "../../src/components/ModuleRagChat";

describe("ModuleRagChat Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render default header, badges, and upload panel", () => {
    render(<ModuleRagChat defaultModuleName="Struktur Data" />);

    expect(screen.getByText(/Mode: Strict RAG/i)).toBeInTheDocument();
    expect(screen.getByText(/RAG Document Q&A Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Struktur Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Panel Unggah Modul/i)).toBeInTheDocument();
    expect(screen.getByText(/Bersihkan Chat/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unggah & Indeks Modul/i })).toBeDisabled();
  });

  it("should show error when selecting an unsupported file format", () => {
    render(<ModuleRagChat />);

    const fileInput = document.getElementById("nexed-rag-file-input") as HTMLInputElement;
    const invalidFile = new File(["dummy content"], "program.exe", {
      type: "application/x-msdownload",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(
      screen.getByText(/Format file tidak didukung. Harap unggah file .pdf, .txt, atau .md./i),
    ).toBeInTheDocument();
  });

  it("should show error when file size exceeds 20MB", () => {
    render(<ModuleRagChat />);

    const fileInput = document.getElementById("nexed-rag-file-input") as HTMLInputElement;
    const largeFile = new File(["a".repeat(100)], "large.pdf", { type: "application/pdf" });
    Object.defineProperty(largeFile, "size", { value: 25 * 1024 * 1024 });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByText(/Ukuran file terlalu besar/i)).toBeInTheDocument();
  });

  it("should accept valid .pdf file and enable upload button", () => {
    render(<ModuleRagChat />);

    const fileInput = document.getElementById("nexed-rag-file-input") as HTMLInputElement;
    const validFile = new File(["Sample PDF Content"], "modul-kuliah.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.getByText("modul-kuliah.pdf")).toBeInTheDocument();
    const uploadBtn = screen.getByRole("button", { name: /Unggah & Indeks Modul/i });
    expect(uploadBtn).not.toBeDisabled();
  });

  it("should handle drag and drop events on the dropzone", () => {
    render(<ModuleRagChat />);

    const dropzone = screen.getByLabelText(/Area unggah file modul/i);

    fireEvent.dragOver(dropzone);
    fireEvent.dragLeave(dropzone);

    const validFile = new File(["Markdown content"], "catatan.md", { type: "text/markdown" });
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [validFile],
      },
    });

    expect(screen.getByText("catatan.md")).toBeInTheDocument();
  });

  it("should successfully upload and index a module", async () => {
    const mockUploadResponse = {
      success: true,
      filename: "modul-algo.pdf",
      moduleId: "modul-test-1",
      chunkCount: 6,
      totalWords: 3100,
    };

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockUploadResponse,
    } as Response);

    render(<ModuleRagChat defaultModuleId="modul-test-1" />);

    const fileInput = document.getElementById("nexed-rag-file-input") as HTMLInputElement;
    const validFile = new File(["PDF Binary data"], "modul-algo.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    const uploadBtn = screen.getByRole("button", { name: /Unggah & Indeks Modul/i });
    fireEvent.click(uploadBtn);

    await waitFor(() => {
      expect(screen.getByText(/Terindeks/i)).toBeInTheDocument();
      expect(screen.getByText("Siap Ditanyakan")).toBeInTheDocument();
    });
  });

  it("should display error message when upload fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Format PDF korup atau tidak dapat dibaca." }),
    } as Response);

    render(<ModuleRagChat />);

    const fileInput = document.getElementById("nexed-rag-file-input") as HTMLInputElement;
    const validFile = new File(["corrupt"], "rusak.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    const uploadBtn = screen.getByRole("button", { name: /Unggah & Indeks Modul/i });
    fireEvent.click(uploadBtn);

    await waitFor(() => {
      expect(screen.getByText(/Format PDF korup atau tidak dapat dibaca./i)).toBeInTheDocument();
    });
  });

  it("should display alert when trying to chat before indexing a module", async () => {
    render(<ModuleRagChat />);

    const chatInput = document.getElementById("nexed-rag-chat-input") as HTMLInputElement;
    fireEvent.change(chatInput, { target: { value: "Apa itu binary search?" } });

    const sendBtn = screen.getByRole("button", { name: /Kirim/i });
    fireEvent.click(sendBtn);

    expect(
      screen.getByText(/Harap unggah dan indeks modul terlebih dahulu sebelum bertanya./i),
    ).toBeInTheDocument();
  });

  it("should successfully send message and receive AI response once module is indexed", async () => {
    // 1. Mock Upload response
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          filename: "modul-pohon.pdf",
          moduleId: "pohon-1",
          chunkCount: 4,
          totalWords: 1800,
        }),
      } as Response)
      // 2. Mock Chat response
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          reply:
            "Binary tree adalah struktur data hierarkis di mana setiap simpul memiliki maksimal dua anak.",
          usedChunks: 2,
        }),
      } as Response);

    render(<ModuleRagChat defaultModuleId="pohon-1" />);

    // Upload module
    const fileInput = document.getElementById("nexed-rag-file-input") as HTMLInputElement;
    const validFile = new File(["pohon biner"], "modul-pohon.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    fireEvent.click(screen.getByRole("button", { name: /Unggah & Indeks Modul/i }));

    await waitFor(() => {
      expect(screen.getByText(/Siap Ditanyakan/i)).toBeInTheDocument();
    });

    // Chat query
    const chatInput = document.getElementById("nexed-rag-chat-input") as HTMLInputElement;
    fireEvent.change(chatInput, { target: { value: "Jelaskan definisi binary tree!" } });
    fireEvent.click(screen.getByRole("button", { name: /Kirim/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          /Binary tree adalah struktur data hierarkis di mana setiap simpul memiliki maksimal dua anak./i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Dijawab berdasarkan 2 potongan teks relevan/i),
      ).toBeInTheDocument();
    });
  });

  it("should handle error response during AI chat gracefully", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          filename: "modul.txt",
          moduleId: "modul-txt",
          chunkCount: 2,
          totalWords: 500,
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Groq API rate limit reached" }),
      } as Response);

    render(<ModuleRagChat defaultModuleId="modul-txt" />);

    // Upload
    const fileInput = document.getElementById("nexed-rag-file-input") as HTMLInputElement;
    const validFile = new File(["text"], "modul.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    fireEvent.click(screen.getByRole("button", { name: /Unggah & Indeks Modul/i }));

    await waitFor(() => {
      expect(screen.getByText(/Siap Ditanyakan/i)).toBeInTheDocument();
    });

    // Chat
    const chatInput = document.getElementById("nexed-rag-chat-input") as HTMLInputElement;
    fireEvent.change(chatInput, { target: { value: "Halo AI" } });
    fireEvent.click(screen.getByRole("button", { name: /Kirim/i }));

    await waitFor(() => {
      expect(screen.getByText(/Groq API rate limit reached/i)).toBeInTheDocument();
    });
  });

  it("should reset chat when Bersihkan Chat button is clicked", () => {
    render(<ModuleRagChat />);

    const clearBtn = screen.getByRole("button", { name: /Bersihkan Chat/i });
    fireEvent.click(clearBtn);

    expect(screen.getByText(/Sesi percakapan telah dibersihkan/i)).toBeInTheDocument();
  });
});
