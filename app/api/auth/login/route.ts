import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { loginSchema } from "@/lib/validation";
import { signToken } from "@/lib/jwt";
import { UserDocument, User } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    // Parse y validar el body
    const body = await req.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Conectar a la base de datos
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS);

    // Buscar usuario por email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Credenciales inválidas",
        },
        { status: 401 }
      );
    }

    // Verificar que el email esté verificado
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.",
        },
        { status: 403 }
      );
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Credenciales inválidas",
        },
        { status: 401 }
      );
    }

    // Crear JWT
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Preparar datos del usuario (sin información sensible)
    const userResponse: User = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
    };

    // Crear la respuesta con cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Inicio de sesión exitoso",
        user: userResponse,
      },
      { status: 200 }
    );

    // Establecer cookie httpOnly con el JWT
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Cambiado de "strict" a "lax" para permitir navegación
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error en /api/auth/login:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
