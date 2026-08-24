"use client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: "0",
    sku: "",
    supplier: "",
    supplierUrl: "",
    costPrice: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const product: Product = await res.json();
          setForm({
            name: product.name,
            price: String(product.price),
            description: product.description || "",
            category: product.category || "",
            image: product.image || "",
            stock: String(product.stock ?? 0),
            sku: product.sku || "",
            supplier: product.supplier || "",
            supplierUrl: product.supplierUrl || "",
            costPrice: product.costPrice ? String(product.costPrice) : "",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price) || 0,
          description: form.description || null,
          category: form.category || null,
          image: form.image || null,
          stock: parseInt(form.stock) || 0,
          sku: form.sku || null,
          supplier: form.supplier || null,
          supplierUrl: form.supplierUrl || null,
          costPrice: form.costPrice ? parseFloat(form.costPrice) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar.");
        setSaving(false);
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Error de conexión.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar Producto</h1>
        <p className="text-muted-foreground">Modifica los datos del producto.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6 shadow-sm">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nombre *</label>
          <Input
            placeholder="Nombre del producto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Precio *</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Stock</label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Categoría</label>
          <Input
            placeholder="ej. Cartas, Box"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Imagen del Producto</label>
          <FileUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descripción</label>
          <Textarea
            placeholder="Descripción del producto..."
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            <i className="fa-solid fa-truck mr-2 text-muted-foreground" />
            Proveedor (Auto-DS)
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">SKU</label>
                <Input
                  placeholder="Código del producto"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Precio de Costo</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.costPrice}
                  onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Proveedor</label>
              <Input
                placeholder="Nombre del proveedor"
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL del Proveedor</label>
              <Input
                placeholder="https://..."
                value={form.supplierUrl}
                onChange={(e) => setForm({ ...form, supplierUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
