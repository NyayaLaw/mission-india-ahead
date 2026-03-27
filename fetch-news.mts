import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

// ── RSS FEEDS PER PILLAR ─────────────────────────────────────────────────────
const FEEDS = [
  // Law & Justice
  { url: "https://www.livelaw.in/rss/news",             pillar: "Law & Justice",          source: "LiveLaw" },
  { url: "https://www.barandbench.com/feed",            pillar: "Law & Justice",          source: "Bar & Bench" },

  // Policy & Governance
  { url: "https://www.prsindia.org/feed",               pillar: "Policy & Governance",    source: "PRS India" },
  { url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", pillar: "Policy & Governance", source: "PIB" },

  // Economy
  { url: "https://www.livemint.com/rss/economy",        pillar: "Economy",                source: "Mint" },
  { url: "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms", pillar: "Economy", source: "Economic Times" },

  // Security & Strategy
  { url: "https://mea.gov.in/press-releases.htm?dtl/rss", pillar: "Security & Strategy", source: "MEA" },
  { url: "https://www.thequint.com/rss/national/defence",  pillar: "Security & Strategy", source: "The Quint Defence" },

  // Culture & Civilisation
  { url: "https://swarajyamag.com/feed",                pillar: "Culture & Civilisation", source: "Swarajya" },
  { url: "https://organiser.org/feed/",                 pillar: "Culture & Civilisation", source: "The Organiser" },

  // Environment & Ecology
  { url: "https://www.downtoearth.org.in/rss/feed",     pillar: "Environment & Ecology",  source: "Down To Earth" },

  // Education
  { url: "https://www.careers360.com/rss/news",         pillar: "Education",              source: "Careers360" },

  // Health
  { url: "https://www.thehindu.com/sci-tech/health/feeder/default.rss", pillar: "Health", source: "The Hindu Health" },

  // Technology
  { url: "https://inc42.com/feed/",                     pillar: "Technology",             source: "Inc42" },
  { url: "https://www.medianama.com/feed/",             pillar: "Technology",             source: "MediaNama" },

  // Governance
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", pillar: "Governance", source: "The Hindu National" },
];

// ── INDIA KEYWORDS FILTER ────────────────────────────────────────────────────
const INDIA_KEYWORDS = [
  "india", "bharat", "supreme court", "high court", "parliament", "lok sabha",
  "rajya sabha", "modi", "government of india", "ministry", "central government",
  "state government", "constitution", "rbi", "sebi", "niti aayog", "delhi",
  "mumbai", "bengaluru", "chennai", "kolkata", "indian"
];

function isIndiaRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return INDIA_KEYWORDS.some(kw => lower.includes(kw));
}

// ── XML PARSER (no dependencies) ─────────────────────────────────────────────
function parseRSS(xml: string, pillar: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title   = stripTags(extract(block, "title"));
    const link    = extract(block, "link") || extract(block, "guid");
    const pubDate = extract(block, "pubDate") || extract(block, "dc:date") || "";
    const desc    = stripTags(extract(block, "description")).slice(0, 280);

    if (!title || !link) continue;
    if (!isIndiaRelevant(title + " " + desc)) continue;

    let parsedDate: string;
    try {
      parsedDate = new Date(pubDate).toISOString();
    } catch {
      parsedDate = new Date().toISOString();
    }

    items.push({ title, link, description: desc, pubDate: parsedDate, pillar, source });
  }

  return items;
}

function extract(xml: string, tag: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i"),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"),
    new RegExp(`<${tag}[^>]*/?>([^<]*)`, "i"),
  ];
  for (const re of patterns) {
    const m = xml.match(re);
    if (m && m[1]) return m[1].trim();
  }
  return "";
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

// ── TYPES ────────────────────────────────────────────────────────────────────
interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  pillar: string;
  source: string;
}

// ── MAIN FUNCTION ────────────────────────────────────────────────────────────
export default async (req: Request) => {
  console.log("fetch-news: starting RSS fetch run");

  const results: NewsItem[] = [];
  const errors: string[] = [];

  await Promise.allSettled(
    FEEDS.map(async ({ url, pillar, source }) => {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "MissionIndiaAhead/1.0 RSS Reader" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        const items = parseRSS(xml, pillar, source);
        results.push(...items);
        console.log(`✓ ${source}: ${items.length} India-relevant items`);
      } catch (err) {
        const msg = `✗ ${source}: ${err instanceof Error ? err.message : String(err)}`;
        console.error(msg);
        errors.push(msg);
      }
    })
  );

  // Sort by date descending, deduplicate by link, keep top 120
  const seen = new Set<string>();
  const deduped = results
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .filter(item => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .slice(0, 120);

  // Group by pillar
  const byPillar: Record<string, NewsItem[]> = {};
  for (const item of deduped) {
    if (!byPillar[item.pillar]) byPillar[item.pillar] = [];
    byPillar[item.pillar].push(item);
  }

  const payload = {
    lastUpdated: new Date().toISOString(),
    totalItems: deduped.length,
    errors,
    byPillar,
    all: deduped,
  };

  // Store in Netlify Blobs
  const store = getStore("news-cache");
  await store.setJSON("latest", payload);

  console.log(`fetch-news: done — ${deduped.length} items stored`);
};

export const config: Config = {
  schedule: "0 */6 * * *", // every 6 hours
};
