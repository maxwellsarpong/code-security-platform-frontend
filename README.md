# Code Security Platform

Monorepo for the code security platform frontend:

- **`apps/landing`** – Marketing landing page with **checkout** (`/checkout`) and **sign-in** (`/login`). Billing CTAs go to checkout; “Go to dashboard” goes to the auth page. After sign-in, redirects to the dashboard app (set `VITE_DASHBOARD_URL` in `apps/landing/.env`; see `apps/landing/.env.example`).
- **`apps/dashboard`** – Platform dashboard (post-login).

## Quick start

```bash
# Install dependencies (from repo root)
npm install

# Run both landing and dashboard apps concurrently
npm run dev

# Or run individually:
npm run dev:landing  # Landing page only
npm run dev:dashboard  # Dashboard only
```

## Build

```bash
npm run build          # build both apps
npm run build:landing  # landing only
npm run build:dashboard # dashboard only
```

## Structure

```
security-compliance-frontend/
├── apps/
│   ├── landing/     # Vue 3 landing page + billing
│   └── dashboard/   # Vue 3 dashboard app
├── package.json
└── README.md
```
