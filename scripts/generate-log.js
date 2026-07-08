// generate-log.js
// A compact terminal-style status readout for the About Me section.
// Static/curated data — edit LINES below and re-run to update.

const OUT_PATH = process.env.OUT_PATH || "assets/log.svg";

const LINES = [
  { tag: "STATUS", text: "Building full-stack apps with AI/ML integrations", color: "#2CB1BC" },
  { tag: "OBJECTIVE", text: "Applying ML fundamentals beyond tutorials", color: "#7F5AF0" },
  { tag: "SEEKING", text: "Collaborators on AI-powered products", color: "#E94BFF" },
  { tag: "LEARNING", text: "Data science basics, productionizing models", color: "#FFD166" }
];

function buildSvg() {
  const width = 900;
  const lineH = 34;
  const topPad = 46;
  const height = topPad + LINES.length * lineH + 24;

  const rows = LINES.map((l, i) => {
    const y = topPad + i * lineH;
    const delay = (i * 0.4).toFixed(1);
    return `<g>
      <circle cx="26" cy="${y - 5}" r="3" fill="${l.color}">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
      <text x="42" y="${y}" font-family="Fira Code, monospace" font-size="13" fill="${l.color}" font-weight="700">${l.tag}</text>
      <text x="150" y="${y}" font-family="Fira Code, monospace" font-size="13" fill="#c9d1d9">${l.text}</text>
    </g>`;
  }).join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0e27"/>
      <stop offset="100%" stop-color="#030014"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" rx="10" fill="url(#logbg)" stroke="#7F5AF0" stroke-width="1" stroke-opacity="0.3"/>
  <circle cx="20" cy="20" r="4" fill="#E94BFF" opacity="0.8"/>
  <circle cx="34" cy="20" r="4" fill="#FFD166" opacity="0.8"/>
  <circle cx="48" cy="20" r="4" fill="#2CB1BC" opacity="0.8"/>
  <text x="${width - 20}" y="25" text-anchor="end" font-family="Fira Code, monospace"
    font-size="12" fill="#7F5AF0" letter-spacing="1">MISSION LOG — PARAM PATEL</text>
  <line x1="16" y1="34" x2="${width - 16}" y2="34" stroke="#7F5AF0" stroke-width="1" opacity="0.25"/>
  ${rows}
</svg>`;
}

async function main() {
  const svg = buildSvg();
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, svg, "utf8");
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch(err => { console.error(err); process.exit(1); });
