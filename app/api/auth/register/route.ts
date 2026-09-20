// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { signSessionToken } from "../../../../src/lib/server/sessionToken";
import { registerServerUser } from "../../../../src/lib/server/userRegistry";
import { RegisterInputSchema } from "../../../../src/lib/validations/authSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = RegisterInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Data pendaftaran tidak valid.",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parseResult.data;

    // Register securely on server registry
    const newUser = await registerServerUser({
      name: data.name,
      email: data.email,
      role: data.role,
      nimOrNip: data.nimOrNip,
      password: data.password,
      semester: data.semester,
      prodi: data.prodi,
    });

    // Create session token for immediate login
    const tokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    const sessionToken = await signSessionToken({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      nimOrNip: newUser.nimOrNip,
      exp: Date.now() + tokenMaxAge,
    });

    const response = NextResponse.json({
      success: true,
      message: "Pendaftaran akun berhasil!",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        nimOrNip: newUser.nimOrNip,
        semester: newUser.semester,
        prodi: newUser.prodi,
      },
    });

    response.cookies.set("nexed_session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(tokenMaxAge / 1000),
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan pendaftaran.";
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
