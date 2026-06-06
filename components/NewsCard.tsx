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
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col border border-gray-100">
      {item.image && (
        <div className="relative h-44 overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category badges */}
        <div className="flex flex-wrap gap-1">
          {item.categories.map((cat) => (
            <span
              key={cat}
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[cat]}`}
            >
              {categoryLabels[cat]}
            </span>
          ))}
          <span className="text-xs text-gray-400 ml-auto">{regionLabels[item.region]}</span>
        </div>

        {/* Title */}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-3 leading-snug"
        >
          {item.title}
        </a>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-500 line-clamp-3 flex-1">{item.description}</p>
        )}

        {/* Footer: source + time */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline font-medium truncate max-w-[60%]"
          >
            📰 {item.sourceName}
          </a>
          {timeAgo && <span className="text-xs text-gray-400">{timeAgo}</span>}
        </div>
      </div>
    </article>
  );
}
