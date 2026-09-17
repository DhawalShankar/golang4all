# golangforall.in

Go developer blog for the Indian dev community. Docusaurus frontend + Go
serverless API, single Vercel deployment. See `PRD.md` (project root, not
included here) for decisions and roadmap.

## Structure

- `docs/` — static long-form technical content (Git-tracked MDX)
- `src/pages/` — custom pages, incl. the admin panel (`admin.js`)
- `src/css/` — custom theme overrides
- `static/` — images/assets served as-is
- `api/` — Go serverless functions (`/api/*` on Vercel)
- `internal/db/` — shared Go DB connection helper, imported by `api/`
- `.env.example` — required environment variables, copy to `.env.local`

## Local dev

```
npm install
npm start          # Docusaurus dev server
vercel dev         # run Go functions locally alongside it
```
