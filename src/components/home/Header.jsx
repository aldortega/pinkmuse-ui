import { useState, useRef, useEffect, useMemo } from "react";
import api from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Music, LogOut, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";

const getInitials = (value) => {
  if (!value) {
    return "AA";
  }

  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .padEnd(2, "A");
};

const toStringId = (value) => {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object") {
    if (typeof value.$oid === "string") {
      return value.$oid;
    }
    if (typeof value.oid === "string") {
      return value.oid;
    }
    if (typeof value.id === "string") {
      return value.id;
    }
  }
  try {
    return String(value);
  } catch {
    return "";
  }
};

const getRoleLabel = (role) => {
  if (!role || typeof role !== "object") {
    return "";
  }
  const label = (
    typeof role.rol === "string" && role.rol.trim() !== ""
      ? role.rol
      : typeof role.nombre === "string" && role.nombre.trim() !== ""
      ? role.nombre
      : typeof role.displayName === "string" && role.displayName.trim() !== ""
      ? role.displayName
      : ""
  ).trim();
  return label;
};

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [adminRoleIds, setAdminRoleIds] = useState([]);
  const rolesFetchPending = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setAdminRoleIds([]);
      rolesFetchPending.current = false;
      return;
    }

    if (adminRoleIds.length > 0 || rolesFetchPending.current) {
      return;
    }

    rolesFetchPending.current = true;

    api
      .get("/roles")
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        const items = Array.isArray(data?.data) ? data.data : [];
        const adminIds = items
          .map((role) => {
            const id = toStringId(role?._id ?? role?.id);
            const label = getRoleLabel(role);
            return { id, label };
          })
          .filter((item) => item.id && item.label)
          .filter((item) => item.label.toLowerCase().includes("admin"))
          .map((item) => item.id);

        setAdminRoleIds(adminIds);
      })
      .catch(() => {
        if (!cancelled) {
          setAdminRoleIds([]);
          rolesFetchPending.current = false;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, adminRoleIds.length]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const isAdmin = useMemo(() => {
    if (!user) {
      return false;
    }

    const candidates = [
      user?.rol,
      user?.rolRelacion?.rol,
      user?.rolRelacion?.nombre,
      user?.rol?.rol,
      user?.rol?.nombre,
      user?.rol?.displayName,
    ];

    if (
      candidates.some(
        (value) =>
          typeof value === "string" &&
          value.trim().toLowerCase().includes("admin")
      )
    ) {
      return true;
    }

    const currentRoleId = toStringId(user?.rol_id ?? user?.rolId);
    if (currentRoleId && adminRoleIds.includes(currentRoleId)) {
      return true;
    }

    return false;
  }, [user, adminRoleIds]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await logout();
    } catch {
      // ignore logout errors here; interceptor already handles tokens
    }
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    setIsMenuOpen(false);
    navigate("/perfil");
  };

  const handleUserManagement = () => {
    setIsMenuOpen(false);
    navigate("/gestion-usuarios");
  };

  const displayName =
    user?.displayName ||
    [user?.nombre, user?.apellido].filter(Boolean).join(" ").trim();
  const avatarUrl =
    user?.avatar ??
    user?.perfil?.imagenPrincipal ??
    user?.perfil?.avatar ??
    user?.foto ??
    user?.image ??
    "";
  const avatarInitials =
    user?.initials || getInitials(displayName || user?.correo || "");
  const menuLabel = displayName
    ? "Abrir menu de " + displayName
    : "Abrir menu de usuario";
  const avatarAlt = displayName
    ? "Avatar de " + displayName
    : "Avatar de usuario";

  return (
    <header className="sticky top-0 z-50 w-full bg-red-50 shadow">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white">
            <Music className="h-5 w-5" />
          </div>
          <Link
            to="/home"
            className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-xl font-bold text-transparent"
          >
            PinkMuse
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          <Link
            to="/eventos"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Eventos
          </Link>
          <Link
            to="/entradas"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Entradas
          </Link>
          <Link
            to="/merch"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Merch
          </Link>
          <Link
            to="/noticias"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Noticias
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-red-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gradient-to-br from-rose-500 via-red-400 to-red-500" />
          </Button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="rounded-full outline-hidden transition hover:ring-2 hover:ring-red-200 focus-visible:ring-2 focus-visible:ring-red-300"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-label={menuLabel}
            >
              <Avatar className="h-8 w-8">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={avatarAlt} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white">
                  {avatarInitials || "A"}
                </AvatarFallback>
              </Avatar>
            </button>

            {isMenuOpen ? (
              <div
                className="absolute left-1/2 mt-2 w-40 -translate-x-1/2 rounded-lg border border-slate-200 bg-red-50 p-2 shadow-lg"
                role="menu"
                aria-label="Menu de usuario"
              >
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-100 hover:text-red-600"
                    onClick={handleProfile}
                    role="menuitem"
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </button>
                  {isAdmin ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-100 hover:text-red-600"
                      onClick={handleUserManagement}
                      role="menuitem"
                    >
                      <Users className="h-4 w-4" />
                      Usuarios
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-100 hover:text-red-600"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Salir
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
