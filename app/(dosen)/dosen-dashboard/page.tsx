// app/(dosen)/dosen-dashboard/page.tsx
import { Suspense } from "react";
import DosenDashboard from "../../../src/views/DosenDashboard";
import DosenLoading from "../loading";

export const metadata = {
  title: "Dashboard Analitik Dosen | NexedAI - Portal Pengajar",
  description: "Monitoring performa komputasional dan deteksi dini risiko mahasiswa D3 TI SV UNS.",
};

export default function DosenDashboardPage() {
  return (
    <Suspense fallback={<DosenLoading />}>
      <DosenDashboard />
    </Suspense>
  );
}
