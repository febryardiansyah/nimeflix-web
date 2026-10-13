import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  jp,
  children,
}: {
  eyebrow?: string;
  title: string;
  jp?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative mb-10 overflow-hidden border-b border-line pb-8">
      {jp && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[7rem] leading-none text-cream/[0.04] sm:text-[10rem]"
        >
          {jp}
        </span>
      )}
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-vermilion">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl leading-tight sm:text-6xl">
        {title}
      </h1>
      {children && <div className="mt-4 text-mute">{children}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  jp,
  href,
}: {
  title: string;
  jp?: string;
  href?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="flex items-baseline gap-3 font-display text-2xl sm:text-3xl">
        <span className="inline-block h-6 w-1.5 -skew-x-12 bg-vermilion" />
        {title}
        {jp && (
          <span aria-hidden className="text-xs tracking-[0.3em] text-mute">
            {jp}
          </span>
        )}
      </h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-bold text-mute transition-colors hover:text-vermilion"
        >
          Lihat semua →
        </Link>
      )}
    </div>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  href,
  action,
}: {
  title: string;
  hint?: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="border border-dashed border-line px-6 py-20 text-center">
      <p className="font-display text-5xl text-cream/10" aria-hidden>
        空
      </p>
      <p className="mt-4 font-display text-xl">{title}</p>
      {hint && <p className="mt-2 text-sm text-mute">{hint}</p>}
      {href && (
        <Link href={href} className="btn mt-6">
          {action ?? "Kembali"}
        </Link>
      )}
    </div>
  );
}

export function Pagination({
  basePath,
  page,
  hasNext,
}: {
  basePath: string;
  page: number;
  hasNext: boolean;
}) {
  const sep = basePath.includes("?") ? "&" : "?";
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}${sep}page=${p}`);
  return (
    <nav
      aria-label="Paginasi"
      className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} className="btn btn-ghost">
          ← Sebelumnya
        </Link>
      ) : (
        <span />
      )}
      <span className="font-display text-sm text-mute">
        HALAMAN <span className="text-cream">{page}</span>
      </span>
      {hasNext ? (
        <Link href={href(page + 1)} className="btn">
          Berikutnya →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

export function parsePage(raw: string | string[] | undefined): number {
  const n = Number.parseInt(Array.isArray(raw) ? raw[0] : (raw ?? ""), 10);
  return Number.isFinite(n) && n >= 1 && n <= 500 ? n : 1;
}
