import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 " />
      <div className="relative grid items-center gap-8 px-6 mx-auto max-w-7xl md:grid-cols-2">
        {/* Illustration */}
        <div className="order-2 md:order-1">
          <img
            src="imagen2.png"
            alt="Concierto 3D con público y escenario"
            className="object-scale-down rounded-3xl"
          />
        </div>
        {/* Copy + CTA */}
        <div className="order-1 md:order-2">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl text-slate-800">
            Tu música, tus fans,{" "}
            <span className="text-transparent bg-gradient-to-br from-rose-500 via-red-400 to-red-600 bg-clip-text">
              tu espacio
            </span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-700 max-w-prose">
            Publica noticias, anuncia eventos, vende entradas y conecta con tu
            comunidad desde un solo lugar.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button className="px-4 py-2 font-semibold text-white shadow bg-gradient-to-br from-rose-500 via-red-400 to-red-600 hover:bg-pink-700 cursor-pointer">
              Crear cuenta gratis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
