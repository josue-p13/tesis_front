"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function HeaderUser() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 text-sm">
        <User className="h-4 w-4 text-muted" />
        <span className="text-foreground">{user.name}</span>
      </div>
      <Button
        onClick={logout}
        variant="ghost"
        size="sm"
        className="h-8 gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Cerrar sesión</span>
      </Button>
    </div>
  );
}
