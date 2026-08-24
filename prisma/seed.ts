import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(
  process.env.DATABASE_URL || "mysql://root:password@localhost:3306/kirukard"
);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Ampharos",
    price: 7.0,
    image: "/images/products/1-ampharos.png",
    images: JSON.stringify([
      "/images/products/back/1-ampharos-back.jpg",
    ]),
    description:
      "Carta Ampharos del set Ascended Heroes / Ninja Spinner (JP). #88/83 Secret Rare. En excelente estado. Precio según lista del cliente: $7.",
    category: "Cartas",
  },
  {
    name: "Banette",
    price: 2.0,
    image: "/images/products/2-banette.png",
    images: JSON.stringify([
      "/images/products/back/2-banette-back.pdf",
      "/images/products/detail/2-banette-detail.pdf",
    ]),
    description:
      "Carta Banette del set Ascended Heroes. #32/108. Precio según lista del cliente: $2. Gran opción para mazos de tipo psíquico.",
    category: "Cartas",
  },
  {
    name: "Crobat",
    price: 4.0,
    image: "/images/products/3-crobat.png",
    images: JSON.stringify([
      "/images/products/back/3-crobat-back.jpg",
      "/images/products/detail/3-crobat-detail.jpg",
    ]),
    description:
      "Carta Crobat del set Ascended Heroes / Chaos Rising. #93/86 Illustration Rare. Precio según lista del cliente: $4. Perfecta para estrategias de veneno y rapidez.",
    category: "Cartas",
  },
  {
    name: "Eevee",
    price: 3.0,
    image: "/images/products/4-eevee.png",
    images: JSON.stringify([
      "/images/products/back/4-eevee-back.jpg",
      "/images/products/detail/4-eevee-detail.pdf",
    ]),
    description:
      "Carta Eevee del set Ascended Heroes / Plasma Freeze. #89/116. Precio según lista del cliente: $3. El Pokémon más querido por los coleccionistas.",
    category: "Cartas",
  },
  {
    name: "Holon's Magnemite",
    price: 2.5,
    image: "/images/products/5-magnemite.png",
    images: JSON.stringify([
      "/images/products/back/5-magnemite-back.pdf",
      "/images/products/detail/5-magnemite-detail.jpg",
    ]),
    description:
      "Carta Holon's Magnemite del set Delta Species (EX). Precio según lista del cliente: $2.50. Edición clásica con diseño retro. Funciona también como Special Energy.",
    category: "Cartas",
  },
  {
    name: "Mega Pyroar EX",
    price: 4.0,
    image: "/images/products/6-mega-pyroar.png",
    images: JSON.stringify([
      "/images/products/back/6-mega-pyroar-back.jpg",
      "/images/products/detail/6-mega-pyroar-detail.jpg",
    ]),
    description:
      "Carta Mega Pyroar EX del set Ascended Heroes / Chaos Rising. #15/86 Double Rare. Precio según lista del cliente: $4. Poder de fuego devastador.",
    category: "Cartas",
  },
  {
    name: "Starmie",
    price: 1.0,
    image: "/images/products/7-starmie.png",
    images: JSON.stringify([
      "/images/products/back/7-starmie-back.jpg",
      "/images/products/detail/7-starmie-detail.jpg",
    ]),
    description:
      "Carta Starmie Base Set. #64/102 Common. Precio según lista del cliente: $1. Clásica carta de agua en excelente estado. Ideal para principiantes.",
    category: "Cartas",
  },
  {
    name: "Tangela",
    price: 5.0,
    image: "/images/products/8-tangela.png",
    images: JSON.stringify([
      "/images/products/back/8-tangela-back.pdf",
      "/images/products/detail/8-tangela-detail.jpg",
    ]),
    description:
      "Carta Tangela Base Set. #66/102 Common. Precio según lista del cliente: $5. Pieza coleccionable de las primeras ediciones. Ilustración original.",
    category: "Cartas",
  },
  {
    name: "Pikachu",
    price: 8.0,
    image: "/images/products/pikachu.png",
    images: JSON.stringify([]),
    description:
      "Carta Pikachu (Portada Principal). El ícono de Pokémon en versión coleccionable. Precio estimado según rareza: $8.",
    category: "Cartas",
  },
  {
    name: "Team Rocket's Dark Pokemon",
    price: 12.0,
    image: "/images/products/rockets.png",
    images: JSON.stringify([]),
    description:
      "Carta del set Team Rocket. Pokémon Oscuros clásicos de la era 2000. Precio estimado: $12. Muy buscado por coleccionistas vintage.",
    category: "Cartas",
  },
  {
    name: "Venonat",
    price: 3.0,
    image: "/images/products/venonat.png",
    images: JSON.stringify([]),
    description:
      "Carta Venonat Base Set / Jungle. #56 Common. Precio estimado: $3. Insecto venenoso clásico de la primera generación.",
    category: "Cartas",
  },
  {
    name: "Mega Greninja EX",
    price: 25.0,
    image: "/images/products/mega-grenninja.png",
    images: JSON.stringify([]),
    description:
      "Carta Mega Greninja EX (BREAKthrough / Chaos Rising). Chase card del set. Precio estimado: $25. Una de las más buscadas.",
    category: "Cartas",
  },
  {
    name: "Grovyle",
    price: 5.0,
    image: "/images/products/grovyle.png",
    images: JSON.stringify([]),
    description:
      "Carta Grovyle (Ruby & Sapphire era). Evolución media de Treecko. Precio estimado: $5. Clásico de Hoenn.",
    category: "Cartas",
  },
  {
    name: "Omanyte",
    price: 4.0,
    image: "/images/products/52.png",
    images: JSON.stringify([]),
    description:
      "Carta Omanyte Fossil Set. #52/62 Uncommon. Precio estimado: $4. Fósil clásico de la primera generación.",
    category: "Cartas",
  },
  {
    name: "Piplup",
    price: 4.0,
    image: "/images/products/piplup.png",
    images: JSON.stringify([]),
    description:
      "Carta Piplup (Diamond & Pearl era). Starter de agua de Sinnoh. Precio estimado: $4. Muy popular entre fans de Gen 4.",
    category: "Cartas",
  },
  {
    name: "Doduo",
    price: 2.0,
    image: "/images/products/42.png",
    images: JSON.stringify([]),
    description:
      "Carta Doduo Base Set. #42/102 Common. Precio estimado: $2. Pájaro de dos cabezas clásico de Kanto.",
    category: "Cartas",
  },
  {
    name: "Aerodactyl",
    price: 18.0,
    image: "/images/products/aerodacty.png",
    images: JSON.stringify([]),
    description:
      "Carta Aerodactyl Fossil Set. #4/62 Holo Rare. Precio estimado: $18. Fósil prehistórico muy buscado en versión holográfica.",
    category: "Cartas",
  },
  {
    name: "Dawn (Supporter)",
    price: 6.0,
    image: "/images/products/dawn.png",
    images: JSON.stringify([]),
    description:
      "Carta de Entrenador: Dawn (Amanecer). Supporter del set Diamond & Pearl. Precio estimado: $6. Personaje clave del anime Sinnoh.",
    category: "Cartas",
  },
  {
    name: "Booster Bundle",
    price: 47.0,
    image: "/images/products/9-booster-bundle.png",
    images: JSON.stringify([
      "/images/products/detail/9-booster-detail.jpg",
      "/images/products/ascended/9-booster-bundle-alt.jpg",
    ]),
    description:
      "Booster Bundle completo (6 sobres). Precio sugerido retail: $26.94 USD (~$485 MXN). Precio KIRU KARD: $47. Incluye sobres con cartas aleatorias.",
    category: "Box",
  },
  {
    name: "Booster Bundle Ascended Heroes",
    price: 52.0,
    image: "/images/products/10-booster-ascended.png",
    images: JSON.stringify([
      "/images/products/ascended/9-booster-bundle-alt.jpg",
    ]),
    description:
      "Booster Bundle del set Ascended Heroes (Mega Evolution - Ascended Heroes, enero 2026). 295+ cartas. Precio KIRU KARD: $52.",
    category: "Box",
  },
  {
    name: "Elite Trainer Box (ETB)",
    price: 52.0,
    image: "/images/products/11-etb.png",
    images: JSON.stringify([
      "/images/products/detail/11-etb-detail.png",
      "/images/products/ascended/11-etb-alt.png",
    ]),
    description:
      "Elite Trainer Box estándar (9 sobres + accesorios). MSRP: $45-55 USD. Precio KIRU KARD: $52. Incluye dados, divisores, monedas, guía.",
    category: "Box",
  },
  {
    name: "ETB Ascended Heroes",
    price: 58.0,
    image: "/images/products/12-etb-ascended.png",
    images: JSON.stringify([
      "/images/products/ascended/11-etb-alt.png",
    ]),
    description:
      "Elite Trainer Box Ascended Heroes (Edición Especial 2026). Contenido exclusivo: sobres promocionales, accesorios temáticos Mega Evolution. Precio KIRU KARD: $58.",
    category: "Box",
  },
  {
    name: "Sleeved Booster Pack",
    price: 5.0,
    image: "/images/products/13-sleeved-pack.png",
    images: JSON.stringify([
      "/images/products/detail/13-sleeved-detail.jpg",
      "/images/products/detail/13-sobre-detail.jpg",
    ]),
    description:
      "Sobre booster individual con funda protectora. MSRP: $4.49-5.49 USD. Precio KIRU KARD: $5. 10 cartas aleatorias por sobre.",
    category: "Box",
  },
  {
    name: "Sobre Suelto (Booster Pack)",
    price: 5.0,
    image: "/images/products/sobre.jpg",
    images: JSON.stringify([
      "/images/products/detail/13-sobre-detail.jpg",
    ]),
    description:
      "Sobre booster individual suelto. MSRP: $4.49-4.99 USD. Precio KIRU KARD: $5. Ideal para probar suerte sin comprar caja completa.",
    category: "Box",
  },
  {
    name: "Funko Pop! Michael Jackson Thriller #359",
    price: 15.0,
    image: "/images/products/funko/funko-MJ.png",
    images: JSON.stringify([]),
    description:
      "Funko Pop! Rocks: Michael Jackson (Thriller) #359. Vinyl figure 9cm. MSRP: $14.99 USD. Precio KIRU KARD: $15. Ícono del pop inmortalizado.",
    category: "Funko",
  },
  {
    name: "Funko Pop! Overwatch McCree / Cassidy #182",
    price: 13.0,
    image: "/images/products/funko/funko-McCree.png",
    images: JSON.stringify([]),
    description:
      "Funko Pop! Games: Overwatch - McCree (ahora Cassidy) #182. GameStop Exclusive original. MSRP: $12.99-14.99. Precio KIRU KARD: $13.",
    category: "Funko",
  },
  {
    name: "Funko Pop! Haikyuu!! Shishio",
    price: 13.0,
    image: "/images/products/funko/funko-shishido.png",
    images: JSON.stringify([]),
    description:
      "Funko Pop! Animation: Haikyuu!! - Shishio (Nekoma). MSRP: $12.99. Precio KIRU KARD: $13. Del anime de voleibol favorito.",
    category: "Funko",
  },
  {
    name: "Funko Pop! Star Wars Sabine Wren #135",
    price: 14.0,
    image: "/images/products/funko/funko-sabine.png",
    images: JSON.stringify([]),
    description:
      "Funko Pop! Star Wars: Rebels - Sabine Wren #135. Mandaloriana artista y explosivista. MSRP: $12.99-14.99. Precio KIRU KARD: $14.",
    category: "Funko",
  },
  {
    name: "Funko Pop! Hunter x Hunter Bisky #1133",
    price: 13.0,
    image: "/images/products/funko/funko-bisky.png",
    images: JSON.stringify([]),
    description:
      "Funko Pop! Animation: Hunter x Hunter - Biscuit Kreuger (Bisky) #1133. Forma niña/verdadera. MSRP: $12.99. Precio KIRU KARD: $13.",
    category: "Funko",
  },
  {
    name: "Funko Pop! My Hero Academia Tsuyu Asui #374",
    price: 13.0,
    image: "/images/products/funko/funko-tsuyu.png",
    images: JSON.stringify([]),
    description:
      "Funko Pop! Animation: My Hero Academia - Tsuyu Asui (Froppy) #374. Heroína rana de la Clase 1-A. MSRP: $12.99. Precio KIRU KARD: $13.",
    category: "Funko",
  },
  {
    name: "Funko Pop! (Genérico / Sorpresa)",
    price: 13.0,
    image: "/images/products/funko/funko.png",
    images: JSON.stringify([]),
    description:
      "Funko Pop! sorpresa. Modelo aleatorio de nuestra colección. Precio KIRU KARD: $13. ¡Descubre cuál te toca!",
    category: "Funko",
  },
  {
    name: "Promo Ascended Heroes",
    price: 18.0,
    image: "/images/products/promos/Ascended- heroes.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Ascended Heroes (Mega Evolution). Oferta especial en sobres y productos de esta colección. Precio promocional: $18.",
    category: "Promociones",
  },
  {
    name: "Promo Black Bolt",
    price: 22.0,
    image: "/images/products/promos/Black-bolt.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Black Bolt. Colección exclusiva con cartas de tipo Electric/Dark. Precio promocional: $22.",
    category: "Promociones",
  },
  {
    name: "Promo Chaos Rising",
    price: 20.0,
    image: "/images/products/promos/Chaos-Rising.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Chaos Rising. Mega Evolutions y cartas raras en oferta. Precio promocional: $20.",
    category: "Promociones",
  },
  {
    name: "Promo Destined Rivals",
    price: 25.0,
    image: "/images/products/promos/Destined-rivals.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Destined Rivals. Rivalidades icónicas de Pokémon en esta colección. Precio promocional: $25.",
    category: "Promociones",
  },
  {
    name: "Promo Estellar Crown",
    price: 19.0,
    image: "/images/products/promos/Estellar-Crown.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Estellar Crown. Corona estelar para tu colección. Precio promocional: $19.",
    category: "Promociones",
  },
  {
    name: "Promo Journey Together",
    price: 17.0,
    image: "/images/products/promos/Journey-Together.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Journey Together. Viaja junto a tus Pokémon favoritos. Precio promocional: $17.",
    category: "Promociones",
  },
  {
    name: "Promo Mega Evolution",
    price: 28.0,
    image: "/images/products/promos/Mega-Evolution.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Mega Evolution. Mega Evoluciones exclusivas al mejor precio. Precio promocional: $28.",
    category: "Promociones",
  },
  {
    name: "Promo Perfect Order",
    price: 16.0,
    image: "/images/products/promos/Perfect-Order.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Perfect Order. El orden perfecto para tu deck. Precio promocional: $16.",
    category: "Promociones",
  },
  {
    name: "Promo Phantasmal Flame",
    price: 21.0,
    image: "/images/products/promos/Phantasmal-flame.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Phantasmal Flame. Llamas fantasmales y cartas espectrales en oferta. Precio promocional: $21.",
    category: "Promociones",
  },
  {
    name: "Promo Pitch Black",
    price: 23.0,
    image: "/images/products/promos/Pitch-Black.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Pitch Black. Oscuridad total con cartas de tipo Dark y Ghost. Precio promocional: $23.",
    category: "Promociones",
  },
  {
    name: "Promo Prismatic Evolutions",
    price: 30.0,
    image: "/images/products/promos/Prismatic-Evolutions.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Prismatic Evolutions. Evoluciones prismáticas, una de las colecciones más buscadas. Precio promocional: $30.",
    category: "Promociones",
  },
  {
    name: "Promo Scarlet & Violet",
    price: 24.0,
    image: "/images/products/promos/Scarlet  y Violet.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Scarlet & Violet. La era actual de Pokémon TCG en oferta especial. Precio promocional: $24.",
    category: "Promociones",
  },
  {
    name: "Promo Shrouded Fable",
    price: 18.0,
    image: "/images/products/promos/Shrouded-Flave.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Shrouded Fable. Fábradas ocultas y cartas misteriosas. Precio promocional: $18.",
    category: "Promociones",
  },
  {
    name: "Promo Surging Sparks",
    price: 26.0,
    image: "/images/products/promos/Surging-Sparks.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set Surging Sparks. Chispas eléctricas y cartas full art en oferta. Precio promocional: $26.",
    category: "Promociones",
  },
  {
    name: "Promo White Flare",
    price: 20.0,
    image: "/images/products/promos/White-Flare.png",
    images: JSON.stringify([]),
    description:
      "Promoción del set White Flare. Resplandor blanco con cartas holográficas premium. Precio promocional: $20.",
    category: "Promociones",
  },
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@kirukard.com" },
  });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@kirukard.com",
        password: adminPassword,
        name: "Admin",
        role: "admin",
      },
    });
    console.log("Admin user created: admin@kirukard.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        stock: Math.floor(Math.random() * 46) + 5,
      },
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });