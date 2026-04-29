"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, User, CheckCircle2 } from "lucide-react";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effect = FOG({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0x29c5e8,
        midtoneColor: 0x161b22,
        lowlightColor: 0x0d1117,
        baseColor: 0x0d1117,
        blurFactor: 0.6,
        speed: 1.5,
        zoom: 1.0,
      });
      setVantaEffect(effect);
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Error al crear la cuenta. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Vanta Background */}
        <div ref={vantaRef} className="absolute inset-0 -z-10" />

        <Card className="w-full max-w-md p-8 bg-surface/80 backdrop-blur-md border-border/50 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              ¡Cuenta creada!
            </h1>
            <p className="text-muted text-sm">
              Te hemos enviado un correo de verificación a{" "}
              <strong className="text-foreground">{formData.email}</strong>.
              Por favor revisa tu bandeja de entrada y haz clic en el enlace
              para activar tu cuenta.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full mt-4">
              Ir a iniciar sesión
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Vanta Background */}
      <div ref={vantaRef} className="absolute inset-0 -z-10" />

      <Card className="w-full max-w-md p-8 bg-surface/80 backdrop-blur-md border-border/50 shadow-2xl my-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Crear cuenta
            </h1>
            <p className="text-sm text-muted">
              Ingresa tus datos para crear una nueva cuenta
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
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="pl-10"
                />
              </div>
            </div>

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
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted">
                Debe contener mayúsculas, minúsculas y números
              </p>
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          {/* Divisor OAuth */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-wider text-muted font-medium">
              O registrarse con
            </span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons mode="register" isLoading={isLoading} />

          {/* Footer */}
          <div className="text-center text-sm">
            <span className="text-muted">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Inicia sesión
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
