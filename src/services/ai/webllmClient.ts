import * as webllm from "@mlc-ai/web-llm";
import type { AIAnalysisResult, ChatMessage } from "../../domain/types";

/**
 * REAL + FREE AI via WebLLM (WebGPU).
 * WebLLM only supports models that exist in prebuiltAppConfig.model_list.
 * The model IDs often include the "-MLC" suffix (and sometimes "-1k").
 * See: prebuiltAppConfig.model_list. :contentReference[oaicite:1]{index=1}
 */

let engine: webllm.MLCEngine | null = null;
let engineModel: string | null = null;

/**
 * ✅ Use a model ID that exists in WebLLM's built-in registry.
 * These IDs commonly include "-MLC".
 *
 * Good default:
 * - "Phi-3-mini-4k-instruct-q4f16_1-MLC"
 *
 * Alternative:
 * - "Llama-3-8B-Instruct-q4f16_1-MLC"
 */
const DEFAULT_MODEL_ID = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

export function ensureWebLLMSupported() {
  const nav: any = navigator;
  if (!nav.gpu) {
    throw new Error(
      "WebGPU not available. Free local AI requires WebGPU. Use Chrome/Edge and enable WebGPU."
    );
  }
}

/**
 * Helpful: call this once to see EXACT model IDs available in your build.
 * Open DevTools console and run:
 *   window.__foldmindModels
 */
function exposeModelList() {
  try {
    const list = (webllm as any).prebuiltAppConfig?.model_list ?? [];
    (window as any).__foldmindModels = list.map((m: any) => m.model_id ?? m.modelId ?? m.id ?? m);
  } catch {
    (window as any).__foldmindModels = [];
  }
}

function resolveModelIdOrThrow(preferred: string) {
  const list = (webllm as any).prebuiltAppConfig?.model_list ?? [];
  const ids = list.map((m: any) => m.model_id ?? m.modelId ?? m.id).filter(Boolean);

  if (ids.includes(preferred)) return preferred;

  // Try common variants (some lists include -1k variants)
  const variants = [
    preferred,
    `${preferred}-1k`,
    preferred.replace(/-MLC$/, "-MLC-1k")
  ];
  for (const v of variants) if (ids.includes(v)) return v;

  // If still not found, give a helpful error with a few available IDs
  const sample = ids.slice(0, 12).join(", ");
  throw new Error(
    `WebLLM model ID not found in prebuiltAppConfig.model_list: "${preferred}". ` +
      `Available sample IDs: ${sample}. ` +
      `Open console and inspect window.__foldmindModels for the full list.`
  );
}

async function getEngine(modelId = DEFAULT_MODEL_ID) {
  ensureWebLLMSupported();
  exposeModelList();

  const resolved = resolveModelIdOrThrow(modelId);

  if (engine && engineModel === resolved) return engine;

  engine = await webllm.CreateMLCEngine(resolved, {
    initProgressCallback: (p) => {
      // optional progress hook
      // console.log(`[WebLLM] ${Math.round(p.progress * 100)}% ${p.text}`);
    }
  });

  engineModel = resolved;
  return engine;
}

function extractJson(text: string): string {
  const t = (text ?? "").trim();
  if (t.startsWith("{") && t.endsWith("}")) return t;

  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) return t.slice(start, end + 1);

  return "{}";
}

export async function webllmAnalyze(
  sequence: string,
  proteinName: string
): Promise<AIAnalysisResult> {
  const eng = await getEngine();

  const prompt = `
You are FoldMind, a protein analysis assistant.

Return ONLY valid JSON with EXACT keys:
summary,
secondaryStructurePrediction,
stabilityAssessment,
potentialFunctionalDomains,
clinicalSignificance,
suggestedMutations

Protein: ${proteinName}
Sequence:
${sequence}

Be conservative. If uncertain, say what data is missing.
`;

  const res = await eng.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  const text = res.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(extractJson(text));
}

export async function webllmChat(
  history: ChatMessage[],
  userMessage: string,
  sequence: string
): Promise<string> {
  const eng = await getEngine();

  const transcript = history
    .slice(-8)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `
You are FoldMind, a concise protein assistant.

Current sequence:
${sequence}

Conversation:
${transcript}

User:
${userMessage}

Assistant:
`;

  const res = await eng.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5
  });

  return res.choices?.[0]?.message?.content?.trim() ?? "";
}
