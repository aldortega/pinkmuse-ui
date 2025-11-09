import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // 🚫 Si no hay token, redirigimos al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚀 Si hay token, lo enviamos al backend para validarlo o actualizar usuario
  useEffect(() => {
    const enviarTokenAlBackend = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/usuario`, // o /verify-token si usás esa
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.warn("Token inválido o expirado");
          localStorage.removeItem("authToken");
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        console.log("🔐 Usuario autenticado:", data);
        // 💡 Opcional: guardarlo en Context o global state
      } catch (error) {
        console.error("❌ Error al enviar token:", error);
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    };

    enviarTokenAlBackend();
  }, [token]);

  return children;
}
