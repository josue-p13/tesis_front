"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface OAuthButtonsProps {
  mode: "login" | "register";
  isLoading?: boolean;
}

export function OAuthButtons({ mode, isLoading }: OAuthButtonsProps) {
  const handleGoogleAction = () => {
    window.location.href = `http://localhost:8000/auth/${mode}/google`;
  };

  const handleMicrosoftAction = () => {
    window.location.href = `http://localhost:8000/auth/${mode}/microsoft`;
  };

  const label = mode === "login" ? "Continuar con" : "Registrarse con";

  return (
    <div className="grid grid-cols-1 gap-3">
      <Button
        variant="outline"
        type="button"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleAction}
        disabled={isLoading}
      >
        <Image src="/google.svg" alt="Google" width={16} height={16} />
        {label} Google
      </Button>

      <Button
        variant="outline"
        type="button"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleMicrosoftAction}
        disabled={isLoading}
      >
        <Image src="/microsoft.svg" alt="Microsoft" width={16} height={16} />
        {label} Microsoft
      </Button>
    </div>
  );
}
