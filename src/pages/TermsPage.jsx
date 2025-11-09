import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 text-gray-800 font-sans overflow-hidden">
      {/* ENCABEZADO */}
      <header className="relative bg-gradient-to-br from-rose-500 via-red-400 to-pink-500 text-white text-center py-14 px-4 shadow-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide drop-shadow-md">
          Términos y Condiciones de Uso
        </h1>
        <p className="mt-2 text-sm sm:text-base opacity-90">
          Fecha de actualización:{" "}
          <span className="font-semibold">10 / 11 / 2025</span>
        </p>
      </header>

      {/* CUERPO */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-10 py-10 leading-relaxed text-base sm:text-lg">
        <p className="mb-8">
          Al registrarte en <strong>PinkMuse</strong>, aceptás cumplir con los
          siguientes términos y condiciones. Te recomendamos leerlos
          detenidamente antes de usar nuestra plataforma.
        </p>

        <Section
          title="1. Aceptación de Normas"
          content={[
            "Al crear una cuenta, aceptás respetar las normas de conducta del sitio y de la comunidad. Cualquier incumplimiento podrá derivar en la suspensión o eliminación de tu cuenta.",
          ]}
        />

        <Section
          title="2. Condiciones de Uso"
          content={[
            "Responsabilidad del Usuario: Sos responsable de mantener la seguridad de tu información de acceso y del contenido que publiques.",
            "Prohibiciones: Está prohibido el uso de lenguaje ofensivo, la publicación de contenido inapropiado o con derechos de autor sin permiso.",
            "Derechos de PinkMuse: Nos reservamos el derecho de eliminar contenido que viole estas condiciones o dañe la convivencia dentro del sitio.",
          ]}
        />

        <Section
          title="3. Acceso y Modificaciones"
          content={[
            "PinkMuse puede modificar, suspender o discontinuar temporal o permanentemente el servicio sin previo aviso.",
            "Los cambios en los términos serán informados, y el uso continuado implicará su aceptación.",
          ]}
        />

        <p className="mt-8 text-base sm:text-lg italic text-gray-700">
          El uso de nuestra plataforma implica la aceptación plena de estos
          Términos y Condiciones.
        </p>

        <div className="text-center mt-10">
          <Link
            to="/privacy"
            className="text-sm sm:text-base bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent font-semibold hover:opacity-90 transition-opacity"
          >
            Ver Política de Privacidad →
          </Link>
        </div>
      </main>
    </div>
  );
}

/* --- COMPONENTE REUTILIZABLE --- */
function Section({ title, content }) {
  return (
    <section className="pb-8">
      <h2 className="font-bold text-rose-600 text-xl sm:text-2xl mb-3 border-l-4 border-rose-400 pl-3">
        {title}
      </h2>
      <ul className="list-disc ml-6 space-y-2">
        {content.map((paragraph, i) => (
          <li key={i} className="text-gray-800 text-base sm:text-lg">
            {paragraph}
          </li>
        ))}
      </ul>
    </section>
  );
}
