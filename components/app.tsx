"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Key, BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EstadoBadge } from "@/components/estado-badge";
import { extraerReferencias, validarReferencias } from "@/services/api";
import type { ExtraerResponse, ValidarResponse } from "@/types/api";
import { cn } from "@/lib/utils";

type Paso = "upload" | "extraidas" | "validadas";

export function App() {
  const [paso, setPaso] = useState<Paso>("upload");
  const [serperApiKey, setSerperApiKey] = useState("");
  const [usarSerper, setUsarSerper] = useState(false);
  const [pdf, setPdf] = useState<File | null>(null);
  const [arrastrandoPDF, setArrastrandoPDF] = useState(false);

  const [loadingExtraer, setLoadingExtraer] = useState(false);
  const [loadingValidar, setLoadingValidar] = useState(false);
  const [errorExtraer, setErrorExtraer] = useState<string | null>(null);
  const [errorValidar, setErrorValidar] = useState<string | null>(null);

  const [extraerResult, setExtraerResult] = useState<ExtraerResponse | null>(null);
  const [validarResult, setValidarResult] = useState<ValidarResponse | null>(null);

  const [tabActiva, setTabActiva] = useState<"extraidas" | "validadas">("extraidas");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setArrastrandoPDF(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setPdf(file);
  }, []);

  const handleExtraer = async () => {
    if (!pdf) return;
    setLoadingExtraer(true);
    setErrorExtraer(null);
    try {
      const result = await extraerReferencias(pdf, serperApiKey, usarSerper);
      setExtraerResult(result);
      setValidarResult(null);
      setPaso("extraidas");
      setTabActiva("extraidas");
    } catch (e) {
      setErrorExtraer(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoadingExtraer(false);
    }
  };

  const handleValidar = async () => {
    if (!extraerResult) return;
    setLoadingValidar(true);
    setErrorValidar(null);
    try {
      const result = await validarReferencias(
        extraerResult.referencias,
        extraerResult.serper_api_key,
        extraerResult.usar_serper
      );
      setValidarResult(result);
      setPaso("validadas");
      setTabActiva("validadas");
    } catch (e) {
      setErrorValidar(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoadingValidar(false);
    }
  };

  const handleReset = () => {
    setPaso("upload");
    setPdf(null);
    setExtraerResult(null);
    setValidarResult(null);
    setErrorExtraer(null);
    setErrorValidar(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">

        {/* Paso 1: Upload */}
        {paso === "upload" && (
          <div className="space-y-6">
            {/* Zona de drop */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subir PDF
                </CardTitle>
                <CardDescription>
                  Sube el PDF del que quieres extraer y validar las referencias bibliográficas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
                    arrastrandoPDF
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setArrastrandoPDF(true); }}
                  onDragLeave={() => setArrastrandoPDF(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPdf(file);
                    }}
                  />
                  {pdf ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-primary" />
                      <p className="font-medium">{pdf.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(pdf.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="h-10 w-10" />
                      <p className="font-medium">Arrastra un PDF aquí o haz clic para seleccionar</p>
                      <p className="text-sm">Solo archivos .pdf</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Configuración Serper */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Google Scholar (opcional)
                </CardTitle>
                <CardDescription>
                  Activa Serper para usar Google Scholar como fuente adicional de validación.
                  Consigue tu API key gratis en serper.dev
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch
                    id="usar-serper"
                    checked={usarSerper}
                    onCheckedChange={setUsarSerper}
                  />
                  <label htmlFor="usar-serper" className="text-sm font-medium cursor-pointer">
                    Usar Google Scholar via Serper
                  </label>
                </div>
                {usarSerper && (
                  <Input
                    type="password"
                    placeholder="Serper API Key (e.g. abc123xyz...)"
                    value={serperApiKey}
                    onChange={(e) => setSerperApiKey(e.target.value)}
                  />
                )}
              </CardContent>
            </Card>

            {errorExtraer && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{errorExtraer}</span>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              disabled={!pdf || loadingExtraer}
              onClick={handleExtraer}
            >
              {loadingExtraer ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extrayendo referencias... (puede tardar hasta 30 seg)
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

        {/* Pasos 2 y 3: Resultados en pestañas */}
        {(paso === "extraidas" || paso === "validadas") && extraerResult && (
          <div className="space-y-4">
            {/* Header con botón de resetear */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{pdf?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Estilo:{" "}
                  <span className="font-medium">{extraerResult.estilo_citacion.nombre}</span>
                  {" — "}
                  {extraerResult.estilo_citacion.descripcion}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="h-4 w-4" />
                Nuevo PDF
              </Button>
            </div>

            <Tabs value={tabActiva} onValueChange={(v) => setTabActiva(v as "extraidas" | "validadas")}>
              <TabsList>
                <TabsTrigger value="extraidas">
                  Referencias extraídas
                  <Badge variant="secondary" className="ml-2">
                    {extraerResult.total_referencias}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="validadas" disabled={!validarResult && !loadingValidar}>
                  Referencias validadas
                  {validarResult && (
                    <Badge variant="secondary" className="ml-2">
                      {validarResult.total}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Tab: Extraídas */}
              <TabsContent value="extraidas">
                <div className="space-y-4 mt-4">
                  {/* Botón validar */}
                  {!validarResult && (
                    <Card>
                      <CardContent className="pt-6 space-y-3">
                        {errorValidar && (
                          <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>{errorValidar}</span>
                          </div>
                        )}
                        <Button
                          className="w-full"
                          onClick={handleValidar}
                          disabled={loadingValidar}
                        >
                          {loadingValidar ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Validando contra bases de datos académicas... (puede tardar varios minutos)
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Validar {extraerResult.total_referencias} referencias
                            </>
                          )}
                        </Button>
                        {extraerResult.usar_serper && (
                          <p className="text-xs text-center text-muted-foreground">
                            Google Scholar via Serper activado
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Lista de referencias extraídas */}
                  <div className="space-y-3">
                    {extraerResult.referencias.map((ref, i) => (
                      <Card key={i}>
                        <CardContent className="pt-4 pb-4">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className="shrink-0 mt-0.5">
                                #{i + 1}
                              </Badge>
                              <p className="font-medium text-sm leading-snug">
                                {ref.titulo || <span className="text-muted-foreground italic">Sin título</span>}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground pl-8">
                              {ref.autores && <span><span className="font-medium text-foreground">Autores:</span> {ref.autores}</span>}
                              {ref.año && <span><span className="font-medium text-foreground">Año:</span> {ref.año}</span>}
                              {ref.publicacion && <span><span className="font-medium text-foreground">Publicación:</span> {ref.publicacion}</span>}
                              {ref.doi && <span><span className="font-medium text-foreground">DOI:</span> {ref.doi}</span>}
                              {ref.volumen && <span><span className="font-medium text-foreground">Volumen:</span> {ref.volumen}</span>}
                              {ref.paginas && <span><span className="font-medium text-foreground">Páginas:</span> {ref.paginas}</span>}
                              {ref.url && (
                                <span className="col-span-2">
                                  <span className="font-medium text-foreground">URL:</span>{" "}
                                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                                    {ref.url}
                                  </a>
                                </span>
                              )}
                            </div>
                            <details className="pl-8">
                              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                Ver texto original
                              </summary>
                              <p className="text-xs text-muted-foreground mt-1 bg-muted/50 rounded p-2 font-mono leading-relaxed">
                                {ref.raw}
                              </p>
                            </details>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Tab: Validadas */}
              <TabsContent value="validadas">
                {validarResult ? (
                  <div className="space-y-4 mt-4">
                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Card>
                        <CardContent className="pt-4 pb-4 text-center">
                          <p className="text-2xl font-bold">{validarResult.encontradas}</p>
                          <p className="text-xs text-muted-foreground">Encontradas</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 pb-4 text-center">
                          <p className="text-2xl font-bold text-destructive">{validarResult.no_encontradas}</p>
                          <p className="text-xs text-muted-foreground">No encontradas</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 pb-4 text-center">
                          <p className="text-2xl font-bold text-green-600">{validarResult.porcentaje_verificadas}%</p>
                          <p className="text-xs text-muted-foreground">Verificadas</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 pb-4 text-center">
                          <p className="text-2xl font-bold">{validarResult.total}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Detalle BD y Scholar */}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>
                        BD cache: <span className="font-medium text-foreground">{validarResult.estadisticas_bd.servidas_desde_bd}</span> servidas,{" "}
                        <span className="font-medium text-foreground">{validarResult.estadisticas_bd.nuevas_guardadas_en_bd}</span> guardadas
                      </span>
                      {validarResult.estadisticas_google_scholar.serper_habilitado && (
                        <span>
                          · Google Scholar: <span className="font-medium text-foreground">{validarResult.estadisticas_google_scholar.encontradas_por_serper}</span> encontradas
                        </span>
                      )}
                    </div>

                    {/* Lista de referencias validadas */}
                    <div className="space-y-3">
                      {validarResult.referencias.map((ref) => (
                        <Card key={ref.indice}>
                          <CardContent className="pt-4 pb-4">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2 flex-wrap">
                                <Badge variant="outline" className="shrink-0 mt-0.5">
                                  #{ref.indice}
                                </Badge>
                                <EstadoBadge estado={ref.estado} />
                                {ref.validacion.fuente && (
                                  <Badge variant="secondary" className="text-xs">
                                    {ref.validacion.fuente}
                                  </Badge>
                                )}
                              </div>

                              <p className="font-medium text-sm leading-snug">
                                {ref.validacion.titulo_verificado || ref.titulo_original || (
                                  <span className="text-muted-foreground italic">Sin título</span>
                                )}
                              </p>

                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                {ref.autores && <span><span className="font-medium text-foreground">Autores:</span> {ref.autores}</span>}
                                {ref.año && <span><span className="font-medium text-foreground">Año:</span> {ref.año}</span>}
                                {(ref.doi_original || ref.doi_sugerido) && (
                                  <span className="col-span-2">
                                    <span className="font-medium text-foreground">DOI:</span>{" "}
                                    {ref.doi_original || ref.doi_sugerido}
                                    {!ref.doi_original && ref.doi_sugerido && (
                                      <Badge variant="info" className="ml-1 text-[10px]">sugerido</Badge>
                                    )}
                                  </span>
                                )}
                                {ref.validacion.citaciones !== undefined && ref.validacion.citaciones > 0 && (
                                  <span><span className="font-medium text-foreground">Citas:</span> {ref.validacion.citaciones}</span>
                                )}
                                {ref.validacion.url && (
                                  <span className="col-span-2">
                                    <a
                                      href={ref.validacion.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      Ver publicación
                                    </a>
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                    {loadingValidar ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>Validando referencias contra bases de datos académicas...</p>
                        <p className="text-xs">Esto puede tardar varios minutos</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-8 w-8" />
                        <p>Aún no has validado las referencias</p>
                        <Button variant="outline" onClick={() => setTabActiva("extraidas")}>
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
    </div>
  );
}
