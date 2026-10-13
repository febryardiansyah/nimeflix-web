import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getGenreAnime, getGenres, PAGE_SIZE } from "@/lib/api";
import { AnimeGrid, GridSkeleton } from "@/components/anime-card";
import {
  Container,
  EmptyState,
  PageHeader,
  Pagination,
  parsePage,
} from "@/components/ui";

export const metadata: Metadata = { title: "Genre" };

export default function GenreDetailPage({
  params,
  searchParams,
}: PageProps<"/genres/[id]">) {
  return (
    <Container>
      <Suspense
        fallback={
          <>
            <div className="skeleton mb-10 h-28" />
            <GridSkeleton count={15} />
          </>
        }
      >
        <GenreList params={params} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function GenreList({
  params,
  searchParams,
}: Pick<PageProps<"/genres/[id]">, "params" | "searchParams">) {
  const { id } = await params;
  const page = parsePage((await searchParams).page);

  const [genres, items] = await Promise.all([
    getGenres(),
    getGenreAnime(id, page),
  ]);
  const genre = genres.find((g) => g.id === id);
  if (!genre) notFound();

  return (
    <>
      <PageHeader eyebrow="Genre" title={genre.name} jp="種類">
        Halaman {page}
      </PageHeader>
      {items.length === 0 ? (
        <EmptyState
          title="Halaman kosong"
          hint="Tidak ada anime di halaman ini."
          href={`/genres/${id}`}
          action="Ke halaman 1"
        />
      ) : (
        <>
          <AnimeGrid items={items} />
          <Pagination
            basePath={`/genres/${id}`}
            page={page}
            hasNext={items.length >= PAGE_SIZE.genre}
          />
        </>
      )}
    </>
  );
}
