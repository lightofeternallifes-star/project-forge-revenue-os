# Digital Brain Memory Model

## Memory Classes

| Class | Purpose | Default lifetime | Example |
| --- | --- | --- | --- |
| Working | Active step context for one task or workflow | Minutes to workflow completion | Current approval request |
| Episodic | Prior interaction or task outcome | Tenant policy, usually bounded | Previous conversation outcome |
| Semantic | Consolidated facts and relationships | Until superseded or invalidated | Company business model |
| Procedural | Approved policies and workflow guidance | Policy lifecycle | Qualification policy |
| Organizational | Shared tenant context | Tenant lifecycle and retention policy | ICP definition |

## Memory Record Requirements

Every Memory record has identity, organization scope, class, content reference, subject references, provenance, evidence, confidence, freshness, access policy, retention class, creation time, expiry or supersession, and the actor or process that wrote it.

## Read And Write Rules

- Working memory may be written by a workflow within its task scope.
- Semantic and procedural memory requires publication or approval by its owning engine.
- Digital Employees receive the minimum context needed for their task.
- Retrieval returns provenance, version, freshness, and access decision with context.
- Memory does not replace authoritative entity records, evidence, audit, or event history.
- Consolidation creates a new record linked to source memories; it never erases the source trail.

## Scale And Safety

Partition by organization and subject, separate hot working context from durable memory, support TTL and deletion, and keep retrieval indexes rebuildable from canonical records. Memory access is auditable and can be denied by field, purpose, region, or employee policy.
