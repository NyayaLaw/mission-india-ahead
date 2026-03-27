import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

const FEEDS = [
  { url: "https://www.livelaw.in/rss/news",             pillar: "Law & Justice",          source: "LiveLaw" },
  { url: "https://www.barandbench.com/feed",            pillar: "Law & Justice",          source: "Bar & Bench" },
  { url: "https://verdictum.in/feed",                   pillar: "Law & Justice",          source: "Verdictum" },
  { url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", pillar: "Policy & Governance", source: "PIB" },
  { url: "https://www.prsindia.org/feed",               pillar: "Policy & Governance",    source: "PRS India" },
  { url: "https://www.livemint.com/rss/economy",        pillar: "Economy",                source: "Mint" },
  { url: "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms", pillar: "Economy", source: "Economic Times" },
  { url: "https://organiser.org/feed/",                 pillar: "Culture & Civilisation", source: "The Organiser" },
  { url: "https://swarajyamag.com/feed",                pillar: "Culture & Civilisation", source: "Swarajya" },
  { url: "https://www.downtoearth.org.in/rss/feed",     pillar: "Environment & Ecology",  source: "Down To Earth" },
  { url: "https://inc42.com/feed/",                     pillar: "Technology",             source: "Inc42" },
  { url: "https://www.medianama.com/feed/",             pillar: "Technology",             source: "MediaNama" },
  { url: "https://www.careers360.com/rss/news",         pillar: "Education",              source: "Careers360" },
  { url: "https://www.thehindu.com/sci-tech/health/feeder/default.rss", pillar: "Health", source: "The Hindu Health" },
  { url: "https://www.thehindu.com/news/national/feeder/default.rss",   pillar: "Governance", source: "The Hindu" },
  { url: "https://www.thequint.com/rss/india",          pillar: "Security & Strategy",    source: "The Quint" },
  { url: "https://mea.gov.in/press-releases.htm?rss",   pillar: "Security & Strategy",    source: "MEA" },
];

// Topic trackers — keyword → tracker name
const TRACKERS: Record<string, string[]> = {
  "Human Rights":   ["human rights", "fundamental rights", "habeas corpus", "nhrc", "torture", "custodial"],
  "Legislation":    ["bill", "act passed", "parliament", "lok sabha passed", "rajya sabha passed", "amendment", "ordinance"],
  "Judiciary":      ["supreme court", "high court", "tribunal", "bench", "judgment", "verdict", "order", "chief justice"],
  "Constitution":   ["constitutional", "article 32", "article 226", "basic structure", "amendment", "preamble"],
  "Criminal Law":   ["fir", "arrest", "bail", "conviction", "acquittal", "ipc", "bns", "bnss", "crpc"],
  "Environment":    ["forest", "wildlife", "pollution", "climate", "ngt", "green tribunal", "ecology"],
  "Economy":        ["gdp", "rbi", "inflation", "budget", "fiscal", "gst", "msme", "trade"],
  "Security":       ["terror", "naxal", "border", "defence", "military", "army", "internal security"],
};

const INDIA_KEYWORDS = [
  "india", "bharat", "supreme court", "high court", "parliament", "lok sabha",
  "rajya sabha", "modi", "government of india", "ministry", "central government",
  "state government", "constitution", "rbi", "sebi", "niti aayog", "delhi",
  "indian", "sc", "hc", "cbi", "ed", "nhrc"
];

function isIndiaRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return INDIA_KEYWORDS.some(kw => lower.includes(kw));
}

function getTrackers(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.entries(TRACKERS)
    .filter(([, keywords]) => keywords.some(kw => lower.includes(kw)))
    .map(([name]) => name);
}

function extract(xml: string, tag: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>`, "i"),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, "i"),
  ];
  for (const re of patterns) {
    const m = xml.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function parseRSS(xml: string, pillar: string, source: string) {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = stripTags(extract(block, "title"));
    const link  = extract(block, "link") || extract(block, "guid");
    const desc  = stripTags(extract(block, "description")).slice(0, 300);
    const pub   = extract(block, "pubDate") || extract(block, "dc:date") || "";
    if (!title || !link) continue;
    if (!isIndiaRelevant(title + " " + desc)) continue;
    let pubDate: string;
    try { pubDate = new Date(pub).toISOString(); } catch { pubDate = new Date().toISOString(); }
    const trackers = getTrackers(title + " " + desc);
    items.push({ title, link, description: desc, pubDate, pillar, source, trackers });
  }
  return items;
}

export default async (req: Request) => {
  console.log("fetch-news: starting hourly run");
  const results: any[] = [];

  await Promise.allSettled(FEEDS.map(async ({ url, pillar, source }) => {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "MissionIndiaAhead/2.0 RSS Reader" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const items = parseRSS(xml, pillar, source);
      results.push(...items);
      console.log(`✓ ${source}: ${items.length} items`);
    } catch (err) {
      console.error(`✗ ${source}: ${err instanceof Error ? err.message : err}`);
    }
  }));

  // Deduplicate + sort
  const seen = new Set<string>();
  const deduped = results
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .filter(item => { if (seen.has(item.link)) return false; seen.add(item.link); return true; })
    .slice(0, 200);

  // Group by pillar
  const byPillar: Record<string, any[]> = {};
  for (const item of deduped) {
    if (!byPillar[item.pillar]) byPillar[item.pillar] = [];
    byPillar[item.pillar].push(item);
  }

  // Group by tracker
  const byTracker: Record<string, any[]> = {};
  for (const item of deduped) {
    for (const tracker of (item.trackers || [])) {
      if (!byTracker[tracker]) byTracker[tracker] = [];
      byTracker[tracker].push(item);
    }
  }

  const payload = {
    lastUpdated: new Date().toISOString(),
    totalItems: deduped.length,
    byPillar,
    byTracker,
    all: deduped,
  };

  const store = getStore("news-cache");
  await store.setJSON("latest", payload);
  console.log(`fetch-news: stored ${deduped.length} items`);
};

export const config: Config = { schedule: "@hourly" };
