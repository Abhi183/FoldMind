import { AMINO_ACIDS } from "./constants";

export type ProteinStats = {
  length: number;
  counts: Record<string, number>;
  composition: {
    hydrophobicPct: number;
    polarPct: number;
    positivePct: number;
    negativePct: number;
    specialPct: number;
  };
  netChargeApproxPH7: number;
  aromaticityPct: number;
  aliphaticIndex: number;
  molecularWeightDa: number;
  gravy: number; // Kyte-Doolittle average hydropathy
  longestHydrophobicRun: number;
  motifs: string[];
};

const KD: Record<string, number> = {
  A: 1.8, R: -4.5, N: -3.5, D: -3.5, C: 2.5, Q: -3.5, E: -3.5, G: -0.4,
  H: -3.2, I: 4.5, L: 3.8, K: -3.9, M: 1.9, F: 2.8, P: -1.6, S: -0.8,
  T: -0.7, W: -0.9, Y: -1.3, V: 4.2
};

// average residue mass (Da) (approx, without water corrections beyond peptide bonds)
const MASS: Record<string, number> = {
  A: 71.0788, R: 156.1875, N: 114.1038, D: 115.0886, C: 103.1388,
  Q: 128.1307, E: 129.1155, G: 57.0519, H: 137.1411, I: 113.1594,
  L: 113.1594, K: 128.1741, M: 131.1926, F: 147.1766, P: 97.1167,
  S: 87.0782, T: 101.1051, W: 186.2132, Y: 163.1760, V: 99.1326
};

// quick motif probes (not exhaustive)
const MOTIF_PATTERNS: Array<[string, RegExp]> = [
  ["N-glycosylation (NXS/T)", /N[^P][ST]/g],
  ["ATP-binding (P-loop NTPase) (A/GxxxxGKT)", /[AG]....GKT/g],
  ["HExxH (metalloprotease-like)", /HE..H/g],
  ["C2H2-like (C..C....H..H)", /C..C....H..H/g]
];

function pct(n: number, d: number) {
  return d ? Math.round((n / d) * 1000) / 10 : 0;
}

export function computeProteinStats(sequence: string): ProteinStats {
  const seq = (sequence || "").trim().toUpperCase();
  const length = seq.length;

  const counts: Record<string, number> = {};
  for (const c of seq) counts[c] = (counts[c] ?? 0) + 1;

  const hyd = (seq.match(/[AILMFWV]/g) ?? []).length;
  const pol = (seq.match(/[STNQY]/g) ?? []).length;
  const pos = (seq.match(/[KRH]/g) ?? []).length;
  const neg = (seq.match(/[DE]/g) ?? []).length;
  const spec = Math.max(0, length - (hyd + pol + pos + neg));

  // crude net charge at pH ~7: K/R +0.9, H +0.1, D/E -1.0
  const netChargeApproxPH7 =
    (counts["K"] ?? 0) * 0.9 +
    (counts["R"] ?? 0) * 0.9 +
    (counts["H"] ?? 0) * 0.1 -
    (counts["D"] ?? 0) * 1.0 -
    (counts["E"] ?? 0) * 1.0;

  const arom = (counts["F"] ?? 0) + (counts["W"] ?? 0) + (counts["Y"] ?? 0);
  const aromaticityPct = pct(arom, length);

  // aliphatic index (rough): X(Ala)+2.9*X(Val)+3.9*(X(Ile)+X(Leu)) per 100 residues
  const xA = pct(counts["A"] ?? 0, length);
  const xV = pct(counts["V"] ?? 0, length);
  const xI = pct(counts["I"] ?? 0, length);
  const xL = pct(counts["L"] ?? 0, length);
  const aliphaticIndex = Math.round((xA + 2.9 * xV + 3.9 * (xI + xL)) * 10) / 10;

  // molecular weight: sum residue masses - water (18.015) * (n-1) due to peptide bonds
  let mw = 0;
  for (const c of seq) mw += MASS[c] ?? 0;
  if (length > 1) mw -= 18.015 * (length - 1);
  const molecularWeightDa = Math.round(mw);

  // GRAVY
  let hydSum = 0;
  for (const c of seq) hydSum += KD[c] ?? 0;
  const gravy = Math.round(((length ? hydSum / length : 0) * 100) ) / 100;

  // Longest hydrophobic run
  let best = 0, cur = 0;
  for (const c of seq) {
    if ("AILMFWV".includes(c)) {
      cur += 1;
      best = Math.max(best, cur);
    } else cur = 0;
  }
  const longestHydrophobicRun = best;

  const motifs: string[] = [];
  for (const [label, rx] of MOTIF_PATTERNS) {
    const m = seq.match(rx);
    if (m && m.length) motifs.push(`${label}: ${m.length}`);
  }

  return {
    length,
    counts,
    composition: {
      hydrophobicPct: pct(hyd, length),
      polarPct: pct(pol, length),
      positivePct: pct(pos, length),
      negativePct: pct(neg, length),
      specialPct: pct(spec, length)
    },
    netChargeApproxPH7: Math.round(netChargeApproxPH7 * 10) / 10,
    aromaticityPct,
    aliphaticIndex,
    molecularWeightDa,
    gravy,
    longestHydrophobicRun,
    motifs
  };
}

export function residueInfo(residue: string) {
  const r = residue.toUpperCase();
  return AMINO_ACIDS[r] ?? { code: r, name: "Unknown", type: "polar", note: "" };
}
