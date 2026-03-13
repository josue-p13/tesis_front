"use client";

import { Key } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface SerperConfigProps {
  usarSerper: boolean;
  apiKey: string;
  onToggle: (val: boolean) => void;
  onKeyChange: (val: string) => void;
}

export function SerperConfig({
  usarSerper,
  apiKey,
  onToggle,
  onKeyChange,
}: SerperConfigProps) {
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
          usarSerper ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Input
          type="password"
          placeholder="API Key de Serper (ej. abc123xyz...)"
          value={apiKey}
          onChange={(e) => onKeyChange(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
