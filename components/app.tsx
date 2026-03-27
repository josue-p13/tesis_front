"use client";

import { useCallback, useMemo, useReducer } from "react";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  BookMarked,
  Plus,
  Info,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { UploadZone } from "@/components/upload/upload-zone";
import { SerperConfig } from "@/components/upload/serper-config";
import { RefExtraidaCard } from "@/components/referencias/ref-extraida-card";
import { RefValidadaCard } from "@/components/referencias/ref-validada-card";
import { StatsBar } from "@/components/referencias/stats-bar";

import { extraerReferencias, validarReferencias } from "@/services/api";
import type { ExtraerResponse, ValidarResponse, ReferenciaCruda } from "@/types/api";

type Paso = "upload" | "resultados";
type TabId = "extraidas" | "validadas";

const EMPTY_REFERENCE: ReferenciaCruda = {
  titulo: "",
  autores: "",
  año: "",
  publicacion: "",
  doi: "",
  url: "",
  volumen: "",
  paginas: "",
  raw: "Referencia añadida manualmente",
};

type RefItem = { id: string; referencia: ReferenciaCruda };

type ExtraidasState = Omit<ExtraerResponse, "referencias" | "total_referencias"> & {
  referencias: RefItem[];
};

type AppState = {
  paso: Paso;
  tabActiva: TabId;
  pdf: File | null;
  dragging: boolean;
  usarSerper: boolean;
  serperKey: string;
  loadingExtraer: boolean;
  loadingValidar: boolean;
  errorExtraer: string | null;
  errorValidar: string | null;
  extraerData: ExtraidasState | null;
  validarData: ValidarResponse | null;
};

type AppAction =
  | { type: "setPaso"; paso: Paso }
  | { type: "setTab"; tab: TabId }
  | { type: "setPdf"; pdf: File | null }
  | { type: "setDragging"; dragging: boolean }
  | { type: "setUsarSerper"; usarSerper: boolean }
  | { type: "setSerperKey"; serperKey: string }
  | { type: "reset" }
  | { type: "extraerStart" }
  | { type: "extraerSuccess"; data: ExtraidasState }
  | { type: "extraerError"; error: string }
  | { type: "validarStart" }
  | { type: "validarSuccess"; data: ValidarResponse }
  | { type: "validarError"; error: string }
  | { type: "refUpdate"; id: string; referencia: ReferenciaCruda }
  | { type: "refDelete"; id: string }
  | { type: "refAdd"; referencia: ReferenciaCruda };

function createId() {
  const cryptoObj = globalThis.crypto as Crypto | undefined;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const initialState: AppState = {
  paso: "upload",
  tabActiva: "extraidas",
  pdf: null,
  dragging: false,
  usarSerper: false,
  serperKey: "",
  loadingExtraer: false,
  loadingValidar: false,
  errorExtraer: null,
  errorValidar: null,
  extraerData: null,
  validarData: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "setPaso":
      return { ...state, paso: action.paso };
    case "setTab":
      return { ...state, tabActiva: action.tab };
    case "setPdf":
      return { ...state, pdf: action.pdf };
    case "setDragging":
      return { ...state, dragging: action.dragging };
    case "setUsarSerper":
      return { ...state, usarSerper: action.usarSerper };
    case "setSerperKey":
      return { ...state, serperKey: action.serperKey };
    case "reset":
      return { ...initialState };
    case "extraerStart":
      return { ...state, loadingExtraer: true, errorExtraer: null };
    case "extraerSuccess":
      return {
        ...state,
        loadingExtraer: false,
        extraerData: action.data,
        validarData: null,
        paso: "resultados",
        tabActiva: "extraidas",
      };
    case "extraerError":
      return { ...state, loadingExtraer: false, errorExtraer: action.error };
    case "validarStart":
      return { ...state, loadingValidar: true, errorValidar: null };
    case "validarSuccess":
      return {
        ...state,
        loadingValidar: false,
        validarData: action.data,
        tabActiva: "validadas",
      };
    case "validarError":
      return { ...state, loadingValidar: false, errorValidar: action.error };
    case "refUpdate": {
      if (!state.extraerData) return state;
      const referencias = state.extraerData.referencias.map((item) =>
        item.id === action.id ? { ...item, referencia: action.referencia } : item
      );
      return { ...state, extraerData: { ...state.extraerData, referencias } };
    }
    case "refDelete": {
      if (!state.extraerData) return state;
      const referencias = state.extraerData.referencias.filter((item) => item.id !== action.id);
      return { ...state, extraerData: { ...state.extraerData, referencias } };
    }
    case "refAdd": {
      if (!state.extraerData) return state;
      const referencias = [{ id: createId(), referencia: action.referencia }, ...state.extraerData.referencias];
      return { ...state, extraerData: { ...state.extraerData, referencias }, tabActiva: "extraidas" };
    }
    default:
      return state;
  }
}

function LoadingSession() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-center">Cargando sesión…</p>
    </div>
  );
}

function UploadSection(props: {
  pdf: File | null;
  dragging: boolean;
  usarSerper: boolean;
  serperKey: string;
  errorExtraer: string | null;
  loadingExtraer: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onToggleSerper: (val: boolean) => void;
  onChangeSerperKey: (val: string) => void;
  onExtraer: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Extraer referencias</h1>
        <p className="text-sm text-muted mt-0.5">
          Sube un PDF y el sistema extraerá y validará sus referencias bibliográficas.
        </p>
      </div>

      <UploadZone
        file={props.pdf}
        dragging={props.dragging}
        onFile={props.onFile}
        onClear={props.onClear}
        onDragEnter={props.onDragEnter}
        onDragLeave={props.onDragLeave}
      />

      <SerperConfig
        usarSerper={props.usarSerper}
        apiKey={props.serperKey}
        onToggle={props.onToggleSerper}
        onKeyChange={props.onChangeSerperKey}
      />

      {props.errorExtraer && (
        <div className="flex items-start gap-2.5 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{props.errorExtraer}</span>
        </div>
      )}

      <Button size="lg" className="w-full" disabled={!props.pdf || props.loadingExtraer} onClick={props.onExtraer}>
        {props.loadingExtraer ? (
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
  );
}

function DocumentHeader(props: {
  pdfName: string;
  estiloNombre: string;
  estiloDescripcion: string;
  onReset: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <BookMarked className="h-4 w-4 text-primary shrink-0" />
          <h1 className="text-base font-semibold truncate">{props.pdfName}</h1>
          <Badge variant="secondary">{props.estiloNombre}</Badge>
        </div>
        <p className="text-xs text-muted mt-0.5 pl-6">{props.estiloDescripcion}</p>
      </div>
      <Button variant="outline" size="sm" onClick={props.onReset}>
        <RefreshCw className="h-3.5 w-3.5" />
        Nuevo PDF
      </Button>
    </div>
  );
}

function ExtractedTab(props: {
  referencias: RefItem[];
  usarSerper: boolean;
  errorValidar: string | null;
  loadingValidar: boolean;
  validarData: ValidarResponse | null;
  onAddRef: () => void;
  onValidar: () => void;
  onUpdateRef: (id: string, referencia: ReferenciaCruda) => void;
  onDeleteRef: (id: string) => void;
}) {
  const total = props.referencias.length;
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Referencias Detectadas</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={props.onAddRef}
          className="h-8 text-xs border-primary/30 hover:bg-primary/5"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Añadir Referencia
        </Button>
      </div>

      <Alert className="bg-primary/5 border-primary/20 py-3">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
          Verifica que las referencias hayan sido extraídas correctamente. Si detectas algún error o texto irrelevante,
          puedes <span className="font-semibold text-foreground">editarlas</span> o{" "}
          <span className="font-semibold text-foreground">eliminarlas</span> antes de iniciar la validación académica.
        </AlertDescription>
      </Alert>

      {!props.validarData && (
        <div className="rounded-lg border border-border bg-surface px-5 py-4 space-y-3">
          {props.errorValidar && (
            <div className="flex items-start gap-2 rounded border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              {props.errorValidar}
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">¿Validar contra bases de datos académicas?</p>
              <p className="text-xs text-muted">
                OpenAlex · CrossRef · Semantic Scholar · PubMed · CORE · Google Books
                {props.usarSerper && " · Google Scholar"}
              </p>
            </div>
            <Button onClick={props.onValidar} disabled={props.loadingValidar} className="shrink-0">
              {props.loadingValidar ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validando…
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Validar {total} refs
                </>
              )}
            </Button>
          </div>
          {props.loadingValidar && (
            <p className="text-xs text-muted text-center">Esto puede tardar varios minutos para PDFs grandes…</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {props.referencias.map((item, i) => (
          <RefExtraidaCard
            key={item.id}
            referencia={item.referencia}
            index={i + 1}
            onUpdate={(updated) => props.onUpdateRef(item.id, updated)}
            onDelete={() => props.onDeleteRef(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ValidatedTab(props: {
  validarData: ValidarResponse | null;
  loadingValidar: boolean;
  onGoExtracted: () => void;
}) {
  if (props.validarData) {
    return (
      <div className="mt-4 space-y-4">
        <StatsBar data={props.validarData} />
        <div className="space-y-2">
          {props.validarData.referencias.map((ref) => (
            <RefValidadaCard key={ref.indice} referencia={ref} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col items-center gap-3 py-20 text-muted">
      {props.loadingValidar ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Validando referencias…</p>
        </>
      ) : (
        <>
          <CheckCircle className="h-8 w-8" />
          <p className="text-sm">Todavía no has validado las referencias.</p>
          <Button variant="outline" size="sm" onClick={props.onGoExtracted}>
            Ir a referencias extraídas
          </Button>
        </>
      )}
    </div>
  );
}

function ResultsSection(props: {
  pdfName: string;
  estiloNombre: string;
  estiloDescripcion: string;
  tabActiva: TabId;
  totalExtraidas: number;
  totalValidadas: number | null;
  referencias: RefItem[];
  usarSerper: boolean;
  validarData: ValidarResponse | null;
  loadingValidar: boolean;
  errorValidar: string | null;
  onTabChange: (tab: TabId) => void;
  onReset: () => void;
  onAddRef: () => void;
  onValidar: () => void;
  onUpdateRef: (id: string, referencia: ReferenciaCruda) => void;
  onDeleteRef: (id: string) => void;
  onGoExtracted: () => void;
}) {
  return (
    <div className="space-y-4">
      <DocumentHeader
        pdfName={props.pdfName}
        estiloNombre={props.estiloNombre}
        estiloDescripcion={props.estiloDescripcion}
        onReset={props.onReset}
      />

      <Tabs value={props.tabActiva} onValueChange={(v) => props.onTabChange(v as TabId)}>
        <TabsList>
          <TabsTrigger value="extraidas">
            <FileText className="h-3.5 w-3.5" />
            Extraídas
            <Badge variant="secondary">{props.totalExtraidas}</Badge>
          </TabsTrigger>
          <TabsTrigger value="validadas">
            <CheckCircle className="h-3.5 w-3.5" />
            Validadas
            {props.totalValidadas !== null && <Badge variant="secondary">{props.totalValidadas}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="extraidas">
          <ExtractedTab
            referencias={props.referencias}
            usarSerper={props.usarSerper}
            errorValidar={props.errorValidar}
            loadingValidar={props.loadingValidar}
            validarData={props.validarData}
            onAddRef={props.onAddRef}
            onValidar={props.onValidar}
            onUpdateRef={props.onUpdateRef}
            onDeleteRef={props.onDeleteRef}
          />
        </TabsContent>

        <TabsContent value="validadas">
          <ValidatedTab
            validarData={props.validarData}
            loadingValidar={props.loadingValidar}
            onGoExtracted={props.onGoExtracted}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function App() {
  const { user, loading } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const pdfName = state.pdf?.name || "Documento";

  const totalExtraidas = state.extraerData?.referencias.length ?? 0;
  const totalValidadas = state.validarData?.total ?? null;

  const dataParaValidar = useMemo(() => {
    if (!state.extraerData) return null;
    return {
      referencias: state.extraerData.referencias.map((item) => item.referencia),
      serper_api_key: state.extraerData.serper_api_key,
      usar_serper: state.extraerData.usar_serper,
    };
  }, [state.extraerData]);

  const handleExtraer = useCallback(async () => {
    if (!state.pdf) return;
    dispatch({ type: "extraerStart" });
    try {
      const data = await extraerReferencias(state.pdf, state.serperKey, state.usarSerper);
      const referencias: RefItem[] = data.referencias.map((ref) => ({ id: createId(), referencia: ref }));
      dispatch({
        type: "extraerSuccess",
        data: {
          estilo_citacion: data.estilo_citacion,
          referencias,
          serper_api_key: data.serper_api_key,
          usar_serper: data.usar_serper,
        },
      });
    } catch (e) {
      dispatch({ type: "extraerError", error: e instanceof Error ? e.message : "Error desconocido" });
    }
  }, [state.pdf, state.serperKey, state.usarSerper]);

  const handleValidar = useCallback(async () => {
    if (!dataParaValidar) return;
    dispatch({ type: "validarStart" });
    try {
      const data = await validarReferencias(dataParaValidar.referencias, dataParaValidar.serper_api_key, dataParaValidar.usar_serper);
      dispatch({ type: "validarSuccess", data });
    } catch (e) {
      dispatch({ type: "validarError", error: e instanceof Error ? e.message : "Error desconocido" });
    }
  }, [dataParaValidar]);

  const handleReset = useCallback(() => dispatch({ type: "reset" }), []);

  const handleAddRef = useCallback(() => dispatch({ type: "refAdd", referencia: EMPTY_REFERENCE }), []);

  const handleUpdateRef = useCallback((id: string, referencia: ReferenciaCruda) => {
    dispatch({ type: "refUpdate", id, referencia });
  }, []);

  const handleDeleteRef = useCallback((id: string) => dispatch({ type: "refDelete", id }), []);

  const handleFile = useCallback((file: File) => dispatch({ type: "setPdf", pdf: file }), []);
  const handleClear = useCallback(() => dispatch({ type: "setPdf", pdf: null }), []);

  const results = useMemo(() => {
    if (!state.extraerData) return null;
    return state.extraerData;
  }, [state.extraerData]);

  if (loading) return <LoadingSession />;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {state.paso === "upload" && (
        <UploadSection
          pdf={state.pdf}
          dragging={state.dragging}
          usarSerper={state.usarSerper}
          serperKey={state.serperKey}
          errorExtraer={state.errorExtraer}
          loadingExtraer={state.loadingExtraer}
          onFile={handleFile}
          onClear={handleClear}
          onDragEnter={() => dispatch({ type: "setDragging", dragging: true })}
          onDragLeave={() => dispatch({ type: "setDragging", dragging: false })}
          onToggleSerper={(val) => dispatch({ type: "setUsarSerper", usarSerper: val })}
          onChangeSerperKey={(val) => dispatch({ type: "setSerperKey", serperKey: val })}
          onExtraer={handleExtraer}
        />
      )}

      {state.paso === "resultados" && results && (
        <ResultsSection
          pdfName={pdfName}
          estiloNombre={results.estilo_citacion.nombre}
          estiloDescripcion={results.estilo_citacion.descripcion}
          tabActiva={state.tabActiva}
          totalExtraidas={totalExtraidas}
          totalValidadas={totalValidadas}
          referencias={results.referencias}
          usarSerper={results.usar_serper}
          validarData={state.validarData}
          loadingValidar={state.loadingValidar}
          errorValidar={state.errorValidar}
          onTabChange={(tab) => dispatch({ type: "setTab", tab })}
          onReset={handleReset}
          onAddRef={handleAddRef}
          onValidar={handleValidar}
          onUpdateRef={handleUpdateRef}
          onDeleteRef={handleDeleteRef}
          onGoExtracted={() => dispatch({ type: "setTab", tab: "extraidas" })}
        />
      )}
    </div>
  );
}
