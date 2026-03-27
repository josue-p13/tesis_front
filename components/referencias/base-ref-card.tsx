"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BaseRefCardProps {
  index: number | string;
  title: string | React.ReactNode;
  metadata: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  expandibleContent?: React.ReactNode;
  isEditing?: boolean;
  className?: string;
}

export function BaseRefCard({
  index,
  title,
  metadata,
  badges,
  actions,
  expandibleContent,
  isEditing,
  className,
}: BaseRefCardProps) {
  return (
    <div className={cn(
      "rounded-lg border transition-all duration-200",
      isEditing 
        ? "border-primary/50 bg-primary/5 shadow-md ring-1 ring-primary/20" 
        : "border-border bg-surface hover:border-border/80 hover:bg-surface-2/30",
      className
    )}>
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Número/Índice */}
        <span className="mt-1 shrink-0 text-xs font-mono text-muted w-6 text-right">
          {index}
        </span>

        {/* Contenido Principal */}
        <div className="min-w-0 flex-1 space-y-2">
          {title}
          {metadata}
          {badges && <div className="flex flex-wrap gap-1.5 pt-0.5">{badges}</div>}
        </div>

        {/* Acciones Laterales */}
        {actions && <div className="flex flex-col gap-1 mt-0.5">{actions}</div>}
      </div>

      {/* Contenido Expandible */}
      {expandibleContent}
    </div>
  );
}
