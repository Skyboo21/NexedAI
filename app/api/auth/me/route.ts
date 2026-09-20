// app/api/auth/me/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../../../../src/lib/server/sessionToken";
import { findUserByIdentifier } from "../../../../src/lib/server/userRegistry";

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies?.get?.("nexed_session_token")?.value;
    if (!token) {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(/nexed_session_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 401 },
      );
    }

    // Retrieve fresh user info from server registry
    const userRecord = await findUserByIdentifier(session.email);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.sub,
        email: session.email,
        name: userRecord?.name || session.name,
        role: session.role,
        nimOrNip: userRecord?.nimOrNip || session.nimOrNip,
        semester: userRecord?.semester,
        prodi: userRecord?.prodi,
      },
    });
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 401 },
    );
  }
}
