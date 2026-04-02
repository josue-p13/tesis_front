import { RegisterData, LoginData, AuthResponse, User } from "@/types/user";

const API_BASE = "/api/auth";

// Registrar nuevo usuario
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

// Iniciar sesión
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // Importante para las cookies
  });

  return response.json();
}

// Cerrar sesión
export async function logout(): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return response.json();
}

// Obtener usuario actual
export async function getCurrentUser(): Promise<{
  success: boolean;
  user?: User;
  message?: string;
}> {
  const response = await fetch(`${API_BASE}/me`, {
    credentials: "include",
  });

  return response.json();
}

// Verificar email
export async function verifyEmail(
  token: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/verify-email?token=${token}`);
  return response.json();
}

export async function requestPasswordResetCode(
  email: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return response.json();
}

export async function resetPasswordWithCode(
  email: string,
  code: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, password }),
  });
  return response.json();
}
