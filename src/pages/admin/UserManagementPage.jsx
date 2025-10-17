import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { useUser } from "@/contexts/UserContext";
import { AlertCircle, CheckCircle2, Loader2, Shield } from "lucide-react";

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

const normalizeRole = (role) => {
  if (!role) {
    return null;
  }
  const id = toStringId(role._id ?? role.id);
  const label =
    (typeof role.rol === "string" && role.rol.trim() !== ""
      ? role.rol
      : typeof role.nombre === "string" && role.nombre.trim() !== ""
        ? role.nombre
        : typeof role.displayName === "string" && role.displayName.trim() !== ""
          ? role.displayName
          : "").trim();

  if (!id || !label) {
    return null;
  }

  return {
    id,
    label,
    permissions: Array.isArray(role.permisos) ? role.permisos : [],
  };
};

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  const username =
    typeof user?.perfil?.username === "string" && user.perfil.username.trim() !== ""
      ? user.perfil.username.trim()
      : typeof user?.username === "string" && user.username.trim() !== ""
        ? user.username.trim()
        : "";

  const email =
    typeof user?.correo === "string" && user.correo.trim() !== ""
      ? user.correo.trim().toLowerCase()
      : typeof user?.email === "string" && user.email.trim() !== ""
        ? user.email.trim().toLowerCase()
        : "";

  const nameParts = [user?.nombre, user?.apellido]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  const displayName =
    nameParts.join(" ") || username || email || "Usuario sin nombre";

  const roleId = toStringId(user?.rol_id ?? user?.rolId ?? user?.rol?.id ?? user?.rol?._id);

  const roleName =
    typeof user?.rol === "string" && user.rol.trim() !== ""
      ? user.rol.trim()
      : typeof user?.rolRelacion?.rol === "string" && user.rolRelacion.rol.trim() !== ""
        ? user.rolRelacion.rol.trim()
        : typeof user?.rol?.rol === "string" && user.rol.rol.trim() !== ""
          ? user.rol.rol.trim()
          : "";

  const id =
    username ||
    email ||
    toStringId(user?._id ?? user?.id) ||
    Math.random().toString(36).slice(2, 10);

  return {
    id,
    username,
    email,
    displayName,
    roleId,
    roleName,
    raw: user,
  };
};

const getAllowedRoles = (roles) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return [];
  }
  return roles.filter((role) => {
    const label = role.label.toLowerCase();
    return label.includes("admin") || label.includes("usuario");
  });
};

export default function UserManagementPage() {
  const { user: currentUser, refreshUser } = useUser();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roleMap = useMemo(() => {
    return roles.reduce((acc, role) => {
      acc[role.id] = role;
      return acc;
    }, {});
  }, [roles]);

  const allowedRoles = useMemo(() => getAllowedRoles(roles), [roles]);

  const currentUsername = useMemo(() => {
    if (!currentUser) {
      return "";
    }
    if (typeof currentUser?.perfil?.username === "string" && currentUser.perfil.username.trim() !== "") {
      return currentUser.perfil.username.trim();
    }
    if (typeof currentUser?.username === "string" && currentUser.username.trim() !== "") {
      return currentUser.username.trim();
    }
    if (typeof currentUser?.correo === "string" && currentUser.correo.trim() !== "") {
      return currentUser.correo.trim().toLowerCase();
    }
    return "";
  }, [currentUser]);



  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const [usersResult, rolesResult] = await Promise.allSettled([
        api.get("/usuarios"),
        api.get("/roles"),
      ]);

      if (rolesResult.status === "fulfilled") {
        const fetchedRoles = Array.isArray(rolesResult.value?.data?.data)
          ? rolesResult.value.data.data
          : [];
        const normalizedRoles = fetchedRoles
          .map((item) => normalizeRole(item))
          .filter(Boolean);
        setRoles(normalizedRoles);
      } else {
        throw rolesResult.reason;
      }

      if (usersResult.status === "fulfilled") {
        const fetchedUsers = Array.isArray(usersResult.value?.data?.data)
          ? usersResult.value.data.data
          : [];
        const normalizedUsers = fetchedUsers
          .map((item) => normalizeUser(item))
          .filter(Boolean);
        setUsers(normalizedUsers);
        const selections = {};
        normalizedUsers.forEach((item) => {
          if (item.username) {
            selections[item.username] = item.roleId;
          }
        });
        setSelectedRoles(selections);
      } else if (usersResult.status === "rejected" && usersResult.reason?.response?.status === 404) {
        setUsers([]);
        setSelectedRoles({});
      } else if (usersResult.status === "rejected") {
        throw usersResult.reason;
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "No pudimos cargar la informacion de usuarios.";
      setError(message);
      setUsers([]);
      setSelectedRoles({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData().catch(() => {
      setError("No pudimos cargar la informacion de usuarios.");
    });
  }, [loadData]);

  const handleRoleChange = useCallback((username, roleId) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [username]: roleId,
    }));
    setSuccess("");
  }, []);

  const handleRoleUpdate = useCallback(
    async (username) => {
      const selectedRoleId = selectedRoles[username];
      const userEntry = users.find((item) => item.username === username);

      if (!userEntry || !selectedRoleId || selectedRoleId === userEntry.roleId) {
        return;
      }

      setSaving((prev) => ({
        ...prev,
        [username]: true,
      }));
      setError("");
      setSuccess("");

      try {
        const payload = { rol_id: selectedRoleId };
        const response = await api.put(`/usuarios/${encodeURIComponent(username)}`, payload);
        const updatedRaw = response?.data?.data ?? response?.data;
        const updatedUser = normalizeUser(updatedRaw) ?? {
          ...userEntry,
          roleId: selectedRoleId,
        };

        setUsers((prev) =>
          prev.map((item) => (item.username === username ? { ...item, ...updatedUser } : item))
        );

        setSelectedRoles((prev) => ({
          ...prev,
          [username]: updatedUser.roleId || selectedRoleId,
        }));

        const newRoleLabel = roleMap[updatedUser.roleId || selectedRoleId]?.label;
        setSuccess(
          newRoleLabel
            ? `Rol actualizado a ${newRoleLabel} para ${updatedUser.displayName}.`
            : `Rol actualizado para ${updatedUser.displayName}.`
        );

        if (currentUsername && username === currentUsername) {
          refreshUser()?.catch(() => {});
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No pudimos actualizar el rol del usuario.";
        setError(message);
      } finally {
        setSaving((prev) => {
          const next = { ...prev };
          delete next[username];
          return next;
        });
      }
    },
    [currentUsername, refreshUser, roleMap, selectedRoles, users]
  );

  const isLoadingRoles = allowedRoles.length === 0;



  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-red-50 via-rose-50 to-white">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
        <Card className="bg-white/90 shadow">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                <Shield className="h-5 w-5 text-rose-500" />
                Gestion de usuarios
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Administra los roles de acceso. Por ahora solo puedes alternar entre Administrador y Usuario.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer gap-2 text-slate-700 sm:w-auto"
              onClick={loadData}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Actualizar listado"
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <Alert variant="destructive" className="border border-red-200 bg-red-50 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {success ? (
              <Alert className="border border-emerald-200 bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <AlertTitle>Rol actualizado</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            ) : null}

            {loading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-slate-600">Todavia no hay usuarios para gestionar.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-rose-100 text-left text-sm text-slate-700">
                  <thead className="bg-rose-50/80 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Usuario</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Correo</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Rol actual</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Asignar rol</th>
                      <th scope="col" className="px-4 py-3 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100">
                    {users.map((item) => {
                      const currentRoleId = item.roleId;
                      const selectedRoleId = selectedRoles[item.username] ?? currentRoleId;
                      const currentRoleLabel =
                        roleMap[currentRoleId]?.label || item.roleName || "Sin rol";
                      const pendingRoleLabel =
                        selectedRoleId && selectedRoleId !== currentRoleId
                          ? roleMap[selectedRoleId]?.label
                          : null;
                      const isSaving = Boolean(saving[item.username]);
                      const canSave =
                        Boolean(selectedRoleId) &&
                        selectedRoleId !== currentRoleId &&
                        !isSaving &&
                        !isLoadingRoles;

                      return (
                        <tr
                          key={item.id}
                          className="bg-white/40 transition hover:bg-rose-50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{item.displayName}</span>
                              {item.username ? (
                                <span className="text-xs text-slate-500">@{item.username}</span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {item.email || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="secondary"
                              className="bg-rose-100 text-rose-700"
                            >
                              {currentRoleLabel}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-48">
                              <Select
                                value={selectedRoleId || ""}
                                onValueChange={(value) => handleRoleChange(item.username, value)}
                                disabled={isLoadingRoles || isSaving || !item.username}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                  {allowedRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                      {role.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {pendingRoleLabel ? (
                                <p className="mt-1 text-xs text-rose-500">
                                  Cambiar a {pendingRoleLabel}
                                </p>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              type="button"
                              size="sm"
                              className="cursor-pointer gap-2"
                              onClick={() => handleRoleUpdate(item.username)}
                              disabled={!canSave}
                            >
                              {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Guardar"
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}



