"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Users, Calendar, Hash, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReferenciaCruda } from "@/types/api";
import { cn } from "@/lib/utils";

interface RefExtraidaCardProps {
  ref: ReferenciaCruda;
  index: number;
}

function MetaChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted min-w-0">
      <Icon className="h-3 w-3 shrink-0" />
      <span className="font-medium text-foreground/70 shrink-0">{label}:</span>
      <span className="truncate" title={value}>{value}</span>
    </div>
  );
}

export function RefExtraidaCard({ ref: referencia, index }: RefExtraidaCardProps) {
  const [open, setOpen] = useState(false);
  const hasDoi = !!referencia.doi;
  const hasUrl = !!referencia.url;

  return (
    <div className="rounded-lg border border-border bg-surface transition-colors hover:border-border/80 hover:bg-surface-2/30">
      {/* Row principal */}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Número */}
        <span className="mt-0.5 shrink-0 text-xs font-mono text-muted w-6 text-right">
          {index}
        </span>

        {/* Contenido */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm font-medium leading-snug text-foreground">
            {referencia.titulo || (
              <span className="italic text-muted">Sin título detectado</span>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <MetaChip icon={Users}    label="Autores"  value={referencia.autores} />
            <MetaChip icon={Calendar} label="Año"      value={referencia.año} />
            <MetaChip icon={BookOpen} label="Revista"  value={referencia.publicacion} />
            {referencia.volumen && referencia.paginas && (
              <MetaChip icon={Hash} label="Vol/Pág" value={`${referencia.volumen} · ${referencia.paginas}`} />
            )}
          </div>

          {/* Badges rápidos */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {hasDoi && (
              <Badge variant="default" className="text-[10px]">
                DOI · {referencia.doi}
              </Badge>
            )}
            {hasUrl && (
              <a
                href={referencia.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border bg-info/10 text-info border-info/25 hover:bg-info/20 transition-colors"
              >
                <Link2 className="h-2.5 w-2.5" />
                URL
              </a>
            )}
          </div>
        </div>

        {/* Toggle raw */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Ver texto original"
          className="mt-0.5 shrink-0 rounded p-1 text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Raw expandible */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-40" : "max-h-0"
        )}
      >
        <div className="mx-4 mb-3 rounded-md border border-border bg-surface-2 px-3 py-2">
          <p className="text-[11px] font-mono leading-relaxed text-muted">
            {referencia.raw || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
