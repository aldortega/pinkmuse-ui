import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "@/lib/axios";

const UserContext = createContext(null);
const USER_STORAGE_KEY = "authUser";
const TOKEN_STORAGE_KEY = "authToken";

const DEFAULT_USER = {
  nombre: "Usuario PinkMuse",
  apellido: "",
  displayName: "Usuario PinkMuse",
  nacionalidad: "",
  fechaNacimiento: "",
  correo: "Sin correo registrado",
  rol: "Miembro",
  telefono: "",
  avatar: "",
  initials: "UP",
};

const pickString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return "";
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const computeInitials = (value) => {
  if (!value) {
    return "UP";
  }

  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .padEnd(2, "P");
};

const normalizeUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== "object") {
    return { ...DEFAULT_USER };
  }

  const nombre = pickString(rawUser.nombre, rawUser.name);
  const apellido = pickString(
    rawUser.apellido,
    rawUser.apellidos,
    rawUser.lastName,
    rawUser.lastname
  );
  const nacionalidad = pickString(
    rawUser.nacionalidad,
    rawUser.pais,
    rawUser.country,
    rawUser.nation
  );
  const fechaNacimientoRaw = pickString(
    rawUser.fechaNacimiento,
    rawUser.fecha_nacimiento,
    rawUser.fechaNac,
    rawUser.fecha_nac,
    rawUser.birthDate,
    rawUser.birthdate
  );
  const correo = pickString(rawUser.correo, rawUser.email);
  const rol =
    pickString(
      typeof rawUser?.rol === "string" ? rawUser.rol : "",
      rawUser?.rol?.nombre,
      rawUser?.rol?.rol,
      rawUser?.rol?.displayName,
      typeof rawUser?.rol_id === "string" ? rawUser.rol_id : ""
    ) || DEFAULT_USER.rol;
  const telefono = pickString(
    rawUser.telefono,
    rawUser.telefonoMovil,
    rawUser.telefono_movil,
    rawUser.phone,
    rawUser.celular,
    rawUser.mobile
  );
  const avatar = pickString(
    rawUser?.perfil?.imagenPrincipal,
    rawUser?.perfil?.avatar,
    rawUser.avatar,
    rawUser.foto,
    rawUser.image,
    rawUser.photo
  );
  const username = pickString(rawUser.username, rawUser?.perfil?.username);

  const fechaNacimiento = formatDate(fechaNacimientoRaw);
  const displayName =
    [nombre, apellido].filter(Boolean).join(" ").trim() ||
    username ||
    correo ||
    DEFAULT_USER.displayName;
  const initials = computeInitials(displayName || correo || DEFAULT_USER.displayName);

  return {
    ...rawUser,
    nombre: nombre || DEFAULT_USER.nombre,
    apellido,
    nacionalidad,
    fechaNacimiento,
    correo: correo || DEFAULT_USER.correo,
    rol,
    telefono,
    avatar,
    username,
    displayName,
    initials,
  };
};

const readStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return normalizeUser(JSON.parse(stored));
  } catch {
    return null;
  }
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const persistUser = useCallback((value) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (value) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // ignore persistence errors
    }

    window.dispatchEvent(new Event("authUser:update"));
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, [persistUser]);

  const setUserData = useCallback(
    (nextUser) => {
      if (!nextUser) {
        clearUser();
        return null;
      }

      const normalized = normalizeUser(nextUser);
      setUser(normalized);
      persistUser(normalized);
      return normalized;
    },
    [clearUser, persistUser]
  );

  const refreshUser = useCallback(async () => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        clearUser();
        return null;
      }
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/usuario");
      return setUserData(data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo cargar tu perfil.";
      setError(message);

      if (err?.response?.status === 401) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        clearUser();
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearUser, setUserData]);

  const logout = useCallback(async () => {
    try {
      await api.post("/cerrarsesion");
    } catch {
      // ignore logout errors
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      clearUser();
    }
  }, [clearUser]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleExternalUpdate = (event) => {
      if (event?.type === "storage" && event?.key && event.key !== USER_STORAGE_KEY) {
        return;
      }
      const stored = readStoredUser();
      setUser(stored);
    };

    window.addEventListener("authUser:update", handleExternalUpdate);
    window.addEventListener("storage", handleExternalUpdate);

    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && !user) {
      refreshUser().catch(() => {
        // ignore refresh errors here; handled by state already
      });
    }

    return () => {
      window.removeEventListener("authUser:update", handleExternalUpdate);
      window.removeEventListener("storage", handleExternalUpdate);
    };
  }, [refreshUser, user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      setUser: setUserData,
      refreshUser,
      clearUser,
      logout,
    }),
    [user, loading, error, setUserData, refreshUser, clearUser, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe utilizarse dentro de un UserProvider");
  }
  return context;
}