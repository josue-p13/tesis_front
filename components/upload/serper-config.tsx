"use client";

import { Key, AlertCircle, CheckCircle2, Languages } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SerperConfigProps {
  usarSerper: boolean;
  apiKey: string;
  permitirTraduccion: boolean;
  onToggle: (val: boolean) => void;
  onKeyChange: (val: string) => void;
  onTraduccionToggle: (val: boolean) => void;
}

export function SerperConfig({
  usarSerper,
  apiKey,
  permitirTraduccion,
  onToggle,
  onKeyChange,
  onTraduccionToggle,
}: SerperConfigProps) {
  const isKeyValid = apiKey.length >= 32; // Serper keys suelen tener ~40 caracteres

  return (
    <div className="rounded-xl border border-border bg-surface px-5 py-4 space-y-3">
      {/* Toggle row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 border border-border">
            <Key className="h-3.5 w-3.5 text-muted" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Google Scholar</p>
            <p className="text-xs text-muted mt-0.5">
              Búsqueda adicional via{" "}
              <a
                href="https://serper.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Serper.dev
              </a>
              {" "}(opcional)
            </p>
          </div>
        </div>
        <Switch checked={usarSerper} onCheckedChange={onToggle} />
      </div>

      {/* API Key input (animated) */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          usarSerper ? "max-h-[250px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative">
          <Input
            type="password"
            placeholder="API Key de Serper (ej. abc123xyz...)"
            value={apiKey}
            onChange={(e) => onKeyChange(e.target.value)}
            className={cn(
              "pr-10 transition-colors",
              usarSerper && !apiKey && "border-amber-500/50 focus-visible:ring-amber-500/30",
              usarSerper && apiKey && isKeyValid && "border-green-500/50 focus-visible:ring-green-500/30",
              usarSerper && apiKey && !isKeyValid && "border-red-500/50 focus-visible:ring-red-500/30"
            )}
          />
          {usarSerper && apiKey && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isKeyValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        {usarSerper && !apiKey && (
          <p className="text-[10px] text-amber-600 mt-1.5 ml-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Necesitas una API Key para usar Google Scholar
          </p>
        )}
        {usarSerper && apiKey && !isKeyValid && (
          <p className="text-[10px] text-red-600 mt-1.5 ml-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            La llave parece demasiado corta o inválida
          </p>
        )}

        {/* Translation Toggle */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 border border-border">
                <Languages className="h-3.5 w-3.5 text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Búsqueda Profunda (Traducción)</p>
                <p className="text-[10px] text-muted mt-1">
                  Reintenta citas no encontradas traduciéndolas al inglés.
                </p>
              </div>
            </div>
            <Switch checked={permitirTraduccion} onCheckedChange={onTraduccionToggle} />
          </div>
          {permitirTraduccion && (
            <div className="mt-2.5 flex items-start gap-2 rounded-md bg-amber-500/5 border border-amber-500/20 p-2 text-[10px] text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
              <p>
                <b>Aviso:</b> Usar traducción al inglés puede consumir más búsquedas en la API de Serper (hasta un x2 en cada cita que no se encuentre).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
