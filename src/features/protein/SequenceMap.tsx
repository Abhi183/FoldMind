import React, { useMemo } from "react";
import { TYPE_COLOR } from "../../domain/constants";
import { residueInfo } from "../../domain/proteinStats";

function cx(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function SequenceMap({
  sequence,
  selectedIndex,
  onSelect,
  onMutate
}: {
  sequence: string;
  selectedIndex: number | null;
  onSelect: (idx: number) => void;
  onMutate: (idx: number, newResidue: string) => void;
}) {
  const seq = sequence || "";

  const residues = useMemo(() => seq.split(""), [seq]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-600">Interactive residues</div>
        <div className="text-[11px] text-slate-500">
          Click to inspect • Shift+Click to mutate
        </div>
      </div>

      <div className="rounded-2xl border border-slate-900/10 bg-white/80 p-2 overflow-auto">
        <div className="flex gap-1 w-max">
          {residues.map((r, i) => {
            const info = residueInfo(r);
            const color = TYPE_COLOR[info.type] ?? "#64748b";

            const isSel = selectedIndex === i;
            return (
              <button
                key={i}
                className={cx(
                  "w-7 h-8 rounded-xl border text-xs font-mono flex items-center justify-center transition",
                  isSel ? "border-slate-900/30 ring-2 ring-indigo-500/20" : "border-slate-900/10 hover:border-slate-900/20"
                )}
                style={{ background: `${color}1A` as any, color: "#0f172a" }}
                title={`${i + 1}: ${info.name} (${info.type}) — ${info.note}`}
                onClick={(e) => {
                  if (e.shiftKey) {
                    const newR = prompt(`Mutate position ${i + 1} (${r}) to which residue? (A,C,D,E,F,G,H,I,K,L,M,N,P,Q,R,S,T,V,W,Y)`, r);
                    if (newR) onMutate(i, newR.toUpperCase().slice(0, 1));
                    return;
                  }
                  onSelect(i);
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] text-slate-500">
        Mutations update stats + visualization instantly (simple sequence edit; no structure recalculation).
      </div>
    </div>
  );
}
