"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, BookOpen, Users, Calendar, Hash, Link2, Pencil, Trash2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MetaChip } from "./meta-chip";
import type { ReferenciaCruda } from "@/types/api";
import { cn } from "@/lib/utils";

interface RefExtraidaCardProps {
  referencia: ReferenciaCruda;
  index: number;
  onUpdate?: (updated: ReferenciaCruda) => void;
  onDelete?: () => void;
}

export function RefExtraidaCard({ referencia, index, onUpdate, onDelete }: RefExtraidaCardProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRef, setEditedRef] = useState<ReferenciaCruda>({ ...referencia });

  // Sincronizar si cambia desde afuera (ej. al limpiar o resetear)
  useEffect(() => {
    setEditedRef({ ...referencia });
  }, [referencia]);

  const hasDoi = !!editedRef.doi;
  const hasUrl = !!editedRef.url;

  const handleSave = () => {
    onUpdate?.(editedRef);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRef({ ...referencia });
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "rounded-lg border transition-all duration-200",
      isEditing 
        ? "border-primary/50 bg-primary/5 shadow-md ring-1 ring-primary/20" 
        : "border-border bg-surface hover:border-border/80 hover:bg-surface-2/30"
    )}>
      {/* Row principal */}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Número */}
        <span className="mt-1 shrink-0 text-xs font-mono text-muted w-6 text-right">
          {index}
        </span>

        {/* Contenido */}
        <div className="min-w-0 flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Título del Artículo</label>
                <Input
                  value={editedRef.titulo || ""}
                  onChange={(e) => setEditedRef({ ...editedRef, titulo: e.target.value })}
                  placeholder="Título de la referencia..."
                  className="h-8 text-sm bg-background"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Autores</label>
                  <Input
                    value={editedRef.autores || ""}
                    onChange={(e) => setEditedRef({ ...editedRef, autores: e.target.value })}
                    placeholder="Ej: Doe J, Smith A"
                    className="h-8 text-sm bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Año</label>
                  <Input
                    value={editedRef.año || ""}
                    onChange={(e) => setEditedRef({ ...editedRef, año: e.target.value })}
                    placeholder="Ej: 2024"
                    className="h-8 text-sm bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Revista / Libro</label>
                  <Input
                    value={editedRef.publicacion || ""}
                    onChange={(e) => setEditedRef({ ...editedRef, publicacion: e.target.value })}
                    placeholder="Nombre de la fuente..."
                    className="h-8 text-sm bg-background"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">DOI</label>
                  <Input
                    value={editedRef.doi || ""}
                    onChange={(e) => setEditedRef({ ...editedRef, doi: e.target.value })}
                    placeholder="10.xxxx/yyyy"
                    className="h-8 text-sm bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">URL</label>
                  <Input
                    value={editedRef.url || ""}
                    onChange={(e) => setEditedRef({ ...editedRef, url: e.target.value })}
                    placeholder="https://..."
                    className="h-8 text-sm bg-background"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 text-xs">
                  <X className="mr-1 h-3 w-3" /> Cancelar
                </Button>
                <Button size="sm" onClick={handleSave} className="h-7 text-xs">
                  <Check className="mr-1 h-3 w-3" /> Guardar Cambios
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium leading-snug text-foreground">
                {editedRef.titulo || (
                  <span className="italic text-muted">Sin título detectado</span>
                )}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                <MetaChip icon={Users}    label="Autores"  value={editedRef.autores} />
                <MetaChip icon={Calendar} label="Año"      value={editedRef.año} />
                <MetaChip icon={BookOpen} label="Revista"  value={editedRef.publicacion} />
                {editedRef.volumen && editedRef.paginas && (
                  <MetaChip icon={Hash} label="Vol/Pág" value={`${editedRef.volumen} · ${editedRef.paginas}`} />
                )}
              </div>

              {/* Badges rápidos */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {hasDoi && (
                  <Badge variant="default" className="text-[10px]">
                    DOI · {editedRef.doi}
                  </Badge>
                )}
                {hasUrl && (
                  <a
                    href={editedRef.url}
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
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-1 mt-0.5">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                title="Editar referencia"
                className="rounded p-1 text-muted hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onDelete}
                title="Eliminar referencia"
                className="rounded p-1 text-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setOpen((v) => !v)}
                title="Ver texto original"
                className="rounded p-1 text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
              >
                {open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </>
          )}
        </div>
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
