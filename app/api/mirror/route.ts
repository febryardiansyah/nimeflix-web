import { resolveMirror } from "@/lib/api";

const ID_PATTERN = /^[\w-]{1,200}$/;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const episode = params.get("episode") ?? "";
  const mirror = params.get("mirror") ?? "";

  if (!ID_PATTERN.test(episode) || !ID_PATTERN.test(mirror)) {
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const url = await resolveMirror(episode, mirror);
    if (!url) {
      return Response.json({ error: "Mirror not available" }, { status: 404 });
    }
    return Response.json({ url }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "Upstream error" }, { status: 502 });
  }
}
