"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Users, Calendar, Hash, Link2, Pencil, Trash2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MetaChip } from "./meta-chip";
import { BaseRefCard } from "./base-ref-card";
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
  const [editedRef, setEditedRef] = useState<ReferenciaCruda | null>(null);

  const handleSave = () => {
    onUpdate?.(editedRef || referencia);
    setIsEditing(false);
    setEditedRef(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedRef(null);
  };

  if (isEditing) {
    const draft = editedRef || referencia;
    const baseId = `ref-extraida-${index}`;
    return (
      <BaseRefCard
        index={index}
        isEditing
        title={
          <div className="space-y-1">
            <label
              htmlFor={`${baseId}-titulo`}
              className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1"
            >
              Título del Artículo
            </label>
            <Input
              id={`${baseId}-titulo`}
              value={draft.titulo || ""}
              onChange={(e) => setEditedRef({ ...(editedRef || { ...referencia }), titulo: e.target.value })}
              placeholder="Título de la referencia..."
              className="h-8 text-sm bg-background"
            />
          </div>
        }
        metadata={
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor={`${baseId}-autores`}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Autores
                </label>
                <Input
                  id={`${baseId}-autores`}
                  value={draft.autores || ""}
                  onChange={(e) => setEditedRef({ ...(editedRef || { ...referencia }), autores: e.target.value })}
                  placeholder="Ej: Doe J, Smith A"
                  className="h-8 text-sm bg-background"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor={`${baseId}-anio`}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Año
                </label>
                <Input
                  id={`${baseId}-anio`}
                  value={draft.año || ""}
                  onChange={(e) => setEditedRef({ ...(editedRef || { ...referencia }), año: e.target.value })}
                  placeholder="Ej: 2024"
                  className="h-8 text-sm bg-background"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor={`${baseId}-publicacion`}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Revista / Libro
                </label>
                <Input
                  id={`${baseId}-publicacion`}
                  value={draft.publicacion || ""}
                  onChange={(e) => setEditedRef({ ...(editedRef || { ...referencia }), publicacion: e.target.value })}
                  placeholder="Nombre de la fuente..."
                  className="h-8 text-sm bg-background"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor={`${baseId}-doi`}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  DOI
                </label>
                <Input
                  id={`${baseId}-doi`}
                  value={draft.doi || ""}
                  onChange={(e) => setEditedRef({ ...(editedRef || { ...referencia }), doi: e.target.value })}
                  placeholder="10.xxxx/yyyy"
                  className="h-8 text-sm bg-background"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor={`${baseId}-url`}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  URL
                </label>
                <Input
                  id={`${baseId}-url`}
                  value={draft.url || ""}
                  onChange={(e) => setEditedRef({ ...(editedRef || { ...referencia }), url: e.target.value })}
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
        }
      />
    );
  }

  return (
    <BaseRefCard
      index={index}
      title={
        <p className="text-sm font-medium leading-snug text-foreground">
          {referencia.titulo || <span className="italic text-muted">Sin título detectado</span>}
        </p>
      }
      metadata={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
          <MetaChip icon={Users}    label="Autores"  value={referencia.autores} />
          <MetaChip icon={Calendar} label="Año"      value={referencia.año} />
          <MetaChip icon={BookOpen} label="Revista"  value={referencia.publicacion} />
          {referencia.volumen && referencia.paginas && (
            <MetaChip icon={Hash} label="Vol/Pág" value={`${referencia.volumen} · ${referencia.paginas}`} />
          )}
        </div>
      }
      badges={
        <>
          {referencia.doi && (
            <Badge variant="default" className="text-[10px]">
              DOI · {referencia.doi}
            </Badge>
          )}
          {referencia.url && (
            <a
              href={referencia.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border bg-info/10 text-info border-info/25 hover:bg-info/20 transition-colors"
            >
              <Link2 className="h-2.5 w-2.5" /> URL
            </a>
          )}
        </>
      }
      actions={
        <>
          <button
            onClick={() => {
              setEditedRef({ ...referencia });
              setIsEditing(true);
            }}
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
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </>
      }
      expandibleContent={
        <div className={cn("overflow-hidden transition-all duration-200", open ? "max-h-40" : "max-h-0")}>
          <div className="mx-4 mb-3 rounded-md border border-border bg-surface-2 px-3 py-2">
            <p className="text-[11px] font-mono leading-relaxed text-muted">
              {referencia.raw || "—"}
            </p>
          </div>
        </div>
      }
    />
  );
}
