import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  let productCount = 0;
  let categoryCount = 0;
  let userCount = 0;

  try {
    productCount = await prisma.product.count();
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
    });
    categoryCount = categories.length;
    userCount = await prisma.user.count();
  } catch {
    // ignore
  }

  const stats = [
    { label: "Productos", value: productCount, icon: "fa-box", color: "text-primary" },
    { label: "Categorías", value: categoryCount, icon: "fa-tags", color: "text-green-600" },
    { label: "Usuarios", value: userCount, icon: "fa-users", color: "text-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de tu tienda KIRU KARD.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <i className={`fa-solid ${stat.icon} text-2xl ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Acciones Rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <i className="fa-solid fa-plus" />
            Gestionar Productos
          </a>
          <a
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            <i className="fa-solid fa-tags" />
            Gestionar Categorías
          </a>
          <a
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            <i className="fa-solid fa-gear" />
            Configurar Pagos
          </a>
        </div>
      </div>
    </div>
  );
}
