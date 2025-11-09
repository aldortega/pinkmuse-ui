import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 text-gray-800 font-sans overflow-hidden">
      {/* ENCABEZADO */}
      <header className="relative bg-gradient-to-br from-pink-500 via-red-400 to-rose-500 text-white text-center py-14 px-4 shadow-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide drop-shadow-md">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm sm:text-base opacity-90">
          Fecha de actualización:{" "}
          <span className="font-semibold">10 / 11 / 2025</span>
        </p>
      </header>

      {/* CUERPO */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-10 py-10 leading-relaxed text-base sm:text-lg">
        <p className="mb-8">
          En <strong>PinkMuse</strong> respetamos tu privacidad y nos
          comprometemos a proteger tu información personal. Esta política
          describe cómo recopilamos, utilizamos y protegemos tus datos.
        </p>

        <Section
          title="1. Datos Recopilados"
          content={[
            "Recopilamos los datos que proporcionás al registrarte, como nombre, correo electrónico y nacionalidad.",
            "También podemos recopilar información sobre tu uso del sitio (por ejemplo, eventos visitados o productos comprados) para mejorar tu experiencia.",
          ]}
        />

        <Section
          title="2. Uso de la Información"
          content={[
            "Los datos se utilizan exclusivamente para ofrecerte una mejor experiencia, procesar tus pedidos y personalizar tu interacción con PinkMuse.",
            "No compartimos tu información personal con terceros sin tu consentimiento explícito.",
          ]}
        />

        <Section
          title="3. Seguridad de los Datos"
          content={[
            "Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos frente a accesos no autorizados, pérdida o alteración.",
          ]}
        />

        <Section
          title="4. Derechos del Usuario"
          content={[
            "Podés solicitar en cualquier momento la actualización, rectificación o eliminación de tus datos personales enviando un correo a soporte@pinkmuse.com.",
          ]}
        />

        <Section
          title="5. Cambios en esta Política"
          content={[
            "Podemos actualizar esta Política de Privacidad ocasionalmente. Los cambios se publicarán en esta misma página.",
          ]}
        />

        <div className="text-center mt-10">
          <Link
            to="/terms"
            className="text-sm sm:text-base bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent font-semibold hover:opacity-90 transition-opacity"
          >
            ← Volver a Términos y Condiciones
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
