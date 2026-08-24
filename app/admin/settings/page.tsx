"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/context/SettingsContext";
import { CheckCircle, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Settings {
  paypalClientId: string;
  paypalSecret: string;
  mercadopagoPublicKey: string;
  mercadopagoAccessToken: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  storeName: string;
  storeDescription: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  storeCurrency: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialTiktok: string;
}

const defaultSettings: Settings = {
  paypalClientId: "",
  paypalSecret: "",
  mercadopagoPublicKey: "",
  mercadopagoAccessToken: "",
  stripePublishableKey: "",
  stripeSecretKey: "",
  storeName: "KIRU KARD",
  storeDescription: "Cartas coleccionables, sobres booster y productos TCG de calidad.",
  storeAddress: "Ciudad de México, México",
  storePhone: "+52 (55) 1234-5678",
  storeEmail: "contacto@kirukard.com",
  storeCurrency: "MXN",
  socialFacebook: "",
  socialInstagram: "",
  socialTwitter: "",
  socialTiktok: "",
};

export default function AdminSettingsPage() {
  const { refetchSettings } = useSettings();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        refetchSettings();
      }
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">
            Configura la tienda, APIs de pago y redes sociales.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : "Guardar Configuración"}
            </>
          )}
        </Button>
      </div>

      {/* Store Info */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <i className="fa-solid fa-store text-2xl text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Información de la Tienda</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nombre de la Tienda</label>
              <Input
                placeholder="KIRU KARD"
                value={settings.storeName}
                onChange={(e) => update("storeName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Moneda</label>
              <Input
                placeholder="MXN"
                value={settings.storeCurrency}
                onChange={(e) => update("storeCurrency", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Descripción</label>
            <Textarea
              placeholder="Descripción de la tienda..."
              rows={2}
              value={settings.storeDescription}
              onChange={(e) => update("storeDescription", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Dirección</label>
              <Input
                placeholder="Ciudad de México, México"
                value={settings.storeAddress}
                onChange={(e) => update("storeAddress", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Teléfono</label>
              <Input
                placeholder="+52 (55) 1234-5678"
                value={settings.storePhone}
                onChange={(e) => update("storePhone", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email de Contacto</label>
            <Input
              placeholder="contacto@kirukard.com"
              value={settings.storeEmail}
              onChange={(e) => update("storeEmail", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <i className="fa-solid fa-share-nodes text-2xl text-blue-500" />
          <h2 className="text-lg font-semibold text-foreground">Redes Sociales</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Facebook URL</label>
            <Input
              placeholder="https://facebook.com/..."
              value={settings.socialFacebook}
              onChange={(e) => update("socialFacebook", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Instagram URL</label>
            <Input
              placeholder="https://instagram.com/..."
              value={settings.socialInstagram}
              onChange={(e) => update("socialInstagram", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Twitter/X URL</label>
            <Input
              placeholder="https://x.com/..."
              value={settings.socialTwitter}
              onChange={(e) => update("socialTwitter", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">TikTok URL</label>
            <Input
              placeholder="https://tiktok.com/..."
              value={settings.socialTiktok}
              onChange={(e) => update("socialTiktok", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* PayPal */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <i className="fa-brands fa-paypal text-2xl text-blue-600" />
          <h2 className="text-lg font-semibold text-foreground">PayPal</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Client ID</label>
            <Input
              placeholder="PayPal Client ID"
              value={settings.paypalClientId}
              onChange={(e) => update("paypalClientId", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Client Secret</label>
            <Input
              type="password"
              placeholder="PayPal Client Secret"
              value={settings.paypalSecret}
              onChange={(e) => update("paypalSecret", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MercadoPago */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <i className="fa-solid fa-money-bill-wave text-2xl text-blue-400" />
          <h2 className="text-lg font-semibold text-foreground">MercadoPago</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Public Key</label>
            <Input
              placeholder="MercadoPago Public Key"
              value={settings.mercadopagoPublicKey}
              onChange={(e) => update("mercadopagoPublicKey", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Access Token</label>
            <Input
              type="password"
              placeholder="MercadoPago Access Token"
              value={settings.mercadopagoAccessToken}
              onChange={(e) => update("mercadopagoAccessToken", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stripe */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <i className="fa-solid fa-credit-card text-2xl text-purple-500" />
          <h2 className="text-lg font-semibold text-foreground">Stripe</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Publishable Key</label>
            <Input
              placeholder="Stripe Publishable Key"
              value={settings.stripePublishableKey}
              onChange={(e) => update("stripePublishableKey", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Secret Key</label>
            <Input
              type="password"
              placeholder="Stripe Secret Key"
              value={settings.stripeSecretKey}
              onChange={(e) => update("stripeSecretKey", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
