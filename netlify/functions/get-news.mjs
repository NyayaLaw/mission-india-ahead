import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const store = getStore("news-cache");
    const data = await store.get("latest", { type: "json" });
    if (!data) {
      return Response.json({ error: "News not cached yet. Runs hourly." }, { status: 404 });
    }
    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=1800" },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

export const config = { path: "/api/news" };
