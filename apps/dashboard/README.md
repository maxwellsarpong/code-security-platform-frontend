# SecureCode Dashboard

Platform dashboard for the code security product. Post-login app for:

- Scans & findings
- Repos & integrations
- Billing & usage
- Team & settings

## Run locally

```bash
# From repo root
npm run dev:dashboard

# Or from this folder
npm run dev
```

Runs at [http://localhost:5174](http://localhost:5174) by default.

## Build

```bash
npm run build
```

## Next steps

- Add Vue Router for dashboard routes
- Add auth (e.g. OAuth / session)
- Add API client for backend
- Build out scan results, repo list, billing views, settings
