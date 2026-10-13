import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAnime } from "@/lib/api";
import { Poster } from "@/components/anime-card";
import { Container } from "@/components/ui";

export async function generateMetadata({
  params,
}: PageProps<"/anime/[id]">): Promise<Metadata> {
  const anime = await getAnime((await params).id);
  return { title: anime?.title ?? "Anime" };
}

export default function AnimePage({ params }: PageProps<"/anime/[id]">) {
  return (
    <Suspense
      fallback={
        <Container>
          <div className="skeleton h-96" />
        </Container>
      }
    >
      <Detail params={params} />
    </Suspense>
  );
}

function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="border-l-2 border-line pl-3">
      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-mute">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

async function Detail({ params }: Pick<PageProps<"/anime/[id]">, "params">) {
  const anime = await getAnime((await params).id);
  if (!anime) notFound();

  const first = anime.episodes.at(-1);
  const latest = anime.episodes[0];

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="absolute inset-0 -z-10">
          <Poster
            src={anime.thumb}
            alt=""
            className="scale-125 blur-3xl saturate-150"
          />
          <div className="absolute inset-0 bg-ink/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[260px_1fr] md:py-16">
          <div className="reveal mx-auto w-52 md:w-full">
            <div className="aspect-[3/4] overflow-hidden border border-line bg-panel shadow-[8px_8px_0_var(--vermilion)]">
              <Poster src={anime.thumb} alt={anime.title} />
            </div>
          </div>

          <div className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {anime.status && <span className="stamp">{anime.status}</span>}
              {anime.type && (
                <span className="stamp stamp-outline">{anime.type}</span>
              )}
              {anime.score ? (
                <span className="font-bold text-gold">
                  ★ {anime.score.toFixed(2)}
                </span>
              ) : null}
            </div>

            <h1 className="font-display text-3xl leading-tight sm:text-5xl">
              {anime.title}
            </h1>
            {anime.japanese && (
              <p className="mt-2 text-sm tracking-wide text-mute">
                {anime.japanese}
              </p>
            )}

            {anime.genres.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {anime.genres.map((g) => (
                  <li key={g.id}>
                    <Link
                      href={`/genres/${g.id}`}
                      className="block border border-line px-3 py-1 text-xs font-bold transition-colors hover:border-vermilion hover:text-vermilion"
                    >
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-6 max-w-3xl leading-relaxed text-cream/80">
              {anime.synopsis || "Sinopsis belum tersedia."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {first && (
                <Link href={`/watch/${first.id}`} className="btn">
                  ▶ Mulai dari {first.label}
                </Link>
              )}
              {latest && latest.id !== first?.id && (
                <Link href={`/watch/${latest.id}`} className="btn btn-ghost">
                  Terbaru · {latest.label}
                </Link>
              )}
              {anime.batchId && (
                <Link href={`/batch/${anime.batchId}`} className="btn btn-ghost">
                  ⬇ Download Batch
                </Link>
              )}
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
              <Fact label="Studio" value={anime.studio} />
              <Fact label="Produser" value={anime.producer} />
              <Fact label="Rilis" value={anime.releaseDate} />
              <Fact label="Episode" value={anime.totalEpisode} />
              <Fact label="Durasi" value={anime.duration} />
            </dl>
          </div>
        </div>
      </section>

      <Container>
        <h2 className="mb-6 flex items-baseline gap-3 font-display text-2xl">
          <span className="inline-block h-6 w-1.5 -skew-x-12 bg-vermilion" />
          Daftar Episode
          <span className="text-sm text-mute">{anime.episodes.length}</span>
        </h2>
        {anime.episodes.length === 0 ? (
          <p className="text-mute">Belum ada episode.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {anime.episodes.map((ep) => (
              <li key={ep.id}>
                <Link
                  href={`/watch/${ep.id}`}
                  className="group flex items-center gap-4 border border-line bg-panel px-4 py-3 transition-colors hover:border-vermilion hover:bg-panel-2"
                >
                  <span className="font-display text-sm text-vermilion">
                    {ep.label}
                  </span>
                  <span className="ml-auto text-xs text-mute">
                    {ep.uploadedOn}
                  </span>
                  <span className="text-vermilion transition-transform group-hover:translate-x-1">
                    ▶
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
