export default function Features({
  items = [
    {
      title: "Noticias",
      img: "/assets/card-news.png",
      text: "Publica novedades y mantén a tus fans al día.",
    },
    {
      title: "Entradas",
      img: "/entradas.png",
      text: "Vende tickets fácil y sin fricción.",
    },
    {
      title: "Merch",
      img: "/assets/card-merch.png",
      text: "Crea y promociona tu merchandising oficial.",
    },
    {
      title: "Eventos",
      img: "/assets/card-events.png",
      text: "Anuncia fechas y giras en tu calendario.",
    },
  ],
}) {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">
          Todo lo que necesitas
        </h2>
        <p className="text-slate-600 mt-2">
          Cuatro pilares para artistas y bandas
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-pink-200 bg-red-300/80 p-5 hover:shadow-lg transition-shadow text-center"
          >
            <img
              src={item.img}
              alt={item.title}
              className="h-70 mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
