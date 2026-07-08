// generate-orbit.js
// Tech stack categories rendered as planets orbiting a central star.
// Static/curated data — no GitHub API needed. Edit CATEGORIES below and
// re-run to regenerate whenever your stack changes.

const OUT_PATH = process.env.OUT_PATH || "assets/orbit.svg";

const CATEGORIES = [
  { name: "LANGUAGES", count: 4, color: "#2CB1BC", period: 6 },
  { name: "AI / ML", count: 8, color: "#7F5AF0", period: 9 },
  { name: "FRONTEND", count: 12, color: "#E94BFF", period: 12 },
  { name: "BACKEND", count: 9, color: "#4DD8E6", period: 15 },
  { name: "CLOUD & TOOLS", count: 11, color: "#9D7FFF", period: 18 },
  { name: "DESIGN & OTHER", count: 8, color: "#FFD166", period: 21 }
];

function buildSvg() {
  const width = 900;
  const height = 620;
  const cx = width / 2;
  const cy = height / 2;
  const ringGap = 46;
  const baseR = 60;

  const stars = Array.from({ length: 35 }, (_, i) => {
    const sx = (i * 53 + 17) % width;
    const sy = (i * 71 + 9) % height;
    const delay = (i % 12) * 0.3;
    return `<circle cx="${sx}" cy="${sy}" r="${i % 4 === 0 ? 1.5 : 0.8}" fill="#fff" opacity="0.35">
      <animate attributeName="opacity" values="0.1;0.6;0.1" dur="4s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`;
  }).join("\n");

  const rings = CATEGORIES.map((cat, i) => {
    const r = baseR + i * ringGap;
    const labelY = cy - r - 8;
    return `<g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cat.color}" stroke-width="1" opacity="0.28" stroke-dasharray="3 5"/>
      <text x="${cx}" y="${labelY}" text-anchor="middle" font-family="Fira Code, monospace"
        font-size="11" fill="${cat.color}" letter-spacing="1">${cat.name} · ${cat.count}</text>
      <circle r="6" fill="${cat.color}">
        <animateMotion dur="${cat.period}s" begin="0s" repeatCount="indefinite"
          path="M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}"/>
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle r="10" fill="${cat.color}" opacity="0.25">
        <animateMotion dur="${cat.period}s" begin="0s" repeatCount="indefinite"
          path="M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}"/>
      </circle>
    </g>`;
  }).join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="orbitbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#030014"/>
      <stop offset="100%" stop-color="#0a0e27"/>
    </linearGradient>
    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFD166"/>
      <stop offset="60%" stop-color="#FFD166" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FFD166" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#orbitbg)"/>
  ${stars}
  <text x="${cx}" y="30" text-anchor="middle" font-family="Fira Code, monospace"
    font-size="15" fill="#FFD166" letter-spacing="2">◆ TECH ORBIT ◆</text>
  <circle cx="${cx}" cy="${cy}" r="34" fill="url(#starGlow)"/>
  <circle cx="${cx}" cy="${cy}" r="14" fill="#FFD166">
    <animate attributeName="r" values="14;16;14" dur="3s" repeatCount="indefinite"/>
  </circle>
  ${rings}
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
