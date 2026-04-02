import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendPasswordResetCodeEmail } from "@/lib/email";
import { UserDocument } from "@/types/user";

const CODE_TTL_MS = 5 * 60 * 1000;
const MIN_RESEND_MS = 60 * 1000;
const RESET_CODE_SECRET = process.env.JWT_SECRET || "";

function generate6DigitCode() {
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

function hashCode(code: string) {
  if (!RESET_CODE_SECRET) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
  }
  return crypto.createHmac("sha256", RESET_CODE_SECRET).update(code).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Datos inválidos" },
        { status: 400 }
      );
    }

    const email = validation.data.email;

    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS);
    const user = await usersCollection.findOne({ email });

    const now = new Date();

    if (user && user.emailVerified && (user.password || "")) {
      const lastSentAt = user.passwordResetCodeLastSentAt;
      const expiry = user.passwordResetCodeExpiry;

      if (
        lastSentAt instanceof Date &&
        expiry instanceof Date &&
        expiry.getTime() > now.getTime() &&
        now.getTime() - lastSentAt.getTime() < MIN_RESEND_MS
      ) {
        return NextResponse.json(
          {
            success: true,
            message:
              "Si existe una cuenta con ese correo, enviaremos un código para restablecerla.",
          },
          { status: 200 }
        );
      }

      const code = generate6DigitCode();
      const codeHash = hashCode(code);
      const codeExpiry = new Date(now.getTime() + CODE_TTL_MS);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetCodeHash: codeHash,
            passwordResetCodeExpiry: codeExpiry,
            passwordResetCodeAttempts: 0,
            passwordResetCodeLastSentAt: now,
            updatedAt: now,
          },
        }
      );

      const emailResult = await sendPasswordResetCodeEmail(
        email,
        user.name || "usuario",
        code
      );

      if (!emailResult.success) {
        console.error("Error enviando código de restablecimiento:", emailResult.error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Si existe una cuenta con ese correo, enviaremos un código para restablecerla.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en /api/auth/forgot-password:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
