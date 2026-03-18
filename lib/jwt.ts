import jwt from "jsonwebtoken";
import { JWTPayload } from "@/types/user";
import { SignJWT, jwtVerify } from "jose";

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
  } catch (error) {
    return null;
  }
}

// Crear un JWT token (Edge Runtime - para middleware)
export async function signTokenEdge(payload: JWTPayload): Promise<string> {
  if (!JWT_SECRET) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
  }
  
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
    
  return token;
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
  } catch (error) {
    console.error("[JWT] Error verifying token:", error);
    return null;
  }
}

// Generar token aleatorio para verificación de email
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
