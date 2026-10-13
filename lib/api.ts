import { cacheLife } from "next/cache";

function apiBase(): string {
  const base = process.env.API_BASE_URL?.trim();
  if (!base) {
    throw new Error(
      "API_BASE_URL is not set. Deploy https://github.com/febryardiansyah/nimeflix-api and set API_BASE_URL (e.g. http://localhost:3000/api) in .env.local — see .env.example.",
    );
  }
  return base.replace(/\/+$/, "");
}

export const PAGE_SIZE = { list: 25, genre: 15 } as const;

/* ----------------------------- public types ----------------------------- */

export type GenreTag = { id: string; name: string };

export type AnimeCard = {
  id: string;
  title: string;
  thumb: string;
  episode?: string;
  note?: string;
  score?: number | null;
  status?: string;
  studio?: string;
  season?: string;
  genres?: GenreTag[];
};

export type Genre = { id: string; name: string; image: string };

export type ScheduleDay = {
  day: string;
  anime: { id: string; title: string }[];
};

export type EpisodeRef = {
  id: string;
  title: string;
  label: string;
  uploadedOn: string;
};

export type AnimeDetail = {
  id: string;
  title: string;
  japanese: string;
  thumb: string;
  synopsis: string;
  score: number | null;
  producer: string;
  type: string;
  status: string;
  totalEpisode: string;
  duration: string;
  releaseDate: string;
  studio: string;
  genres: GenreTag[];
  episodes: EpisodeRef[];
  batchId: string | null;
};

export type DownloadGroup = {
  quality: string;
  size: string;
  links: { host: string; url: string }[];
};

export type MirrorGroup = {
  quality: string;
  hosts: { host: string; id: string }[];
};

export type EpisodeDetail = {
  id: string;
  title: string;
  prevId: string | null;
  nextId: string | null;
  mirrors: MirrorGroup[];
  downloads: DownloadGroup[];
  defaultStream: string | null;
};

export type BatchDetail = {
  title: string;
  downloads: DownloadGroup[];
};

/* ------------------------------ raw shapes ------------------------------ */

type Envelope<T> = { success: boolean; message: string; data: T };

type RawGenreTag = {
  genre_id: string;
  genre_name?: string;
  genre_title?: string;
};

type RawCard = {
  id: string;
  title?: string;
  anime_name?: string;
  thumb: string;
  episode?: string;
  uploaded_on?: string;
  day_updated?: string;
  score?: number | null;
  status?: string;
  studio?: string;
  release_date?: string;
  genre_list?: RawGenreTag[];
};

type RawDownload = {
  quality: string;
  size: string;
  download_links: { host: string; link: string }[];
};

/* -------------------------------- helpers ------------------------------- */

export function cleanId(id: string | null | undefined): string {
  return (id ?? "").replace(/^\/+|\/+$/g, "");
}

function fmtEpisode(raw?: string): string | undefined {
  if (!raw) return undefined;
  const m = raw.match(/^(\d+)\s*Episode$/i);
  return m ? `${m[1]} Eps` : raw;
}

export function cleanTitle(title: string): string {
  return title.replace(/\s*Subtitle Indonesia\s*$/i, "").trim();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, init);
  if (!res.ok) throw new Error(`API ${path} responded ${res.status}`);
  const json = (await res.json()) as Envelope<T>;
  if (!json.success) throw new Error(`API ${path}: ${json.message}`);
  return json.data;
}

const tag = (g: RawGenreTag): GenreTag => ({
  id: cleanId(g.genre_id),
  name: g.genre_name ?? g.genre_title ?? cleanId(g.genre_id),
});

function toCard(r: RawCard): AnimeCard {
  return {
    id: cleanId(r.id),
    title: cleanTitle(r.title ?? r.anime_name ?? ""),
    thumb: r.thumb,
    episode: fmtEpisode(r.episode),
    note: [r.day_updated, r.uploaded_on].filter(Boolean).join(" · ") || undefined,
    score: r.score ?? null,
    status: r.status,
    studio: r.studio,
    season: r.release_date,
    genres: r.genre_list?.map(tag),
  };
}

const toDownloads = (list?: Record<string, RawDownload | null>): DownloadGroup[] =>
  Object.values(list ?? {})
    .filter((d): d is RawDownload => !!d && d.download_links?.length > 0)
    .map((d) => ({
      quality: d.quality,
      size: d.size,
      links: d.download_links.map((l) => ({ host: l.host, url: l.link })),
    }));

/* ------------------------------- endpoints ------------------------------ */

export async function getHome() {
  "use cache";
  cacheLife("minutes");
  const d = await request<{ on_going: RawCard[]; complete: RawCard[] }>("/home");
  return {
    ongoing: d.on_going.map(toCard),
    complete: d.complete.map(toCard),
  };
}

export async function getOngoing(page: number) {
  "use cache";
  cacheLife("minutes");
  const d = await request<{ anime_list: RawCard[] }>(`/ongoing/page/${page}`);
  return d.anime_list.map(toCard);
}

export async function getComplete(page: number) {
  "use cache";
  cacheLife("minutes");
  const d = await request<{ anime_list: RawCard[] }>(`/complete/page/${page}`);
  return d.anime_list.map(toCard);
}

export async function getSchedule(): Promise<ScheduleDay[]> {
  "use cache";
  cacheLife("hours");
  const d = await request<{
    schedule_list: {
      day: string;
      anime_list: { id: string; anime_name: string }[];
    }[];
  }>("/schedule");
  return d.schedule_list.map((s) => ({
    day: s.day,
    anime: s.anime_list.map((a) => ({
      id: cleanId(a.id),
      title: cleanTitle(a.anime_name),
    })),
  }));
}

export async function getGenres(): Promise<Genre[]> {
  "use cache";
  cacheLife("days");
  const d = await request<{
    genre_list: { id: string; genre_name: string; image_link: string }[];
  }>("/genres");
  return d.genre_list.map((g) => ({
    id: cleanId(g.id),
    name: g.genre_name,
    image: g.image_link,
  }));
}

export async function getGenreAnime(id: string, page: number) {
  "use cache";
  cacheLife("hours");
  const d = await request<{ anime_list: RawCard[] }>(
    `/genres/${encodeURIComponent(id)}/page/${page}`,
  );
  return d.anime_list.map(toCard);
}

export async function searchAnime(query: string) {
  "use cache";
  cacheLife("minutes");
  const d = await request<{ search_results: RawCard[] }>(
    `/search/${encodeURIComponent(query)}`,
  );
  return d.search_results.map(toCard);
}

export async function getAnime(id: string): Promise<AnimeDetail | null> {
  "use cache";
  cacheLife("minutes");
  const d = await request<{
    anime_id: string;
    title?: string;
    japanese?: string;
    thumb?: string;
    synopsis?: string;
    score?: number | null;
    producer?: string;
    type?: string;
    status?: string;
    total_episode?: string | number | null;
    duration?: string;
    release_date?: string;
    studio?: string;
    genre_list?: RawGenreTag[];
    episode_list?: {
      id: string;
      title: string;
      uploaded_on: string;
    }[];
    batch_link?: { id: string | null };
  }>(`/anime/${encodeURIComponent(id)}`);

  if (!d.title) return null;

  return {
    id: cleanId(d.anime_id),
    title: cleanTitle(d.title),
    japanese: d.japanese ?? "",
    thumb: d.thumb ?? "",
    synopsis: d.synopsis?.trim() ?? "",
    score: d.score ?? null,
    producer: d.producer ?? "",
    type: d.type ?? "",
    status: d.status ?? "",
    totalEpisode: d.total_episode ? String(d.total_episode) : "",
    duration: d.duration ?? "",
    releaseDate: d.release_date ?? "",
    studio: d.studio ?? "",
    genres: (d.genre_list ?? []).map(tag),
    episodes: (d.episode_list ?? []).map((e) => {
      const num = e.title.match(/Episode\s+([\d.]+(?:\s*\(End\))?)/i)?.[1];
      return {
        id: cleanId(e.id),
        title: cleanTitle(e.title),
        label: num ? `Ep ${num.trim()}` : cleanTitle(e.title),
        uploadedOn: e.uploaded_on,
      };
    }),
    batchId: d.batch_link?.id ? cleanId(d.batch_link.id) : null,
  };
}

export async function getEpisode(id: string): Promise<EpisodeDetail | null> {
  "use cache";
  cacheLife("minutes");
  const d = await request<{
    id: string;
    title?: string;
    prev?: string;
    next?: string;
    mirrors?: {
      quality: string;
      mirror_list: { host: string; id: string }[];
    }[];
    download_list?: Record<string, RawDownload | null>;
    link_stream?: string;
    alternate_stream?: string;
  }>(`/eps/${encodeURIComponent(id)}`);

  if (!d.title) return null;

  const stream = [d.link_stream, d.alternate_stream].find((s) =>
    s?.startsWith("http"),
  );

  return {
    id,
    title: cleanTitle(d.title),
    prevId: cleanId(d.prev) || null,
    nextId: cleanId(d.next) || null,
    mirrors: (d.mirrors ?? [])
      .filter((m) => m.mirror_list.length > 0)
      .map((m) => ({ quality: m.quality, hosts: m.mirror_list })),
    downloads: toDownloads(d.download_list),
    defaultStream: stream ?? null,
  };
}

export async function getBatch(id: string): Promise<BatchDetail | null> {
  "use cache";
  cacheLife("hours");
  const d = await request<{
    title?: string;
    download_list?: Record<string, RawDownload | null>;
  }>(`/batch/${encodeURIComponent(id)}`);
  if (!d.title) return null;
  return { title: cleanTitle(d.title), downloads: toDownloads(d.download_list) };
}

/** Resolves a mirror to an embeddable URL. Never cached: links expire. */
export async function resolveMirror(
  episodeId: string,
  mirrorId: string,
): Promise<string | null> {
  const d = await request<{ stream_link?: string; link_stream?: string }>(
    `/eps/${encodeURIComponent(episodeId)}/mirror`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mirrorId }),
      cache: "no-store",
    },
  );
  const url = d.stream_link || d.link_stream;
  return url?.startsWith("http") ? url : null;
}
