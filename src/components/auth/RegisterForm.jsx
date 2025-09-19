import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Eye, EyeOff, Mail, Lock, User, Calendar, Globe } from "lucide-react";
import api from "@/lib/axios";
import CountryCombobox from "@/components/ui/CountryCombobox";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    password: "",
    nacionalidad: "",
    fechaNacimiento: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        nacionalidad: formData.nacionalidad,
        fechaNacimiento: formData.fechaNacimiento,
        correo: formData.email,
        password: formData.password,
        password_confirmation: formData.password,
        perfil: {
          username: formData.username,
          imagenPrincipal: null,
        },
      };

      const { data } = await api.post("/registro", payload);

      if (data?.status && data?.status >= 200 && data?.status < 300) {
        setSuccess("Registro exitoso. Ahora podes iniciar sesión.");
        setTimeout(() => navigate("/"), 800);
      } else {
        setError(data?.message || "Ocurrió un error en el registro.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error de red al registrar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-3 overflow-hidden box-border bg-pink-100">
      <Card className="w-full max-w-md sm:max-w-lg bg-violet-50 border-violet-100 shadow-xl">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-700 flex justify-center items-center gap-2">
            <span>Registrate en</span>
            <span className="bg-gradient-to-br from-rose-500 via-red-400 to-red-600 text-transparent bg-clip-text">
              PinkMuse
            </span>
          </CardTitle>
          <CardDescription className="text-center text-gray-700 text-base">
            Ingresa tus datos para crear una cuenta
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700" htmlFor="nombre">
                  Nombre
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Brenda"
                    value={formData.nombre}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className="pl-10 placeholder:text-gray-400 bg-gray-100 border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700" htmlFor="apellido">
                  Apellido
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="Cano"
                    value={formData.apellido}
                    onChange={(e) =>
                      handleInputChange("apellido", e.target.value)
                    }
                    className="pl-10 bg-gray-100 border-gray-300 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label className="text-gray-700" htmlFor="username">
                Nombre de usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="brenda123"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="pl-10 bg-gray-100 border-gray-300 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-gray-700" htmlFor="email">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-gray-100 border-gray-300 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700" htmlFor="password">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="pl-10 pr-10 bg-gray-100 border-gray-300 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-red-400 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Nacionalidad + Fecha */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700" htmlFor="nacionalidad">
                  Nacionalidad
                </Label>
                <div className="relative">
                  <CountryCombobox
                    value={formData.nacionalidad}
                    onChange={(val) => handleInputChange("nacionalidad", val)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700" htmlFor="fechaNacimiento">
                  Fecha de nacimiento
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) =>
                      handleInputChange("fechaNacimiento", e.target.value)
                    }
                    className="pl-10 bg-gray-100 border-gray-300 cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white cursor-pointer hover:opacity-90"
            >
              {loading ? "Creando..." : "Crear Cuenta"}
            </Button>

            {/* Password */}

            <div className="text-center text-sm text-gray-600">
              ¿Ya tenes una cuenta?{" "}
              <Link
                to="/login"
                className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent cursor-pointer font-semibold"
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
