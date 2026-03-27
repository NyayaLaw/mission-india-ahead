import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  try {
    const store = getStore("news-cache");
    const data = await store.get("latest", { type: "json" });

    if (!data) {
      return Response.json({ error: "No news cached yet. The scheduled function runs every 6 hours." }, { status: 404 });
    }

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=1800", // cache for 30 min on CDN
      },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/news",
};
