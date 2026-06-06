"use client";
import { useEffect, useState, useCallback } from "react";
import { NewsItem } from "@/lib/fetchNews";
import { Category, Region, regionLabels, categoryLabels } from "@/lib/sources";
import NewsCard from "./NewsCard";

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

  const PER_PAGE = 24;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-2xl">🌐</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">ZoneCheck News</h1>
              <p className="text-xs text-gray-400">Teknoloji · Startup · Drone</p>
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Yükleniyor..." : "🔄 Yenile"}
          </button>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
          {/* Region filter */}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | "all")}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">🌍 Tüm Bölgeler</option>
            {(["usa", "europe", "asia"] as Region[]).map((r) => (
              <option key={r} value={r}>
                {regionLabels[r]}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "all")}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">📂 Tüm Kategoriler</option>
            {(["technology", "startup", "drone"] as Category[]).map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="date">🕐 En Yeni</option>
            <option value="source">📰 Kaynağa Göre</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Haber ara..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1 min-w-40"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>
            {loading ? "Haberler yükleniyor..." : `${filtered.length} haber bulundu`}
          </span>
          {fetchedAt && (
            <span>
              Son güncelleme:{" "}
              {new Date(fetchedAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                  <div className="h-3 bg-gray-100 rounded w-2/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>Haber bulunamadı. Filtrelerinizi değiştirin.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-40"
                >
                  ← Önceki
                </button>
                <span className="text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-40"
                >
                  Sonraki →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer with sources */}
      <footer className="border-t border-gray-200 bg-white mt-10 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-semibold text-gray-700 mb-4">📡 Haber Kaynakları</h2>
          <SourceList />
        </div>
      </footer>
    </div>
  );
}

function SourceList() {
  const { sources, regionLabels } = require("@/lib/sources") as {
    sources: import("@/lib/sources").NewsSource[];
    regionLabels: Record<Region, string>;
  };
  const grouped: Record<Region, typeof sources> = { usa: [], europe: [], asia: [] };
  for (const s of sources) grouped[s.region].push(s);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {(["usa", "europe", "asia"] as Region[]).map((r) => (
        <div key={r}>
          <h3 className="text-sm font-medium text-gray-500 mb-2">{regionLabels[r]}</h3>
          <ul className="space-y-1">
            {grouped[r].map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
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
