import { useEffect, useState } from "react";

export function WelcomeSection() {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUser = window.localStorage.getItem("authUser");
    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const nameCandidate = user?.nombre ?? user?.name ?? "";

      if (typeof nameCandidate === "string") {
        setDisplayName(nameCandidate.trim());
      }
    } catch {
      setDisplayName("");
    }
  }, []);

  const nombre = displayName;

  return (
    <section className="py-8">
      <div className="container px-6">
        <h1 className="text-3xl font-bold text-slate-800 text-balance">
          Hola{" "}
          <span className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text">
            {nombre}
          </span>
        </h1>
      </div>
    </section>
  );
}
