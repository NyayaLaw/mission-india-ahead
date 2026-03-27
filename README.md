# Mission India Ahead — Self-Updating Site

## How it works

The site reads `articles.json` every time someone opens it.
To add a new article: **edit articles.json → push to GitHub → done**.
Netlify rebuilds in ~30 seconds. Any open browser tab refreshes automatically every 5 minutes.

---

## Adding a new article

Open `articles.json` and add a new entry inside the `"articles": [ ]` array.
Copy this template and fill in your details:

```json
{
  "id": 27,
  "title": "Your Article Title Here",
  "summary": "One or two sentence summary of what the article argues.",
  "pillar": "Law & Justice",
  "author": "Adv. Aditya Kashyap",
  "publication": "The Organiser",
  "date": "2026-03-28",
  "readTime": 8,
  "url": "https://organiser.org/your-article-url"
}
```

**Available pillar values (must match exactly):**
- Law & Justice
- Policy & Governance
- Culture & Civilisation
- Security & Strategy
- Technology
- Education
- Health
- Economy
- Governance
- Environment & Ecology

**Date format:** YYYY-MM-DD

**readTime:** estimated reading time in minutes

---

## Updating site stats

Open `articles.json` and update the `"meta"` block at the top:

```json
"meta": {
  "site": "Mission India Ahead",
  "pillars": 10,
  "contributors": 12
}
```

The article count is calculated **automatically** from the number of entries.

---

## Files

```
mission-india-ahead/
├── index.html        ← The site. Never needs to be edited.
├── articles.json     ← Your content database. Edit this to update the site.
└── README.md         ← This file.
```

---

## Deploying to Netlify

1. Push both files to a GitHub repository
2. Connect the repo to Netlify (Build command: none. Publish directory: `/`)
3. Every `git push` triggers an automatic redeploy in ~30 seconds

---

## Auto-refresh

The site polls `articles.json` every **5 minutes** while open in a browser.
This means visitors see new content without needing to refresh.
