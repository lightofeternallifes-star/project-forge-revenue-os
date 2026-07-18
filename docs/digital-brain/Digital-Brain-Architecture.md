# Digital Brain Architecture

## Mission

The Digital Brain is the permanent enterprise domain model of PROJECT FORGE Revenue OS™. It is the single language spoken by all engines and Digital Employees.

## Principles

1. **Single source of truth:** each canonical entity has one ownership boundary.
2. **Everything has provenance:** material values identify where and when they came from.
3. **Everything has evidence:** facts, inferences, scores, and recommendations link to support or are explicitly marked unknown.
4. **Every change is auditable:** mutations, access, approvals, and policy decisions produce audit records.
5. **Every object has identity:** stable internal IDs are separate from provider identifiers.
6. **Every object is versioned:** published states are immutable and historical states remain explainable.
7. **No provider owns business data:** providers supply capabilities and observations; the Digital Brain owns canonical meaning.
8. **Digital Employees communicate through contracts:** employees use typed entities, commands, events, memory, evidence, and permissions.
9. **Facts are separate from inferences:** derived conclusions never overwrite source observations.
10. **Trust is a platform capability:** privacy, least privilege, retention, residency, and reversibility are domain requirements.

## Layers

- **Identity layer:** Organization, User, and tenant-scoped identifiers.
- **Business layer:** Company, Contact, Lead, Opportunity, Proposal, Appointment, Campaign, and Revenue Event.
- **Interaction layer:** Conversation, Task, and Notification.
- **Intelligence layer:** Research Session, Knowledge Record, Evidence Record, and Memory.
- **Control layer:** Digital Employee, Workflow, Permission, and Audit Record.
- **Contract layer:** shared types, versioned events, lifecycle rules, and provider-neutral APIs.

## Canonical Flow

Authorized observations become Evidence Records. Evidence and user-approved context become Knowledge Records or entity observations. Domain engines create or update canonical entities. Workflows coordinate state transitions. Digital Employees propose bounded work. Revenue Events capture outcomes. Memory supplies scoped context. Audit Records preserve accountability. No provider response bypasses this flow into business data.

## Scale Boundary

The model is designed for millions of companies through tenant and entity partitioning, immutable event streams, asynchronous commands, resumable bulk operations, derived read models, field-level freshness, regional data controls, and schema compatibility gates. Entity ownership remains logical even when storage is physically sharded.

## Operating Rule

An engine is complete only when it can operate entirely through Digital Brain entities and contracts. Direct access from an engine to a named provider, model, CRM, channel, or vendor-owned business record is an architectural violation.
