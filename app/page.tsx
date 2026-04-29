"use client";

import Link from "next/link";
import { FileText, SearchCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { App } from "@/components/app";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card className="p-6">
          <div className="space-y-3">
            <div className="h-7 w-2/3 bg-surface-2 rounded" />
            <div className="h-4 w-5/6 bg-surface-2 rounded" />
            <div className="h-10 w-52 bg-surface-2 rounded mt-4" />
          </div>
        </Card>
      </div>
    );
  }

  if (user) return <App />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
      <Card className="relative overflow-hidden p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative space-y-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted">RefCheck</p>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
              Extrae y valida referencias bibliográficas desde tu PDF
            </h1>
            <p className="text-sm sm:text-base text-muted max-w-2xl">
              Sube un PDF, revisa las referencias detectadas y valida contra fuentes académicas para mejorar la calidad de tu bibliografía.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="sm:w-auto">
              <Link href="/login">
                Iniciar sesión
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="sm:w-auto">
              <Link href="/register">Crear cuenta</Link>
            </Button>
          </div>

          <p className="text-xs text-muted">
            OpenAlex · CrossRef · Semantic Scholar · PubMed · CORE · Google Books (y Google Scholar opcional)
          </p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm">Extracción</p>
              <p className="text-xs text-muted leading-relaxed">
                Detecta y estructura tus referencias (título, autores, año, DOI, URL).
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <SearchCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm">Validación</p>
              <p className="text-xs text-muted leading-relaxed">
                Contrasta contra bases académicas para sugerir DOI y metadatos confiables.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm">Control</p>
              <p className="text-xs text-muted leading-relaxed">
                Edita o elimina referencias antes de validar. Tú decides qué se procesa.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">¿Listo para empezar?</p>
            <p className="text-xs text-muted mt-1">
              Crea una cuenta o inicia sesión para subir tu PDF y ver resultados.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Registrarme</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
