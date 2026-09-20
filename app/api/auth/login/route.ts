// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { signSessionToken } from "../../../../src/lib/server/sessionToken";
import { verifyUserCredentials } from "../../../../src/lib/server/userRegistry";
import { LoginInputSchema } from "../../../../src/lib/validations/authSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = LoginInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Format identitas atau kata sandi tidak valid.",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email: identifier, password, rememberMe } = parseResult.data;

    // Verify against secure server user registry
    const verifiedUser = await verifyUserCredentials(identifier, password);

    if (!verifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email / Username atau Kata Sandi salah.",
        },
        { status: 401 },
      );
    }

    // Generate cryptographically signed HMAC-SHA256 session token
    const tokenMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const sessionToken = await signSessionToken({
      sub: verifiedUser.id,
      email: verifiedUser.email,
      role: verifiedUser.role,
      name: verifiedUser.name,
      nimOrNip: verifiedUser.nimOrNip,
      exp: Date.now() + tokenMaxAge,
    });

    const response = NextResponse.json({
      success: true,
      message: "Otentikasi berhasil. Selamat datang kembali!",
      user: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        name: verifiedUser.name,
        role: verifiedUser.role,
        nimOrNip: verifiedUser.nimOrNip,
        semester: verifiedUser.semester,
        prodi: verifiedUser.prodi,
      },
    });

    // Set HttpOnly, Secure, Lax session cookie
    response.cookies.set("nexed_session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(tokenMaxAge / 1000),
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal server.";
    return NextResponse.json(
      {
        success: false,
        message: errorMsg,
      },
      { status: 500 },
    );
  }
}
