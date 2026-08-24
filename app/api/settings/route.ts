import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PUBLIC_KEYS = [
  "storeName",
  "storeDescription",
  "storeAddress",
  "storePhone",
  "storeEmail",
  "storeCurrency",
  "socialFacebook",
  "socialInstagram",
  "socialTwitter",
  "socialTiktok",
];

export async function GET() {
  try {
    const settings = await prisma.settings.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    });
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}
