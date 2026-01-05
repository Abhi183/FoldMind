import React from "react";

export default function Card({
  title,
  subtitle,
  right,
  children
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white/80 border border-slate-900/10 rounded-2xl shadow-[0_0_0_1px_rgba(15,23,42,.05)] overflow-hidden">
      {(title || subtitle || right) && (
        <header className="px-4 py-3 border-b border-slate-900/10 flex items-center gap-3">
          <div className="min-w-0">
            {title && <div className="font-semibold truncate">{title}</div>}
            {subtitle && <div className="text-xs text-slate-300/70 truncate">{subtitle}</div>}
          </div>
          <div className="ml-auto">{right}</div>
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
