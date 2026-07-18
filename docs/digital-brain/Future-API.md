# Digital Brain Future API Contract

## Contract Shape

Future APIs expose provider-neutral commands, queries, subscriptions, and batch jobs. Each request includes organization scope, actor, purpose, policy context, correlation ID, idempotency key where mutating, requested version, and field-selection or pagination controls.

## Entity Operations

- `create(entityType, attributes)`
- `get(entityType, entityId, version?)`
- `search(entityType, filter, page, sort)`
- `propose(entityType, changeSet)`
- `approve(changeId)`
- `publish(entityType, version)`
- `compare(entityType, fromVersion, toVersion)`
- `archive(entityType, entityId)`

## Cross-Cutting Operations

- `relationships.list(entityId, relationshipType?)`
- `events.subscribe(eventType, organizationScope)`
- `evidence.get(evidenceRefs)`
- `memory.retrieve(query, scope)`
- `permissions.evaluate(actor, action, resource)`
- `audit.query(resource, timeRange)`
- `bulk.submit(operation, records)`

## Response Requirements

Responses include canonical IDs, entity or event versions, freshness, confidence, provenance references, evidence references, policy decision, correlation ID, and partial-failure details where applicable.

## Error Contract

Errors distinguish invalid input, unauthorized, forbidden, not found, conflict, stale version, unsupported contract, rate limit, dependency unavailable, policy denial, and retention or residency violation. Errors never expose provider-specific internals as domain semantics.
