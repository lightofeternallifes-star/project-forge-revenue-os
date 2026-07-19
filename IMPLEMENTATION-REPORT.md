# PROJECT FORGE Revenue OS — Real Platform Foundation

## Delivered

- Responsive Revenue OS dashboard with overview, pipeline, customer timeline, AI insights, executive view, and settings.
- Password-hash authentication with secure HTTP-only session cookies, roles, tenant scope, and environment-controlled bootstrap.
- Pipeline management: create opportunities, stage updates, probability, owner, and value.
- KPI engine: active pipeline, weighted pipeline, won revenue, win rate, deal size, and coverage.
- Evidence-first AI revenue insights using deterministic rules with evidence and confidence values.
- Customer timeline and executive readout surfaces.
- Dependency-free Node runtime suitable for local development and later adapter replacement.
- Automated domain tests and syntax/build checks.

## Run

```bash
npm install
npm run build
npm test
npm start
```

Open `http://localhost:3000`.

Configure `FORGE_BOOTSTRAP_EMAIL` and `FORGE_BOOTSTRAP_PASSWORD` before first administration.

## Known limitations

- Authentication records persist through the file-backed repository boundary; deploy production secrets and storage controls before customer launch.
- External identity providers and distributed session storage remain adapter substitutions behind the auth service.
- AI insights are deterministic Phase I rules; no model provider is connected.
- No external CRM, email, calendar, or provider integration is enabled.
- Tenant-scoped authorization and organization provisioning are implemented; managed database and distributed audit persistence remain infrastructure substitutions.

## Next sprint

1. Add a persistent database behind the existing store boundary.
2. Add tenant-aware authentication and authorization.
3. Add provider-neutral CRM import with evidence and reconciliation.
4. Add event persistence and an auditable activity stream.
5. Add contract tests for the first approved provider adapter.
