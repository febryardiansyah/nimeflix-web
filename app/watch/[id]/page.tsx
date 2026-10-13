import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getEpisode } from "@/lib/api";
import { Downloads } from "@/components/downloads";
import { Player } from "@/components/player";
import { Container } from "@/components/ui";

export async function generateMetadata({
  params,
}: PageProps<"/watch/[id]">): Promise<Metadata> {
  const ep = await getEpisode((await params).id);
  return { title: ep?.title ?? "Tonton" };
}

export default function WatchPage({ params }: PageProps<"/watch/[id]">) {
  return (
    <Container className="max-w-5xl">
      <Suspense
        fallback={
          <>
            <div className="skeleton mb-6 h-10 w-2/3" />
            <div className="skeleton aspect-video" />
          </>
        }
      >
        <Watch params={params} />
      </Suspense>
    </Container>
  );
}

async function Watch({ params }: Pick<PageProps<"/watch/[id]">, "params">) {
  const { id } = await params;
  const ep = await getEpisode(id);
  if (!ep) notFound();

  return (
    <>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-vermilion">
        Sedang menonton
      </p>
      <h1 className="mb-8 font-display text-2xl leading-tight sm:text-4xl">
        {ep.title}
      </h1>

      <Player
        key={id}
        episodeId={id}
        mirrors={ep.mirrors}
        defaultStream={ep.defaultStream}
      />

      <nav
        aria-label="Navigasi episode"
        className="mt-6 flex items-center justify-between gap-4"
      >
        {ep.prevId ? (
          <Link href={`/watch/${ep.prevId}`} className="btn btn-ghost">
            ← Episode sebelumnya
          </Link>
        ) : (
          <span />
        )}
        {ep.nextId ? (
          <Link href={`/watch/${ep.nextId}`} className="btn">
            Episode berikutnya →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <section className="mt-14">
        <h2 className="mb-5 flex items-baseline gap-3 font-display text-xl">
          <span className="inline-block h-5 w-1.5 -skew-x-12 bg-vermilion" />
          Download
        </h2>
        <Downloads groups={ep.downloads} />
      </section>
    </>
  );
}
