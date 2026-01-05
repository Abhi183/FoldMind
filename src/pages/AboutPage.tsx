import React from "react";
import Card from "../components/Card";
import { Cpu, Database, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <Card title="FoldMind, explained" subtitle="Protein insight studio + free local AI">
        <div className="text-sm leading-relaxed text-slate-900 space-y-3">
          <p>
            FoldMind is a browser-first workbench for <b>sequence exploration</b>. You can upload proteins, inspect residues interactively,
            run local AI for hypotheses, and chat with context grounded in the sequence you’re working on.
          </p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Mini icon={<Database className="w-4 h-4" />} title="Bring data" text="Upload FASTA or JSON datasets." />
            <Mini icon={<Cpu className="w-4 h-4" />} title="Run locally" text="AI runs on-device using WebGPU." />
            <Mini icon={<Sparkles className="w-4 h-4" />} title="Stay free" text="No keys. No cloud bills." />
          </div>
        </div>
      </Card>

      <Card title="Requirements" subtitle="WebGPU is required for free local AI">
        <div className="text-sm leading-relaxed text-slate-900 space-y-2">
          <p>
            FoldMind uses WebLLM which requires <b>WebGPU</b>. Chrome or Edge on desktop works best. The first time you run AI,
            the model downloads and caches.
          </p>
          <p className="text-slate-600">
            There is <b>no mock mode</b> — if WebGPU is unavailable, AI features will error with a clear message.
          </p>
        </div>
      </Card>
    </div>
  );
}

function Mini({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-900/10 bg-white/80 p-4">
      <div className="flex items-center gap-2 text-slate-900">
        <div className="p-2 rounded-xl bg-slate-900/5 border border-slate-900/10">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="mt-2 text-sm text-slate-600">{text}</div>
    </div>
  );
}
