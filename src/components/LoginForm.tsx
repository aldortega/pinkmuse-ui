import { useState, type FormEvent } from "react";
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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 bg-pink-100 overflow-hidden">
      <Card className="w-full max-w-lg bg-violet-50 border-violet-100 shadow-xl">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-bold text-center text-gray-700 flex justify-center items-center gap-2">
            <span>Bienvenido a</span>
            <span className="bg-gradient-to-br from-rose-500 via-red-400 to-red-600 text-transparent bg-clip-text">
              PinkMuse
            </span>
          </CardTitle>
          <CardDescription className="text-center text-gray-700 text-base">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-red-400 transition-colors"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* remember + pass */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 bg-gray-100 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-gray-600 cursor-pointer">Recordarme</span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent hover:opacity-80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón */}
            <Button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-br from-rose-500 via-red-400 to-red-500 hover:opacity-90 text-white font-medium py-2 px-4 rounded-md transition-colors focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white"
            >
              Iniciar Sesión
            </Button>

            {/* Registro */}
            <div className="text-center text-sm text-gray-600">
              ¿No tenés una cuenta?{" "}
              <a
                href="#"
                className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent hover:opacity-80 transition-colors font-semibold"
              >
                Regístrate
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
