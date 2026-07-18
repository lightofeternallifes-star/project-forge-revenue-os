# PROJECT FORGE Revenue OS — Phase I MVP

## Delivered

- Responsive Revenue OS dashboard with overview, pipeline, customer timeline, AI insights, executive view, and settings.
- In-memory authenticated session foundation with secure HTTP-only session cookie behavior.
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

Demo login: `admin@projectforge.local` / `forge-demo`.

## Known limitations

- Persistence is in-memory and resets on restart.
- Authentication is a foundation/demo, not production identity management.
- AI insights are deterministic Phase I rules; no model provider is connected.
- No external CRM, email, calendar, or provider integration is enabled.
- No multi-tenant authorization or persistent audit store is included yet.

## Next sprint

1. Add a persistent database behind the existing store boundary.
2. Add tenant-aware authentication and authorization.
3. Add provider-neutral CRM import with evidence and reconciliation.
4. Add event persistence and an auditable activity stream.
5. Add contract tests for the first approved provider adapter.
