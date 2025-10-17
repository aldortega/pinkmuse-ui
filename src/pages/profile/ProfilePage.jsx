import { useEffect, useMemo } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const FALLBACK_NAME = "Usuario PinkMuse";
const FALLBACK_EMAIL = "Sin correo registrado";
const FALLBACK_ROLE = "Miembro";

export default function ProfilePage() {
  const { user, loading, error, refreshUser } = useUser();

  useEffect(() => {
    refreshUser().catch(() => {
      // el estado de error ya se maneja dentro del contexto
    });
  }, [refreshUser]);

  const displayName = user?.displayName || FALLBACK_NAME;
  const avatarUrl = user?.avatar || user?.perfil?.imagenPrincipal || "";
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
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border border-red-200">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-lg font-semibold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-xl text-slate-900 sm:text-2xl">
                      {displayName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-slate-600">
                      <Shield className="h-4 w-4" />
                      {role}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-red-100 bg-red-50/60 px-4 py-3 text-sm text-slate-700"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-800">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Preferencias</CardTitle>
                <CardDescription className="text-slate-600">
                  Pronto podras personalizar tu experiencia dentro de PinkMuse desde esta seccion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Estamos preparando nuevas herramientas para que gestiones tu perfil, intereses y configuraciones de manera sencilla.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}