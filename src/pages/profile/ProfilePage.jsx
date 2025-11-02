import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import api from "@/lib/axios";
import { normalizeNotificationPreferences } from "@/lib/notifications";
import { buildImageUrl, uploadImage } from "@/lib/imageService";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileNotifications from "@/components/profile/ProfileNotifications";

const FALLBACK_NAME = "Usuario PinkMuse";
const FALLBACK_EMAIL = "Sin correo registrado";
const FALLBACK_ROLE = "Miembro";

const NOTIFICATION_OPTIONS = [
  {
    value: "evento",
    label: "Eventos",
    description:
      "Recibe alertas cuando publiquemos nuevos shows, fechas y experiencias.",
  },
  {
    value: "producto",
    label: "Merchandising",
    description:
      "Enterate al instante cuando haya nuevos productos o reposiciones exclusivas.",
  },
  {
    value: "noticia",
    label: "Noticias",
    description:
      "Mantente al dia con entrevistas, anuncios y novedades de PinkMuse.",
  },
];

export default function ProfilePage() {
  const { user, loading, error, refreshUser, setUser } = useUser();
  const [preferences, setPreferences] = useState(() =>
    normalizeNotificationPreferences(
      user?.notificationPreferences ?? user?.preferenciaNotificacion,
      { fallbackToDefault: true }
    )
  );
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [preferencesError, setPreferencesError] = useState("");
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarMessage, setAvatarMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    refreshUser().catch(() => {
      // el estado de error ya se maneja dentro del contexto
    });
  }, [refreshUser]);

  useEffect(() => {
    setPreferences(
      normalizeNotificationPreferences(
        user?.notificationPreferences ?? user?.preferenciaNotificacion,
        { fallbackToDefault: true }
      )
    );
    setPreferencesError("");
    setPreferencesMessage("");
  }, [user?.notificationPreferences, user?.preferenciaNotificacion]);

  useEffect(() => {
    setAvatarError("");
    setAvatarMessage("");
  }, [user?.avatar, user?.avatarPaths]);

  const avatarPaths = user?.avatarPaths ?? user?.perfil?.imagenPrincipal ?? null;
  const avatarSource =
    user?.avatar ??
    avatarPaths ??
    user?.perfil?.avatar ??
    user?.foto ??
    "";
  const avatarUrl = useMemo(
    () => buildImageUrl(avatarSource),
    [avatarSource]
  );
  const username =
    user?.username || user?.perfil?.username || user?.correo || "";
  const displayName = user?.displayName || FALLBACK_NAME;
  const initials = user?.initials || displayName.slice(0, 2).toUpperCase();
  const firstName = user?.nombre || FALLBACK_NAME;
  const lastName = user?.apellido || "No registrado";
  const nationality = user?.nacionalidad || "Nacionalidad no registrada";
  const birthDate = user?.fechaNacimiento || "No registrada";
  const email = user?.correo || FALLBACK_EMAIL;
  const role = user?.rol || FALLBACK_ROLE;
  const phone = user?.telefono || "Telefono no registrado";

  const infoItems = useMemo(
    () => [
      { label: "Nombre", value: firstName },
      { label: "Apellido", value: lastName },
      { label: "Nacionalidad", value: nationality },
      { label: "Fecha de nacimiento", value: birthDate },
      { label: "Correo", value: email },
      { label: "Rol", value: role },
      { label: "Telefono", value: phone },
    ],
    [firstName, lastName, nationality, birthDate, email, role, phone]
  );
  const hasAvatar = Boolean(avatarUrl);

  const triggerAvatarFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file || !username) {
        if (event.target) {
          event.target.value = "";
        }
        return;
      }

      setAvatarError("");
      setAvatarMessage("");
      setAvatarUploading(true);

      try {
        const uploaded = await uploadImage({
          file,
          tipo: "usuario",
          nombre: username,
        });
        const payload = Array.isArray(uploaded) ? uploaded[0] : uploaded;
        if (!payload) {
          throw new Error("No recibimos la ruta de la imagen.");
        }

        const response = await api.put(
          `/usuarios/${encodeURIComponent(username)}`,
          {
            perfil: {
              imagenPrincipal: payload,
            },
          }
        );
        const updatedUser = response?.data?.data ?? null;
        if (updatedUser) {
          setUser(updatedUser);
        }
        setAvatarMessage("Foto de perfil actualizada.");
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No pudimos actualizar tu foto de perfil.";
        setAvatarError(message);
      } finally {
        setAvatarUploading(false);
        if (event.target) {
          event.target.value = "";
        }
      }
    },
    [username, setUser]
  );

  const handleRemoveAvatar = useCallback(async () => {
    if (!username) {
      return;
    }

    setAvatarError("");
    if (!avatarPaths && !user?.avatar) {
      setAvatarMessage("No tenes una foto de perfil cargada.");
      return;
    }

    setAvatarMessage("");
    setAvatarUploading(true);

    try {
      const response = await api.put(
        `/usuarios/${encodeURIComponent(username)}`,
        {
          perfil: {
            imagenPrincipal: null,
          },
        }
      );
      const updatedUser = response?.data?.data ?? null;
      const sourceUser = updatedUser ?? user ?? null;

      if (sourceUser) {
        const sanitizedPerfil = {
          ...(sourceUser.perfil ?? {}),
          imagenPrincipal: null,
          avatar: null,
        };
        const sanitizedUser = {
          ...sourceUser,
          avatar: null,
          avatarPaths: null,
          foto: null,
          image: null,
          photo: null,
          perfil: sanitizedPerfil,
        };

        setUser(sanitizedUser);
      }

      setAvatarMessage("Foto de perfil eliminada.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "No pudimos eliminar tu foto de perfil.";
      setAvatarError(message);
    } finally {
      setAvatarUploading(false);
    }
  }, [username, avatarPaths, user, setUser]);

  const handleTogglePreference = useCallback(
    async (value) => {
      const currentNormalized = normalizeNotificationPreferences(preferences, {
        fallbackToDefault: false,
      });

      const hasValue = currentNormalized.includes(value);
      const next = hasValue
        ? currentNormalized.filter((item) => item !== value)
        : [...currentNormalized, value];

      setPreferences(next);
      setPreferencesError("");
      setPreferencesMessage("");
      setPreferencesSaving(true);

      try {
        const response = await api.put(
          "/usuario/preferencias/notificaciones",
          { preferencias: next }
        );
        const updatedUser = response?.data?.data ?? null;
        if (updatedUser) {
          setUser(updatedUser);
          const updatedPreferences = normalizeNotificationPreferences(
            updatedUser.preferenciaNotificacion,
            { fallbackToDefault: false }
          );
          setPreferences(updatedPreferences);
        }
        setPreferencesMessage("Preferencias actualizadas.");
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No pudimos actualizar tus preferencias.";
        setPreferencesError(message);
        setPreferences(currentNormalized);
      } finally {
        setPreferencesSaving(false);
      }
    },
    [preferences, setUser]
  );

  const notificationSummary = preferences.length > 0
    ? "Recibirás avisos según tus selecciones."
    : "No recibirás notificaciones hasta que actives al menos una opción.";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-red-50 via-rose-50 to-white">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-600">Cargando tu perfil...</p>
          </div>
        ) : (
          <>
            <Card className="bg-white/90">
              <CardHeader>
                <ProfileHeader 
                  hasAvatar={hasAvatar}
                  avatarUrl={avatarUrl}
                  displayName={displayName}
                  initials={initials}
                  role={role}
                  triggerAvatarFile={triggerAvatarFile}
                  avatarUploading={avatarUploading}
                  handleRemoveAvatar={handleRemoveAvatar}
                  avatarError={avatarError}
                  avatarMessage={avatarMessage}
                  handleAvatarFileChange={handleAvatarFileChange}
                  fileInputRef={fileInputRef}
                />
              </CardHeader>
              <CardContent>
                <ProfileInfo infoItems={infoItems} />
              </CardContent>
            </Card>

            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">
                  Notificaciones
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Elegi que tipo de novedades queres recibir de PinkMuse.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileNotifications 
                  preferencesError={preferencesError}
                  preferencesMessage={preferencesMessage}
                  preferencesSaving={preferencesSaving}
                  notificationOptions={NOTIFICATION_OPTIONS}
                  preferences={preferences}
                  handleTogglePreference={handleTogglePreference}
                  notificationSummary={notificationSummary}
                />
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
