"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, CheckCircle2 } from "lucide-react";
import { Suspense } from "react";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

function Skeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="h-6 w-2/3 bg-surface-2 rounded mx-auto" />
            <div className="h-4 w-4/5 bg-surface-2 rounded mx-auto" />
          </div>
          <div className="space-y-4">
            <div className="h-10 w-full bg-surface-2 rounded" />
            <div className="h-10 w-full bg-surface-2 rounded" />
            <div className="h-10 w-full bg-surface-2 rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const status = searchParams.get("status");
  const statusEmail = searchParams.get("email");

  const verifyEmail =
    status === "verify-email" && statusEmail ? statusEmail : null;

  const statusError =
    status === "pending-verification"
      ? "Por favor verifica tu correo antes de iniciar sesión."
      : status === "notfound"
        ? "No existe una cuenta con este correo. Por favor, regístrate primero."
        : status === "already-exists"
          ? "Ya existe una cuenta con este correo. Por favor, inicia sesión."
          : status === "error"
            ? "Hubo un error con el inicio de sesión."
            : null;

  const displayError = error || statusError;

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
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.href = "/";
      } else {
        setError(result.message || "Credenciales inválidas.");
        setIsLoading(false);
      }
    } catch {
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
              <strong className="text-foreground">{verifyEmail}</strong>. Por
              favor revisa tu bandeja de entrada y haz clic en el enlace para
              activar tu cuenta.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => {
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
          {displayError && (
            <Alert variant="destructive">
              <AlertDescription>
                {displayError}{" "}
                {/* Mostrar enlace a registro si no está registrado */}
                {status === "notfound" && (
                  <Link href="/register" className="underline font-medium">
                    Crear cuenta
                  </Link>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* OAuth Buttons */}
          <OAuthButtons mode="login" isLoading={isLoading} />

          {/* Footer */}
          <div className="text-center text-sm">
            <span className="text-muted">¿No tienes una cuenta? </span>
            <Link href="/register" className="text-primary hover:underline font-medium">
              Regístrate
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <LoginContent />
    </Suspense>
  );
}
