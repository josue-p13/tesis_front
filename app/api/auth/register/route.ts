import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { registerSchema } from "@/lib/validation";
import { generateVerificationToken } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/email";
import { UserDocument } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    // Parse y validar el body
    const body = await req.json();
    const validationResult = registerSchema.safeParse(body);

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

    const { name, email, password } = validationResult.data;

    // Conectar a la base de datos
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS);

    // Verificar si el email ya existe
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Este correo electrónico ya está registrado",
        },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar token de verificación
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Crear el usuario
    const newUser: Omit<UserDocument, "_id"> = {
      email,
      password: hashedPassword,
      name,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser as UserDocument);

    if (!result.insertedId) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al crear el usuario",
        },
        { status: 500 }
      );
    }

    // Enviar email de verificación
    const emailResult = await sendVerificationEmail(
      email,
      name,
      verificationToken
    );

    if (!emailResult.success) {
      console.error("Error enviando email de verificación:", emailResult.error);
      // No fallamos el registro si el email falla, pero lo registramos
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Cuenta creada exitosamente. Por favor revisa tu correo electrónico para verificar tu cuenta.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en /api/auth/register:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
