import Parser from "rss-parser";
import { sources, type Category, type Region } from "./sources";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  region: Region;
  categories: Category[];
  image?: string;
}

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent": "ZoneCheck News Aggregator/1.0",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["enclosure", "enclosure", { keepArray: false }],
    ],
  },
});

function extractImage(item: Parser.Item & Record<string, unknown>): string | undefined {
  const mc = item.mediaContent as Record<string, unknown> | undefined;
  if (mc?.["$"] && (mc["$"] as Record<string, string>).url) {
    return (mc["$"] as Record<string, string>).url;
  }
  const mt = item.mediaThumbnail as Record<string, unknown> | undefined;
  if (mt?.["$"] && (mt["$"] as Record<string, string>).url) {
    return (mt["$"] as Record<string, string>).url;
  }
  const enc = item.enclosure as Record<string, string> | undefined;
  if (enc?.url && enc.type?.startsWith("image")) {
    return enc.url;
  }
  // Try extracting from content
  const content = (item.content || item["content:encoded"] || "") as string;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  return undefined;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchSource(source: (typeof sources)[0]): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.rss);
    return (feed.items || []).slice(0, 15).map((item, idx) => ({
      id: `${source.id}-${idx}-${Date.now()}`,
      title: stripHtml(item.title || "Başlık yok"),
      description: stripHtml(
        item.contentSnippet || item.summary || item.content || ""
      ).slice(0, 280),
      link: item.link || source.url,
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.url,
      region: source.region,
      categories: source.categories,
      image: extractImage(item as unknown as Parser.Item & Record<string, unknown>),
    }));
  } catch {
    return [];
  }
}

export async function fetchAllNews(options?: {
  region?: Region;
  category?: Category;
}): Promise<NewsItem[]> {
  const filtered = sources.filter((s) => {
    if (options?.region && s.region !== options.region) return false;
    if (options?.category && !s.categories.includes(options.category)) return false;
    return true;
  });

  const results = await Promise.allSettled(filtered.map(fetchSource));

  const allItems: NewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Sort by date descending
  allItems.sort((a, b) => {
    const da = new Date(a.pubDate).getTime();
    const db = new Date(b.pubDate).getTime();
    return isNaN(db) || isNaN(da) ? 0 : db - da;
  });

  return allItems;
}
