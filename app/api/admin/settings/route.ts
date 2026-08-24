import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

const SETTINGS_KEYS = [
  "paypalClientId",
  "paypalSecret",
  "mercadopagoPublicKey",
  "mercadopagoAccessToken",
  "stripePublishableKey",
  "stripeSecretKey",
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
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const settings = await prisma.settings.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();

    for (const key of SETTINGS_KEYS) {
      if (key in body) {
        const value = body[key];
        if (typeof value === "string") {
          const existing = await prisma.settings.findUnique({ where: { key } });
          if (existing) {
            await prisma.settings.update({ where: { key }, data: { value } });
          } else {
            await prisma.settings.create({ data: { key, value } });
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 });
  }
}
