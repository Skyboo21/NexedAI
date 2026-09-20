// app/api/mastery/route.ts
import { NextResponse } from "next/server";
import { fetchStudentMasteryApi } from "../../../src/services/apiService";

export async function GET() {
  try {
    const data = await fetchStudentMasteryApi();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memuat matriks penguasaan.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
