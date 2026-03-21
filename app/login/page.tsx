"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Chrome, CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const status = searchParams.get("status");
    const email = searchParams.get("email");

    if (status === "verify-email" && email) {
      setVerifyEmail(email);
    } else if (status === "pending-verification") {
      setError("Por favor verifica tu correo antes de iniciar sesión.");
    } else if (status === "error") {
      setError("Hubo un error con el inicio de sesión de Google.");
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    // Redirigir al endpoint de login del backend
    window.location.href = "http://localhost:8000/auth/login/google";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        // Login exitoso - esperar un momento para que la cookie se establezca
        // antes de navegar, esto evita race conditions con el middleware
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Usar window.location.href para forzar una navegación completa del servidor
        // Esto asegura que el middleware se ejecute con la cookie ya establecida
        window.location.href = "/";
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor intenta nuevamente.");
      setIsLoading(false);
    }
  };

  if (verifyEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              ¡Cuenta creada!
            </h1>
            <p className="text-sm text-muted">
              Te hemos enviado un correo de verificación a <br />
              <strong className="text-foreground">{verifyEmail}</strong>. Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => {
              setVerifyEmail(null);
              router.push("/login");
            }}
          >
            Ir a iniciar sesión
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Iniciar sesión
            </h1>
            <p className="text-sm text-muted">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          {/* Divisor OAuth */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted">O continuar con</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome className="h-4 w-4 text-red-500" />
             Iniciar sesión con Google
          </Button>

          {/* Footer */}
          <div className="space-y-4">
            <div className="text-center text-sm">
              <span className="text-muted">¿No tienes una cuenta? </span>
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
