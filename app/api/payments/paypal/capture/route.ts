import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/payments/paypal";
import { prisma } from "@/lib/prisma";
import { getPaymentConfig } from "@/lib/payments/config";

export async function POST(request: Request) {
  try {
    const { paypalOrderId, orderId } = await request.json();

    if (!paypalOrderId || !orderId) {
      return NextResponse.json({ error: "Missing paypalOrderId or orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { orderId } });
    if (!order || order.paymentMethod !== "paypal") {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    const captureData = await capturePayPalOrder(paypalOrderId);

    if (captureData.status === "COMPLETED") {
      const config = await getPaymentConfig();
      const purchaseUnit = captureData.purchase_units?.[0];
      const amount = purchaseUnit?.amount;
      const expectedTotal = order.total.toFixed(2);

      if (
        purchaseUnit?.custom_id !== order.orderId ||
        amount?.currency_code !== config.paypal.currency ||
        amount?.value !== expectedTotal
      ) {
        return NextResponse.json({ error: "El pago no coincide con la orden" }, { status: 400 });
      }

      await prisma.order.update({
        where: { orderId },
        data: {
          status: "paid",
          paymentId: captureData.id,
        },
      });
    }

    return NextResponse.json({
      status: captureData.status,
      id: captureData.id,
    });
  } catch (err) {
    console.error("[PayPal Capture]", err);
    return NextResponse.json(
      { error: "Error capturing PayPal payment" },
      { status: 500 }
    );
  }
}
