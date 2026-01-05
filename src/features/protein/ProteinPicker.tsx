import React from "react";
import { useStudio, useSelectedProtein } from "../../state/studioStore";
import Badge from "../../components/Badge";

export default function ProteinPicker() {
  const { state, dispatch } = useStudio();
  const selected = useSelectedProtein(state);

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-600">Dataset</div>

      <select
        value={state.selectedId}
        onChange={(e) => dispatch({ type: "selectProtein", id: e.target.value })}
        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-900/10 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        {state.dataset.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.length})
          </option>
        ))}
      </select>

      <div className="text-sm font-medium">{selected.name}</div>
      <div className="text-xs text-slate-600">{selected.organism ?? "Unknown organism"}</div>

      <div className="flex flex-wrap gap-2 pt-1">
        {selected.tags.map(t => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
    </div>
  );
}
