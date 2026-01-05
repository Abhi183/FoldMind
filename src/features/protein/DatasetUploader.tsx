import React, { useRef, useState } from "react";
import type { Protein } from "../../domain/types";

/**
 * Upload your own dataset:
 * - JSON: array of Protein objects {id,name,organism,length,sequence,tags}
 * - FASTA: multiple entries supported; id/name derived from header line
 */
export default function DatasetUploader({
  onLoad
}: {
  onLoad: (dataset: Protein[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState<string>("");

  function cleanSeq(s: string) {
    return s.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "");
  }

  function parseJson(text: string): Protein[] {
    const raw = JSON.parse(text);
    if (!Array.isArray(raw)) throw new Error("JSON must be an array of proteins.");
    const cleaned: Protein[] = raw.map((p: any, idx: number) => {
      const seq = cleanSeq(String(p.sequence ?? ""));
      if (!seq) throw new Error(`Protein at index ${idx} is missing a valid sequence.`);
      return {
        id: String(p.id ?? `p_${idx + 1}`),
        name: String(p.name ?? `Protein ${idx + 1}`),
        organism: p.organism ? String(p.organism) : undefined,
        length: Number(p.length ?? seq.length),
        sequence: seq,
        tags: Array.isArray(p.tags) ? p.tags.map(String) : []
      };
    });
    return cleaned;
  }

  function parseFasta(text: string): Protein[] {
    const blocks = text.replace(/\r/g, "").split(/^>/m).filter(Boolean);
    if (!blocks.length) throw new Error("FASTA file has no records.");
    const out: Protein[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const lines = blocks[i].trim().split("\n");
      const header = (lines[0] ?? `protein_${i + 1}`).trim();
      const seq = cleanSeq(lines.slice(1).join(""));
      if (!seq) continue;
      const name = header.split("|")[0].trim();
      out.push({
        id: `fasta_${i + 1}`,
        name: name || `FASTA ${i + 1}`,
        organism: undefined,
        length: seq.length,
        sequence: seq,
        tags: ["uploaded"]
      });
    }
    if (!out.length) throw new Error("No valid sequences found in FASTA.");
    return out;
  }

  async function handleFile(file: File) {
    try {
      const text = await file.text();
      let dataset: Protein[];
      if (file.name.toLowerCase().endsWith(".json")) dataset = parseJson(text);
      else dataset = parseFasta(text);

      if (!dataset.length) throw new Error("Dataset is empty.");
      onLoad(dataset);
      setMsg(`Loaded ${dataset.length} proteins from ${file.name}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to load dataset.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-600">Upload dataset (JSON or FASTA)</div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept=".json,.fasta,.fa,.faa,.fna,.txt"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            if (e.target) e.target.value = "";
          }}
        />

        <button
          onClick={() => inputRef.current?.click()}
          className="px-3 py-2 rounded-xl border border-slate-900/10 bg-white hover:bg-slate-900/5 text-sm"
        >
          Choose file
        </button>

        <button
          onClick={() => {
            const sample = [
              {
                id: "custom_1",
                name: "My Protein",
                organism: "Unknown",
                sequence: "MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFF...",
                tags: ["custom"]
              }
            ];
            navigator.clipboard?.writeText(JSON.stringify(sample, null, 2));
            setMsg("Copied a JSON template to clipboard.");
          }}
          className="px-3 py-2 rounded-xl border border-slate-900/10 bg-white hover:bg-slate-900/5 text-sm"
          title="Copies an example JSON structure"
        >
          Copy JSON template
        </button>
      </div>

      {msg && (
        <div className="text-[12px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2">
          {msg}
        </div>
      )}

      <div className="text-[11px] text-slate-500">
        JSON must be an array of objects with at least <span className="font-mono">sequence</span>. FASTA headers are used as names.
      </div>
    </div>
  );
}
