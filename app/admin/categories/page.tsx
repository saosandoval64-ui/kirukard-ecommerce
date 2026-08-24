"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Category {
  name: string;
  count: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const products = await res.json();
        const map: Record<string, number> = {};
        for (const p of products) {
          const cat = p.category || "Sin categoría";
          map[cat] = (map[cat] || 0) + 1;
        }
        setCategories(
          Object.entries(map).map(([name, count]) => ({ name, count }))
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchCategories();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchCategories]);

  const handleAdd = async () => {
    const name = newCategory.trim();
    if (!name) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      alert("Esta categoría ya existe.");
      return;
    }
    setCategories((prev) => [...prev, { name, count: 0 }]);
    setNewCategory("");
  };

  const handleRename = async (oldName: string) => {
    const newName = editValue.trim();
    if (!newName || newName === oldName) {
      setEditIndex(null);
      return;
    }

    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const products = await res.json();
        for (const p of products) {
          if (p.category === oldName) {
            await fetch(`/api/admin/products/${p.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...p, category: newName }),
            });
          }
        }
        setCategories((prev) =>
          prev.map((c) =>
            c.name === oldName ? { name: newName, count: c.count } : c
          )
        );
      }
    } catch {
      // ignore
    }
    setEditIndex(null);
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los productos no serán eliminados.`))
      return;
    setCategories((prev) => prev.filter((c) => c.name !== name));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
        <p className="text-muted-foreground">
          Administra las categorías de productos.
        </p>
      </div>

      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Nueva categoría..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Nombre
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Productos
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <tr
                    key={cat.name}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {editIndex === i ? (
                        <div className="flex gap-2">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleRename(cat.name)
                            }
                            className="max-w-xs"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleRename(cat.name)}
                          >
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditIndex(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">{cat.count}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditIndex(i);
                            setEditValue(cat.name);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(cat.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No hay categorías creadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
