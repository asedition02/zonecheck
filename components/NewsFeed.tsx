"use client";
import { useEffect, useState, useCallback } from "react";
import { NewsItem } from "@/lib/fetchNews";
import {
  Category,
  Region,
  regionLabels,
  categoryLabels,
  categoryColors,
  sources,
  NewsSource,
} from "@/lib/sources";
import NewsCard from "./NewsCard";
import TabNav from "./TabNav";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

const ROTATE_MS = 30 * 60 * 1000; // 30 dakika

function timeAgo(date: string): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return formatDistanceToNow(d, { addSuffix: true, locale: tr });
  } catch {
    return "";
  }
}

type SortOption = "date" | "source";

export default function NewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string>("");

  const [region, setRegion] = useState<Region | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("date");
  const [page, setPage] = useState(1);

  // Öne çıkan haberi her 30 dakikada bir döndürmek için zaman dilimi.
  const [bucket, setBucket] = useState(() => Math.floor(Date.now() / ROTATE_MS));

  const PER_PAGE = 24;

  useEffect(() => {
    const id = setInterval(
      () => setBucket(Math.floor(Date.now() / ROTATE_MS)),
      60 * 1000
    );
    return () => clearInterval(id);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (region !== "all") params.set("region", region);
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();
      setItems(data.items || []);
      setFetchedAt(data.fetchedAt || "");
      setPage(1);
    } catch {
      setError("Haberler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [region, category]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = items
    .filter((item) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sourceName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === "source") {
        return a.sourceName.localeCompare(b.sourceName);
      }
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Öne çıkan haber: en güncel, görselli haberlerden oluşan havuzdan
  // 30 dakikalık dilime göre seçilir; böylece yarım saatte bir değişir.
  const featuredPool = [...items]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .filter((i) => i.image && i.title)
    .slice(0, 12);
  const featured =
    featuredPool.length > 0
      ? featuredPool[bucket % featuredPool.length]
      : null;

  const selectClass =
    "text-sm text-zinc-700 border border-zinc-200 rounded-full px-4 py-2 bg-white appearance-none cursor-pointer hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#fafaf9]/80 backdrop-blur border-b border-zinc-200/70 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-4">
          <a href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight text-zinc-900">
              ZoneCheck
            </span>
            <span className="hidden sm:inline text-xs uppercase tracking-[0.25em] text-zinc-400">
              News
            </span>
          </a>
          <div className="mx-auto">
            <TabNav />
          </div>
          {fetchedAt && (
            <span className="hidden md:inline text-xs text-zinc-400">
              {new Date(fetchedAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              güncellendi
            </span>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="text-sm px-4 py-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 transition"
          >
            {loading ? "Yükleniyor…" : "Yenile"}
          </button>
        </div>
      </header>

      {/* Öne çıkan haber — her 30 dakikada bir değişir */}
      <section className="border-b border-zinc-200/70">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium tracking-wide text-accent">
              Öne Çıkan
            </p>
            <span className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Her 30 dakikada bir yenilenir
            </span>
          </div>

          {featured ? (
            <a
              href={featured.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center animate-fade-up"
            >
              {featured.image && (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 order-1 lg:order-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
              )}
              <div className="order-2 lg:order-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {featured.categories.map((cat) => (
                    <span
                      key={cat}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${categoryColors[cat]}`}
                    >
                      {categoryLabels[cat]}
                    </span>
                  ))}
                  <span className="text-xs text-zinc-400">
                    {regionLabels[featured.region]}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 leading-[1.08] group-hover:text-accent transition-colors line-clamp-4">
                  {featured.title}
                </h1>
                {featured.description && (
                  <p className="mt-5 max-w-xl text-base sm:text-lg text-zinc-500 leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
                  <span className="font-medium text-zinc-700">
                    {featured.sourceName}
                  </span>
                  {timeAgo(featured.pubDate) && (
                    <>
                      <span className="text-zinc-300">·</span>
                      <span>{timeAgo(featured.pubDate)}</span>
                    </>
                  )}
                </div>
              </div>
            </a>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center animate-pulse">
              <div className="space-y-4 order-2 lg:order-1">
                <div className="h-4 w-24 bg-zinc-100 rounded" />
                <div className="h-10 bg-zinc-100 rounded" />
                <div className="h-10 bg-zinc-100 rounded w-3/4" />
                <div className="h-4 bg-zinc-100 rounded w-1/2 mt-4" />
              </div>
              <div className="aspect-[16/9] rounded-2xl bg-zinc-100 order-1 lg:order-2" />
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-10 bg-[#fafaf9]/80 backdrop-blur border-b border-zinc-200/70">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center gap-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | "all")}
            className={selectClass}
          >
            <option value="all">Tüm Bölgeler</option>
            {(["usa", "europe", "asia"] as Region[]).map((r) => (
              <option key={r} value={r}>
                {regionLabels[r]}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "all")}
            className={selectClass}
          >
            <option value="all">Tüm Kategoriler</option>
            {(["technology", "startup", "drone"] as Category[]).map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className={selectClass}
          >
            <option value="date">En Yeni</option>
            <option value="source">Kaynağa Göre</option>
          </select>

          <input
            type="text"
            placeholder="Haber ara…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-zinc-200 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition flex-1 min-w-44"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-8 flex-1">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6 text-sm text-zinc-400">
          <span>
            {loading
              ? "Haberler yükleniyor…"
              : `${filtered.length} haber`}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-zinc-100" />
                <div className="p-5 space-y-2.5">
                  <div className="h-3 bg-zinc-100 rounded w-1/3" />
                  <div className="h-4 bg-zinc-100 rounded" />
                  <div className="h-4 bg-zinc-100 rounded w-4/5" />
                  <div className="h-3 bg-zinc-50 rounded w-2/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">
            <p className="text-lg text-zinc-500">Haber bulunamadı.</p>
            <p className="mt-1 text-sm">Filtrelerinizi değiştirmeyi deneyin.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map((item, i) => (
                <div
                  key={item.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                >
                  <NewsCard item={item} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 rounded-full border border-zinc-200 text-sm hover:bg-white hover:border-zinc-300 disabled:opacity-40 transition"
                >
                  Önceki
                </button>
                <span className="text-sm text-zinc-500 tabular-nums">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2 rounded-full border border-zinc-200 text-sm hover:bg-white hover:border-zinc-300 disabled:opacity-40 transition"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer with sources */}
      <footer className="border-t border-zinc-200/70 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400 mb-6">
            Haber Kaynakları
          </h2>
          <SourceList />
          <p className="mt-10 text-xs text-zinc-400">
            © {new Date().getFullYear()} ZoneCheck News
          </p>
        </div>
      </footer>
    </div>
  );
}

function SourceList() {
  const grouped: Record<Region, NewsSource[]> = {
    usa: [],
    europe: [],
    asia: [],
  };
  for (const s of sources) grouped[s.region].push(s);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {(["usa", "europe", "asia"] as Region[]).map((r) => (
        <div key={r}>
          <h3 className="text-sm font-medium text-zinc-700 mb-3">
            {regionLabels[r]}
          </h3>
          <ul className="space-y-1.5">
            {grouped[r].map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
