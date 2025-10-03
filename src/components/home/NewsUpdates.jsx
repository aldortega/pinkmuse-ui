export default function NewsUpdates() {
  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-slate-800 sm:mb-12 sm:text-left">
          Noticias
        </h2>

        <div className="space-y-10">
          {/* Latest News Article */}
          <article className="space-y-3">
            <div className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text text-xs font-medium uppercase tracking-wide sm:text-sm">
              Ultimas noticias
            </div>
            <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">
              Lorem ipsum dolor sit amet consectetur.
            </h3>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0 sm:text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam, modi iusto placeat possimus, adipisci nostrum quam
              incidunt, sequi reiciendis doloremque ducimus hic corrupti
              deleniti voluptatem.
            </p>
          </article>

          {/* Event Update Article */}
          <article className="space-y-3">
            <div className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text text-xs font-medium uppercase tracking-wide sm:text-sm">
              Nuevo Evento
            </div>
            <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">
              Lorem ipsum dolor sit amet consectetur.
            </h3>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0 sm:text-base">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut,
              inventore necessitatibus! Harum qui alias quidem quasi!
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
