"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CreditCard, Lock, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
          paymentMethod: "paypal",
          customerEmail: fd.get("email") as string,
          customerName: `${fd.get("firstName")} ${fd.get("lastName")}` as string,
          customerPhone: (fd.get("phone") as string) || undefined,
          shippingAddr: fd.get("address") as string,
          shippingCity: fd.get("city") as string,
          shippingState: fd.get("state") as string,
          shippingZip: fd.get("zip") as string,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al procesar la orden");
        return;
      }

      setOrderId(data.orderId);

      const ppRes = await fetch("/api/payments/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderId }),
      });

      const ppData = await ppRes.json();
      if (!ppRes.ok) {
        setError("Error al crear la orden de PayPal");
        return;
      }

      const approveLink = ppData.links?.find(
        (l: { rel: string }) => l.rel === "approve"
      );
      if (approveLink) {
        clearCart();
        window.location.href = approveLink.href;
      } else {
        setError("No se encontró el enlace de pago de PayPal");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isCompleted && !isProcessing) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">No items to checkout</h1>
        <p className="text-muted-foreground mb-6">Add some products to your cart first.</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-4">¡Orden Recibida!</h1>
        <p className="text-muted-foreground mb-2">
          Tu orden <strong className="text-foreground">{orderId}</strong> fue registrada.
        </p>
        <p className="text-muted-foreground mb-6">
          Nos pondremos en contacto contigo para coordinar el envío.
        </p>
        <Button asChild>
          <Link href="/">Seguir Comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground mt-2">Complete your purchase</p>
        </div>
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/cart" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</label>
                    <Input id="phone" name="phone" type="tel" placeholder="+52 (55) 1234-5678" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                    <Input id="firstName" name="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                    <Input id="lastName" name="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-foreground">Address</label>
                  <Input id="address" name="address" placeholder="123 Main St" required />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium text-foreground">City</label>
                    <Input id="city" name="city" placeholder="Ciudad de México" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium text-foreground">State</label>
                    <Input id="state" name="state" placeholder="CDMX" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-sm font-medium text-foreground">ZIP</label>
                    <Input id="zip" name="zip" placeholder="06600" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#0070ba] rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PP</span>
                    </div>
                    <span className="font-medium text-foreground">PayPal</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Serás redirigido a PayPal para completar el pago de forma segura.
                  </p>
                </div>

                <Separator className="my-4" />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#0070ba] text-white hover:bg-[#005ea6]"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Redirigiendo a PayPal...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Pagar con PayPal — ${total.toFixed(2)}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Pago seguro vía PayPal</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>Tarjeta, débito o saldo PayPal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
