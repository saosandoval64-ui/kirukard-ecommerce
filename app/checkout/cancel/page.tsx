"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancel() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-8 pb-6 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pago Cancelado
          </h1>
          <p className="text-muted-foreground mb-6">
            El pago no fue completado. Tu orden sigue pendiente.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/checkout">Intentar de Nuevo</Link>
            </Button>
            <Button asChild>
              <Link href="/">Seguir Comprando</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
