import { useMemo } from "react";
import { useUser } from "@/contexts/UserContext";

export default function WelcomeSection() {
  const { user } = useUser();

  const nombre = useMemo(() => {
    if (!user) {
      return "";
    }

    if (user.displayName) {
      return user.displayName;
    }

    const combined = [user.nombre, user.apellido].filter(Boolean).join(" ").trim();
    if (combined) {
      return combined;
    }

    return user?.perfil?.username || user?.correo || "";
  }, [user]);

  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h1 className="text-center text-3xl font-bold text-slate-800 text-balance sm:text-left">
          Hola{" "}
          <span className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text">
            {nombre}
          </span>
        </h1>
      </div>
    </section>
  );
}
