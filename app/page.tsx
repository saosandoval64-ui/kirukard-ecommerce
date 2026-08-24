import ProductList from "@/components/home/ProductList";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <section className="relative px-4 py-16 sm:py-20 flex items-center justify-center min-h-[300px]">
<Image
            src="/images/backgrounds/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 text-center mx-auto max-w-4xl space-y-4">
          <h1 className="text-white leading-tight text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl drop-shadow-lg">
            El Santo Grial de{" "}
            <span className="text-primary">Pokémon</span>{" "}
            y el Coleccionismo
          </h1>
          <p className="text-white/85 text-base max-w-2xl mx-auto sm:text-lg drop-shadow">
            Figuras de alta calidad, Elite Trainer Boxes, cartas únicas y
            Mystery Boxes seleccionadas a mano para quienes no se conforman
            con lo común.
          </p>

          <div className="flex justify-center pt-1">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              <i className="fa-solid fa-layer-group" />
              Explorar Categorías
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16 lg:px-8">
        <ProductList />
      </section>
    </div>
  );
}
