import { prisma } from "@/lib/prisma";

export interface PaymentConfig {
  paypal: { clientId: string; currency: string };
  mercadopago: { publicKey: string; currency: string };
  stripe: { publishableKey: string; currency: string };
}

let cachedConfig: PaymentConfig | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

export async function getPaymentConfig(): Promise<PaymentConfig> {
  const now = Date.now();
  if (cachedConfig && now - cacheTime < CACHE_TTL) {
    return cachedConfig;
  }

  try {
    const settings = await prisma.settings.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    cachedConfig = {
      paypal: {
        clientId: map.paypalClientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: map.storeCurrency || "USD",
      },
      mercadopago: {
        publicKey: map.mercadopagoPublicKey || process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "",
        currency: map.storeCurrency || "MXN",
      },
      stripe: {
        publishableKey: map.stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
        currency: map.storeCurrency || "USD",
      },
    };
    cacheTime = now;
    return cachedConfig;
  } catch {
    return {
      paypal: { clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", currency: "USD" },
      mercadopago: { publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "", currency: "MXN" },
      stripe: { publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "", currency: "USD" },
    };
  }
}

export function getPaymentSecrets() {
  return {
    paypal: { secret: process.env.PAYPAL_SECRET || "" },
    mercadopago: { accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "" },
    stripe: { secretKey: process.env.STRIPE_SECRET_KEY || "" },
  };
}
