// generate-constellation.js
// Builds a "language constellation" — top languages as stars, sized by real
// usage across your repos, connected like a constellation, with a comet
// sweeping across representing overall activity. Entirely self-generated:
// no third-party rendering service, just this repo's own GraphQL call.

const USERNAME = process.env.USERNAME;
const TOKEN = process.env.METRICS_TOKEN || process.env.GITHUB_TOKEN;
const OUT_PATH = process.env.OUT_PATH || "assets/constellation.svg";
const MAX_STARS = 7;

if (!USERNAME) throw new Error("USERNAME is empty");
if (!TOKEN) throw new Error("No token found (METRICS_TOKEN or GITHUB_TOKEN)");

const QUERY = `
query($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      nodes {
        stargazerCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
    contributionsCollection {
      contributionCalendar { totalContributions }
    }
  }
}`;

async function fetchData() {
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
  return json.data.user;
}

function computeTopLanguages(repos) {
  const totals = new Map(); // name -> { size, color }
  let totalStars = 0;
  for (const repo of repos) {
    totalStars += repo.stargazerCount || 0;
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      const prev = totals.get(name) || { size: 0, color: edge.node.color || "#8b949e" };
      prev.size += edge.size;
      totals.set(name, prev);
    }
  }
  const grandTotal = [...totals.values()].reduce((a, b) => a + b.size, 0) || 1;
  const ranked = [...totals.entries()]
    .map(([name, v]) => ({ name, color: v.color, pct: v.size / grandTotal }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, MAX_STARS);
  return { ranked, totalStars };
}

function buildSvg({ ranked, totalStars, totalContributions }) {
  const width = 900;
  const height = 380;
  const marginX = 70;

  // Positions along a gentle arc, brightest (top language) highest up
  const n = ranked.length || 1;
  const points = ranked.map((lang, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const x = marginX + t * (width - marginX * 2);
    const arc = Math.sin(t * Math.PI); // higher in the middle, dips at edges
    const rankBoost = (n - i) / n; // earlier (more-used) languages sit a bit higher
    const y = 250 - arc * 60 - rankBoost * 70;
    const r = 4 + lang.pct * 46; // star size scaled by usage share
    return { ...lang, x, y, r };
  });

  const backgroundStars = Array.from({ length: 40 }, (_, i) => {
    const sx = (i * 53 + 17) % width;
    const sy = 10 + ((i * 71) % (height - 60));
    const r = (i % 4 === 0) ? 1.6 : 0.9;
    const delay = (i % 12) * 0.35;
    return `<circle cx="${sx}" cy="${sy}" r="${r}" fill="#ffffff" opacity="0.4">
      <animate attributeName="opacity" values="0.1;0.7;0.1" dur="4s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`;
  }).join("\n");

  const constellationLines = points.slice(1).map((p, i) => {
    const prev = points[i];
    return `<line x1="${prev.x}" y1="${prev.y}" x2="${p.x}" y2="${p.y}" stroke="#4493F8" stroke-width="1" opacity="0.35"/>`;
  }).join("\n");

  const stars = points.map((p, i) => {
    const delay = (i * 0.4).toFixed(2);
    const label = `${p.name} · ${(p.pct * 100).toFixed(1)}%`;
    return `<g>
      <circle cx="${p.x}" cy="${p.y}" r="${(p.r * 1.8).toFixed(1)}" fill="${p.color}" opacity="0.15"/>
      <circle cx="${p.x}" cy="${p.y}" r="${p.r.toFixed(1)}" fill="${p.color}">
        <animate attributeName="r" values="${p.r.toFixed(1)};${(p.r * 1.18).toFixed(1)};${p.r.toFixed(1)}"
          dur="3s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
      <text x="${p.x}" y="${p.y + p.r + 18}" text-anchor="middle" font-family="Fira Code, monospace"
        font-size="12" fill="#c9d1d9">${label}</text>
    </g>`;
  }).join("\n");

  const cometPath = `M -40 40 C ${width * 0.3} 20, ${width * 0.6} ${height - 60}, ${width + 40} ${height - 100}`;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0D1117"/>
      <stop offset="100%" stop-color="#161b2e"/>
    </linearGradient>
    <radialGradient id="cometGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <path id="cometTrack" d="${cometPath}" fill="none"/>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#sky)"/>
  ${backgroundStars}

  <text x="${width / 2}" y="34" text-anchor="middle" font-family="Fira Code, monospace"
    font-size="16" fill="#E3B341" letter-spacing="2">✦ LANGUAGE CONSTELLATION ✦</text>
  <text x="${width / 2}" y="54" text-anchor="middle" font-family="Fira Code, monospace"
    font-size="11" fill="#7d8590">${totalContributions.toLocaleString()} contributions charted · ${totalStars} stars earned</text>

  ${constellationLines}
  ${stars}

  <circle r="3" fill="url(#cometGlow)">
    <animateMotion dur="9s" begin="0s" repeatCount="indefinite" path="${cometPath}"/>
  </circle>
  <circle r="1.6" fill="#ffffff">
    <animateMotion dur="9s" begin="0s" repeatCount="indefinite" path="${cometPath}"/>
  </circle>
</svg>`;
}

async function main() {
  const user = await fetchData();
  const repos = user.repositories.nodes;
  const { ranked, totalStars } = computeTopLanguages(repos);
  const totalContributions = user.contributionsCollection.contributionCalendar.totalContributions;

  const svg = buildSvg({ ranked, totalStars, totalContributions });

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, svg, "utf8");
  console.log(`Wrote ${OUT_PATH} — top languages: ${ranked.map(r => r.name).join(", ")}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
