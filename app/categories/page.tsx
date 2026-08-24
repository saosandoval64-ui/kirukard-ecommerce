import CategoryNav from "@/components/categories/CategoryNav";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
    const grouped: Record<string, typeof products> = {};
    for (const product of products) {
      const cat = product.category || "Sin categoría";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(product);
    }
    return { all: products, grouped };
  } catch {
    return { all: [], grouped: {} };
  }
}

export default async function CategoriesPage() {
  const { all, grouped } = await getProducts();
  const categories = Object.keys(grouped);

  return (
    <div className="bg-background px-4 py-8 sm:py-12 lg:py-16 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <CategoryNav
          categories={categories}
          productsByCategory={grouped}
          allProducts={all}
        />
      </div>
    </div>
  );
}
