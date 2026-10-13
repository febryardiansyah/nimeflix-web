"use client";

import { useEffect, useState } from "react";
import type { MirrorGroup } from "@/lib/api";

type Source = { quality: string; host: string; id: string };

export function Player({
  episodeId,
  mirrors,
  defaultStream,
}: {
  episodeId: string;
  mirrors: MirrorGroup[];
  defaultStream: string | null;
}) {
  const sources: Source[] = mirrors.flatMap((m) =>
    m.hosts.map((h) => ({ quality: m.quality, host: h.host, id: h.id })),
  );
  const qualities = mirrors.map((m) => m.quality);

  const [quality, setQuality] = useState(qualities[0]);
  const [selected, setSelected] = useState<string | null>(
    sources[0]?.id ?? null,
  );
  const [state, setState] = useState<{
    key: string | null;
    url: string | null;
    error: boolean;
  }>({ key: null, url: defaultStream, error: false });

  const loading = selected !== null && state.key !== selected;

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ episode: episodeId, mirror: selected });

    fetch(`/api/mirror?${query}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { url: string }) =>
        setState({ key: selected, url: d.url, error: false }),
      )
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setState({ key: selected, url: null, error: true });
      });

    return () => controller.abort();
  }, [episodeId, selected]);

  if (sources.length === 0 && !defaultStream) {
    return (
      <div className="flex aspect-video items-center justify-center border border-line bg-panel px-6 text-center text-mute">
        Streaming belum tersedia untuk episode ini. Gunakan link download di
        bawah.
      </div>
    );
  }

  const visible = sources.filter((s) => s.quality === quality);

  return (
    <div>
      <div className="relative aspect-video overflow-hidden border border-line bg-black shadow-[8px_8px_0_var(--vermilion)]">
        {state.url && !loading ? (
          <iframe
            key={state.url}
            src={state.url}
            title="Pemutar video"
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-mute">
            {loading ? (
              <span className="skeleton absolute inset-0" />
            ) : (
              "Mirror ini tidak tersedia. Coba mirror lain."
            )}
            {loading && (
              <span className="relative font-display">MEMUAT…</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 border border-line bg-panel p-4 sm:flex-row sm:items-center sm:gap-8">
        {qualities.length > 0 && (
          <div role="group" aria-label="Kualitas">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-mute">
              Kualitas
            </p>
            <div className="flex gap-2">
              {qualities.map((q) => (
                <button
                  key={q}
                  type="button"
                  aria-pressed={q === quality}
                  onClick={() => {
                    setQuality(q);
                    const first = sources.find((s) => s.quality === q);
                    if (first) setSelected(first.id);
                  }}
                  className={`px-3 py-1.5 font-display text-xs transition-colors ${
                    q === quality
                      ? "bg-vermilion text-ink"
                      : "border border-line hover:border-cream"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {visible.length > 0 && (
          <div role="group" aria-label="Mirror">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-mute">
              Mirror
            </p>
            <div className="flex flex-wrap gap-2">
              {visible.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={s.id === selected}
                  onClick={() => setSelected(s.id)}
                  className={`px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                    s.id === selected
                      ? "bg-cream text-ink"
                      : "border border-line hover:border-cream"
                  }`}
                >
                  {s.host}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.url && !loading && (
          <a
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-mute underline-offset-4 hover:text-vermilion hover:underline sm:ml-auto"
          >
            Buka di tab baru ↗
          </a>
        )}
      </div>
    </div>
  );
}
