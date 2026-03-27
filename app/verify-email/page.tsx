"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmail } from "@/services/auth.service";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        const result = await verifyEmail(token);

        if (result.success) {
          setStatus("success");
          setMessage(result.message);

          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result.message);
        }
      } catch {
        setStatus("error");
        setMessage("Error al verificar el correo electrónico");
      }
    };

    verify();
  }, [token, router]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-danger/20 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-danger" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              Error de verificación
            </h1>
            <Alert variant="destructive" className="text-left">
              <AlertDescription>Token de verificación no encontrado</AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2 w-full">
              <Button
                onClick={() => router.push("/register")}
                variant="outline"
                className="w-full"
              >
                Volver a registrarse
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="ghost"
                className="w-full"
              >
                Ir a iniciar sesión
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Loading State */}
          {status === "loading" && (
            <>
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                Verificando...
              </h1>
              <p className="text-muted text-sm">
                Por favor espera mientras verificamos tu correo electrónico.
              </p>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                ¡Correo verificado!
              </h1>
              <Alert variant="success" className="text-left">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <p className="text-muted text-sm">
                Serás redirigido a la página de inicio de sesión en unos segundos...
              </p>
              <Button onClick={() => router.push("/login")} className="w-full">
                Ir a iniciar sesión ahora
              </Button>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <div className="h-16 w-16 rounded-full bg-danger/20 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-danger" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                Error de verificación
              </h1>
              <Alert variant="destructive" className="text-left">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  onClick={() => router.push("/register")}
                  variant="outline"
                  className="w-full"
                >
                  Volver a registrarse
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="ghost"
                  className="w-full"
                >
                  Ir a iniciar sesión
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
