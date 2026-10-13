import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl">
            NIME<span className="text-vermilion">FLIX</span>
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
            Proyek edukasi yang menampilkan data dari otakudesu.blog melalui
            REST API tidak resmi. Seluruh konten anime adalah milik pemegang
            hak ciptanya masing-masing.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute">
          <Link href="/ongoing" className="hover:text-cream">
            Ongoing
          </Link>
          <Link href="/complete" className="hover:text-cream">
            Tamat
          </Link>
          <Link href="/genres" className="hover:text-cream">
            Genre
          </Link>
          <Link href="/schedule" className="hover:text-cream">
            Jadwal
          </Link>
        </nav>
      </div>
    </footer>
  );
}
