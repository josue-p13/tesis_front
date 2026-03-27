"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Users, Calendar, ExternalLink, Database, Link2, Search, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EstadoBadge } from "@/components/estado-badge";
import { MetaChip } from "./meta-chip";
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
    <div className="rounded-lg border border-border bg-surface overflow-hidden transition-all hover:border-border/80">
      {/* Header / Resumen */}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Número */}
        <span className="mt-0.5 shrink-0 text-xs font-mono text-muted w-6 text-right">
          {referencia.indice}
        </span>

        {/* Info principal */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm font-medium leading-snug text-foreground">
            {v.titulo_verificado || referencia.titulo_original}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <MetaChip 
              icon={Users} 
              label="Autores" 
              value={v.autores_verificados || referencia.autores || "Sin autores"} 
            />
            <MetaChip 
              icon={Calendar} 
              label="Año" 
              value={referencia.año || "S/A"} 
            />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <EstadoBadge estado={referencia.estado} />

            {v.fuente && (
              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                <Database className="h-2.5 w-2.5 mr-1" />
                {v.fuente}
              </Badge>
            )}

            {v.citaciones !== undefined && v.citaciones > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {v.citaciones} citaciones
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

        {/* Acciones rápidas */}
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {v.url && (
            <a
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-colors"
              title="Abrir fuente original"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
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
          <div className="flex items-center justify-between gap-4 py-1 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-background border border-border">
                <Search className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Verificado vía</p>
                <p className="text-sm font-semibold">{v.fuente || "Búsqueda manual"}</p>
              </div>
            </div>
            
            {v.url ? (
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                Ver Documento
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <div className="text-[10px] text-muted italic">No hay link directo disponible</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Título Original (PDF)</p>
              <p className="text-xs leading-relaxed text-muted-foreground italic">"{referencia.titulo_original}"</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Título Verificado</p>
              <p className="text-xs leading-relaxed font-medium">{v.titulo_verificado || "No disponible"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Link2 className="h-3 w-3 text-muted" />
              <span className="text-muted-foreground">DOI:</span>
              <span className="font-mono text-[11px]">{doi || "No disponible"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
