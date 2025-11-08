import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import api from "@/lib/axios";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.post("/forgotten", { correo: email });

      if (data?.status === "success") {
        setSuccess("Te enviamos un enlace para recuperar tu contraseña.");
      } else {
        setError(data?.message || "No pudimos procesar tu solicitud.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error de red al solicitar recuperación.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-3 bg-pink-100">
      <Card className="w-full max-w-md sm:max-w-lg bg-violet-50 border-violet-100 shadow-xl">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center text-gray-700">
            Recuperar contraseña
          </CardTitle>
          <CardDescription className="text-center text-gray-700 text-base">
            Ingresá tu correo electrónico para recibir un enlace de recuperación
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-100 border-gray-300"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white hover:opacity-90"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              ¿Recordaste tu contraseña?{" "}
              <Link
                to="/login"
                className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent font-semibold"
              >
                Inicia sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
