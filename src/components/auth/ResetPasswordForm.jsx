import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
import { Lock } from "lucide-react";
import api from "@/lib/axios";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/reset-password", {
        correo: email,
        token,
        password,
      });

      if (data?.status === "success") {
        setSuccess("Contraseña restablecida correctamente.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data?.message || "Error al restablecer la contraseña.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error de red al restablecer contraseña.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-3 bg-pink-100">
      <Card className="w-full max-w-md sm:max-w-lg bg-violet-50 border-violet-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-700">
            Restablecer contraseña
          </CardTitle>
          <CardDescription className="text-center text-gray-700 text-base">
            Ingresá tu nueva contraseña
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-100 border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
              {loading ? "Restableciendo..." : "Restablecer contraseña"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <Link
                to="/login"
                className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent font-semibold"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
