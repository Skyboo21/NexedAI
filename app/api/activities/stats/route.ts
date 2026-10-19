// app/api/activities/stats/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "../../../../src/lib/server/authHelper";
import { getUserGamificationStats } from "../../../../src/lib/server/gamificationDb";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const stats = await getUserGamificationStats(user.id);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Gagal mengambil statistik aktivitas" },
      { status: 500 },
    );
  }
}
