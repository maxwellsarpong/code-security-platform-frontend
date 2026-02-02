# SecureCode Dashboard

Platform dashboard for the code security product.

## Features

- **Overview** – Stats, recent scans, critical findings
- **Scans** – List and filter scan runs (passed/failed), run new scans
- **Repositories** – Connected repos, last scan status, open issues
- **Billing** – Current plan, usage, payment method, invoices
- **Settings** – Organization, team members, danger zone

## Run locally

```bash
# From repo root
npm run dev:dashboard

# Or from this folder
npm run dev
```

Runs at [http://localhost:5174](http://localhost:5174).

## Build

```bash
npm run build
```

## Tech

- Vue 3 (Composition API)
- Vue Router 4
- Vite 5
- Same design tokens as landing (dark theme, cyan accent, DM Sans, JetBrains Mono)

## Next steps

- Add auth (OAuth / session) and protect routes
- Connect to real API for scans, repos, billing
- Add scan detail view (route `/scans/:id`)
- Add repo settings / webhook config
