import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function Cta() {
  const navigate = useNavigate();
  return (
    <section id="cta" className="relative overflow-hidden">
      <div className="absolute inset-0" />
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 items-center text-white">
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-gradient-to-br from-rose-500 via-red-400 to-red-600 bg-clip-text">
            Lleva tu musica al siguiente nivel
          </h2>
          <p className="mt-3 max-w-prose text-slate-800 font-semibold">
            Crea tu cuenta, publica, vende y conecta. Todo en un solo lugar.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              className="px-4 py-2 font-semibold text-white shadow bg-gradient-to-br from-rose-500 via-red-400 to-red-600 hover:bg-pink-700 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Registrate a PinkMuse
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
