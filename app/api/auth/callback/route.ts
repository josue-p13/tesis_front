import { NextRequest, NextResponse } from "next/server";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationToken, signToken } from "@/lib/jwt";
import { UserDocument } from "@/types/user";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const name = searchParams.get("name") || "";
  const mode = searchParams.get("mode") || "login"; // "login" o "register"

  if (!email) {
    return NextResponse.redirect(new URL("/login?status=error", req.url));
  }

  const db = await getDatabase();
  const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS);

  // 1. ¿Ya existe el usuario en tu MongoDB?
  const user = await usersCollection.findOne({ email });

  // CASO A: El usuario NO existe
  if (!user) {
    // Si intentaba hacer LOGIN pero no existe -> Error: "No tienes cuenta"
    if (mode === "login") {
      return NextResponse.redirect(new URL("/login?status=notfound", req.url));
    }

    // Si intentaba hacer REGISTER -> Lo creamos
    const verificationToken = generateVerificationToken();
    const newUser: Omit<UserDocument, "_id"> = {
      email,
      password: "", // Sin password por ser OAuth
      name,
      emailVerified: false, 
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser as UserDocument);
    await sendVerificationEmail(email, name, verificationToken);

    return NextResponse.redirect(
      new URL(`/login?status=verify-email&email=${encodeURIComponent(email)}`, req.url)
    );
  }

  // CASO B: El usuario SÍ existe
  if (mode === "register") {
    return NextResponse.redirect(new URL("/login?status=already-exists", req.url));
  }

  // Si intentaba hacer LOGIN
  if (!user.emailVerified) {
    // Mantener el flujo original: exigir verificación por correo
    return NextResponse.redirect(new URL("/login?status=pending-verification", req.url));
  }

  // LOGIN EXITOSO
  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
  });

  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
