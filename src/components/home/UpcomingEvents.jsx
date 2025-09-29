import { EventCard } from "./EventCard";

const events = [
  {
    title: "Summer Music Fest",
    date: "July 15, 2024",
    image: "/brazos.png",
    imageQuery: "summer-music-festival-stage",
  },
  {
    title: "Indie Rock Night",
    date: "August 22, 2024",
    image: "/brazos.png",
    imageQuery: "indie-rock-concert-crowd",
  },
  {
    title: "Acoustic Sessions",
    date: "September 5, 2024",
    image: "/brazos.png",
    imageQuery: "acoustic-guitar-performance",
  },
];

export default function UpcomingEvents() {
  return (
    <section>
      <div className="container px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Proximos eventos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              date={event.date}
              image={event.image}
              imageQuery={event.imageQuery}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
