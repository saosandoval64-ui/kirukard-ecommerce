"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import ProductCard from "@/components/home/ProductCard";
import type { Product } from "@/types/product";

interface CategoryNavProps {
  categories: string[];
  productsByCategory: Record<string, Product[]>;
  allProducts: Product[];
}

export default function CategoryNav({
  categories,
  productsByCategory,
  allProducts,
}: CategoryNavProps) {
  const [active, setActive] = useState("Todos");

  const products =
    active === "Todos" ? allProducts : productsByCategory[active] || [];

  return (
    <div>
      <nav className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive("Todos")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            active === "Todos"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              active === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </nav>

      {products.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No se encontraron productos
          </h3>
          <p className="text-muted-foreground">
            Vuelve pronto para ver nuestra colección.
          </p>
        </div>
      )}
    </div>
  );
}
