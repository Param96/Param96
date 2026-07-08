// generate-signal.js
// A satellite hub pinging out to each social platform. Purely decorative —
// links don't work inside an <img>-embedded SVG, so keep real clickable
// badges alongside this for actual functionality.

const OUT_PATH = process.env.OUT_PATH || "assets/signal.svg";

const NODES = [
  { name: "DISCORD", color: "#7289DA", angle: -60 },
  { name: "INSTAGRAM", color: "#E4405F", angle: -20 },
  { name: "LINKEDIN", color: "#0077B5", angle: 20 },
  { name: "EMAIL", color: "#D14836", angle: 60 }
];

function buildSvg() {
  const width = 900;
  const height = 260;
  const hubX = width / 2;
  const hubY = height / 2 + 10;
  const radius = 220;

  const stars = Array.from({ length: 20 }, (_, i) => {
    const sx = (i * 61 + 13) % width;
    const sy = (i * 43 + 5) % height;
    const delay = (i % 10) * 0.3;
    return `<circle cx="${sx}" cy="${sy}" r="0.8" fill="#fff" opacity="0.3">
      <animate attributeName="opacity" values="0.05;0.5;0.05" dur="4s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`;
  }).join("\n");

  const links = NODES.map((n, i) => {
    const rad = (n.angle * Math.PI) / 180;
    const nx = hubX + Math.cos(rad) * radius;
    const ny = hubY + Math.sin(rad) * radius * 0.55;
    const delay = (i * 0.6).toFixed(1);

    return `<g>
      <line x1="${hubX}" y1="${hubY}" x2="${nx}" y2="${ny}" stroke="${n.color}" stroke-width="1" opacity="0.25"/>
      <circle r="4" fill="${n.color}">
        <animateMotion dur="2.4s" begin="${delay}s" repeatCount="indefinite"
          path="M ${hubX} ${hubY} L ${nx} ${ny}"/>
        <animate attributeName="opacity" values="1;1;0" dur="2.4s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${nx}" cy="${ny}" r="10" fill="none" stroke="${n.color}" stroke-width="1.5"/>
      <circle cx="${nx}" cy="${ny}" r="10" fill="${n.color}" opacity="0.15">
        <animate attributeName="r" values="10;16;10" dur="2.4s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.25;0;0.25" dur="2.4s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
      <text x="${nx}" y="${ny + (n.angle < 0 ? -20 : 30)}" text-anchor="middle" font-family="Fira Code, monospace"
        font-size="11" fill="${n.color}" letter-spacing="1">${n.name}</text>
    </g>`;
  }).join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="signalbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#030014"/>
      <stop offset="100%" stop-color="#0a0e27"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" rx="10" fill="url(#signalbg)"/>
  ${stars}
  <text x="${hubX}" y="26" text-anchor="middle" font-family="Fira Code, monospace"
    font-size="14" fill="#FFD166" letter-spacing="2">◈ SIGNAL NETWORK ◈</text>
  ${links}
  <circle cx="${hubX}" cy="${hubY}" r="9" fill="#7F5AF0"/>
  <circle cx="${hubX}" cy="${hubY}" r="16" fill="none" stroke="#7F5AF0" stroke-width="1.5" opacity="0.5">
    <animate attributeName="r" values="16;30;16" dur="2.4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite"/>
  </circle>
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
