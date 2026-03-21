"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Users, Calendar, ExternalLink, Database, Link2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EstadoBadge } from "@/components/estado-badge";
import type { ReferenciaValidada } from "@/types/api";
import { cn } from "@/lib/utils";

interface RefValidadaCardProps {
  ref: ReferenciaValidada;
}

export function RefValidadaCard({ ref: referencia }: RefValidadaCardProps) {
  const [open, setOpen] = useState(false);
  const v = referencia.validacion;
  const encontrado = v.encontrado;
  const doi = referencia.doi_original || referencia.doi_sugerido;

  return (
    <div
      className={cn(
        "rounded-lg border bg-surface transition-colors hover:bg-surface-2/30",
        encontrado ? "border-border" : "border-danger/25 bg-danger/5"
      )}
    >
      {/* Row principal */}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Número */}
        <span className="mt-0.5 shrink-0 text-xs font-mono text-muted w-6 text-right">
          {referencia.indice}
        </span>

        {/* Contenido */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Título verificado (preferido) o original */}
          <p className="text-sm font-medium leading-snug text-foreground">
            {v.titulo_verificado || referencia.titulo_original || (
              <span className="italic text-muted">Sin título</span>
            )}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {referencia.autores && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {referencia.autores}
              </span>
            )}
            {referencia.año && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {referencia.año}
              </span>
            )}
            {v.citaciones !== undefined && v.citaciones > 0 && (
              <span className="flex items-center gap-1">
                <span className="font-medium text-foreground/70">{v.citaciones}</span> citas
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <EstadoBadge estado={referencia.estado} />

            {v.fuente && (
              <Badge variant="secondary" className="text-[10px]">
                <Database className="h-2.5 w-2.5" />
                {v.fuente}
              </Badge>
            )}

            {doi && (
              <Badge variant={referencia.doi_sugerido && !referencia.doi_original ? "info" : "outline"} className="text-[10px] font-mono">
                {doi}
                {referencia.doi_sugerido && !referencia.doi_original && (
                  <span className="ml-1 opacity-70">sugerido</span>
                )}
              </Badge>
            )}
          </div>
        </div>

        {/* Toggle detalle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Ver detalle de validación"
          className="mt-0.5 shrink-0 rounded p-1 text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Detalle expandible */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="mx-4 mb-3 space-y-3 rounded-md border border-border bg-surface-2 px-4 py-3">
          {/* Fuente y link destacados */}
          {v.fuente && (
            <div className="rounded-md bg-primary/5 border border-primary/20 p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-xs text-muted mb-1.5">Encontrado en:</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold text-foreground">{v.fuente}</span>
                  </div>
                </div>
              </div>
              
              {/* Link al documento o búsqueda */}
              {v.url && (
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    v.es_link_busqueda 
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {v.es_link_busqueda ? <Search className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                  {v.es_link_busqueda ? "Buscar en Google" : "Ir al documento"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {/* Detalles adicionales en grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {referencia.titulo_original && (
              <div className="col-span-2">
                <span className="text-muted">Título (del PDF):</span>{" "}
                <span className="text-foreground">{referencia.titulo_original}</span>
              </div>
            )}
            {v.titulo_verificado && v.titulo_verificado !== referencia.titulo_original && (
              <div className="col-span-2">
                <span className="text-muted">Título verificado:</span>{" "}
                <span className="text-foreground font-medium text-primary">{v.titulo_verificado}</span>
              </div>
            )}
            {v.autores_verificados && (
              <div className="col-span-2">
                <span className="text-muted">Autores verificados:</span>{" "}
                <span className="text-foreground">{v.autores_verificados}</span>
              </div>
            )}
            {v.doi_encontrado && (
              <div className="col-span-2">
                <span className="text-muted">DOI encontrado:</span>{" "}
                <a
                  href={`https://doi.org/${v.doi_encontrado}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary hover:underline"
                >
                  {v.doi_encontrado}
                  <ExternalLink className="h-2.5 w-2.5 inline ml-1" />
                </a>
              </div>
            )}
            {referencia.doi_original && referencia.doi_original !== v.doi_encontrado && (
              <div className="col-span-2">
                <span className="text-muted">DOI original (del PDF):</span>{" "}
                <span className="font-mono text-foreground">{referencia.doi_original}</span>
              </div>
            )}
            {v.citaciones !== undefined && v.citaciones > 0 && (
              <div>
                <span className="text-muted">Citas encontradas:</span>{" "}
                <span className="font-semibold text-foreground">{v.citaciones}</span>
              </div>
            )}
            {v.desde_bd && (
              <div>
                <span className="text-muted">Procedencia:</span>{" "}
                <span className="text-foreground">Caché local (BD)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
