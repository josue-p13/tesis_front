"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  BookMarked,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UploadZone } from "@/components/upload/upload-zone";
import { SerperConfig } from "@/components/upload/serper-config";
import { RefExtraidaCard } from "@/components/referencias/ref-extraida-card";
import { RefValidadaCard } from "@/components/referencias/ref-validada-card";
import { StatsBar } from "@/components/referencias/stats-bar";

import { extraerReferencias, validarReferencias } from "@/services/api";
import type { ExtraerResponse, ValidarResponse } from "@/types/api";

/* ─── Tipos internos ──────────────────────────────────────────── */
type Paso = "upload" | "resultados";
type TabId = "extraidas" | "validadas";

/* ─── Componente principal ────────────────────────────────────── */
export function App() {
  const { user, loading } = useAuth();
  const router = useRouter();

  /* Flujo */
  const [paso, setPaso] = useState<Paso>("upload");
  const [tabActiva, setTabActiva] = useState<TabId>("extraidas");

  /* Archivo */
  const [pdf, setPdf] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  /* Serper */
  const [usarSerper, setUsarSerper] = useState(false);
  const [serperKey, setSerperKey] = useState("");

  /* Estado de carga */
  const [loadingExtraer, setLoadingExtraer] = useState(false);
  const [loadingValidar, setLoadingValidar] = useState(false);
  const [errorExtraer, setErrorExtraer] = useState<string | null>(null);
  const [errorValidar, setErrorValidar] = useState<string | null>(null);

  /* Datos */
  const [extraerData, setExtraerData] = useState<ExtraerResponse | null>(null);
  const [validarData, setValidarData] = useState<ValidarResponse | null>(null);

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleFile = useCallback((file: File) => setPdf(file), []);
  const handleClear = useCallback(() => setPdf(null), []);

  const handleReset = useCallback(() => {
    setPaso("upload");
    setPdf(null);
    setExtraerData(null);
    setValidarData(null);
    setErrorExtraer(null);
    setErrorValidar(null);
  }, []);

  const handleExtraer = useCallback(async () => {
    if (!pdf) return;
    setLoadingExtraer(true);
    setErrorExtraer(null);
    try {
      const data = await extraerReferencias(pdf, serperKey, usarSerper);
      setExtraerData(data);
      setValidarData(null);
      setPaso("resultados");
      setTabActiva("extraidas");
    } catch (e) {
      setErrorExtraer(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoadingExtraer(false);
    }
  }, [pdf, serperKey, usarSerper]);

  const handleValidar = useCallback(async () => {
    if (!extraerData) return;
    setLoadingValidar(true);
    setErrorValidar(null);
    try {
      const data = await validarReferencias(
        extraerData.referencias,
        extraerData.serper_api_key,
        extraerData.usar_serper
      );
      setValidarData(data);
      setTabActiva("validadas");
    } catch (e) {
      setErrorValidar(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoadingValidar(false);
    }
  }, [extraerData]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-8"><p className="text-center">Cargando sesión…</p></div>;
  if (!user) return null;

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">

      {/* ══════════════════════ PASO: UPLOAD ══════════════════════ */}
      {paso === "upload" && (
        <div className="space-y-4">
          {/* Encabezado de sección */}
          <div>
            <h1 className="text-xl font-semibold">Extraer referencias</h1>
            <p className="text-sm text-muted mt-0.5">
              Sube un PDF y el sistema extraerá y validará sus referencias bibliográficas.
            </p>
          </div>

          {/* Zona de drop */}
          <UploadZone
            file={pdf}
            dragging={dragging}
            onFile={handleFile}
            onClear={handleClear}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
          />

          {/* Serper */}
          <SerperConfig
            usarSerper={usarSerper}
            apiKey={serperKey}
            onToggle={setUsarSerper}
            onKeyChange={setSerperKey}
          />

          {/* Error */}
          {errorExtraer && (
            <div className="flex items-start gap-2.5 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errorExtraer}</span>
            </div>
          )}

          {/* Botón */}
          <Button
            size="lg"
            className="w-full"
            disabled={!pdf || loadingExtraer}
            onClick={handleExtraer}
          >
            {loadingExtraer ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Extrayendo referencias…&nbsp;
                <span className="text-primary-fg/60 text-xs">(puede tardar ~30 s)</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Extraer referencias
              </>
            )}
          </Button>
        </div>
      )}

      {/* ══════════════════════ PASO: RESULTADOS ══════════════════ */}
      {paso === "resultados" && extraerData && (
        <div className="space-y-4">

          {/* Cabecera del documento */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <BookMarked className="h-4 w-4 text-primary shrink-0" />
                <h1 className="text-base font-semibold truncate">{pdf?.name}</h1>
                <Badge variant="secondary">{extraerData.estilo_citacion.nombre}</Badge>
              </div>
              <p className="text-xs text-muted mt-0.5 pl-6">
                {extraerData.estilo_citacion.descripcion}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-3.5 w-3.5" />
              Nuevo PDF
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={tabActiva} onValueChange={(v) => setTabActiva(v as TabId)}>
            <TabsList>
              <TabsTrigger value="extraidas">
                <FileText className="h-3.5 w-3.5" />
                Extraídas
                <Badge variant="secondary">{extraerData.total_referencias}</Badge>
              </TabsTrigger>
              <TabsTrigger value="validadas">
                <CheckCircle className="h-3.5 w-3.5" />
                Validadas
                {validarData && (
                  <Badge variant="secondary">{validarData.total}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── Tab: Extraídas ────────────────────────────────── */}
            <TabsContent value="extraidas">
              <div className="mt-4 space-y-4">

                {/* Botón validar (si aún no se validó) */}
                {!validarData && (
                  <div className="rounded-lg border border-border bg-surface px-5 py-4 space-y-3">
                    {errorValidar && (
                      <div className="flex items-start gap-2 rounded border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        {errorValidar}
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">¿Validar contra bases de datos académicas?</p>
                        <p className="text-xs text-muted">
                          OpenAlex · CrossRef · Semantic Scholar · PubMed · CORE · Google Books
                          {extraerData.usar_serper && " · Google Scholar"}
                        </p>
                      </div>
                      <Button
                        onClick={handleValidar}
                        disabled={loadingValidar}
                        className="shrink-0"
                      >
                        {loadingValidar ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Validando…
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Validar {extraerData.total_referencias} refs
                          </>
                        )}
                      </Button>
                    </div>
                    {loadingValidar && (
                      <p className="text-xs text-muted text-center">
                        Esto puede tardar varios minutos para PDFs grandes…
                      </p>
                    )}
                  </div>
                )}

                {/* Lista */}
                <div className="space-y-2">
                  {extraerData.referencias.map((ref, i) => (
                    <RefExtraidaCard key={i} ref={ref} index={i + 1} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ── Tab: Validadas ────────────────────────────────── */}
            <TabsContent value="validadas">
              {validarData ? (
                <div className="mt-4 space-y-4">
                  <StatsBar data={validarData} />
                  <div className="space-y-2">
                    {validarData.referencias.map((ref) => (
                      <RefValidadaCard key={ref.indice} ref={ref} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center gap-3 py-20 text-muted">
                  {loadingValidar ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm">Validando referencias…</p>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-8 w-8" />
                      <p className="text-sm">Todavía no has validado las referencias.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTabActiva("extraidas")}
                      >
                        Ir a referencias extraídas
                      </Button>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
