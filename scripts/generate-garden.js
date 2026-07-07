// generate-garden.js
// Fetches the last N days of GitHub contributions via the GraphQL API and
// renders them as an animated "contribution garden" SVG — no third-party
// rendering service involved, so nothing outside this repo can go down.

const USERNAME = process.env.USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;
const DAYS = 60;
const OUT_PATH = process.env.OUT_PATH || "assets/garden.svg";

if (!USERNAME) throw new Error("USERNAME is empty");
if (!TOKEN) throw new Error("GITHUB_TOKEN is empty");

const QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}`;

async function fetchContributions() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": USERNAME
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } })
  });

  if (!res.ok) {
    throw new Error(`GitHub API request failed: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);

  const weeks = json.data.user.contributionsCollection.contributionCalendar.weeks;
  const allDays = weeks.flatMap(w => w.contributionDays);
  return allDays.slice(-DAYS);
}

function lerp(a, b, t) { return a + (b - a) * t; }

function colorForCount(t) {
  // t in [0,1] -> stem/flower color from dim grey-green to bright bloom
  const stops = [
    { t: 0.0, r: 0x30, g: 0x36, b: 0x3d },
    { t: 0.25, r: 0x2e, g: 0x5a, b: 0x3e },
    { t: 0.55, r: 0x3f, g: 0xb9, b: 0x50 },
    { t: 0.8, r: 0x7c, g: 0xe3, b: 0x8a },
    { t: 1.0, r: 0xff, g: 0xd6, b: 0x6b }
  ];
  let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) { a = stops[i]; b = stops[i + 1]; break; }
  }
  const localT = (b.t - a.t) === 0 ? 0 : (t - a.t) / (b.t - a.t);
  const r = Math.round(lerp(a.r, b.r, localT));
  const g = Math.round(lerp(a.g, b.g, localT));
  const bl = Math.round(lerp(a.b, b.b, localT));
  return `rgb(${r},${g},${bl})`;
}

function buildSvg(days) {
  const maxCount = Math.max(4, ...days.map(d => d.contributionCount));
  const spacing = 13;
  const padX = 24;
  const width = padX * 2 + spacing * (days.length - 1) + 20;
  const height = 220;
  const groundY = height - 34;
  const maxStemHeight = 130;

  const stars = Array.from({ length: 26 }, (_, i) => {
    const sx = (i * 37 + 13) % width;
    const sy = 8 + ((i * 53) % 90);
    const r = (i % 3 === 0) ? 1.4 : 0.8;
    const delay = (i % 10) * 0.3;
    return `<circle cx="${sx}" cy="${sy}" r="${r}" fill="#ffffff" opacity="0.55">
      <animate attributeName="opacity" values="0.15;0.75;0.15" dur="3.5s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`;
  }).join("\n");

  const stems = days.map((d, i) => {
    const x = padX + i * spacing;
    const t = Math.min(1, d.contributionCount / maxCount);
    const stemH = 6 + t * maxStemHeight;
    const color = colorForCount(t);
    const flowerR = 2.2 + t * 5.5;
    const sway = (2 + t * 3).toFixed(1);
    const dur = (3 + (i % 5) * 0.4).toFixed(1);
    const delay = (i * 0.06).toFixed(2);

    return `<g transform="translate(${x} ${groundY})">
      <animateTransform attributeName="transform" type="rotate"
        values="-${sway} 0 0; ${sway} 0 0; -${sway} 0 0"
        dur="${dur}s" begin="${delay}s" repeatCount="indefinite" additive="sum"/>
      <line x1="0" y1="0" x2="0" y2="${-stemH}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="0" cy="${-stemH}" r="${flowerR}" fill="${color}">
        <animate attributeName="r" values="${flowerR};${(flowerR * 1.25).toFixed(1)};${flowerR}"
          dur="${(2.5 + (i % 4) * 0.3).toFixed(1)}s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
    </g>`;
  }).join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0D1117"/>
      <stop offset="100%" stop-color="#1b2a4a"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#161b22"/>
      <stop offset="100%" stop-color="#0D1117"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#sky)"/>
  ${stars}
  <rect x="0" y="${groundY}" width="${width}" height="${height - groundY}" fill="url(#ground)"/>
  <line x1="0" y1="${groundY}" x2="${width}" y2="${groundY}" stroke="#2196F3" stroke-width="1.5" opacity="0.6"/>
  ${stems}
</svg>`;
}

async function main() {
  const days = await fetchContributions();
  const svg = buildSvg(days);
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, svg, "utf8");
  console.log(`Wrote ${OUT_PATH} (${days.length} days, max=${Math.max(...days.map(d => d.contributionCount))})`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
