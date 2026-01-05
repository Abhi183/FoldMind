import React, { useMemo } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { AMINO_ACIDS } from "../../domain/constants";

function count(seq: string, re: RegExp) {
  return (seq.match(re) ?? []).length;
}

export default function Metrics({ sequence }: { sequence: string }) {
  const data = useMemo(() => {
    const len = sequence.length || 1;
    const hyd = count(sequence, /[AILMFWV]/g);
    const pol = count(sequence, /[STNQY]/g);
    const pos = count(sequence, /[KRH]/g);
    const neg = count(sequence, /[DE]/g);
    const spec = len - (hyd + pol + pos + neg);

    const pct = (n: number) => Math.round((n / len) * 100);

    return [
      { name: "Hydrophobic", value: hyd, pct: pct(hyd) },
      { name: "Polar", value: pol, pct: pct(pol) },
      { name: "Positive", value: pos, pct: pct(pos) },
      { name: "Negative", value: neg, pct: pct(neg) },
      { name: "Special", value: spec, pct: pct(spec) }
    ];
  }, [sequence]);

  const most = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const c of sequence) freq[c] = (freq[c] ?? 0) + 1;
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return entries.map(([k, v]) => ({
      code: k,
      n: v,
      name: AMINO_ACIDS[k]?.name ?? "?"
    }));
  }, [sequence]);

  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      <div className="col-span-12 lg:col-span-5 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={85} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <div className="text-sm font-semibold">Composition highlights</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {data.map(d => (
            <div key={d.name} className="rounded-xl border border-slate-900/10 bg-white/70 p-3">
              <div className="text-xs text-slate-300/70">{d.name}</div>
              <div className="text-lg font-semibold">{d.pct}%</div>
              <div className="text-[11px] text-slate-300/60">{d.value} residues</div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm font-semibold">Most frequent residues</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {most.map(m => (
            <div key={m.code} className="px-3 py-2 rounded-xl border border-slate-900/10 bg-white/70">
              <div className="font-mono text-sm">{m.code}</div>
              <div className="text-[11px] text-slate-300/70">{m.name}</div>
              <div className="text-[11px] text-slate-300/60">{m.n}×</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
