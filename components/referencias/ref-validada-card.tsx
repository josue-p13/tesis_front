"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Users, Calendar, ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EstadoBadge } from "@/components/estado-badge";
import { MetaChip } from "./meta-chip";
import { BaseRefCard } from "./base-ref-card";
import type { ReferenciaValidada } from "@/types/api";
import { cn } from "@/lib/utils";

interface RefValidadaCardProps {
  referencia: ReferenciaValidada;
}

export function RefValidadaCard({ referencia }: RefValidadaCardProps) {
  const [open, setOpen] = useState(false);
  const v = referencia.validacion;
  const doi = referencia.doi_original || referencia.doi_sugerido;

  return (
    <BaseRefCard
      index={referencia.indice}
      title={
        <p className="text-sm font-medium leading-snug text-foreground">
          {v.titulo_verificado || referencia.titulo_original}
        </p>
      }
      metadata={
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
      }
      badges={
        <>
          <EstadoBadge estado={referencia.estado} />
          {v.fuente && (
            <Badge variant="outline" className="gap-1 text-[10px] bg-surface-2">
              <Search className="h-2.5 w-2.5" />
              {v.fuente}
            </Badge>
          )}
          {v.citaciones !== undefined && v.citaciones > 0 && (
            <Badge variant="secondary" className="text-[10px] bg-success/10 text-success border-success/20">
              {v.citaciones} citaciones
            </Badge>
          )}
          {doi && (
            <Badge variant="default" className="text-[10px]">
              DOI · {doi}
            </Badge>
          )}
        </>
      }
      actions={
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded p-1 text-muted hover:text-foreground hover:bg-surface-2 transition-colors mt-1"
        >
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      }
      expandibleContent={
        <div className={cn("overflow-hidden transition-all duration-200", open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
          <div className="px-4 pb-4 space-y-4 pt-2">
            {/* Grid de comparación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md border border-border/50 bg-surface-2/50 p-3">
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Original (PDF)</h4>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">{referencia.titulo_original}</p>
                  <p className="text-[10px] text-muted leading-relaxed line-clamp-2">{referencia.autores}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">Verificado</h4>
                {v.encontrado ? (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">{v.titulo_verificado}</p>
                    <p className="text-[10px] text-muted leading-relaxed line-clamp-2">{v.autores_verificados}</p>
                  </div>
                ) : (
                  <p className="text-xs italic text-muted-foreground">No se encontraron datos oficiales</p>
                )}
              </div>
            </div>

            {v.url && (
              <div className="flex justify-end pt-2">
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver Documento
                </a>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
