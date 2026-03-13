"use client";

import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";

const ESTADO_CONFIG: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
  "VERIFICADA":                          { variant: "success",   label: "Verificada" },
  "VERIFICADA (BD)":                     { variant: "success",   label: "Verificada · BD" },
  "VERIFICADA (BD por score)":           { variant: "success",   label: "Verificada · score" },
  "ENCONTRADA_POR_TITULO":               { variant: "info",      label: "Por título" },
  "ENCONTRADA_POR_TITULO (DOI fallido)": { variant: "info",      label: "Por título (DOI fallido)" },
  "ENCONTRADA_GOOGLE_SCHOLAR":           { variant: "info",      label: "Google Scholar" },
  "DOI_NO_ENCONTRADO":                   { variant: "warning",   label: "DOI no encontrado" },
  "REFERENCIA_WEB":                      { variant: "secondary", label: "Referencia web" },
  "URL_NO_ACCESIBLE":                    { variant: "danger",    label: "URL no accesible" },
  "NO_ENCONTRADA":                       { variant: "danger",    label: "No encontrada" },
  "SIN_DATOS_PARA_BUSCAR":               { variant: "muted",     label: "Sin datos" },
};

export function EstadoBadge({ estado }: { estado: string }) {
  const config = ESTADO_CONFIG[estado] ?? { variant: "outline" as const, label: estado };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
