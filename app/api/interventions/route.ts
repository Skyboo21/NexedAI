// app/api/interventions/route.ts
import { NextResponse } from "next/server";

export interface InterventionPayload {
  studentName: string;
  type: "Catatan Dosen" | "Penugasan Remedial" | "Jadwal Asistensi Lab";
  message: string;
  lecturerName?: string;
}

const INTERVENTIONS_DB: (InterventionPayload & { id: string; timestamp: string })[] = [];

export async function POST(request: Request) {
  try {
    const body: InterventionPayload = await request.json();

    if (!body.studentName || !body.message || !body.type) {
      return NextResponse.json(
        {
          success: false,
          message: "Data intervensi tidak lengkap.",
        },
        { status: 400 },
      );
    }

    const record = {
      id: `inv-${Date.now()}`,
      studentName: body.studentName,
      type: body.type,
      message: body.message,
      lecturerName: body.lecturerName || "Dr. Ir. Hendra Wijaya, M.Kom.",
      timestamp: new Date().toISOString(),
    };

    INTERVENTIONS_DB.unshift(record);

    return NextResponse.json(
      {
        success: true,
        message: `Intervensi berhasil dikirim ke portal ${body.studentName}!`,
        data: record,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memproses intervensi.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INTERVENTIONS_DB,
  });
}
