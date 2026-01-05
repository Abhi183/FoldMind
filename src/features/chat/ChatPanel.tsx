import React, { useMemo, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useStudio } from "../../state/studioStore";
import { chat } from "../../services/ai";

export default function ChatPanel() {
  const { state, dispatch } = useStudio();
  const [input, setInput] = useState("");

  const canSend = useMemo(() => input.trim().length > 0 && state.chatStatus !== "loading", [input, state.chatStatus]);

  async function onSend() {
    if (!canSend) return;
    const msg = input.trim();
    setInput("");

    dispatch({ type: "chatAppend", message: { role: "user", content: msg } });
    dispatch({ type: "chatStart" });

    try {
      const reply = await chat(state.chat, msg, state.sequence);
      dispatch({ type: "chatAppend", message: { role: "model", content: reply } });
    } catch (e) {
      dispatch({ type: "chatError", error: e instanceof Error ? e.message : "Chat failed" });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2 max-h-[360px] overflow-auto pr-2">
        {state.chat.map((m, idx) => (
          <div
            key={idx}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl bg-indigo-50 border border-indigo-200 px-3 py-2"
                : "mr-auto max-w-[85%] rounded-2xl bg-white/80 border border-slate-900/10 px-3 py-2"
            }
          >
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              {m.role === "user" ? "You" : <span className="inline-flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> FoldMind</span>}
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap mt-1">{m.content}</div>
          </div>
        ))}
        {state.chatStatus === "loading" && (
          <div className="mr-auto max-w-[85%] rounded-2xl bg-white/80 border border-slate-900/10 px-3 py-2">
            <div className="text-[11px] text-slate-500">FoldMind</div>
            <div className="text-sm mt-1 text-slate-600">Thinking…</div>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about motifs, stability, fold class, experiments…"
          className="flex-1 min-h-[44px] max-h-[120px] resize-y px-3 py-2 rounded-xl bg-white border border-slate-900/10 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className="px-3 py-2 rounded-xl border border-slate-900/10 bg-white/80 hover:bg-slate-900/5 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send (Ctrl/Cmd + Enter)"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="text-[11px] text-slate-300/60">
        Tip: press <span className="font-mono">Ctrl/Cmd + Enter</span> to send.
      </div>
    </div>
  );
}
