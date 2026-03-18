import { ObjectId } from "mongodb";

// Modelo de usuario en MongoDB
export interface UserDocument {
  _id: ObjectId;
  email: string;
  password: string; // Hasheado con bcrypt
  name: string;
  emailVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Usuario público (sin datos sensibles) para el frontend
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
}

// Payload del JWT
export interface JWTPayload {
  userId: string;
  email: string;
}

// Datos de registro
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Datos de login
export interface LoginData {
  email: string;
  password: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
