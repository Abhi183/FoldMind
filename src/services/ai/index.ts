import type { ChatMessage } from "../../domain/types";
import { webllmAnalyze, webllmChat, ensureWebLLMSupported } from "./webllmClient";

/**
 * AI Router (FREE, REAL AI)
 * - Only WebLLM (runs locally in browser via WebGPU).
 * - No mock mode. If WebGPU/model load fails, we show a user-friendly error.
 */

export async function analyze(sequence: string, proteinName: string) {
  ensureWebLLMSupported();
  return await webllmAnalyze(sequence, proteinName);
}

export async function chat(history: ChatMessage[], userMessage: string, sequence: string) {
  ensureWebLLMSupported();
  return await webllmChat(history, userMessage, sequence);
}
