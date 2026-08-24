import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
