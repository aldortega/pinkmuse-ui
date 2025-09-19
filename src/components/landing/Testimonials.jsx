export default function Testimonials() {
  const testimonials = [
    {
      mensaje:
        "Gracias a esta plataforma siempre estoy al día con mi banda favorita, ¡siento que estoy más cerca que nunca de ellos!",
      autor: "Brenda",
    },
    {
      mensaje:
        "Me encanta poder comprar entradas y merch en un solo lugar, todo es súper fácil y rápido.",
      autor: "Victoria",
    },
    {
      mensaje:
        "Por fin una página que reúne todo lo que necesito: noticias, eventos y productos oficiales.",
      autor: "Marianela",
    },
  ];

  return (
    <section id="testimonials" className="">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <img
          src="/brazos.png"
          alt="Fans celebrando en estilo 3D"
          className="rounded-3xl shadow"
        />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold ">
            Hecho para tu comunidad
          </h2>
          <div className="mt-4 space-y-4">
            {testimonials.map((item, i) => (
              <blockquote key={i} className="rounded-2xl p-5 bg-red-100">
                <p className="text-sm text-slate-800">“{item.mensaje}”</p>
                <footer className="mt-2 text-xs font-medium text-slate-500">
                  — {item.autor}
                </footer>
                <div className="mt-3 h-2 w-24 bg-gradient-to-br from-rose-500 via-red-400 to-red-600 rounded-full" />
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
