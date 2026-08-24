import nodemailer from "nodemailer";

interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddr: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  paymentMethod: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const smtpHost = process.env.SMTP_HOST || "";
const smtpPort = parseInt(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const adminEmail = process.env.ADMIN_EMAIL || "contacto@kirukard.com";

function getTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass) return null;
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

function buildItemsRows(items: OrderEmailData["items"]): string {
  return items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">$${i.price.toFixed(2)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");
}

function buildEmailHtml(data: OrderEmailData): string {
  const paymentLabels: Record<string, string> = {
    paypal: "PayPal",
    mercadopago: "MercadoPago",
    stripe: "Stripe",
  };

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:640px;margin:20px auto;background:#ffffff;border-radius:8px;overflow:hidden;">
    <div style="background:#000000;padding:24px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;">KIRU<span style="color:#3b82f6;">KARD</span> — Nueva Orden</h1>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 8px;font-size:14px;color:#666;">Orden</p>
      <p style="margin:0 0 24px;font-size:20px;font-weight:700;color:#111;">${data.orderId}</p>

      <h2 style="margin:0 0 12px;font-size:16px;color:#111;border-bottom:2px solid #3b82f6;padding-bottom:8px;">Datos del Cliente</h2>
      <table style="width:100%;font-size:14px;color:#333;margin-bottom:24px;">
        <tr><td style="padding:4px 0;font-weight:600;width:120px;">Nombre</td><td>${data.customerName}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Email</td><td>${data.customerEmail}</td></tr>
        ${data.customerPhone ? `<tr><td style="padding:4px 0;font-weight:600;">Teléfono</td><td>${data.customerPhone}</td></tr>` : ""}
      </table>

      <h2 style="margin:0 0 12px;font-size:16px;color:#111;border-bottom:2px solid #3b82f6;padding-bottom:8px;">Dirección de Envío</h2>
      <p style="margin:0 0 4px;font-size:14px;color:#333;">${data.shippingAddr}</p>
      <p style="margin:0 0 24px;font-size:14px;color:#333;">${data.shippingCity}, ${data.shippingState} ${data.shippingZip}</p>

      <h2 style="margin:0 0 12px;font-size:16px;color:#111;border-bottom:2px solid #3b82f6;padding-bottom:8px;">Productos</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;margin-bottom:24px;">
        <thead>
          <tr style="background:#f8f9fa;">
            <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #dee2e6;">Producto</th>
            <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #dee2e6;">Cant.</th>
            <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #dee2e6;">Precio</th>
            <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #dee2e6;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${buildItemsRows(data.items)}
        </tbody>
      </table>

      <table style="width:100%;font-size:14px;color:#333;margin-bottom:24px;">
        <tr><td style="padding:4px 0;">Subtotal</td><td style="text-align:right;">$${data.subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;">Envío</td><td style="text-align:right;">${data.shipping === 0 ? "Gratis" : "$" + data.shipping.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;">IVA (8%)</td><td style="text-align:right;">$${data.tax.toFixed(2)}</td></tr>
        <tr><td style="padding:8px 0;font-size:18px;font-weight:700;border-top:2px solid #111;">Total</td><td style="text-align:right;font-size:18px;font-weight:700;border-top:2px solid #111;color:#3b82f6;">$${data.total.toFixed(2)}</td></tr>
      </table>

      <p style="margin:0 0 8px;font-size:14px;color:#666;">Método de pago: <strong>${paymentLabels[data.paymentMethod] || data.paymentMethod}</strong></p>
    </div>
    <div style="background:#f8f9fa;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#999;">KIRU<span style="color:#3b82f6;">KARD</span> — Tienda de Trading Cards</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendOrderEmail(data: OrderEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] SMTP no configurado — omitiendo envío de email para", data.orderId);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"KIRU KARD" <${smtpUser}>`,
      to: adminEmail,
      subject: `Nueva orden ${data.orderId} — $${data.total.toFixed(2)}`,
      html: buildEmailHtml(data),
      replyTo: data.customerEmail,
    });
    console.log(`[Email] Enviado a ${adminEmail} para orden ${data.orderId}`);
    return true;
  } catch (err) {
    console.error(`[Email] Error enviando email para ${data.orderId}:`, err);
    return false;
  }
}
