import { NextRequest, NextResponse } from "next/server";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { verifyEmailSchema } from "@/lib/validation";
import { UserDocument } from "@/types/user";

export async function GET(req: NextRequest) {
  try {
    // Obtener token de los query params
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    // Validar el token
    const validationResult = verifyEmailSchema.safeParse({ token });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Token de verificación inválido",
        },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS);

    // Buscar usuario con el token
    const user = await usersCollection.findOne({
      verificationToken: token,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Token de verificación inválido o expirado",
        },
        { status: 404 }
      );
    }

    // Verificar si el token ha expirado
    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "El token de verificación ha expirado",
        },
        { status: 410 }
      );
    }

    // Verificar si el email ya está verificado
    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: true,
          message: "Tu correo electrónico ya ha sido verificado",
        },
        { status: 200 }
      );
    }

    // Actualizar usuario: marcar como verificado y limpiar token
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: true,
          updatedAt: new Date(),
        },
        $unset: {
          verificationToken: "",
          verificationTokenExpiry: "",
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Correo electrónico verificado exitosamente. Ya puedes iniciar sesión.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en /api/auth/verify-email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
