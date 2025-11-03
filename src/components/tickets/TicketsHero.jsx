import { CalendarHeart } from "lucide-react";

export default function TicketsHero({ upcomingCount = 0 }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-400 to-red-600 px-6 py-12 text-white shadow-lg sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent)]" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <CalendarHeart className="h-4 w-4" />
            Agenda PinkMuse
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Entradas para los próximos shows
          </h1>
          <p className="text-base text-white/85 sm:text-lg">
            Elegí tu fecha, tu ubicación favorita y el tipo de experiencia que
            querés vivir.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/15 px-6 py-6 text-center backdrop-blur">
          <p className="text-sm uppercase tracking-wide text-white/80">
            Eventos próximos
          </p>
          <p className="text-5xl font-black">{upcomingCount}</p>
          <p className="text-xs text-white/75">
            Actualizamos la agenda en tiempo real. Sumate a la experiencia.
          </p>
        </div>
      </div>
    </section>
  );
}
