import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Brain, FlaskConical, Github, LayoutDashboard, Sparkles } from "lucide-react";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

class Boundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; msg?: string }> {
  state = { hasError: false, msg: undefined as string | undefined };
  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, msg: err instanceof Error ? err.message : "Unknown error" };
  }
  componentDidCatch(err: unknown) {
    console.error("UI error:", err);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
              <Sparkles className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <div className="text-lg font-semibold">FoldMind crashed while rendering</div>
              <div className="text-sm text-slate-500">Usually this is an env/config issue.</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-700 font-mono whitespace-pre-wrap">
            {this.state.msg}
          </div>

          <div className="mt-5 text-sm text-slate-300/90 leading-relaxed">
            Quick fixes:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Open DevTools → Console and look at the <b>first</b> error.</li>
              <li>For Local AI, ensure your browser supports <b>WebGPU</b> (Chrome/Edge).</li>
              <li>Hard refresh / clear cache.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-slate-900/10 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/studio" className="flex items-center gap-2 group">
            <div className="p-2 rounded-2xl bg-indigo-500/10 border border-indigo-400/20">
              <Brain className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="font-semibold tracking-tight leading-4">FoldMind</div>
              <div className="text-xs text-slate-500 leading-4">Protein Insight Studio</div>
            </div>
          </Link>

          <nav className="ml-auto flex items-center gap-2">
            <NavLink
              to="/studio"
              className={({ isActive }) =>
                cx(
                  "px-3 py-2 rounded-xl text-sm flex items-center gap-2 border",
                  isActive ? "bg-slate-900/5 border-slate-900/10 text-white" : "border-transparent text-slate-700 hover:text-white hover:bg-slate-900/5"
                )
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Studio
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                cx(
                  "px-3 py-2 rounded-xl text-sm flex items-center gap-2 border",
                  isActive ? "bg-slate-900/5 border-slate-900/10 text-white" : "border-transparent text-slate-700 hover:text-white hover:bg-slate-900/5"
                )
              }
            >
              <FlaskConical className="w-4 h-4" />
              About
            </NavLink>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="ml-1 px-3 py-2 rounded-xl text-sm flex items-center gap-2 border border-transparent text-slate-700 hover:text-white hover:bg-slate-900/5"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
              Repo
            </a>
          </nav>
        </div>
      </header>

      {/* page */}
      <Boundary key={location.pathname}>{children}</Boundary>

      <footer className="max-w-7xl mx-auto px-4 py-10 text-xs text-slate-500">
        <div className="flex items-center justify-between border-t border-slate-900/10 pt-6">
          <div>© {new Date().getFullYear()} FoldMind</div>
          <div className="font-mono">hash-router • vite • d3 • recharts • local ai</div>
        </div>
      </footer>
    </div>
  );
}
