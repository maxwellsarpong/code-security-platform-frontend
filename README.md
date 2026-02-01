# Code Security Platform

Monorepo for the code security platform frontend:

- **`apps/landing`** – Marketing landing page (billing, pricing, sign-up).
- **`apps/dashboard`** – Platform dashboard (post-login).

## Quick start

```bash
# Install dependencies (from repo root)
npm install

# Run landing page
npm run dev:landing

# Run dashboard (when built out)
npm run dev:dashboard
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
