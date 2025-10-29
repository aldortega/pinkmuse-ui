import TicketEventCard from "./TicketEventCard";

export default function TicketEventList({ events = [] }) {
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-red-200 bg-red-50/60 p-10 text-center">
        <p className="text-lg font-semibold text-slate-800">
          Sin eventos disponibles por ahora
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Apenas confirmemos nuevas fechas vas a poder verlas acá mismo para
          elegir tus entradas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <TicketEventCard key={event?.nombreEvento ?? event?._id} event={event} />
      ))}
    </div>
  );
}
