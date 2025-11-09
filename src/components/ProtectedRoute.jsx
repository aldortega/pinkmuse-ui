import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/apiFetch";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch("/usuario"); // 👈 endpoint protegido
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("authUser", JSON.stringify(data)); // guarda usuario actual
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Verificando sesión...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
