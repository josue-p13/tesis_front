"use client";

import { useEffect, useReducer, Suspense } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmail } from "@/services/auth.service";

function Skeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-4">
          <div className="h-16 w-16 rounded-full bg-surface-2 mx-auto" />
          <div className="h-6 w-2/3 bg-surface-2 rounded mx-auto" />
          <div className="h-4 w-4/5 bg-surface-2 rounded mx-auto" />
          <div className="h-10 w-full bg-surface-2 rounded" />
        </div>
      </Card>
    </div>
  );
}

type VerifyState = {
  status: "loading" | "success" | "error";
  message: string;
  redirectToLogin: boolean;
};

type VerifyAction =
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | { type: "redirectToLogin" };

const initialVerifyState: VerifyState = {
  status: "loading",
  message: "",
  redirectToLogin: false,
};

function verifyReducer(state: VerifyState, action: VerifyAction): VerifyState {
  switch (action.type) {
    case "loading":
      return { status: "loading", message: "", redirectToLogin: false };
    case "success":
      return { ...state, status: "success", message: action.message };
    case "error":
      return { ...state, status: "error", message: action.message };
    case "redirectToLogin":
      return { ...state, redirectToLogin: true };
    default:
      return state;
  }
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, dispatch] = useReducer(verifyReducer, initialVerifyState);

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        dispatch({ type: "loading" });
        const result = await verifyEmail(token);

        if (result.success) {
          dispatch({ type: "success", message: result.message });
          setTimeout(() => {
            dispatch({ type: "redirectToLogin" });
          }, 3000);
        } else {
          dispatch({ type: "error", message: result.message });
        }
      } catch {
        dispatch({ type: "error", message: "Error al verificar el correo electrónico" });
      }
    };

    verify();
  }, [token]);

  if (state.redirectToLogin) {
    redirect("/login");
  }

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
          {state.status === "loading" && (
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
          {state.status === "success" && (
            <>
              <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                ¡Correo verificado!
              </h1>
              <Alert variant="success" className="text-left">
                <AlertDescription>{state.message}</AlertDescription>
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
          {state.status === "error" && (
            <>
              <div className="h-16 w-16 rounded-full bg-danger/20 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-danger" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                Error de verificación
              </h1>
              <Alert variant="destructive" className="text-left">
                <AlertDescription>{state.message}</AlertDescription>
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
    <Suspense fallback={<Skeleton />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
