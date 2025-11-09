import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/utils/apiFetch";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch("/usuario");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          console.log(
            "✅ Usuario autenticado detectado desde AuthContext:",
            data
          );
          localStorage.setItem("authUser", JSON.stringify(data));
        } else {
          setUser(null);
          localStorage.removeItem("authUser");
        }
      } catch {
        setUser(null);
        localStorage.removeItem("authUser");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
