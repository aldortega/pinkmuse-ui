export default function NewsUpdates() {
  return (
    <section className="py-16">
      <div className="container px-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-12">Noticias</h2>

        <div className="space-y-10">
          {/* Latest News Article */}
          <article className="space-y-3">
            <div className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text text-sm font-medium uppercase tracking-wide">
              Ultimas noticias
            </div>
            <h3 className="text-xl font-semibold text-slate-800">
              Lorem ipsum dolor sit amet consectetur.
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam, modi iusto placeat possimus, adipisci nostrum quam
              incidunt, sequi reiciendis doloremque ducimus hic corrupti
              deleniti voluptatem.
            </p>
          </article>

          {/* Event Update Article */}
          <article className="space-y-3">
            <div className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text text-sm font-medium uppercase tracking-wide">
              Nuevo Evento
            </div>
            <h3 className="text-xl font-semibold text-slate-800">
              Lorem ipsum dolor sit amet consectetur.
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut,
              inventore necessitatibus! Harum qui alias quidem quasi!
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
