# Real Platform Foundation

Mission 017 upgrades PROJECT FORGE Revenue OS from a single-workspace runtime to a tenant-aware SaaS foundation.

## Ownership Hierarchy

`Platform -> Organization -> User -> Digital Employee -> Mission -> Evidence / Knowledge / Metrics`

Every persisted resource carries `platformId` where applicable and `organizationId`. Reads are scoped through `visibleRecords`; a `SUPER_ADMIN` may inspect all organizations, while company users can only access their organization. New records inherit the authenticated organization context.

## Application Boundaries

- **Domain:** `platform-domain.mjs`, employee, mission, contract, evidence, and knowledge models.
- **Application:** `tenant-service.mjs`, `provisioning-service.mjs`, `knowledge-repository.mjs`, `dashboard-service.mjs`.
- **Infrastructure:** `auth-service.mjs` and file-backed `data/auth.json` persistence.
- **Presentation:** the existing HTTP API and portal frontend consume scoped service results.
- **Execution:** the existing mission and Digital Employee engines remain the only execution path.

## Authentication

Passwords are salted and derived with scrypt. Passwords are never stored or returned. First platform administration is configured through `FORGE_BOOTSTRAP_EMAIL`, `FORGE_BOOTSTRAP_PASSWORD`, and optional `FORGE_BOOTSTRAP_NAME`; organization provisioning requires `FORGE_PROVISIONING_KEY`. Provider replacement belongs behind the auth service contract.

## Provisioning

`POST /api/platform/provision` creates an Organization, Company Admin, first Digital Employee, knowledge foundation record, and mission queue. The endpoint is protected by the provisioning key and cannot be invoked from the portal UI.

## RBAC

Roles are `SUPER_ADMIN`, `COMPANY_ADMIN`, `STAFF`, and `VIEWER`. Authorization is checked at the server boundary before mutations; tenant filtering is applied before resource lookup, preventing cross-organization access by guessed IDs.
