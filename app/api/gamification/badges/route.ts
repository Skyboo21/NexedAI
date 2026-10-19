// app/api/gamification/badges/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "../../../../src/lib/server/authHelper";
import { getBadgesWithStatus } from "../../../../src/lib/server/gamificationDb";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    const badges = await getBadgesWithStatus(user?.id);

    return NextResponse.json({
      success: true,
      data: badges,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Gagal mengambil daftar lencana" },
      { status: 500 },
    );
  }
}
