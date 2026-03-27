import React from "react";
import { LucideIcon } from "lucide-react";

interface MetaChipProps {
  icon: LucideIcon;
  label: string;
  value?: string | number;
  className?: string;
}

export function MetaChip({
  icon: Icon,
  label,
  value,
  className,
}: MetaChipProps) {
  if (value === undefined || value === null || value === "") return null;
  
  return (
    <div className={`flex items-center gap-1.5 text-xs text-muted min-w-0 ${className || ""}`}>
      <Icon className="h-3 w-3 shrink-0" />
      <span className="font-medium text-foreground/70 shrink-0">{label}:</span>
      <span className="truncate" title={String(value)}>{value}</span>
    </div>
  );
}
