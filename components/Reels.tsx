"use client";
import { useEffect, useRef, useState } from "react";
import { NewsItem } from "@/lib/fetchNews";
import { categoryColors, categoryLabels, regionLabels } from "@/lib/sources";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import TabNav from "./TabNav";

function timeAgo(date: string): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return formatDistanceToNow(d, { addSuffix: true, locale: tr });
  } catch {
    return "";
  }
}

/** RSS özetini kısa, okunabilir bir "story" özetine indirger. */
function shortSummary(text: string, max = 220): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastDot = cut.lastIndexOf(". ");
  if (lastDot > max * 0.5) return cut.slice(0, lastDot + 1);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

export default function Reels() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        const all: NewsItem[] = data.items || [];
        // O saatin en güncel 10 haberi — görselli olanlar önce.
        const withImg = all.filter((i) => i.image);
        const withoutImg = all.filter((i) => !i.image);
        const top = [...withImg, ...withoutImg].slice(0, 10);
        if (!cancelled) setItems(top);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setActive(idx);
  };

  const goTo = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: idx * el.clientHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white overflow-hidden">
      {/* Üst bar */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-5 sm:px-8 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <span className="text-base font-semibold tracking-tight">
          ZoneCheck
        </span>
        <TabNav theme="dark" />
      </div>

      {/* İlerleme noktaları */}
      {items.length > 0 && (
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`${i + 1}. habere git`}
              onClick={() => goTo(i)}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "h-6 bg-white"
                  : "h-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-white/60">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span className="text-sm">Haberler yükleniyor…</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="h-full flex items-center justify-center text-white/60">
          Haber bulunamadı.
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        >
          {items.map((item, i) => (
            <section
              key={item.id}
              className="relative h-full w-full snap-start snap-always flex items-end overflow-hidden"
            >
              {/* Arka plan */}
              {item.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
              )}

              {/* İçerik */}
              <div className="relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-8 pb-16 sm:pb-20">
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {item.categories.map((cat) => (
                    <span
                      key={cat}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${categoryColors[cat]}`}
                    >
                      {categoryLabels[cat]}
                    </span>
                  ))}
                  <span className="text-[11px] text-white/60">
                    {regionLabels[item.region]}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-semibold leading-tight tracking-tight">
                  {item.title}
                </h2>

                {item.description && (
                  <p className="mt-4 text-[15px] sm:text-base text-white/80 leading-relaxed">
                    {shortSummary(item.description)}
                  </p>
                )}

                <div className="mt-5 flex items-center gap-3 text-sm text-white/70">
                  <span className="font-medium text-white">
                    {item.sourceName}
                  </span>
                  {timeAgo(item.pubDate) && (
                    <>
                      <span className="text-white/30">·</span>
                      <span>{timeAgo(item.pubDate)}</span>
                    </>
                  )}
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 transition"
                >
                  Habere git
                  <span aria-hidden>→</span>
                </a>
              </div>

              {/* Kaydırma ipucu (yalnızca ilk haberde) */}
              {i === 0 && items.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50 animate-bounce">
                  <span aria-hidden className="text-lg">
                    ↑
                  </span>
                  <span className="text-[11px]">Kaydır</span>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
