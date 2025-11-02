import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import api from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckCheck,
  Loader2,
  LogOut,
  Music,
  Newspaper,
  ShoppingBag,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { useNotifications } from "@/contexts/NotificationsContext";

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

const notificationIcons = {
  evento: CalendarDays,
  producto: ShoppingBag,
  noticia: Newspaper,
  general: Bell,
};

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [adminRoleIds, setAdminRoleIds] = useState([]);
  const rolesFetchPending = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);

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

  useEffect(() => {
    if (!isNotificationsOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isNotificationsOpen]);

  useEffect(() => {
    if (!isNotificationsOpen) {
      return;
    }

    refetchNotifications().catch(() => {
      // errores controlados en el contexto
    });
  }, [isNotificationsOpen, refetchNotifications]);

  useEffect(() => {
    if (!user) {
      setIsNotificationsOpen(false);
    }
  }, [user]);

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
    setIsNotificationsOpen(false);
    try {
      await logout();
    } catch {
      // ignore logout errors here; interceptor already handles tokens
    }
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    navigate("/perfil");
  };

  const handleUserManagement = () => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    navigate("/gestion-usuarios");
  };

  const handleToggleNotifications = useCallback(() => {
    setIsNotificationsOpen((prev) => !prev);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen]);

  const handleNotificationClick = useCallback(
    async (notification) => {
      if (!notification) {
        return;
      }

      const { id, link, read } = notification;

      try {
        if (!read && id) {
          await markAsRead(id);
        }
      } catch {
        // ignoramos errores de marcado individual
      } finally {
        setIsNotificationsOpen(false);
      }

      if (typeof link === "string" && link.trim() !== "") {
        if (/^https?:\/\//i.test(link)) {
          if (typeof window !== "undefined") {
            window.open(link, "_blank", "noopener,noreferrer");
          }
        } else {
          navigate(link);
        }
      }
    },
    [markAsRead, navigate]
  );

  const handleNotificationDelete = useCallback(
    async (event, notification) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!notification?.id) {
        return;
      }

      setPendingDeleteId(notification.id);
      try {
        await deleteNotification(notification.id);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("No se pudo eliminar la notificacion", err);
      } finally {
        setPendingDeleteId("");
      }
    },
    [deleteNotification]
  );

  const handleMarkAllRead = useCallback(async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsRead();
    } catch {
      // ignoramos errores globales
    } finally {
      setIsMarkingAll(false);
    }
  }, [markAllAsRead]);

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

  const notificationsButtonLabel = useMemo(() => {
    if (unreadCount > 0) {
      const limited = unreadCount > 99 ? "99+" : unreadCount;
      return `Ver notificaciones (${limited} sin leer)`;
    }
    return "Ver notificaciones";
  }, [unreadCount]);

  const unreadBadge = useMemo(() => {
    if (unreadCount <= 0) {
      return "";
    }
    if (unreadCount > 99) {
      return "99+";
    }
    return String(unreadCount);
  }, [unreadCount]);

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
          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-red-100"
              aria-label={notificationsButtonLabel}
              aria-haspopup="true"
              aria-expanded={isNotificationsOpen}
              onClick={handleToggleNotifications}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-red-400 to-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadBadge}
                </span>
              ) : null}
            </Button>

            {isNotificationsOpen ? (
              <div className="absolute right-0 mt-2 w-80 max-w-xs rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Notificaciones
                  </p>
                  {notifications.length > 0 ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleMarkAllRead}
                      disabled={
                        isMarkingAll ||
                        notificationsLoading ||
                        unreadCount === 0
                      }
                    >
                      {isMarkingAll ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCheck className="h-3 w-3" />
                      )}
                      Marcar todas
                    </button>
                  ) : null}
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {notificationsLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                      Cargando notificaciones...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="space-y-2 py-6 text-center text-xs text-slate-500">
                      <p>
                        {notificationsError
                          ? notificationsError
                          : "No tienes notificaciones por ahora."}
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {notifications.map((notification) => {
                        const Icon =
                          notificationIcons[notification.type] ??
                          notificationIcons.general;
                        return (
                          <li key={notification.id}>
                            <div className="flex items-start gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                                className={`flex flex-1 items-start gap-3 rounded-lg border border-transparent px-3 py-3 text-left transition ${
                                  notification.read
                                    ? "bg-red-50/60 hover:bg-red-100/70"
                                    : "bg-rose-50 hover:bg-rose-100"
                                }`}
                              >
                                <span
                                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                    notification.read
                                      ? "bg-white text-rose-400 ring-1 ring-rose-200"
                                      : "bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white"
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                </span>
                                <div className="flex flex-1 flex-col gap-1 text-xs text-slate-600">
                                  <p className="text-sm font-semibold text-slate-800">
                                    {notification.title}
                                  </p>
                                  {notification.message ? (
                                    <p className="line-clamp-2">
                                      {notification.message}
                                    </p>
                                  ) : null}
                                  {notification.formattedDate ? (
                                    <span className="text-[11px] uppercase tracking-wide text-slate-500">
                                      {notification.formattedDate}
                                    </span>
                                  ) : null}
                                </div>
                                {!notification.read ? (
                                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-rose-500" />
                                ) : null}
                              </button>
                              <button
                                type="button"
                                onClick={(event) =>
                                  handleNotificationDelete(event, notification)
                                }
                                disabled={pendingDeleteId === notification.id}
                                className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-transparent bg-white/80 text-slate-400 transition hover:border-rose-200 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {pendingDeleteId === notification.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  Eliminar notificación
                                </span>
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </div>

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
