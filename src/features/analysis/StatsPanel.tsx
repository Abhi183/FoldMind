import React, { useMemo } from "react";
import { computeProteinStats, residueInfo } from "../../domain/proteinStats";

export default function StatsPanel({
  sequence,
  selectedIndex
}: {
  sequence: string;
  selectedIndex: number | null;
}) {
  const stats = useMemo(() => computeProteinStats(sequence), [sequence]);

  const selected = useMemo(() => {
    if (selectedIndex == null) return null;
    const r = sequence[selectedIndex] ?? "";
    return { idx: selectedIndex, r, info: residueInfo(r) };
  }, [sequence, selectedIndex]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="Length" value={`${stats.length} aa`} />
        <Kpi label="Mol. weight" value={`${stats.molecularWeightDa.toLocaleString()} Da`} />
        <Kpi label="Net charge (pH~7)" value={`${stats.netChargeApproxPH7}`} />
        <Kpi label="GRAVY" value={`${stats.gravy}`} />
        <Kpi label="Aliphatic index" value={`${stats.aliphaticIndex}`} />
        <Kpi label="Aromaticity" value={`${stats.aromaticityPct}%`} />
        <Kpi label="Longest hydrophobic run" value={`${stats.longestHydrophobicRun}`} />
        <Kpi label="Motifs (quick scan)" value={stats.motifs.length ? stats.motifs.join(" • ") : "None detected"} wide />
      </div>

      {selected && (
        <div className="rounded-2xl border border-slate-900/10 bg-white/80 p-4">
          <div className="text-xs text-slate-600">Selected residue</div>
          <div className="mt-2 flex items-baseline gap-3">
            <div className="text-2xl font-mono font-semibold">{selected.r}</div>
            <div className="text-sm font-semibold">#{selected.idx + 1}</div>
            <div className="text-sm text-slate-600">{selected.info.name}</div>
          </div>
          <div className="mt-1 text-[12px] text-slate-600">{selected.info.type} • {selected.info.note}</div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-900/10 bg-white/80 p-4">
        <div className="text-xs text-slate-600">Composition</div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          <Chip label="Hydrophobic" value={`${stats.composition.hydrophobicPct}%`} />
          <Chip label="Polar" value={`${stats.composition.polarPct}%`} />
          <Chip label="Positive" value={`${stats.composition.positivePct}%`} />
          <Chip label="Negative" value={`${stats.composition.negativePct}%`} />
          <Chip label="Special" value={`${stats.composition.specialPct}%`} />
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 rounded-2xl border border-slate-900/10 bg-white/80 p-3" : "rounded-2xl border border-slate-900/10 bg-white/80 p-3"}>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-900/10 bg-slate-900/5 p-2 text-center">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
