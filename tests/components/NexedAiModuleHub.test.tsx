// tests/components/NexedAiModuleHub.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NexedAiModuleHub from "../../src/components/NexedAiModuleHub";

describe("NexedAiModuleHub Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should update dropzone when a file is selected via input", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        filename: "struktur-data.pdf",
        chunkCount: 3,
        totalWords: 500,
        rawText: "Sample extracted content",
      }),
    });

    render(<NexedAiModuleHub />);

    const fileInput = document.getElementById("nexed-file-upload-input") as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const testFile = new File(["PDF test data"], "struktur-data.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      // It should either show the file name or loading indicator or start analysis
      const filenameMatch = screen.queryByText(/struktur-data\.pdf/i);
      const loadingMatch = screen.queryByText(/Sedang Mengunggah/i);
      const analyzingMatch = screen.queryByText(/Nexed AI sedang menganalisis/i);
      expect(filenameMatch || loadingMatch || analyzingMatch).toBeTruthy();
    });
  });
});
