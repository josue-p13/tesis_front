"use client";

import { AlertTriangle } from "lucide-react";
import type { ValidarResponse } from "@/types/api";
import { cn } from "@/lib/utils";

interface StatItemProps {
  label: string;
  value: string | number;
  highlight?: "success" | "danger" | "default";
}

function StatItem({ label, value, highlight = "default" }: StatItemProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface px-4 py-3 text-center">
      <span
        className={cn(
          "text-2xl font-bold tabular-nums",
          highlight === "success" && "text-success",
          highlight === "danger"  && "text-danger",
          highlight === "default" && "text-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-[11px] text-muted mt-0.5">{label}</span>
    </div>
  );
}

interface StatsBarProps {
  data: ValidarResponse;
}

export function StatsBar({ data }: StatsBarProps) {
  const pct = data.porcentaje_verificadas;

  return (
    <div className="space-y-3">
      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatItem label="Total"        value={data.total} />
        <StatItem label="Encontradas"  value={data.encontradas}  highlight="success" />
        <StatItem label="No encontradas" value={data.no_encontradas} highlight={data.no_encontradas > 0 ? "danger" : "default"} />
        <StatItem label="Verificadas"  value={`${pct}%`} highlight={pct >= 80 ? "success" : pct >= 50 ? "default" : "danger"} />
      </div>

      {/* Barra de progreso */}
      <div className="h-1.5 w-full rounded-full bg-surface-2 border border-border overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            pct >= 80 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-danger"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Aviso de API key de Serper inválida */}
      {data.serper_error?.ocurrio && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-warning">
              API key de Serper inválida
            </p>
            <p className="text-xs text-muted">
              {data.serper_error.mensaje}
              {data.serper_error.codigo ? ` (código ${data.serper_error.codigo})` : ""}
              . La validación se completó sin Google Scholar.
            </p>
          </div>
        </div>
      )}

      {/* Detalles secundarios */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted px-0.5">
        <span>
          Con DOI original:{" "}
          <span className="font-medium text-foreground">{data.con_doi_original}</span>
        </span>
        <span>
          Sin DOI:{" "}
          <span className="font-medium text-foreground">{data.sin_doi_original}</span>
        </span>
        <span>
          Desde caché BD:{" "}
          <span className="font-medium text-foreground">{data.estadisticas_bd.servidas_desde_bd}</span>
        </span>
        <span>
          Guardadas en BD:{" "}
          <span className="font-medium text-foreground">{data.estadisticas_bd.nuevas_guardadas_en_bd}</span>
        </span>
        {data.estadisticas_google_scholar.serper_habilitado && (
          <span>
            Google Scholar:{" "}
            <span className="font-medium text-foreground">{data.estadisticas_google_scholar.encontradas_por_serper}</span>
          </span>
        )}
      </div>
    </div>
  );
}
