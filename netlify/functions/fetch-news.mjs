import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

const FEEDS = [

  // ── LAW & JUSTICE (10 feeds) ──────────────────────────────────────────────
  { url: "https://www.barandbench.com/feed",                    pillar: "Law & Justice", source: "Bar & Bench" },
  { url: "https://verdictum.in/feed",                           pillar: "Law & Justice", source: "Verdictum" },
  { url: "https://www.scobserver.in/feed/",                     pillar: "Law & Justice", source: "SC Observer" },
  { url: "https://www.legallyindia.com/feed",                   pillar: "Law & Justice", source: "Legally India" },
  { url: "https://www.indialegallive.com/feed/",                pillar: "Law & Justice", source: "India Legal Live" },
  { url: "https://www.scconline.com/blog/feed/",                pillar: "Law & Justice", source: "SCC Online Blog" },
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", pillar: "Law & Justice", source: "The Hindu" },
  { url: "https://indianexpress.com/section/india/feed/",       pillar: "Law & Justice", source: "Indian Express" },
  { url: "https://indianexpress.com/section/explained/feed/",   pillar: "Law & Justice", source: "IE Explained" },
  { url: "https://www.deccanherald.com/feed/",                  pillar: "Law & Justice", source: "Deccan Herald" },

  // ── POLICY & GOVERNANCE (5 feeds) ────────────────────────────────────────
  { url: "https://indianexpress.com/section/political-pulse/feed/", pillar: "Policy & Governance", source: "IE Political Pulse" },
  { url: "https://www.thehindu.com/opinion/editorial/feeder/default.rss", pillar: "Policy & Governance", source: "The Hindu Editorial" },
  { url: "https://www.thehindu.com/opinion/lead/feeder/default.rss", pillar: "Policy & Governance", source: "The Hindu Lead" },
  { url: "https://feeds.feedburner.com/NDTV-LatestNews",        pillar: "Policy & Governance", source: "NDTV" },
  { url: "https://feeds.feedburner.com/firstpostin",            pillar: "Policy & Governance", source: "Firstpost" },
  { url: "https://hindi.theprint.in/feed/",                     pillar: "Policy & Governance", source: "The Print Hindi" },
  { url: "https://www.amarujala.com/rss/india-news.xml",        pillar: "Policy & Governance", source: "Amar Ujala" },
  { url: "https://www.bhaskar.com/rss-feed/1061/",              pillar: "Policy & Governance", source: "Dainik Bhaskar" },
  { url: "https://www.panchjanya.com/feed/",                    pillar: "Policy & Governance", source: "Panchajanya" },

// ── ECONOMY (5 feeds) ─────────────────────────────────────────────────────
  { url: "https://www.livemint.com/rss/economy",                                        pillar: "Economy", source: "Mint" },
  { url: "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms",        pillar: "Economy", source: "Economic Times" },
  { url: "https://www.financialexpress.com/feed/",                                      pillar: "Economy", source: "Financial Express" },
  { url: "https://www.business-standard.com/rss/economy-policy-10601.rss",             pillar: "Economy", source: "Business Standard" },
  { url: "https://www.thehindubusinessline.com/feeder/default.rss",                    pillar: "Economy", source: "Business Line" },
  { url: "https://indianexpress.com/section/business/economy/feed/",                   pillar: "Economy", source: "IE Economy" },
  { url: "https://www.ndtv.com/rss/business",                                           pillar: "Economy", source: "NDTV Business" },
  { url: "https://www.jagran.com/rss/business.xml",                                     pillar: "Economy", source: "Jagran Business" },
  { url: "https://navbharattimes.indiatimes.com/rss/business.cms",                      pillar: "Economy", source: "NBT Business" },

// ── CULTURE & CIVILISATION (5 feeds) ─────────────────────────────────────
  { url: "https://organiser.org/feed/",                                                 pillar: "Culture & Civilisation", source: "The Organiser" },
  { url: "https://swarajyamag.com/feed",                                                pillar: "Culture & Civilisation", source: "Swarajya" },
  { url: "https://www.pgurus.com/feed/",                                                pillar: "Culture & Civilisation", source: "PGurus" },
  { url: "https://indiafacts.org/feed/",                                                pillar: "Culture & Civilisation", source: "India Facts" },
  { url: "https://www.indiatoday.in/rss/home",                                         pillar: "Culture & Civilisation", source: "India Today" },
  { url: "https://www.opindia.com/feed/",                                               pillar: "Culture & Civilisation", source: "OpIndia" },
  { url: "https://www.panchjanya.com/feed/",                                            pillar: "Culture & Civilisation", source: "Panchajanya" },
  { url: "https://hindi.theprint.in/category/culture/feed/",                           pillar: "Culture & Civilisation", source: "The Print Hindi Culture" },
  { url: "https://www.jagran.com/rss/national.xml",                                     pillar: "Culture & Civilisation", source: "Jagran" },
  { url: "https://navbharattimes.indiatimes.com/rss/india.cms",                         pillar: "Culture & Civilisation", source: "Navbharat Times" },
 
// ── SECURITY & STRATEGY (5 feeds) ────────────────────────────────────────
  { url: "https://www.thequint.com/rss/india",                                         pillar: "Security & Strategy", source: "The Quint" },
  { url: "https://mea.gov.in/press-releases.htm?rss",                                  pillar: "Security & Strategy", source: "MEA" },
  { url: "https://www.claws.in/feed/",                                                  pillar: "Security & Strategy", source: "CLAWS" },
  { url: "https://www.idsa.in/rss-feed/all-articles",                                  pillar: "Security & Strategy", source: "IDSA" },
  { url: "https://www.vifindia.org/rss.xml",                                            pillar: "Security & Strategy", source: "VIF India" },
  { url: "https://feeds.feedburner.com/thequint",               pillar: "Security & Strategy", source: "The Quint" },
  { url: "https://indianexpress.com/section/india/feed/",       pillar: "Security & Strategy", source: "Indian Express" },
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", pillar: "Security & Strategy", source: "The Hindu Security" },
  { url: "https://feeds.feedburner.com/NDTV-LatestNews",        pillar: "Security & Strategy", source: "NDTV Security" },
  { url: "https://www.amarujala.com/rss/india-news.xml",        pillar: "Security & Strategy", source: "Amar Ujala Security" },

  // ── ENVIRONMENT & ECOLOGY (5 feeds) ──────────────────────────────────────
  { url: "https://www.downtoearth.org.in/rss/feed",                                    pillar: "Environment & Ecology", source: "Down To Earth" },
  { url: "https://www.mongabay.com/feed/",                                              pillar: "Environment & Ecology", source: "Mongabay India" },
  { url: "https://www.indiawaterportal.org/rss.xml",                                   pillar: "Environment & Ecology", source: "India Water Portal" },
  { url: "https://www.sanctuaryasia.com/feed/",                                         pillar: "Environment & Ecology", source: "Sanctuary Asia" },
  { url: "https://www.cseindia.org/rss",                                                pillar: "Environment & Ecology", source: "CSE India" },
  { url: "https://frontline.thehindu.com/environment/feeder/default.rss",               pillar: "Environment & Ecology", source: "The Hindu"

  // ── TECHNOLOGY (5 feeds) ──────────────────────────────────────────────────
  { url: "https://inc42.com/feed/",                                                     pillar: "Technology", source: "Inc42" },
  { url: "https://www.medianama.com/feed/",                                             pillar: "Technology", source: "MediaNama" },
  { url: "https://entrackr.com/feed/",                                                  pillar: "Technology", source: "Entrackr" },
  { url: "https://techcrunch.com/tag/india/feed/",                                      pillar: "Technology", source: "TechCrunch India" },
  { url: "https://www.financialexpress.com/industry/technology/feed/",                 pillar: "Technology", source: "FE Tech" },
  { url: "https://indianexpress.com/section/technology/feed/",  pillar: "Technology", source: "Indian Express Tech" },
  { url: "https://feeds.feedburner.com/ndtvnews-latest",        pillar: "Technology", source: "NDTV Tech" },

  // ── EDUCATION (5 feeds) ───────────────────────────────────────────────────
  { url: "https://www.careers360.com/rss/news",                                        pillar: "Education", source: "Careers360" },
  { url: "https://www.universityworldnews.com/rss.php?edition=india",                  pillar: "Education", source: "University World News" },
  { url: "https://pib.gov.in/RssMain.aspx?ModId=19&Lang=1&Regid=3",                   pillar: "Education", source: "PIB Education" },
  { url: "https://www.thehindubusinessline.com/education/feeder/default.rss",          pillar: "Education", source: "BL Education" },
  { url: "https://www.indiatoday.in/education-today/rss",                              pillar: "Education", source: "India Today Education" },

  // ── HEALTH (5 feeds) ──────────────────────────────────────────────────────
  { url: "https://www.thehindu.com/sci-tech/health/feeder/default.rss",               pillar: "Health", source: "The Hindu Health" },
  { url: "https://www.mohfw.gov.in/rss.xml",                                           pillar: "Health", source: "MoHFW" },
  { url: "https://www.downtoearth.org.in/health/rss",                                  pillar: "Health", source: "DTE Health" },
  { url: "https://www.pharmabiz.com/rss/TopStories.aspx",                              pillar: "Health", source: "PharmaBiz" },
  { url: "https://www.biospectrumindia.com/feed/",                                     pillar: "Health", source: "BioSpectrum" },
  { url: "https://www.mohfw.gov.in/rss.xml",                    pillar: "Health", source: "MoHFW" },
  { url: "https://indianexpress.com/section/lifestyle/health/feed/", pillar: "Health", source: "IE Health" },
  { url: "https://www.thehindu.com/sci-tech/health/feeder/default.rss", pillar: "Health", source: "The Hindu Health" },
  { url: "https://india.mongabay.com/feed/",                    pillar: "Health", source: "Mongabay Health" },

  // ── GOVERNANCE (5 feeds) ──────────────────────────────────────────────────
  { url: "https://www.thehindu.com/news/national/feeder/default.rss",                  pillar: "Governance", source: "The Hindu National" },
  { url: "https://www.prsindia.org/feed",                                               pillar: "Governance", source: "PRS Governance" },
  { url: "https://accountabilityindia.in/feed/",                                        pillar: "Governance", source: "Accountability India" },
  { url: "https://www.indiabudget.gov.in/rss",                                          pillar: "Governance", source: "India Budget" },
  { url: "https://cag.gov.in/en/rss",                                                   pillar: "Governance", source: "CAG India" },

  // ── EXPLAINED ─────────────────────────────────────────────────────────────
  { url: "https://indianexpress.com/section/explained/feed/",   pillar: "Explained", source: "IE Explained" },
  { url: "https://www.thehindu.com/opinion/lead/feeder/default.rss", pillar: "Explained", source: "The Hindu Lead" },
  { url: "https://www.thehindu.com/opinion/editorial/feeder/default.rss", pillar: "Explained", source: "The Hindu Editorial" },
  { url: "https://feeds.feedburner.com/thequint",               pillar: "Explained", source: "The Quint" },
  { url: "https://feeds.feedburner.com/firstpostin",            pillar: "Explained", source: "Firstpost" },

  // ── HINDI MEDIA (cross-pillar) ─────────────────────────────────────────────
  { url: "https://www.amarujala.com/rss/crime.xml",             pillar: "Law & Justice", source: "Amar Ujala Crime" },
  { url: "https://hindi.theprint.in/feed/",                     pillar: "Explained", source: "The Print Hindi" },
  { url: "https://www.bhaskar.com/rss-feed/1061/",              pillar: "Explained", source: "Dainik Bhaskar" },
  { url: "https://www.panchjanya.com/feed/",                    pillar: "Explained", source: "Panchajanya" },


];

const TRACKERS: Record<string, string[]> = {
  "Human Rights":   ["human rights", "fundamental rights", "habeas corpus", "nhrc", "torture", "custodial", "atrocity", "nhrc", "scst act", "bonded labour"],
  "Legislation":    ["bill", "act passed", "parliament", "lok sabha passed", "rajya sabha passed", "amendment", "ordinance", "gazette", "legislation", "statutory"],
  "Judiciary":      ["supreme court", "high court", "tribunal", "bench", "judgment", "verdict", "order", "chief justice", "collegium", "curative petition"],
  "Constitution":   ["constitutional", "article 32", "article 226", "basic structure", "amendment", "preamble", "fundamental rights", "directive principles"],
  "Criminal Law":   ["fir", "arrest", "bail", "conviction", "acquittal", "ipc", "bns", "bnss", "crpc", "bnss", "chargesheet", "remand"],
  "Environment":    ["forest", "wildlife", "pollution", "climate", "ngt", "green tribunal", "ecology", "deforestation", "carbon", "wetland"],
  "Economy":        ["gdp", "rbi", "inflation", "budget", "fiscal", "gst", "msme", "trade", "repo rate", "monetary policy", "fdi"],
  "Security":       ["terror", "naxal", "border", "defence", "military", "army", "internal security", "uapa", "insurgency", "ceasefire"],
};

const INDIA_KEYWORDS = [
  "india", "bharat", "supreme court", "high court", "parliament", "lok sabha",
  "rajya sabha", "modi", "government of india", "ministry", "central government",
  "state government", "constitution", "rbi", "sebi", "niti aayog", "delhi",
  "indian", "cbi", "ed", "nhrc", "ngt", "cci", "sebi", "nclt"
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
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function parseRSS(xml: string, pillar: string, source: string): any[] {
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
    items.push({
      title, link,
      description: desc,
      pubDate, pillar, source,
      trackers: getTrackers(title + " " + desc),
    });
  }
  return items;
}

export default async (req: Request) => {
  console.log("fetch-news: starting hourly run");
  const results: any[] = [];

  await Promise.allSettled(
    FEEDS.map(async ({ url, pillar, source }) => {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "MissionIndiaAhead/2.0 RSS Reader" },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        const items = parseRSS(xml, pillar, source);
        results.push(...items);
        console.log(`OK: ${source} — ${items.length} items`);
      } catch (err) {
        console.error(`FAIL: ${source} — ${err}`);
      }
    })
  );

  const seen = new Set<string>();
  const deduped = results
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .filter(item => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .slice(0, 300);

  const byPillar: Record<string, any[]> = {};
  const byTracker: Record<string, any[]> = {};

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
    byPillar,
    byTracker,
    all: deduped,
  });

  console.log(`fetch-news: done — ${deduped.length} items stored`);
};

export const config: Config = { schedule: "@hourly" };
