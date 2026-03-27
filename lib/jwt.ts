import jwt from "jsonwebtoken";
import { JWTPayload } from "@/types/user";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

// Crear un JWT token (Node.js Runtime - para API routes)
export function signToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // Token válido por 7 días
  });
}

// Verificar y decodificar un JWT token (Node.js Runtime - para API routes)
export function verifyToken(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

// Verificar y decodificar un JWT token (Edge Runtime - para middleware)
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  if (!JWT_SECRET) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
  }
  
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Extraer los campos que necesitamos
    if (payload.userId && payload.email) {
      return {
        userId: payload.userId as string,
        email: payload.email as string,
      };
    }
    
    return null;
  } catch {
    return null;
  }
}

// Generar token aleatorio para verificación de email
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
