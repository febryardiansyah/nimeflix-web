import type { Metadata } from "next";
import { Suspense } from "react";
import { getOngoing, PAGE_SIZE } from "@/lib/api";
import { AnimeGrid, GridSkeleton } from "@/components/anime-card";
import {
  Container,
  EmptyState,
  PageHeader,
  Pagination,
  parsePage,
} from "@/components/ui";

export const metadata: Metadata = { title: "Anime Ongoing" };

export default function OngoingPage({ searchParams }: PageProps<"/ongoing">) {
  return (
    <Container>
      <PageHeader eyebrow="Update tiap hari" title="Sedang Tayang" jp="放送中">
        Episode terbaru dari anime yang masih berjalan musim ini.
      </PageHeader>
      <Suspense fallback={<GridSkeleton count={15} />}>
        <List searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function List({
  searchParams,
}: {
  searchParams: PageProps<"/ongoing">["searchParams"];
}) {
  const page = parsePage((await searchParams).page);
  const items = await getOngoing(page);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Halaman kosong"
        hint="Tidak ada anime di halaman ini."
        href="/ongoing"
        action="Ke halaman 1"
      />
    );
  }
  return (
    <>
      <AnimeGrid items={items} />
      <Pagination
        basePath="/ongoing"
        page={page}
        hasNext={items.length >= PAGE_SIZE.list}
      />
    </>
  );
}
