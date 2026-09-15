// src/components/admin/OrdersChart.jsx
import { useState } from "react";

/**
 * Small dependency-free SVG area/line chart.
 * data: [{ label: "1 Aug", value: 62 }, ...]
 * Built by hand instead of pulling in recharts/chart.js so this file has
 * zero new dependencies — swap it out later if the project already has a
 * charting library you'd rather standardize on.
 */
export default function OrdersChart({ data }) {
  const [hovered, setHovered] = useState(null);

  const width = 700;
  const height = 240;
  const padX = 36;
  const padTop = 20;
  const padBottom = 30;

  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = 0;
  const range = max - min || 1;

  const plotW = width - padX * 2;
  const plotH = height - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * plotW;
    const y = padTop + plotH - ((d.value - min) / range) * plotH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${
    padTop + plotH
  } Z`;

  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => Math.round((max / ySteps) * i));

  const active = hovered !== null ? points[hovered] : null;

  return (
    <div className="relative w-full">
      {active && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full bg-gray-900 text-white text-[12px] rounded-lg px-3 py-2 pointer-events-none whitespace-nowrap shadow-lg"
          style={{
            left: `${(active.x / width) * 100}%`,
            top: `${(active.y / height) * 100}%`,
            marginTop: "-10px",
          }}
        >
          <div className="font-semibold">{active.value} Orders</div>
          <div className="text-gray-300 text-[11px]">{active.label}</div>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ordersAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff5a36" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff5a36" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines + y labels */}
        {yLabels.map((label, i) => {
          const y = padTop + plotH - (i / ySteps) * plotH;
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#eeeef3" strokeWidth="1" />
              <text x={0} y={y + 4} fontSize="11" fill="#8b8d97">
                {label}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#ordersAreaFill)" stroke="none" />
        <path d={linePath} fill="none" stroke="#ff5a36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i}>
            {/* wide invisible hit target for easier hovering */}
            <rect
              x={p.x - plotW / data.length / 2}
              y={0}
              width={plotW / data.length}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 5.5 : 4}
              fill="#ff5a36"
              stroke="#fff"
              strokeWidth="2"
              className="transition-all pointer-events-none"
            />
            <text x={p.x} y={height - 4} fontSize="11" fill="#8b8d97" textAnchor="middle">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
