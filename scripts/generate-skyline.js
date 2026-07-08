// generate-skyline.js
// Each week of the last year becomes a 3D isometric building — taller and
// brighter-windowed the more you shipped that week. A city that grows with you.

const USERNAME = process.env.USERNAME;
const TOKEN = process.env.METRICS_TOKEN || process.env.GITHUB_TOKEN;
const OUT_PATH = process.env.OUT_PATH || "assets/skyline.svg";

if (!USERNAME) throw new Error("USERNAME is empty");
if (!TOKEN) throw new Error("No token found (METRICS_TOKEN or GITHUB_TOKEN)");

const QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays { contributionCount }
        }
      }
    }
  }
}`;

async function fetchWeeks() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": USERNAME
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } })
  });
  if (!res.ok) throw new Error(`GitHub API request failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json.data.user.contributionsCollection.contributionCalendar.weeks;
}

function lerp(a, b, t) { return a + (b - a) * t; }

function colorForHeight(t) {
  // dim void -> cyan -> magenta, taller towers glow hotter
  const stops = [
    { t: 0, r: 0x2a, g: 0x1f, b: 0x4d },
    { t: 0.5, r: 0x2C, g: 0xB1, b: 0xBC },
    { t: 1, r: 0xE9, g: 0x4B, b: 0xFF }
  ];
  let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) { a = stops[i]; b = stops[i + 1]; break; }
  }
  const lt = (b.t - a.t) === 0 ? 0 : (t - a.t) / (b.t - a.t);
  return `rgb(${Math.round(lerp(a.r, b.r, lt))},${Math.round(lerp(a.g, b.g, lt))},${Math.round(lerp(a.b, b.b, lt))})`;
}

function buildSvg(weeks) {
  const weeklyTotals = weeks.map(w => w.contributionDays.reduce((s, d) => s + d.contributionCount, 0));
  const recent = weeklyTotals.slice(-52);
  const maxVal = Math.max(4, ...recent);

  const width = 960;
  const height = 260;
  const groundY = 210;
  const bw = 12;       // building front-face width
  const depth = 6;      // isometric depth offset
  const spacing = (width - 60) / recent.length;
  const maxH = 130;

  const stars = Array.from({ length: 30 }, (_, i) => {
    const sx = (i * 47 + 11) % width;
    const sy = 6 + ((i * 37) % 90);
    const delay = (i % 10) * 0.3;
    return `<circle cx="${sx}" cy="${sy}" r="${i % 3 === 0 ? 1.5 : 0.8}" fill="#fff" opacity="0.4">
      <animate attributeName="opacity" values="0.1;0.7;0.1" dur="3.6s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`;
  }).join("\n");

  const buildings = recent.map((val, i) => {
    const t = Math.min(1, val / maxVal);
    const h = 6 + t * maxH;
    const x = 40 + i * spacing;
    const color = colorForHeight(t);
    const topColor = colorForHeight(Math.min(1, t + 0.15));
    const sideColor = `rgb(${Math.round(20)},${Math.round(20)},${Math.round(25)})`;

    // front face
    const front = `<rect x="${x}" y="${groundY - h}" width="${bw}" height="${h}" fill="${color}"/>`;
    // side face (parallelogram) for iso depth
    const side = `<polygon points="${x + bw},${groundY - h} ${x + bw + depth},${groundY - h - depth} ${x + bw + depth},${groundY - depth} ${x + bw},${groundY}" fill="${sideColor}" opacity="0.85"/>`;
    // top face
    const top = `<polygon points="${x},${groundY - h} ${x + depth},${groundY - h - depth} ${x + bw + depth},${groundY - h - depth} ${x + bw},${groundY - h}" fill="${topColor}"/>`;

    // a beacon light on tall (high-activity) towers only
    let window = "";
    if (t > 0.35) {
      const wy = groundY - h + Math.min(h * 0.4, 14);
      const delay = (i % 8) * 0.4;
      window = `<rect x="${x + 3}" y="${wy}" width="3" height="4" fill="#FFD166">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" begin="${delay}s" repeatCount="indefinite"/>
      </rect>`;
    }

    return front + side + top + window;
  }).join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skysl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#030014"/>
      <stop offset="100%" stop-color="#1a1140"/>
    </linearGradient>
    <radialGradient id="planetGlow" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stop-color="#E9C089"/>
      <stop offset="100%" stop-color="#E9C089" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#skysl)"/>
  ${stars}
  <ellipse cx="${width - 70}" cy="40" rx="30" ry="7" fill="none" stroke="#7F5AF0" stroke-width="1.5" opacity="0.5" transform="rotate(-15 ${width - 70} 40)"/>
  <circle cx="${width - 70}" cy="40" r="16" fill="#E9C089" opacity="0.9"/>
  <circle cx="${width - 70}" cy="40" r="24" fill="url(#planetGlow)" opacity="0.3"/>
  <text x="24" y="26" font-family="Fira Code, monospace" font-size="14" fill="#FFD166" letter-spacing="1">◈ Orbital Skyline</text>
  <text x="24" y="44" font-family="Fira Code, monospace" font-size="10" fill="#8892b0">each tower is a week — taller and brighter the more you shipped</text>
  <line x1="0" y1="${groundY}" x2="${width}" y2="${groundY}" stroke="#7F5AF0" stroke-width="1.2" opacity="0.5"/>
  ${buildings}
</svg>`;
}

async function main() {
  const weeks = await fetchWeeks();
  const svg = buildSvg(weeks);
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, svg, "utf8");
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
