import { NextRequest, NextResponse } from "next/server";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationToken, signToken } from "@/lib/jwt";
import { UserDocument } from "@/types/user";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const name = searchParams.get("name") || "";

  if (!email) {
    return NextResponse.redirect(new URL("/login?status=error", req.url));
  }

  const db = await getDatabase();
  const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS);

  // 1. ¿Ya existe el usuario en tu MongoDB?
  let user = await usersCollection.findOne({ email });

  if (!user) {
    // 2. Si NO existe -> REGISTRO NUEVO
    const verificationToken = generateVerificationToken();
    const newUser: Omit<UserDocument, "_id"> = {
      email,
      password: "", // Sin password por ser de Google
      name,
      emailVerified: false, // BLOQUEADO hasta que confirme
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser as UserDocument);
    
    // USAMOS TU RESEND (Lo que ya tienes funcionando perfecto)
    await sendVerificationEmail(email, name, verificationToken);

    // Redirigimos a una página que muestre el mensaje de "Cuenta creada"
    // Pasamos el email para que se vea en la pantalla
    return NextResponse.redirect(
      new URL(`/login?status=verify-email&email=${encodeURIComponent(email)}`, req.url)
    );
  }

  // 3. Si existe pero NO está verificado -> BLOQUEADO
  if (!user.emailVerified) {
    return NextResponse.redirect(new URL("/login?status=pending-verification", req.url));
  }

  // 4. Si está verificado -> LOGIN EXITOSO (Le damos su token)
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