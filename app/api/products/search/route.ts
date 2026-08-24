import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products-data";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const products = searchProducts(q);
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Error al buscar productos." },
      { status: 500 }
    );
  }
}
