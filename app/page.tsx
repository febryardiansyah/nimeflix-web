import Link from "next/link";
import { io } from "next/cache";
import { Suspense } from "react";
import { getHome } from "@/lib/api";
import { AnimeGrid, GridSkeleton, Poster } from "@/components/anime-card";
import { Container, SectionHeading } from "@/components/ui";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Home />
    </Suspense>
  );
}

async function Home() {
  // Excludes this fetch from the build-time prerender (the API isn't reachable
  // from the build environment) while keeping it cached at request time.
  await io();
  const { ongoing, complete } = await getHome();
  const hero = ongoing[0];

  return (
    <>
      {hero && (
        <section className="relative isolate overflow-hidden border-b border-line">
          <div aria-hidden className="absolute inset-0 -z-10">
            <Poster
              src={hero.thumb}
              alt=""
              className="scale-125 blur-3xl saturate-150"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
          </div>
          <span
            aria-hidden
            className="vert pointer-events-none absolute right-4 top-6 hidden select-none font-display text-7xl leading-none tracking-widest text-cream/[0.06] lg:block"
          >
            新着アニメ
          </span>

          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_280px] md:py-20 lg:grid-cols-[1fr_320px]">
            <div className="reveal">
              <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-vermilion">
                <span className="h-px w-10 bg-vermilion" />
                Baru rilis · {hero.note}
              </p>
              <h1 className="font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
                {hero.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {hero.episode && (
                  <span className="stamp stamp-outline text-xs">
                    {hero.episode}
                  </span>
                )}
                <span className="text-sm text-mute">
                  Subtitle Indonesia · Ongoing
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={`/anime/${hero.id}`} className="btn">
                  ▶ Tonton sekarang
                </Link>
                <Link href="/ongoing" className="btn btn-ghost">
                  Semua ongoing
                </Link>
              </div>
            </div>

            <Link
              href={`/anime/${hero.id}`}
              className="card-link reveal order-first mx-auto w-48 bg-panel md:order-none md:w-full"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <Poster src={hero.thumb} alt={hero.title} />
              </div>
            </Link>
          </div>
        </section>
      )}

      <Container>
        <section>
          <SectionHeading title="Sedang Tayang" jp="放送中" href="/ongoing" />
          <AnimeGrid items={ongoing} />
        </section>

        <section className="mt-20">
          <SectionHeading title="Baru Tamat" jp="完結" href="/complete" />
          <AnimeGrid items={complete} />
        </section>
      </Container>
    </>
  );
}

function HomeSkeleton() {
  return (
    <>
      <div className="skeleton h-[28rem] border-b border-line" />
      <Container>
        <div className="skeleton mb-6 h-8 w-56" />
        <GridSkeleton />
      </Container>
    </>
  );
}
