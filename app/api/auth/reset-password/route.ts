import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { resetPasswordWithCodeSchema } from "@/lib/validation";
import { UserDocument } from "@/types/user";

const MAX_ATTEMPTS = 5;
const RESET_CODE_SECRET = process.env.JWT_SECRET || "";

function hashCode(code: string) {
  if (!RESET_CODE_SECRET) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
  }
  return crypto.createHmac("sha256", RESET_CODE_SECRET).update(code).digest("hex");
}

function safeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  if (a.length % 2 !== 0) return false;
  if (!/^[0-9a-f]+$/i.test(a)) return false;
  if (!/^[0-9a-f]+$/i.test(b)) return false;
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = resetPasswordWithCodeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Datos inválidos" },
        { status: 400 }
      );
    }

    const { email, code, password } = validation.data;

    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS);
    const user = await usersCollection.findOne({ email });

    const now = new Date();
    const genericError = { success: false, message: "Código inválido o expirado" };

    if (!user || !user.emailVerified || !(user.password || "")) {
      return NextResponse.json(genericError, { status: 400 });
    }

    const storedHash = user.passwordResetCodeHash || "";
    const storedExpiry = user.passwordResetCodeExpiry;

    if (!storedHash || !(storedExpiry instanceof Date) || storedExpiry.getTime() <= now.getTime()) {
      return NextResponse.json(genericError, { status: 400 });
    }

    const incomingHash = hashCode(code);
    const matches = safeEqualHex(storedHash, incomingHash);

    if (!matches) {
      const nextAttempts = (user.passwordResetCodeAttempts || 0) + 1;
      if (nextAttempts >= MAX_ATTEMPTS) {
        await usersCollection.updateOne(
          { _id: user._id },
          {
            $unset: {
              passwordResetCodeHash: "",
              passwordResetCodeExpiry: "",
              passwordResetCodeAttempts: "",
              passwordResetCodeLastSentAt: "",
            },
            $set: { updatedAt: now },
          }
        );
      } else {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { passwordResetCodeAttempts: nextAttempts, updatedAt: now } }
        );
      }

      return NextResponse.json(genericError, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword, updatedAt: now },
        $unset: {
          passwordResetCodeHash: "",
          passwordResetCodeExpiry: "",
          passwordResetCodeAttempts: "",
          passwordResetCodeLastSentAt: "",
        },
      }
    );

    return NextResponse.json(
      { success: true, message: "Contraseña actualizada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en /api/auth/reset-password:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
