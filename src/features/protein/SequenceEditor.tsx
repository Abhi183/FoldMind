import React, { useMemo } from "react";
import { useStudio } from "../../state/studioStore";

function sanitize(input: string) {
  return input.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "");
}

export default function SequenceEditor() {
  const { state, dispatch } = useStudio();
  const seq = state.sequence;

  const stats = useMemo(() => {
    const len = seq.length;
    const invalid = (seq.match(/[^ACDEFGHIKLMNPQRSTVWY]/g) ?? []).length;
    return { len, invalid };
  }, [seq]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-600">Sequence (FASTA not required)</div>
        <div className="text-xs text-slate-600 font-mono">{stats.len} aa</div>
      </div>

      <textarea
        value={seq}
        onChange={(e) => dispatch({ type: "setSequence", sequence: sanitize(e.target.value) })}
        placeholder="Paste an amino-acid sequence…"
        className="w-full min-h-[160px] resize-y px-3 py-2 rounded-xl bg-white border border-slate-900/10 text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/30"
      />

      <div className="text-[11px] text-slate-500">
        Allowed letters: <span className="font-mono">ACDEFGHIKLMNPQRSTVWY</span>. Everything else is stripped automatically.
      </div>
    </div>
  );
}
