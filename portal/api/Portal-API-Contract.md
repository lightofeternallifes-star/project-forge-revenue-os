# Portal API Contract

The Portal API is a provider-agnostic command and query surface over the Digital Brain and Digital Employee Factory.

## Commands

| Command | Request | Response |
| --- | --- | --- |
| `forge employee create` | Employee Definition, request key | Generation job, manifest, validation report |
| `forge employee certify` | Employee ID, evidence manifest, decision | Certification assessment and new version |
| `forge employee promote` | Employee ID, promotion proposal, approvals | Promotion record and new version |
| `forge employee graduate` | Employee ID, executive decision | Graduation package and event |
| `forge employee deploy` | Employee ID, capability grants | Deployment decision and status |
| `forge employee audit` | Employee ID or organization scope | Audit report, issues, score |
| `forge employee archive` | Employee ID, retirement decision | Archive manifest and revocation record |
| `forge employee registry` | Registry query or append event | Registry record or transition result |

## HTTP Resource Shape

`GET /api/employees` returns `{ data, meta, errors }`.

`GET /api/employees/:employeeId` returns `{ data: CanonicalEmployee, meta, errors }`.

Commands return `{ data: JobOrDecision, meta: { request_id, version }, errors }`.

## Common Rules

- Every write requires an authenticated actor, request ID, policy version, and optimistic version.
- Every response includes canonical employee identity and current version when applicable.
- Commands are idempotent on request ID and employee version.
- Authorization is evaluated before factory or lifecycle execution.
- Errors include a stable code, human message, and remediation context.

## Mission Execution Resources

Mission commands use the same authenticated actor, request ID, version, and audit requirements:

`POST /api/missions` creates a mission; `/assign`, `/accept`, `/reject`, `/start`, `/pause`, `/resume`, `/complete`, `/cancel`, `/archive`, `/evidence`, `/report`, and `/review` execute controlled actions. `GET /api/missions` lists the live queue and `GET /api/execution/dashboard` returns working, waiting, blocked, completed, performance, revenue, and knowledge metrics.
