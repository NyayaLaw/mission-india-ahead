import { getStore } from "@netlify/blobs";

const FEEDS = [
  { url: "https://www.barandbench.com/feed",            pillar: "Law & Justice",          source: "Bar & Bench" },
  { url: "https://verdictum.in/feed",                   pillar: "Law & Justice",          source: "Verdictum" },
  { url: "https://www.scobserver.in/feed/",             pillar: "Law & Justice",          source: "SC Observer" },
  { url: "https://www.legallyindia.com/feed",           pillar: "Law & Justice",          source: "Legally India" },
  { url: "https://www.indialegallive.com/feed/",        pillar: "Law & Justice",          source: "India Legal Live" },
  { url: "https://www.scconline.com/blog/feed/",        pillar: "Law & Justice",          source: "SCC Online Blog" },
  { url: "https://indianexpress.com/section/india/feed/",        pillar: "Law & Justice", source: "Indian Express" },
  { url: "https://indianexpress.com/section/explained/feed/",    pillar: "Law & Justice", source: "IE Explained" },
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", pillar: "Law & Justice", source: "The Hindu" },
  { url: "https://www.amarujala.com/rss/crime.xml",              pillar: "Law & Justice", source: "Amar Ujala Crime" },
  { url: "https://www.deccanherald.com/feed/",                   pillar: "Law & Justice", source: "Deccan Herald" },
  { url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", pillar: "Policy & Governance", source: "PIB" },
  { url: "https://indianexpress.com/section/political-pulse/feed/", pillar: "Policy & Governance", source: "IE Political Pulse" },
  { url: "https://www.thehindu.com/opinion/editorial/feeder/default.rss", pillar: "Policy & Governance", source: "The Hindu Editorial" },
  { url: "https://feeds.feedburner.com/NDTV-LatestNews",         pillar: "Policy & Governance", source: "NDTV" },
  { url: "https://feeds.feedburner.com/firstpostin",             pillar: "Policy & Governance", source: "Firstpost" },
  { url: "https://hindi.theprint.in/feed/",                      pillar: "Policy & Governance", source: "The Print Hindi" },
  { url: "https://www.amarujala.com/rss/india-news.xml",         pillar: "Policy & Governance", source: "Amar Ujala" },
  { url: "https://www.bhaskar.com/rss-feed/1061/",               pillar: "Policy & Governance", source: "Dainik Bhaskar" },
  { url: "https://www.panchjanya.com/feed/",                     pillar: "Policy & Governance", source: "Panchajanya" },
  { url: "https://www.livemint.com/rss/economy",                 pillar: "Economy", source: "Mint" },
  { url: "https://www.livemint.com/rss/politics",                pillar: "Economy", source: "Mint Politics" },
  { url: "https://indianexpress.com/section/business/economy/feed/", pillar: "Economy", source: "IE Economy" },
  { url: "https://www.thehindubusinessline.com/feeder/default.rss",  pillar: "Economy", source: "Business Line" },
  { url: "https://feeds.feedburner.com/ndtvnews-latest",         pillar: "Economy", source: "NDTV Business" },
  { url: "https://organiser.org/feed/",                          pillar: "Culture & Civilisation", source: "The Organiser" },
  { url: "https://swarajyamag.com/feed",                         pillar: "Culture & Civilisation", source: "Swarajya" },
  { url: "https://www.opindia.com/feed/",                        pillar: "Culture & Civilisation", source: "OpIndia" },
  { url: "https://indiafacts.org/feed/",                         pillar: "Culture & Civilisation", source: "India Facts" },
  { url: "https://pragyata.com/feed/",                           pillar: "Culture & Civilisation", source: "Pragyata" },
  { url: "https://www.panchjanya.com/feed/",                     pillar: "Culture & Civilisation", source: "Panchajanya" },
  { url: "https://hindi.theprint.in/feed/",                      pillar: "Culture & Civilisation", source: "The Print Hindi" },
  { url: "https://www.amarujala.com/rss/india-news.xml",         pillar: "Culture & Civilisation", source: "Amar Ujala" },
  { url: "https://www.bhaskar.com/rss-feed/1061/",               pillar: "Culture & Civilisation", source: "Dainik Bhaskar" },
  { url: "https://feeds.feedburner.com/thequint",                pillar: "Security & Strategy", source: "The Quint" },
  { url: "https://mea.gov.in/press-releases.htm?rss",            pillar: "Security & Strategy", source: "MEA" },
  { url: "https://indianexpress.com/section/india/feed/",        pillar: "Security & Strategy", source: "Indian Express" },
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", pillar: "Security & Strategy", source: "The Hindu" },
  { url: "https://feeds.feedburner.com/NDTV-LatestNews",         pillar: "Security & Strategy", source: "NDTV Security" },
  { url: "https://www.amarujala.com/rss/india-news.xml",         pillar: "Security & Strategy", source: "Amar Ujala Security" },
  { url: "https://www.downtoearth.org.in/rss/feed",              pillar: "Environment & Ecology", source: "Down To Earth" },
  { url: "https://india.mongabay.com/feed/",                     pillar: "Environment & Ecology", source: "Mongabay India" },
  { url: "https://indianexpress.com/section/explained/feed/",    pillar: "Environment & Ecology", source: "IE Explained Env" },
  { url: "https://www.thehindu.com/opinion/lead/feeder/default.rss", pillar: "Environment & Ecology", source: "The Hindu Lead" },
  { url: "https://inc42.com/feed/",                              pillar: "Technology", source: "Inc42" },
  { url: "https://www.medianama.com/feed/",                      pillar: "Technology", source: "MediaNama" },
  { url: "https://indianexpress.com/section/technology/feed/",   pillar: "Technology", source: "Indian Express Tech" },
  { url: "https://feeds.feedburner.com/ndtvnews-latest",         pillar: "Technology", source: "NDTV Tech" },
  { url: "https://www.thehindu.com/sci-tech/health/feeder/default.rss", pillar: "Health", source: "The Hindu Health" },
  { url: "https://www.mohfw.gov.in/rss.xml",                     pillar: "Health", source: "MoHFW" },
  { url: "https://indianexpress.com/section/lifestyle/health/feed/", pillar: "Health", source: "IE Health" },
  { url: "https://india.mongabay.com/feed/",                     pillar: "Health", source: "Mongabay Health" },
  { url: "https://indianexpress.com/section/political-pulse/feed/", pillar: "Governance", source: "IE Governance" },
  { url: "https://www.thehindu.com/opinion/editorial/feeder/default.rss", pillar: "Governance", source: "The Hindu Editorial" },
  { url: "https://feeds.feedburner.com/NDTV-LatestNews",         pillar: "Governance", source: "NDTV Governance" },
  { url: "https://hindi.theprint.in/feed/",                      pillar: "Governance", source: "The Print Hindi" },
  { url: "https://sabrangindia.in/feed/",                        pillar: "Governance", source: "Sabrang India" },
  { url: "https://indianexpress.com/section/explained/feed/",    pillar: "Explained", source: "IE Explained" },
  { url: "https://www.thehindu.com/opinion/lead/feeder/default.rss", pillar: "Explained", source: "The Hindu Lead" },
  { url: "https://www.thehindu.com/opinion/editorial/feeder/default.rss", pillar: "Explained", source: "The Hindu Editorial" },
  { url: "https://feeds.feedburner.com/thequint",                pillar: "Explained", source: "The Quint" },
  { url: "https://feeds.feedburner.com/firstpostin",             pillar: "Explained", source: "Firstpost" },
  { url: "https://hindi.theprint.in/feed/",                      pillar: "Explained", source: "The Print Hindi" },
  { url: "https://www.bhaskar.com/rss-feed/1061/",               pillar: "Explained", source: "Dainik Bhaskar" },
];

const TRACKERS = {
  "Human Rights":  ["human rights", "fundamental rights", "habeas corpus", "nhrc", "torture", "custodial"],
  "Legislation":   ["bill", "act passed", "parliament", "lok sabha passed", "rajya sabha passed", "amendment", "ordinance"],
  "Judiciary":     ["supreme court", "high court", "tribunal", "bench", "judgment", "verdict", "order", "chief justice"],
  "Constitution":  ["constitutional", "article 32", "article 226", "basic structure", "amendment", "preamble"],
  "Criminal Law":  ["fir", "arrest", "bail", "conviction", "acquittal", "ipc", "bns", "bnss", "crpc"],
  "Environment":   ["forest", "wildlife", "pollution", "climate", "ngt", "green tribunal", "ecology"],
  "Economy":       ["gdp", "rbi", "inflation", "budget", "fiscal", "gst", "msme", "trade"],
  "Security":      ["terror", "naxal", "border", "defence", "military", "army", "internal security"],
};

const INDIA_KEYWORDS = [
  "india", "bharat", "supreme court", "high court", "parliament", "lok sabha",
  "rajya sabha", "modi", "government of india", "ministry", "central government",
  "state government", "constitution", "rbi", "sebi", "niti aayog", "delhi", "indian"
];

function isIndiaRelevant(text) {
  const lower = text.toLowerCase();
  return INDIA_KEYWORDS.some(kw => lower.includes(kw));
}

function getTrackers(text) {
  const lower = text.toLowerCase();
  return Object.entries(TRACKERS)
    .filter(([, keywords]) => keywords.some(kw => lower.includes(kw)))
    .map(([name]) => name);
}

function extract(xml, tag) {
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i"),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"),
  ];
  for (const re of patterns) {
    const m = xml.match(re);
    if (m && m[1]) return m[1].trim();
  }
  return "";
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function parseRSS(xml, pillar, source) {
  const items = [];
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
    let pubDate;
    try { pubDate = new Date(pub).toISOString(); } catch { pubDate = new Date().toISOString(); }
    items.push({ title, link, description: desc, pubDate, pillar, source, trackers: getTrackers(title + " " + desc) });
  }
  return items;
}

export default async (req) => {
  const results = [];
  await Promise.allSettled(FEEDS.map(async ({ url, pillar, source }) => {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "MissionIndiaAhead/2.0 RSS Reader" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      results.push(...parseRSS(xml, pillar, source));
    } catch (err) {
      console.error(`FAIL: ${source} — ${err.message}`);
    }
  }));

  const seen = new Set();
  const deduped = results
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .filter(item => { if (seen.has(item.link)) return false; seen.add(item.link); return true; })
    .slice(0, 300);

  const byPillar = {};
  const byTracker = {};
  for (const item of deduped) {
    if (!byPillar[item.pillar]) byPillar[item.pillar] = [];
    byPillar[item.pillar].push(item);
    for (const t of (item.trackers || [])) {
      if (!byTracker[t]) byTracker[t] = [];
      byTracker[t].push(item);
    }
  }

  const store = getStore("news-cache");
  await store.setJSON("latest", {
    lastUpdated: new Date().toISOString(),
    totalItems: deduped.length,
    byPillar, byTracker, all: deduped,
  });

  console.log(`fetch-news: stored ${deduped.length} items`);
};

export const config = { schedule: "@hourly" };
