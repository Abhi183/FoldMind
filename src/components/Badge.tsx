import React from "react";

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs border border-slate-900/10 bg-slate-900/5 text-slate-700">
      {children}
    </span>
  );
}
