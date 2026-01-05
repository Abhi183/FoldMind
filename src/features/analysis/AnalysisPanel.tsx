import React from "react";
import { AIAnalysisResult } from "../../domain/types";

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-900 whitespace-pre-wrap">{value}</div>
    </div>
  );
}

export default function AnalysisPanel({ analysis }: { analysis: AIAnalysisResult }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Block label="Summary" value={analysis.summary} />
      <Block label="Secondary structure (prediction)" value={analysis.secondaryStructurePrediction} />
      <Block label="Stability notes" value={analysis.stabilityAssessment} />
      <Block label="Functional domains (hypotheses)" value={analysis.potentialFunctionalDomains} />
      <Block label="Clinical significance (if any)" value={analysis.clinicalSignificance} />
      <Block label="Suggested mutations / experiments" value={analysis.suggestedMutations} />
    </div>
  );
}
