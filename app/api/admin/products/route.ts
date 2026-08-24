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

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, price, image, description, category, stock, sku, supplier, supplierUrl, costPrice } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Nombre requerido." }, { status: 400 });
    }

    if (price === undefined || typeof price !== "number" || price < 0) {
      return NextResponse.json({ error: "Precio inválido." }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price,
        image: image || null,
        description: description || null,
        category: category || null,
        stock: stock || 0,
        sku: sku || null,
        supplier: supplier || null,
        supplierUrl: supplierUrl || null,
        costPrice: costPrice || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 });
  }
}
