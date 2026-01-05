import React, { useMemo } from "react";
import { StudioProvider, useStudio, useSelectedProtein } from "../state/studioStore";
import Card from "../components/Card";
import DatasetUploader from "../features/protein/DatasetUploader";
import ProteinPicker from "../features/protein/ProteinPicker";
import SequenceEditor from "../features/protein/SequenceEditor";
import SequenceMap from "../features/protein/SequenceMap";
import ProteinNetwork from "../features/protein/ProteinNetwork";
import StatsPanel from "../features/analysis/StatsPanel";
import AnalysisPanel from "../features/analysis/AnalysisPanel";
import ChatPanel from "../features/chat/ChatPanel";
import { analyze } from "../services/ai";
import { Brain, FlaskConical, Sparkles, Wand2 } from "lucide-react";

function Inner() {
  const { state, dispatch } = useStudio();
  const protein = useSelectedProtein(state);

  const canAnalyze = state.sequence.trim().length > 0 && state.analyzeStatus !== "loading";

  async function run() {
    if (!canAnalyze) return;
    dispatch({ type: "analyzeStart" });
    try {
      const res = await analyze(state.sequence, protein.name);
      dispatch({ type: "analyzeSuccess", analysis: res });
    } catch (e) {
      dispatch({ type: "analyzeError", error: e instanceof Error ? e.message : "AI analysis failed" });
    }
  }

  const headline = useMemo(() => {
    const org = protein.organism ? ` • ${protein.organism}` : "";
    return `${protein.name}${org}`;
  }, [protein]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Hero */}
      <div className="rounded-[28px] border border-slate-900/10 bg-white/75 overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50 via-white to-emerald-50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Brain className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-slate-600">FoldMind Studio</div>
              <div className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 truncate">
                {headline}
              </div>
              <div className="mt-2 text-sm text-slate-600 max-w-3xl">
                Upload a dataset, inspect residues interactively, mutate positions, then run <b>free local AI</b> (WebLLM) for hypotheses.
              </div>
            </div>

            <div className="ml-auto flex flex-col items-end gap-2">
              <button
                onClick={run}
                disabled={!canAnalyze}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-4 h-4" />
                {state.analyzeStatus === "loading" ? "Analyzing…" : "Run AI analysis"}
              </button>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Real AI • Free • Runs in your browser
              </div>
            </div>
          </div>

          {state.error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {state.error}
            </div>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: dataset + sequence */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card title="Dataset & Library" subtitle="Built-in proteins or upload JSON/FASTA">
            <DatasetUploader onLoad={(ds) => dispatch({ type: "setDataset", dataset: ds })} />
            <div className="mt-4">
              <ProteinPicker />
            </div>
          </Card>

          <Card title="Sequence" subtitle="Editable • sanitized automatically">
            <SequenceEditor />
          </Card>

          <Card title="Residue strip" subtitle="Clickable • Shift+Click = mutate">
            <SequenceMap
              sequence={state.sequence}
              selectedIndex={state.selectedResidueIndex}
              onSelect={(idx) => dispatch({ type: "selectResidue", idx })}
              onMutate={(idx, residue) => dispatch({ type: "mutateResidue", idx, residue })}
            />
          </Card>
        </div>

        {/* Center: visualization */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <Card title="Fold proxy" subtitle="Residue network (fast contact intuition)">
            <ProteinNetwork sequence={state.sequence} selectedIndex={state.selectedResidueIndex} />
          </Card>

          <Card title="Stats" subtitle="More metrics (composition, charge, motifs, MW)">
            <StatsPanel sequence={state.sequence} selectedIndex={state.selectedResidueIndex} />
          </Card>
        </div>

        {/* Right: AI + chat */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <Card title="AI Findings" subtitle="Structured output from local WebLLM">
            {state.analysis ? (
              <AnalysisPanel analysis={state.analysis} />
            ) : (
              <div className="text-sm text-slate-600 leading-relaxed">
                Click <b>Run AI analysis</b> to generate a structured report. This uses free local AI — if you get a WebGPU error,
                switch to Chrome/Edge.
              </div>
            )}
          </Card>

          <Card title="Ask FoldMind" subtitle="Chat grounded in current sequence">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              Tip: ask about motifs, domains, mutations, experiments.
            </div>
            <ChatPanel />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <StudioProvider>
      <Inner />
    </StudioProvider>
  );
}
