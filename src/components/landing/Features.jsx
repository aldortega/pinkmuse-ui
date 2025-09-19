import FeatureItem from "./FeatureItem";

export default function Features({
  items = [
    {
      title: "Noticias",
      img: "/news3.png",
      text: "Comparte novedades, lanzamientos y comunicados para mantener a tus fans siempre informados.",
    },
    {
      title: "Entradas",
      img: "/entradas2.png",
      text: "Vende tickets de forma directa, simple y segura, sin intermediarios.",
    },
    {
      title: "Merch",
      img: "/merch.png",
      text: "Promociona y gestiona tu merchandising oficial en un mismo espacio.",
    },
    {
      title: "Eventos",
      img: "/eventos.png",
      text: "Organiza tu calendario de giras y conciertos para que tus fans nunca se pierdan una presentacion.",
    },
  ],
}) {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-6 ">
      <div className="mb-10">
        <h2 className="text-3xl md:text-3xl font-bold text-transparent bg-gradient-to-br from-rose-500 via-red-400 to-red-600 bg-clip-text">
          Todo lo que necesitas
        </h2>
        <p className="text-slate-800 mt-2 font-semibold">
          Descubre las herramientas que hacen de PinkMuse el espacio ideal para
          artistas y fans
        </p>
      </div>
      <FeatureItem items={items} />
    </section>
  );
}
