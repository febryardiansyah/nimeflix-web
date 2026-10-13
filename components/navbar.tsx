import Link from "next/link";
import { NavLinks } from "./nav-links";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2 font-display text-xl tracking-tight"
        >
          <span>
            NIME<span className="text-vermilion">FLIX</span>
          </span>
          <span
            aria-hidden
            className="hidden text-[0.6rem] tracking-[0.3em] text-mute transition-colors group-hover:text-gold sm:inline"
          >
            アニメ
          </span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hide-scrollbar ml-2 hidden items-center overflow-x-auto md:flex"
        >
          <NavLinks />
        </nav>

        <form
          action="/search"
          role="search"
          className="ml-auto flex w-full max-w-xs items-center border border-line bg-panel transition-colors focus-within:border-vermilion"
        >
          <label htmlFor="q" className="sr-only">
            Cari anime
          </label>
          <input
            id="q"
            name="q"
            type="search"
            required
            minLength={2}
            placeholder="Cari anime…"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-mute focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Cari"
            className="px-3 text-mute transition-colors hover:text-vermilion"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </form>
      </div>

      <nav
        aria-label="Navigasi utama (mobile)"
        className="hide-scrollbar flex overflow-x-auto border-t border-line px-2 md:hidden"
      >
        <NavLinks />
      </nav>
    </header>
  );
}
