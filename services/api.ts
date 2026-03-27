import type { ExtraerResponse, ValidarResponse, ReferenciaCruda } from "@/types/api";

const BASE_URL = "http://localhost:8000";

export async function extraerReferencias(
  pdf: File,
  serperApiKey: string,
  usarSerper: boolean
): Promise<ExtraerResponse> {
  const formData = new FormData();
  formData.append("pdf", pdf);
  formData.append("serper_api_key", serperApiKey);
  formData.append("usar_serper", String(usarSerper));

  const res = await fetch(`${BASE_URL}/documents/extraer`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const detail = errorData.detail || {};

    if (res.status === 403 && detail.code === "SERPER_AUTH_ERROR") {
      throw new Error(
        "La API key de Serper ingresada no existe o no tiene créditos disponibles. " +
        "Revisa tu key en serper.dev antes de intentarlo de nuevo."
      );
    }

    const errorMsg = typeof detail === "string" ? detail : (detail.message || JSON.stringify(detail));
    throw new Error(`Error ${res.status}: ${errorMsg || "Error desconocido"}`);
  }

  return res.json();
}

export async function validarReferencias(
  referencias: ReferenciaCruda[],
  serperApiKey: string,
  usarSerper: boolean
): Promise<ValidarResponse> {
  const res = await fetch(`${BASE_URL}/documents/validar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ referencias, serper_api_key: serperApiKey, usar_serper: usarSerper }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const detail = errorData.detail || {};

    if (res.status === 403 && detail.code === "SERPER_AUTH_ERROR") {
      throw new Error(
        "La API key de Serper ingresada no existe o no tiene créditos disponibles. " +
        "Revisa tu key en serper.dev antes de intentarlo de nuevo."
      );
    }

    const errorMsg = typeof detail === "string" ? detail : (detail.message || JSON.stringify(detail));
    throw new Error(`Error ${res.status}: ${errorMsg || "Error desconocido"}`);
  }

  return res.json();
}
