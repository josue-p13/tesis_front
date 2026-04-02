"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { requestPasswordResetCode, resetPasswordWithCode } from "@/services/auth.service";

type Step = "request" | "code" | "password" | "success";

function formatSeconds(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getPasswordIssues(password: string) {
  const issues: string[] = [];
  if (password.length < 8) issues.push("Mínimo 8 caracteres");
  if (!/[a-z]/.test(password)) issues.push("Una minúscula");
  if (!/[A-Z]/.test(password)) issues.push("Una mayúscula");
  if (!/\d/.test(password)) issues.push("Un número");
  if (!/[^A-Za-z0-9]/.test(password)) issues.push("Un símbolo");
  return issues;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasTypedPassword, setHasTypedPassword] = useState(false);
  const [hasTypedConfirm, setHasTypedConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const secondsLeft = useMemo(() => {
    if (!expiresAt) return null;
    const diff = Math.max(0, Math.floor((expiresAt - nowMs) / 1000));
    return diff;
  }, [expiresAt, nowMs]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const now = Date.now();
      setNowMs(now);
      if (expiresAt <= now) {
        setExpiresAt(null);
      }
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const canSubmitRequest = Boolean(email) && !isLoading;
  const canSubmitCode = Boolean(email && code.length === 6) && !isLoading;
  const passwordIssues = useMemo(() => {
    if (!hasTypedPassword) return [];
    return getPasswordIssues(password);
  }, [hasTypedPassword, password]);

  const showPasswordIssues = hasTypedPassword && passwordIssues.length > 0;
  const passwordsMismatch =
    hasTypedConfirm && Boolean(confirmPassword) && password !== confirmPassword;

  const canSubmitPassword =
    Boolean(email && code.length === 6 && password && confirmPassword) &&
    passwordIssues.length === 0 &&
    !passwordsMismatch &&
    !isLoading;

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await requestPasswordResetCode(email);
      setMessage(res.message);
      setStep("code");
      setExpiresAt(Date.now() + 5 * 60 * 1000);
    } catch {
      setError("Error al solicitar el código. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleContinueFromCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setStep("password");
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    setIsLoading(true);
    try {
      const res = await resetPasswordWithCode(email, code, password);
      if (!res.success) {
        setError(res.message);
        return;
      }
      setMessage(res.message);
      setStep("success");
    } catch {
      setError("Error al restablecer la contraseña. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-foreground">Recuperar contraseña</h1>
            <p className="text-sm text-muted">
              Te enviaremos un código de 6 dígitos para restablecer tu contraseña.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert variant="success">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {step === "request" && (
            <form onSubmit={handleRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    disabled={isLoading}
                    required
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!canSubmitRequest}>
                {isLoading ? "Enviando código..." : "Enviar código"}
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Volver a iniciar sesión
                </Link>
              </div>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleContinueFromCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-readonly">Correo</Label>
                <Input id="email-readonly" value={email} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código (6 dígitos)</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="code"
                    inputMode="numeric"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/[^\d]/g, "").slice(0, 6));
                      setError(null);
                    }}
                    disabled={isLoading}
                    required
                    className="pl-10 tracking-[0.3em]"
                  />
                </div>
                {secondsLeft !== null && (
                  <p className="text-xs text-muted">Expira en {formatSeconds(secondsLeft)}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!canSubmitCode}>
                Continuar
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("request");
                  setCode("");
                  setPassword("");
                  setConfirmPassword("");
                  setHasTypedPassword(false);
                  setHasTypedConfirm(false);
                  setMessage(null);
                  setError(null);
                }}
                disabled={isLoading}
              >
                Reenviar código
              </Button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-readonly-2">Correo</Label>
                <Input id="email-readonly-2" value={email} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-readonly">Código</Label>
                <Input
                  id="code-readonly"
                  value={code}
                  readOnly
                  className="tracking-[0.3em]"
                />
                {secondsLeft !== null && (
                  <p className="text-xs text-muted">Expira en {formatSeconds(secondsLeft)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setHasTypedPassword(true);
                      setError(null);
                    }}
                    disabled={isLoading}
                    required
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>

                {showPasswordIssues && (
                  <p className="text-xs text-muted">
                    Requisitos: {passwordIssues.join(" · ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setHasTypedConfirm(true);
                    setError(null);
                  }}
                  disabled={isLoading}
                  required
                  autoComplete="new-password"
                />
                {passwordsMismatch && (
                  <p className="text-xs text-danger">Las contraseñas no coinciden.</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!canSubmitPassword}>
                {isLoading ? "Actualizando..." : "Cambiar contraseña"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("code");
                  setPassword("");
                  setConfirmPassword("");
                  setHasTypedPassword(false);
                  setHasTypedConfirm(false);
                  setMessage(null);
                  setError(null);
                }}
                disabled={isLoading}
              >
                Volver
              </Button>
            </form>
          )}

          {step === "success" && (
            <div className="space-y-4">
              <p className="text-sm text-muted text-center">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Ir a iniciar sesión</Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
