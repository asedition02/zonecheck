"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Haberler" },
  { href: "/newsfeed", label: "Akış" },
];

export default function TabNav({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const pathname = usePathname();

  const base =
    theme === "dark"
      ? "bg-white/10 ring-white/15"
      : "bg-zinc-100 ring-zinc-200/60";

  return (
    <nav
      className={`flex items-center gap-1 rounded-full p-1 ring-1 ${base}`}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const activeCls =
          theme === "dark"
            ? "bg-white text-zinc-900"
            : "bg-white text-zinc-900 shadow-sm";
        const idleCls =
          theme === "dark"
            ? "text-white/70 hover:text-white"
            : "text-zinc-500 hover:text-zinc-900";
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active ? activeCls : idleCls
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
