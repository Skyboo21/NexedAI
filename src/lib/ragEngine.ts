// src/lib/ragEngine.ts
/**
 * RAG (Retrieval-Augmented Generation) Engine for NexedAI.
 * Processes course modules, splits text into overlapping chunks,
 * retrieves relevant context, and queries Groq LLM (LLaMA-3.3-70B)
 * with strict anti-hallucination constraints.
 */

import Groq from "groq-sdk";

export interface StoredModule {
  moduleId: string;
  filename: string;
  chunks: string[];
  uploadedAt: string;
  totalWords: number;
}

// In-memory module storage for uploaded documents and chunks
const moduleStore = new Map<string, StoredModule>();

/**
 * Split text into overlapping word chunks (~500 words per chunk with 100 words overlap)
 */
export function chunkText(text: string, chunkSize: number = 500, overlap: number = 100): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Normalize whitespace and split by words
  const words = text.trim().split(/\s+/);
  if (words.length === 0) {
    return [];
  }

  // If text is shorter than or equal to chunkSize, return single chunk
  if (words.length <= chunkSize) {
    return [words.join(" ")];
  }

  const chunks: string[] = [];
  const step = Math.max(1, chunkSize - overlap);

  for (let i = 0; i < words.length; i += step) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    // Prevent creating tiny trailing chunk if we already reached the end
    if (i + chunkSize >= words.length) {
      break;
    }
  }

  return chunks;
}

// Indonesian and common academic query stop words
const STOP_WORDS = new Set([
  "dan",
  "atau",
  "yang",
  "di",
  "ke",
  "dari",
  "ini",
  "itu",
  "adalah",
  "yaitu",
  "pada",
  "untuk",
  "dengan",
  "sebagai",
  "dalam",
  "oleh",
  "karena",
  "maka",
  "tentang",
  "apa",
  "apakah",
  "bagaimana",
  "mengapa",
  "kenapa",
  "siapa",
  "kapan",
  "dimana",
  "bisa",
  "dapat",
  "tolong",
  "jelaskan",
  "sebutkan",
  "the",
  "a",
  "an",
  "is",
  "in",
  "of",
  "to",
  "for",
  "with",
  "on",
  "at",
  "by",
]);

/**
 * Find the most relevant chunks for a given query based on keyword overlap and phrase matching
 */
export function findRelevantChunks(query: string, chunks: string[], topK: number = 3): string[] {
  if (!chunks || chunks.length === 0 || !query || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

  // Filter stop words to emphasize key conceptual terms
  const searchKeywords = queryTokens.filter((token) => !STOP_WORDS.has(token));
  const activeKeywords = searchKeywords.length > 0 ? searchKeywords : queryTokens;

  if (activeKeywords.length === 0) {
    return [];
  }

  const scoredChunks: Array<{ chunk: string; score: number }> = [];

  for (const chunk of chunks) {
    const lowerChunk = chunk.toLowerCase();
    let score = 0;
    let matchedUnique = 0;

    // High bonus for exact phrase match
    if (lowerChunk.includes(cleanQuery)) {
      score += 50;
    }

    // Score individual keyword matches
    for (const keyword of activeKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = lowerChunk.match(regex);
      if (matches && matches.length > 0) {
        score += matches.length * 5;
        matchedUnique += 1;
      } else if (lowerChunk.includes(keyword)) {
        score += 2;
        matchedUnique += 1;
      }
    }

    // Coverage bonus: reward chunks that match more of the unique query keywords
    if (matchedUnique > 0) {
      const coverageRatio = matchedUnique / activeKeywords.length;
      score += coverageRatio * 20;
      scoredChunks.push({ chunk, score });
    }
  }

  // If no chunk matches any query keyword, return empty array
  if (scoredChunks.length === 0) {
    return [];
  }

  // Sort descending by relevance score and pick topK
  scoredChunks.sort((a, b) => b.score - a.score);
  return scoredChunks.slice(0, topK).map((item) => item.chunk);
}

/**
 * Query Groq LLaMA-3.3-70B model with strict RAG context and anti-hallucination prompt.
 */
export async function generateRagResponse(
  query: string,
  relevantChunks: string[],
): Promise<string> {
  const fallbackMessage = "Maaf, informasi tersebut tidak ditemukan di dalam modul ini.";

  // Rule 1: If no relevant chunks were retrieved, return fallback immediately
  if (!relevantChunks || relevantChunks.length === 0) {
    return fallbackMessage;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY belum dikonfigurasi di environment variable (.env.local).");
  }

  const contextText = relevantChunks
    .map((chunk, index) => `[Potongan Konteks ${index + 1}]\n${chunk}`)
    .join("\n\n---\n\n");

  const systemPrompt =
    "Anda adalah tutor cerdas NexedAI untuk mahasiswa vokasi D3 Teknik Informatika SV UNS. " +
    "DILARANG berhalusinasi. Anda HANYA boleh menjawab berdasarkan potongan teks modul yang disertakan di dalam tag <konteks>. " +
    'Jika informasi untuk menjawab pertanyaan tidak ditemukan atau tidak cukup dijelaskan di dalam potongan teks modul, Anda WAJIB menjawab persis dengan kalimat: "Maaf, informasi tersebut tidak ditemukan di dalam modul ini."';

  const userPrompt = `<konteks>\n${contextText}\n</konteks>\n\nPertanyaan: ${query.trim()}`;

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0,
  });

  const reply = completion.choices[0]?.message?.content?.trim();
  if (!reply) {
    return fallbackMessage;
  }

  return reply;
}

/**
 * Extract plain text from PDF buffer using pdf-parse with fallback
 */
export async function extractTextFromPdf(buffer: Buffer | Uint8Array): Promise<string> {
  const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  // Strategy 1: Use PDFParse from pdf-parse
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: uint8 });
    try {
      const textResult = await parser.getText();
      if (textResult?.text && textResult.text.trim().length > 0) {
        return textResult.text;
      }
    } finally {
      await parser.destroy().catch(() => {});
    }
  } catch (err) {
    console.warn("PDFParse library extraction warning, attempting stream fallback:", err);
  }

  // Strategy 2: Raw PDF text stream extraction fallback
  const rawString = Buffer.isBuffer(buffer)
    ? buffer.toString("latin1")
    : Buffer.from(buffer).toString("latin1");
  const extractedLines: string[] = [];

  // Match text in parentheses (e.g. (Hello World) Tj)
  const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let match: RegExpExecArray | null = tjRegex.exec(rawString);
  while (match !== null) {
    const rawVal = match[1] ?? "";
    const cleanStr = rawVal
      .replace(/\\([()\\])/g, "$1")
      .replace(/\\r/g, " ")
      .replace(/\\n/g, " ")
      .trim();
    if (cleanStr.length > 0) {
      extractedLines.push(cleanStr);
    }
    match = tjRegex.exec(rawString);
  }

  // Match array-based TJ operators: [ (text1) 20 (text2) ] TJ
  const arrayTjRegex = /\[\s*((?:\([^)]*\)|[0-9.-]+|\s+)+)\s*\]\s*TJ/g;
  let arrayMatch: RegExpExecArray | null = arrayTjRegex.exec(rawString);
  while (arrayMatch !== null) {
    const inner = arrayMatch[1] ?? "";
    const itemRegex = /\(([^)]+)\)/g;
    let itemMatch: RegExpExecArray | null = itemRegex.exec(inner);
    let combined = "";
    while (itemMatch !== null) {
      const itemVal = itemMatch[1] ?? "";
      combined += `${itemVal.replace(/\\([()\\])/g, "$1")} `;
      itemMatch = itemRegex.exec(inner);
    }
    if (combined.trim().length > 0) {
      extractedLines.push(combined.trim());
    }
    arrayMatch = arrayTjRegex.exec(rawString);
  }

  if (extractedLines.length > 0) {
    return extractedLines.join("\n");
  }

  throw new Error("Format PDF tidak dapat diekstrak atau dokumen tidak memuat teks.");
}

/**
 * Save module chunks to in-memory store
 */
export function saveModule(
  moduleId: string,
  filename: string,
  chunks: string[],
  totalWords: number = 0,
): StoredModule {
  const record: StoredModule = {
    moduleId,
    filename,
    chunks,
    uploadedAt: new Date().toISOString(),
    totalWords,
  };
  moduleStore.set(moduleId, record);
  return record;
}

/**
 * Get module by ID
 */
export function getModule(moduleId: string): StoredModule | undefined {
  return moduleStore.get(moduleId);
}

/**
 * Check if module exists in store
 */
export function hasModule(moduleId: string): boolean {
  return moduleStore.has(moduleId);
}

/**
 * List all stored modules
 */
export function listModules(): StoredModule[] {
  return Array.from(moduleStore.values());
}

/**
 * Clear in-memory module store (useful for testing)
 */
export function clearModuleStore(): void {
  moduleStore.clear();
}
