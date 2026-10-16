import type { Metadata } from "next";
import Link from "next/link";
import { io } from "next/cache";
import { Suspense } from "react";
import { getGenres } from "@/lib/api";
import { Poster } from "@/components/anime-card";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Genre" };

export default function GenresPage() {
  return (
    <Container>
      <PageHeader eyebrow="Jelajahi" title="Genre" jp="種類">
        Pilih genre favoritmu dan temukan tontonan berikutnya.
      </PageHeader>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="skeleton aspect-[16/9]" />
            ))}
          </div>
        }
      >
        <GenreGrid />
      </Suspense>
    </Container>
  );
}

async function GenreGrid() {
  // Excludes this fetch from the build-time prerender (the API isn't reachable
  // from the build environment) while keeping it cached at request time.
  await io();
  const genres = await getGenres();
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {genres.map((g, i) => (
        <Link
          key={g.id}
          href={`/genres/${g.id}`}
          className="card-link reveal group relative aspect-[16/9] overflow-hidden bg-panel"
          style={{ "--i": Math.min(i, 14) } as React.CSSProperties}
        >
          <Poster
            src={g.image}
            alt=""
            className="opacity-60 grayscale transition duration-500 group-hover:opacity-90 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <span className="absolute bottom-3 left-3 font-display text-lg leading-none sm:text-xl">
            {g.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
