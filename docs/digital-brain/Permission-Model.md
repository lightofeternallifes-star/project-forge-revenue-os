# Digital Brain Permission Model

## Permission Dimensions

Every decision evaluates organization, actor, role, resource, action, field classification, purpose, region, consent, workflow context, and policy version.

## Actions

`discover`, `read`, `search`, `create`, `propose`, `approve`, `execute`, `assign`, `export`, `share`, `redact`, `delete`, `retain`, `audit`, and `administer` are distinct actions. Read permission never implies execute or export permission.

## Actors

Actors are User, Digital Employee, system workflow, provider adapter, or platform operator. Every actor has a stable identity and all privileged actions are audited.

## Rules

- Organization is the default isolation boundary.
- Least privilege applies to entity, field, action, purpose, geography, and time.
- Digital Employees receive capability grants, not broad user impersonation.
- Provider adapters receive only the data and action needed for the requested capability.
- Cross-organization sharing requires an explicit, expiring grant.
- Evidence, memory, conversations, contact channels, proposals, and audit records may have stricter classifications.
- Denials are observable and produce Audit Records without exposing protected content.
