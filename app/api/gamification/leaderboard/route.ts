// app/api/gamification/leaderboard/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "../../../../src/lib/server/authHelper";
import { getLiveLeaderboard } from "../../../../src/lib/server/gamificationDb";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    const leaderboard = await getLiveLeaderboard(user?.id);

    return NextResponse.json({
      success: true,
      data: leaderboard,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Gagal mengambil papan peringkat" },
      { status: 500 },
    );
  }
}
