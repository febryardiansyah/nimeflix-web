import type { Metadata } from "next";
import Link from "next/link";
import { io } from "next/cache";
import { Suspense } from "react";
import { getSchedule } from "@/lib/api";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Jadwal Rilis" };

export default function SchedulePage() {
  return (
    <Container>
      <PageHeader eyebrow="Mingguan" title="Jadwal Rilis" jp="予定">
        Kapan anime favoritmu tayang setiap pekannya.
      </PageHeader>
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton h-72" />
            ))}
          </div>
        }
      >
        <Days />
      </Suspense>
    </Container>
  );
}

async function Days() {
  // Excludes this fetch from the build-time prerender (the API isn't reachable
  // from the build environment) while keeping it cached at request time.
  await io();
  const days = await getSchedule();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {days.map((d, i) => (
        <section
          key={d.day}
          className="reveal border border-line bg-panel"
          style={{ "--i": i } as React.CSSProperties}
        >
          <header className="flex items-center justify-between border-b border-line bg-panel-2 px-4 py-3">
            <h2 className="font-display text-xl">{d.day}</h2>
            <span className="stamp stamp-outline">{d.anime.length} anime</span>
          </header>
          <ul className="max-h-80 divide-y divide-line overflow-y-auto">
            {d.anime.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/anime/${a.id}`}
                  className="block px-4 py-2.5 text-sm text-cream/80 transition-colors hover:bg-vermilion hover:text-ink"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
