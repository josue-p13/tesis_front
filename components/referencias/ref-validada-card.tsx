"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Users, Calendar, ExternalLink, Database } from "lucide-react";
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

            {v.url && (
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border bg-primary/10 text-primary border-primary/25 hover:bg-primary/20 transition-colors"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Ver
              </a>
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
          open ? "max-h-56" : "max-h-0"
        )}
      >
        <div className="mx-4 mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-md border border-border bg-surface-2 px-4 py-3 text-xs">
          {referencia.titulo_original && (
            <div className="col-span-2">
              <span className="text-muted">Título original (PDF):</span>{" "}
              <span className="text-foreground">{referencia.titulo_original}</span>
            </div>
          )}
          {v.titulo_verificado && v.titulo_verificado !== referencia.titulo_original && (
            <div className="col-span-2">
              <span className="text-muted">Título verificado:</span>{" "}
              <span className="text-foreground">{v.titulo_verificado}</span>
            </div>
          )}
          {v.autores_verificados && (
            <div className="col-span-2">
              <span className="text-muted">Autores verificados:</span>{" "}
              <span className="text-foreground">{v.autores_verificados}</span>
            </div>
          )}
          {v.doi_encontrado && (
            <div>
              <span className="text-muted">DOI encontrado:</span>{" "}
              <span className="font-mono text-foreground">{v.doi_encontrado}</span>
            </div>
          )}
          {referencia.doi_original && (
            <div>
              <span className="text-muted">DOI original:</span>{" "}
              <span className="font-mono text-foreground">{referencia.doi_original}</span>
            </div>
          )}
          {v.citaciones !== undefined && (
            <div>
              <span className="text-muted">Citas:</span>{" "}
              <span className="text-foreground">{v.citaciones}</span>
            </div>
          )}
          {v.desde_bd && (
            <div>
              <span className="text-muted">Fuente:</span>{" "}
              <span className="text-foreground">Caché local (BD)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
