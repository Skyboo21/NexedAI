// app/(admin)/admin-dashboard/page.tsx
import { Suspense } from "react";
import AdminDashboardView from "../../../src/views/AdminDashboardView";
import AdminLoading from "../loading";

export const metadata = {
  title: "Panel Administrator | NexedAI - Pusat Kontrol RBAC",
  description: "Pengelolaan otorisasi peran pengguna dan telemetri kinerja toolchain modern.",
};

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminDashboardView />
    </Suspense>
  );
}
