import { z } from "zod";

// Schema para registro
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
});

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "La contraseña es requerida"),
});

// Schema para verificación de email
export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token de verificación requerido"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .trim(),
});

export const resetPasswordWithCodeSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  code: z
    .string()
    .regex(/^\d{6}$/, "El código debe tener 6 dígitos"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo"
    ),
});
