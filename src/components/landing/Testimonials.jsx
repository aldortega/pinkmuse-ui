export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <img
          src=""
          alt="Fans celebrando en estilo 3D"
          className="rounded-3xl shadow-md"
        />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Hecho para tu comunidad
          </h2>
          <div className="mt-4 space-y-4">
            {[1, 2].map((n) => (
              <blockquote
                key={n}
                className="rounded-2xl p-5 bg-pink-50 border border-pink-200"
              >
                <p className="text-sm text-slate-700">
                  “Aquí va un testimonio corto con impacto. Con PinkMuse
                  llegamos directo a nuestros fans.”
                </p>
                <div className="mt-3 h-2 w-24 bg-pink-200 rounded-full" />
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
