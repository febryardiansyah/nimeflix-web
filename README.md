# NIMEFLIX

Anime streaming site built with Next.js 16 (App Router, Cache Components) and Tailwind CSS 4. All data comes from the [nimeflix-api](https://github.com/febryardiansyah/nimeflix-api) scraper API, which you need to run yourself.

## Setup

1. Deploy the API: clone [nimeflix-api](https://github.com/febryardiansyah/nimeflix-api), follow its README, and start it (default `http://localhost:3000`).
2. Point this app at it:

   ```bash
   cp .env.example .env.local
   # edit API_BASE_URL, e.g. http://localhost:3000/api
   ```

   If the API runs on port 3000, start this app on another port (`npm run dev -- -p 3001`).

3. Run:

   ```bash
   npm install
   npm run dev
   npm run build && npm start
   ```

`API_BASE_URL` is required (include the `/api` prefix). The app fails with a clear error if it is missing. When deploying, set it as an environment variable on your host; it is only read on the server and never sent to the browser.

## Routes

| Route | API used |
| --- | --- |
| `/` | `/api/home` |
| `/ongoing?page=n`, `/complete?page=n` | `/api/ongoing/page/:n`, `/api/complete/page/:n` |
| `/genres`, `/genres/[id]?page=n` | `/api/genres`, `/api/genres/:id/page/:n` |
| `/schedule` | `/api/schedule` |
| `/search?q=` | `/api/search/:query` |
| `/anime/[id]` | `/api/anime/:id` |
| `/watch/[id]` | `/api/eps/:id` |
| `/batch/[id]` | `/api/batch/:id` |
| `/api/mirror?episode=&mirror=` | proxies `POST /api/eps/:id/mirror` |

API calls run on the server only, and responses are cached with `use cache` + `cacheLife`. Mirror links are resolved on demand and never cached.

## Disclaimer

Educational project. Not affiliated with Otakudesu; all anime content belongs to its respective owners/licensors.
