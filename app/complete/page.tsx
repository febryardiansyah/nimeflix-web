import type { Metadata } from "next";
import { Suspense } from "react";
import { getComplete, PAGE_SIZE } from "@/lib/api";
import { AnimeGrid, GridSkeleton } from "@/components/anime-card";
import {
  Container,
  EmptyState,
  PageHeader,
  Pagination,
  parsePage,
} from "@/components/ui";

export const metadata: Metadata = { title: "Anime Tamat" };

export default function CompletePage({ searchParams }: PageProps<"/complete">) {
  return (
    <Container>
      <PageHeader eyebrow="Siap maraton" title="Anime Tamat" jp="完結">
        Semua episode sudah rilis — tonton tanpa menunggu.
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
  searchParams: PageProps<"/complete">["searchParams"];
}) {
  const page = parsePage((await searchParams).page);
  const items = await getComplete(page);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Halaman kosong"
        hint="Tidak ada anime di halaman ini."
        href="/complete"
        action="Ke halaman 1"
      />
    );
  }
  return (
    <>
      <AnimeGrid items={items} />
      <Pagination
        basePath="/complete"
        page={page}
        hasNext={items.length >= PAGE_SIZE.list}
      />
    </>
  );
}
