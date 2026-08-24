import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      paymentMethod,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddr,
      shippingCity,
      shippingState,
      shippingZip,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }
    if (!paymentMethod) {
      return NextResponse.json({ error: "No payment method selected" }, { status: 400 });
    }
    if (!customerEmail || !customerName || !shippingAddr || !shippingCity || !shippingState || !shippingZip) {
      return NextResponse.json({ error: "Faltan datos de envío" }, { status: 400 });
    }

    const productIds = items.map((item: { id: number }) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems: { productId: number; name: string; price: number; quantity: number }[] = [];

    for (const item of items as { id: number; quantity: number }[]) {
      const dbProduct = productMap.get(item.id);
      if (!dbProduct) {
        return NextResponse.json({ error: `Producto ${item.id} no encontrado` }, { status: 400 });
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${dbProduct.name} (disponible: ${dbProduct.stock})` },
          { status: 400 }
        );
      }
      subtotal += dbProduct.price * item.quantity;
      orderItems.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    const shippingCost = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    const orderIdStr = `KIRU-${Date.now()}`;

    await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderId: orderIdStr,
          customerEmail,
          customerName,
          customerPhone: customerPhone || null,
          shippingAddr,
          shippingCity,
          shippingState,
          shippingZip,
          paymentMethod,
          subtotal,
          shipping: shippingCost,
          tax,
          total,
          status: "pending",
          items: {
            create: orderItems,
          },
        },
      });

      for (const item of orderItems) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`Stock changed for product ${item.productId}`);
        }
      }

      return newOrder;
    });

    sendOrderEmail({
      orderId: orderIdStr,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddr,
      shippingCity,
      shippingState,
      shippingZip,
      paymentMethod,
      items: orderItems.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      subtotal,
      shipping: shippingCost,
      tax,
      total,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      orderId: orderIdStr,
      total,
      paymentMethod,
      subtotal,
      shipping: shippingCost,
      tax,
    });
  } catch (err) {
    console.error("[Checkout]", err);
    return NextResponse.json({ error: "Error al procesar la orden" }, { status: 500 });
  }
}
