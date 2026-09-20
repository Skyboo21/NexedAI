// app/(mahasiswa)/dashboard/page.tsx
import { Suspense } from "react";
import NexedLeaderboard from "../../../src/components/NexedLeaderboard";
import StudentDashboard from "../../../src/views/StudentDashboard";
import MahasiswaLoading from "../loading";

export const metadata = {
  title: "Dashboard Mahasiswa | NexedAI - Adaptive Learning Platform",
  description: "Pusat monitoring capaian pembelajaran adaptif D3 Teknik Informatika SV UNS.",
};

export default function MahasiswaDashboardPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<MahasiswaLoading />}>
        <StudentDashboard />
      </Suspense>
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <NexedLeaderboard />
      </div>
    </div>
  );
}
