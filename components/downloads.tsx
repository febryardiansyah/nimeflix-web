import type { DownloadGroup } from "@/lib/api";

export function Downloads({ groups }: { groups: DownloadGroup[] }) {
  if (groups.length === 0) {
    return <p className="text-sm text-mute">Link download belum tersedia.</p>;
  }
  return (
    <div className="divide-y divide-line border border-line bg-panel">
      {groups.map((g) => (
        <div
          key={g.quality}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
        >
          <div className="sm:w-44">
            <p className="font-display text-sm">{g.quality}</p>
            <p className="text-xs text-mute">{g.size}</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {g.links.map((l) => (
              <li key={l.host + l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block border border-line px-3 py-1.5 text-xs font-bold transition-colors hover:border-vermilion hover:bg-vermilion hover:text-ink"
                >
                  {l.host}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
