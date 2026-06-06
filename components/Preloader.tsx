"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Full-screen intro panel inspired by curaclimate.com:
 * a counter fills 0 → 100 while a thin line tracks progress,
 * then the dark panel slides up to reveal the page.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    // Only play the intro once per browser session.
    if (typeof window !== "undefined" && sessionStorage.getItem("zc-intro")) {
      setDone(true);
      return;
    }

    const DURATION = 2000; // ms
    let raf = 0;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      // ease-out for a smooth deceleration toward 100
      const t = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("zc-intro", "1");
        setLeaving(true);
        window.setTimeout(() => setDone(true), 800);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-zinc-950 px-6 py-8 sm:px-12 sm:py-12 transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        leaving ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Top row: brand */}
      <div className="flex items-center justify-between text-zinc-400">
        <span className="text-sm font-medium tracking-[0.3em] uppercase">
          ZoneCheck
        </span>
        <span className="text-sm tracking-wide">News</span>
      </div>

      {/* Center wordmark */}
      <div className="flex flex-1 items-center">
        <h1 className="text-[15vw] leading-none font-semibold tracking-tight text-white sm:text-[10vw]">
          ZoneCheck
        </h1>
      </div>

      {/* Bottom: counter + progress line */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
            Teknoloji, startup ve drone dünyasından güncel haberler.
          </p>
          <span className="font-mono text-4xl font-light tabular-nums text-white sm:text-5xl">
            {String(progress).padStart(3, "0")}
          </span>
        </div>
        <div className="h-px w-full overflow-hidden bg-zinc-800">
          <div
            className="h-full origin-left bg-white"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
