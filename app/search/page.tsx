import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { searchAnime } from "@/lib/api";
import { GridSkeleton, Poster } from "@/components/anime-card";
import { Container, EmptyState, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Pencarian" };

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Container>
      <Suspense fallback={<GridSkeleton count={5} />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function Results({
  searchParams,
}: {
  searchParams: PageProps<"/search">["searchParams"];
}) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : (raw ?? "")).trim().slice(0, 100);

  if (q.length < 2) {
    return (
      <>
        <PageHeader eyebrow="Pencarian" title="Cari Anime" jp="探す" />
        <EmptyState
          title="Ketik minimal 2 huruf"
          hint="Gunakan kolom pencarian di atas."
        />
      </>
    );
  }

  const results = await searchAnime(q);

  return (
    <>
      <PageHeader eyebrow="Hasil pencarian" title={`“${q}”`} jp="探す">
        {results.length} anime ditemukan
      </PageHeader>
      {results.length === 0 ? (
        <EmptyState
          title="Tidak ada hasil"
          hint="Coba kata kunci lain atau jelajahi genre."
          href="/genres"
          action="Lihat genre"
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {results.map((a, i) => (
            <li
              key={a.id}
              className="reveal"
              style={{ "--i": Math.min(i, 12) } as React.CSSProperties}
            >
              <Link
                href={`/anime/${a.id}`}
                className="card-link flex gap-4 border border-line bg-panel p-3"
              >
                <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden bg-panel-2">
                  <Poster src={a.thumb} alt="" />
                </div>
                <div className="min-w-0 py-1">
                  <h3 className="line-clamp-2 font-bold leading-snug">
                    {a.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-mute">
                    {a.status && (
                      <span className="stamp stamp-outline">{a.status}</span>
                    )}
                    {a.score ? (
                      <span className="font-bold text-gold">
                        ★ {a.score.toFixed(2)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-mute">
                    {a.genres?.map((g) => g.name).join(" · ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
