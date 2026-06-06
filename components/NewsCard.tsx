"use client";
import { NewsItem } from "@/lib/fetchNews";
import { categoryColors, categoryLabels, regionLabels } from "@/lib/sources";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Props {
  item: NewsItem;
}

export default function NewsCard({ item }: Props) {
  const timeAgo = (() => {
    try {
      const d = new Date(item.pubDate);
      if (isNaN(d.getTime())) return "";
      return formatDistanceToNow(d, { addSuffix: true, locale: tr });
    } catch {
      return "";
    }
  })();

  return (
    <article className="group bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col h-full">
      {item.image && (
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {item.categories.map((cat) => (
            <span
              key={cat}
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${categoryColors[cat]}`}
            >
              {categoryLabels[cat]}
            </span>
          ))}
          <span className="text-[11px] text-zinc-400 ml-auto">
            {regionLabels[item.region]}
          </span>
        </div>

        {/* Title */}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-zinc-900 group-hover:text-accent transition-colors line-clamp-3 leading-snug text-[15px]"
        >
          {item.title}
        </a>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-zinc-500 line-clamp-2 flex-1 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Footer: source + time */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-auto">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-900 font-medium truncate max-w-[60%] transition-colors"
          >
            {item.sourceName}
          </a>
          {timeAgo && (
            <span className="text-xs text-zinc-400">{timeAgo}</span>
          )}
        </div>
      </div>
    </article>
  );
}
