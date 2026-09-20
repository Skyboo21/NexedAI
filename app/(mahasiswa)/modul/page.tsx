// app/(mahasiswa)/modul/page.tsx
import { Suspense } from "react";
import ModulCatalogueView from "../../../src/views/ModulCatalogueView";
import MahasiswaLoading from "../loading";

export const metadata = {
  title: "Modul Pembelajaran & AI Study Hub | NexedAI",
  description:
    "Katalog kurikulum terstruktur dan pemrosesan modul pembelajaran adaptif berbasis AI.",
};

export default function ModulCataloguePage() {
  return (
    <Suspense fallback={<MahasiswaLoading />}>
      <ModulCatalogueView />
    </Suspense>
  );
}
