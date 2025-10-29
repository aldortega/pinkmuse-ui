import { Sparkles } from "lucide-react";

export default function MerchHero({ productCount = 0, categoryCount = 0 }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-400 to-red-600 px-6 py-12 text-white shadow-lg sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent)]" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <Sparkles className="h-4 w-4" />
            Nueva coleccion
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Merch oficial para vibrar el tour
          </h1>
          <p className="text-base text-white/85 sm:text-lg">
            Explora prendas, accesorios y ediciones especiales disenadas para fans. Todo listo para
            integrarse con el carrito y los metodos de pago del backend.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center sm:gap-6">
          <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
            <p className="text-3xl font-bold">{productCount}</p>
            <p className="text-xs uppercase tracking-wide text-white/80">Productos</p>
          </div>
          <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
            <p className="text-3xl font-bold">{categoryCount}</p>
            <p className="text-xs uppercase tracking-wide text-white/80">Categorias</p>
          </div>
        </div>
      </div>
    </section>
  );
}
