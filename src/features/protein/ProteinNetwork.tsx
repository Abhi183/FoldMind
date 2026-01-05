import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { AMINO_ACIDS, TYPE_COLOR } from "../../domain/constants";

type Node = d3.SimulationNodeDatum & {
  id: number;
  residue: string;
  type: string;
};

type Link = d3.SimulationLinkDatum<Node> & {
  source: number | Node;
  target: number | Node;
};

export default function ProteinNetwork({ sequence, selectedIndex }: { sequence: string; selectedIndex: number | null }) {
  const ref = useRef<SVGSVGElement | null>(null);

  const data = useMemo(() => {
    const seq = sequence.slice(0, 280); // keep it snappy
    const nodes: Node[] = seq.split("").map((r, i) => ({
      id: i,
      residue: r,
      type: AMINO_ACIDS[r]?.type ?? "polar"
    }));

    const links: Link[] = [];
    for (let i = 0; i < nodes.length - 1; i++) links.push({ source: i, target: i + 1 });

    // fake "contacts" to give it a fold-ish feel
    for (let i = 0; i < nodes.length; i += 8) {
      const j = i + 6;
      if (j < nodes.length) links.push({ source: i, target: j });
    }
    return { nodes, links };
  }, [sequence]);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const width = svg.clientWidth || 640;
    const height = 340;

    const root = d3.select(svg);
    root.selectAll("*").remove();

    root
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("width", "100%")
      .style("height", "340px");

    const g = root.append("g");

    // subtle grid
    const grid = g.append("g").attr("opacity", 0.08);
    for (let x = 0; x < width; x += 28) grid.append("line").attr("x1", x).attr("y1", 0).attr("x2", x).attr("y2", height).attr("stroke", "#94a3b8");
    for (let y = 0; y < height; y += 28) grid.append("line").attr("x1", 0).attr("y1", y).attr("x2", width).attr("y2", y).attr("stroke", "#94a3b8");

    const link = g
      .append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "rgba(15,23,42,.18)")
      .attr("stroke-width", 1);

    const node = g
      .append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 5.2)
      .attr("fill", d => TYPE_COLOR[d.type] ?? "#94a3b8")
      .attr("stroke", "rgba(15,23,42,.55)")
      .attr("stroke-width", d => (selectedIndex === d.id ? 2.4 : 1.2))
      .attr("stroke", d => (selectedIndex === d.id ? "rgba(99,102,241,.85)" : "rgba(15,23,42,.55)"));


    const tooltip = d3.select(svg.parentElement)
      .append("div")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("padding", "8px 10px")
      .style("border-radius", "12px")
      .style("border", "1px solid rgba(15,23,42,.12)")
      .style("background", "rgba(255,255,255,.95)")
      .style("backdrop-filter", "blur(10px)")
      .style("color", "rgba(15,23,42,.92)")
      .style("font", "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas")
      .style("opacity", 0);

    node
      .on("mousemove", (event, d) => {
        const info = AMINO_ACIDS[d.residue];
        tooltip
          .style("opacity", 1)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY + 12}px`)
          .html(`<div style="font-weight:700">${d.residue} — ${info?.name ?? "Unknown"}</div><div style="opacity:.8">${info?.type ?? "?"} • ${info?.note ?? ""}</div>`);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    const sim = d3.forceSimulation<Node>(data.nodes)
      .force("link", d3.forceLink<Node, Link>(data.links).id(d => d.id).distance(18).strength(0.9))
      .force("charge", d3.forceManyBody().strength(-28))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.09))
      .force("collide", d3.forceCollide(8).strength(0.9));

    // "hydrophobic collapse" feel: pull hydrophobics in, push charged out
    const collapse = (alpha: number) => {
      const cx = width / 2, cy = height / 2;
      for (const n of data.nodes) {
        const dx = cx - (n.x ?? cx);
        const dy = cy - (n.y ?? cy);
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const k = n.type === "hydrophobic" ? 0.015 : (n.type === "positive" || n.type === "negative") ? -0.01 : 0.0;
        n.vx = (n.vx ?? 0) + (dx / dist) * k * alpha * 120;
        n.vy = (n.vy ?? 0) + (dy / dist) * k * alpha * 120;
      }
    };

    sim.on("tick", () => {
      collapse(sim.alpha());
      link
        .attr("x1", d => (d.source as Node).x ?? 0)
        .attr("y1", d => (d.source as Node).y ?? 0)
        .attr("x2", d => (d.target as Node).x ?? 0)
        .attr("y2", d => (d.target as Node).y ?? 0);

      node
        .attr("cx", d => d.x ?? 0)
        .attr("cy", d => d.y ?? 0);
    });

    return () => {
      sim.stop();
      tooltip.remove();
    };
  }, [data, selectedIndex]);

  return (
    <div className="relative">
      <svg ref={ref} className="rounded-2xl" />
      <div className="mt-2 text-[11px] text-slate-500">
        Visualization is a **force-network proxy** (not a real 3D fold). It’s meant for intuition: residue types + contacts.
      </div>
    </div>
  );
}
