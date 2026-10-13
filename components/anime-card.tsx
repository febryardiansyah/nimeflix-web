import Link from "next/link";
import type { AnimeCard } from "@/lib/api";

/* Posters are hotlinked from the source site; a plain <img> avoids the
   image optimizer fetching (and failing on) third-party hosts. */
export function Poster({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={`h-full w-full object-cover transition-transform duration-500 ${className}`}
    />
  );
}

export function AnimeCardItem({
  anime,
  index = 0,
}: {
  anime: AnimeCard;
  index?: number;
}) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="card-link reveal group relative bg-panel"
      style={{ "--i": Math.min(index, 14) } as React.CSSProperties}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-panel-2">
        <Poster src={anime.thumb} alt={anime.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        {anime.episode && (
          <span className="stamp absolute left-2 top-2">{anime.episode}</span>
        )}
        {anime.score ? (
          <span className="absolute right-2 top-2 bg-ink/80 px-1.5 py-1 text-xs font-bold text-gold backdrop-blur">
            ★ {anime.score.toFixed(2)}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug sm:text-[0.95rem]">
            {anime.title}
          </h3>
          {(anime.note || anime.status || anime.studio) && (
            <p className="mt-1 truncate text-xs text-mute">
              {anime.note ?? anime.studio ?? anime.status}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function AnimeGrid({ items }: { items: AnimeCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((a, i) => (
        <AnimeCardItem key={a.id} anime={a} index={i} />
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div
      aria-hidden
      className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton aspect-[3/4]" />
      ))}
    </div>
  );
}
