import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/fetchNews";
import type { Category, Region } from "@/lib/sources";

export const revalidate = 900; // 15 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") as Region | null;
  const category = searchParams.get("category") as Category | null;

  try {
    const news = await fetchAllNews({
      region: region || undefined,
      category: category || undefined,
    });
    return NextResponse.json({ items: news, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error("News fetch error:", err);
    return NextResponse.json({ items: [], error: "Haberler yüklenemedi" }, { status: 500 });
  }
}
