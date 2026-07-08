// generate-dashboard.js
// A "mission control" style panel — key profile stats as glowing medallions,
// no fabricated percentages, just real numbers with a bit of visual life.

const USERNAME = process.env.USERNAME;
const TOKEN = process.env.METRICS_TOKEN || process.env.GITHUB_TOKEN;
const OUT_PATH = process.env.OUT_PATH || "assets/dashboard.svg";

if (!USERNAME) throw new Error("USERNAME is empty");
if (!TOKEN) throw new Error("No token found (METRICS_TOKEN or GITHUB_TOKEN)");

const QUERY = `
query($login: String!) {
  user(login: $login) {
    createdAt
    followers { totalCount }
    following { totalCount }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      totalCount
      nodes { stargazerCount }
    }
    contributionsCollection {
      contributionCalendar { totalContributions }
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
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

function buildSvg(stats) {
  const width = 900;
  const height = 300;
  const cols = 3, rows = 2;
  const cellW = width / cols;
  const cellH = 220 / rows;
  const topPad = 60;

  const medallions = stats.map((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = cellW * col + cellW / 2;
    const cy = topPad + cellH * row + cellH / 2;
    const R = 46;
    const delay = (i * 0.3).toFixed(2);
    return `<g>
      <circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="${s.color}" opacity="0.08">
        <animate attributeName="opacity" values="0.05;0.18;0.05" dur="3.5s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${s.color}" stroke-width="2" opacity="0.55"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${s.color}" stroke-width="2" stroke-dasharray="6 10" opacity="0.35">
        <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="18s" repeatCount="indefinite"/>
      </circle>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-family="Fira Code, monospace"
        font-size="22" font-weight="700" fill="#E6EDF3">${s.value.toLocaleString()}</text>
      <text x="${cx}" y="${cy + R + 22}" text-anchor="middle" font-family="Fira Code, monospace"
        font-size="12" fill="#7d8590" letter-spacing="0.5">${s.label}</text>
    </g>`;
  }).join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dashbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#030014"/>
      <stop offset="100%" stop-color="#0a0e27"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" rx="10" fill="url(#dashbg)"/>
  <text x="${width / 2}" y="32" text-anchor="middle" font-family="Fira Code, monospace"
    font-size="15" fill="#FFD166" letter-spacing="2">◆ MISSION CONTROL ◆</text>
  ${medallions}
</svg>`;
}

async function main() {
  const user = await fetchData();
  const totalStars = user.repositories.nodes.reduce((sum, r) => sum + (r.stargazerCount || 0), 0);
  const c = user.contributionsCollection;

  const stats = [
    { label: "FOLLOWERS", value: user.followers.totalCount, color: "#2CB1BC" },
    { label: "STARS EARNED", value: totalStars, color: "#FFD166" },
    { label: "PUBLIC REPOS", value: user.repositories.totalCount, color: "#7F5AF0" },
    { label: "COMMITS (YR)", value: c.totalCommitContributions, color: "#9D7FFF" },
    { label: "PULL REQUESTS", value: c.totalPullRequestContributions, color: "#E94BFF" },
    { label: "ISSUES", value: c.totalIssueContributions, color: "#4DD8E6" }
  ];

  const svg = buildSvg(stats);
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
