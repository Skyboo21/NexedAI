// app/(mahasiswa)/dashboard/page.tsx
import { Suspense } from "react";
import StudentDashboard from "../../../src/views/StudentDashboard";
import MahasiswaLoading from "../loading";

export const metadata = {
  title: "Dashboard Mahasiswa | NexedAI - Adaptive Learning Platform",
  description: "Pusat monitoring capaian pembelajaran adaptif D3 Teknik Informatika SV UNS.",
};

export default function MahasiswaDashboardPage() {
  return (
    <Suspense fallback={<MahasiswaLoading />}>
      <StudentDashboard />
    </Suspense>
  );
}
