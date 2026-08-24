"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paypalOrderId = searchParams.get("token") || "";
  const orderId = searchParams.get("orderId") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!paypalOrderId || !orderId) {
      setStatus("error");
      return;
    }

    fetch("/api/payments/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paypalOrderId, orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status === "COMPLETED" ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [paypalOrderId, orderId]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Procesando tu pago...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-8 pb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">No se pudo confirmar el pago</h1>
            <p className="text-muted-foreground mb-6">
              No se realizó ningún cobro confirmado. Intenta de nuevo o contacta a la tienda.
            </p>
            <Button asChild>
              <Link href="/cart">Volver al carrito</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-8 pb-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            ¡Pago Exitoso!
          </h1>
          {orderId && (
            <p className="text-muted-foreground mb-2">
              Orden: <strong className="text-foreground">{orderId}</strong>
            </p>
          )}
          <p className="text-muted-foreground mb-6">
            Tu pago fue procesado correctamente. Nos pondremos en contacto
            contigo para coordinar el envío.
          </p>
          <Button asChild>
            <Link href="/">Seguir Comprando</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-32 text-center">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
