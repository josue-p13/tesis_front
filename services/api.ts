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
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
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
    const text = await res.text();

    const esErrorSerper =
      res.status === 500 &&
      /serper|api.?key|401|403/i.test(text);

    if (esErrorSerper) {
      throw new Error(
        "La API key de Serper ingresada no existe o no tiene créditos disponibles. " +
        "Revisa tu key en serper.dev antes de intentarlo de nuevo."
      );
    }

    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}
