import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  try {
    const store = getStore("news-cache");
    const data = await store.get("latest", { type: "json" });
    if (!data) {
      return Response.json(
        { error: "News not cached yet. Runs hourly." },
        { status: 404 }
      );
    }
    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=1800" },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

export const config: Config = { path: "/api/news" };
```

---

## After committing both files, verify your repo root has these exact files:
```
netlify.toml          ← in root
package.json          ← in root
public/
  index.html
  articles.json
netlify/
  functions/
    fetch-news.mts
    get-news.mts
