import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaPg } from "@prisma/adapter-pg";
import Database from "better-sqlite3";
import "dotenv/config";

const sqlitePath = process.env.SQLITE_PATH || "dev.db";
const dbUrl = process.env.DATABASE_URL || "";
const isMysql = dbUrl.startsWith("mysql");

const adapter = isMysql
  ? new PrismaMariaDb(dbUrl || "mysql://root:password@localhost:3306/kirukard")
  : new PrismaPg({ connectionString: dbUrl || "postgresql://postgres:postgres@localhost:5432/postgres" });
const prisma = new PrismaClient({ adapter });

const tables = ["OrderItem", "Order", "Session", "Product", "User", "Settings"] as const;

function all<T>(db: Database.Database, sql: string): T[] {
  return db.prepare(sql).all() as T[];
}

async function main() {
  const sqlite = new Database(sqlitePath);
  sqlite.pragma("journal_mode = WAL");

  const users = all<Record<string, unknown>>(sqlite, 'SELECT * FROM "User"');
  const sessions = all<Record<string, unknown>>(sqlite, 'SELECT * FROM "Session"');
  const products = all<Record<string, unknown>>(sqlite, 'SELECT * FROM "Product"');
  const orders = all<Record<string, unknown>>(sqlite, 'SELECT * FROM "Order"');
  const orderItems = all<Record<string, unknown>>(sqlite, 'SELECT * FROM "OrderItem"');
  const settings = all<Record<string, unknown>>(sqlite, 'SELECT * FROM "Settings"');

  console.log("SQLite ->", { users: users.length, sessions: sessions.length, products: products.length, orders: orders.length, orderItems: orderItems.length, settings: settings.length });

  if (isMysql) {
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS=0");
  }
  for (const t of tables) {
    if (isMysql) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${t}\``);
    } else {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${t}" RESTART IDENTITY CASCADE`);
    }
  }
  if (isMysql) {
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS=1");
  }

  for (const s of settings) {
    await prisma.settings.create({
      data: { id: s.id as number, key: s.key as string, value: s.value as string },
    });
  }

  for (const u of users) {
    await prisma.user.create({
      data: {
        id: u.id as number,
        email: u.email as string,
        password: u.password as string,
        name: u.name as string,
        role: u.role as string,
        createdAt: new Date(u.createdAt as string),
      },
    });
  }

  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id as number,
        name: p.name as string,
        price: p.price as number,
        image: (p.image as string) ?? null,
        images: (p.images as string) ?? null,
        description: (p.description as string) ?? null,
        category: (p.category as string) ?? null,
        stock: p.stock as number,
        sku: (p.sku as string) ?? null,
        supplier: (p.supplier as string) ?? null,
        supplierUrl: (p.supplierUrl as string) ?? null,
        costPrice: (p.costPrice as number) ?? null,
        createdAt: new Date(p.createdAt as string),
        updatedAt: new Date(p.updatedAt as string),
      },
    });
  }

  for (const s of sessions) {
    await prisma.session.create({
      data: {
        id: s.id as string,
        userId: s.userId as number,
        expiresAt: new Date(s.expiresAt as string),
      },
    });
  }

  for (const o of orders) {
    await prisma.order.create({
      data: {
        id: o.id as number,
        orderId: o.orderId as string,
        customerEmail: o.customerEmail as string,
        customerName: o.customerName as string,
        customerPhone: (o.customerPhone as string) ?? null,
        shippingAddr: o.shippingAddr as string,
        shippingCity: o.shippingCity as string,
        shippingState: o.shippingState as string,
        shippingZip: o.shippingZip as string,
        paymentMethod: o.paymentMethod as string,
        subtotal: o.subtotal as number,
        shipping: o.shipping as number,
        tax: o.tax as number,
        total: o.total as number,
        status: o.status as string,
        paymentId: (o.paymentId as string) ?? null,
        createdAt: new Date(o.createdAt as string),
      },
    });
  }

  for (const i of orderItems) {
    await prisma.orderItem.create({
      data: {
        id: i.id as number,
        orderId: i.orderId as number,
        productId: i.productId as number,
        name: i.name as string,
        price: i.price as number,
        quantity: i.quantity as number,
      },
    });
  }

  if (!isMysql) {
    for (const t of ["User", "Product", "Order", "OrderItem", "Settings"] as const) {
      await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${t}"', 'id'), (SELECT MAX(id) FROM "${t}"))`);
    }
  }

  console.log("Datos migrados correctamente a", isMysql ? "MySQL" : "PostgreSQL", ".");
  sqlite.close();
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error("ERROR:", e);
    process.exit(1);
  });
