import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/payments/paypal";
import { getPaymentConfig } from "@/lib/payments/config";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId or total" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { orderId } });
    if (!order || order.paymentMethod !== "paypal" || order.status !== "pending") {
      return NextResponse.json({ error: "Orden no disponible para PayPal" }, { status: 400 });
    }

    const config = await getPaymentConfig();
    const currency = config.paypal.currency || "USD";

    const paypalOrder = await createPayPalOrder(order.total, currency, order.orderId);

    return NextResponse.json({
      id: paypalOrder.id,
      status: paypalOrder.status,
      links: paypalOrder.links,
    });
  } catch (err) {
    console.error("[PayPal Create]", err);
    return NextResponse.json(
      { error: "Error creating PayPal order" },
      { status: 500 }
    );
  }
}
