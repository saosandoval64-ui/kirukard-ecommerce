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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, price, image, description, category, stock, sku, supplier, supplierUrl, costPrice } = body;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(price !== undefined && { price }),
        ...(image !== undefined && { image: image || null }),
        ...(description !== undefined && { description: description || null }),
        ...(category !== undefined && { category: category || null }),
        ...(stock !== undefined && { stock }),
        ...(sku !== undefined && { sku: sku || null }),
        ...(supplier !== undefined && { supplier: supplier || null }),
        ...(supplierUrl !== undefined && { supplierUrl: supplierUrl || null }),
        ...(costPrice !== undefined && { costPrice: costPrice || null }),
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Producto no encontrado." },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Producto no encontrado." },
      { status: 404 }
    );
  }
}
