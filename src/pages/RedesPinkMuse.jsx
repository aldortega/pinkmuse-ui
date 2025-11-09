import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function RedesPinkMuse() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Si en 300 ms todavía no respondió, mostramos el mensaje
    const timer = setTimeout(() => setLoading(true), 300);

    api
      .get("/redes-sociales")
      .then((res) => {
        const redes = res?.data?.data || res?.data || [];
        setLinks(Array.isArray(redes) ? redes : []);
      })
      .catch(() => {
        setLinks([
          { redSocial: "Facebook", url: "https://facebook.com/pinkmuse" },
          { redSocial: "Twitter", url: "https://twitter.com/pinkmuse" },
          { redSocial: "Instagram", url: "https://instagram.com/pinkmuse" },
          { redSocial: "YouTube", url: "https://youtube.com/@pinkmuse" },
          { redSocial: "Spotify", url: "https://open.spotify.com/pinkmuse" },
          { redSocial: "iTunes", url: "https://music.apple.com/pinkmuse" },
          { redSocial: "TikTok", url: "https://tiktok.com/@pinkmuse" },
        ]);
      })
      .finally(() => {
        clearTimeout(timer); // evitamos que se dispare después
        setLoading(false); // ocultamos el mensaje
      });
  }, []);

  // 🔄 Mientras carga (solo si tarda un poco)
  if (loading && links.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-200 via-pink-100 to-red-200 text-gray-700 font-sans">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg sm:text-xl font-semibold animate-pulse">
            Actualizando nuestros datos…
          </p>
        </div>
      </div>
    );
  }

  // ✅ Vista normal
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-200 via-pink-100 to-red-200 text-gray-800 font-sans overflow-hidden px-6">
      {/* ENCABEZADO */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 drop-shadow-md">
          Seguinos en nuestras redes
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mt-3 max-w-xl mx-auto">
          Conectate con{" "}
          <span className="font-semibold text-rose-600">PinkMuse</span> y
          descubrí todas nuestras plataformas oficiales.
        </p>
      </header>

      {/* LISTA DE REDES */}
      <main className="w-full flex flex-col items-center justify-center">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {links.map((red, i) => {
            const nombre = red?.redSocial || "Desconocida";
            const url = red?.url || "#";
            const inicial =
              typeof nombre === "string" && nombre.length > 0
                ? nombre.charAt(0)
                : "?";

            return (
              <li key={red._id || `${nombre}-${i}`}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center gap-3 p-6 bg-white/60 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-transform border border-rose-100"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 via-red-400 to-pink-500 text-white text-2xl font-bold shadow-inner group-hover:opacity-90 transition">
                    {inicial}
                  </div>
                  <span className="text-gray-800 text-lg sm:text-xl font-semibold group-hover:text-rose-600 transition-colors">
                    {nombre}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="mt-16 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} PinkMuse — Todos los derechos reservados.
      </footer>
    </div>
  );
}
