# Digital Brain Contract

## Scope

This contract governs communication among Revenue OS engines. It is the normative companion to the Digital Brain entity catalog and does not implement storage, transport, APIs, or business logic.

## Required Entity Envelope

Every entity has an opaque identity, organization scope, lifecycle state, schema version, entity version, timestamps, provenance references, evidence references, retention class, data classification, and audit references.

## Required Mutation Context

Every mutation identifies actor, purpose, policy version, correlation ID, idempotency key, requested version, and authorization decision. A mutation either publishes a new immutable version or produces an explicit rejection.

## Provider Boundary

Providers can produce observations or execute capabilities through Provider Router. They cannot define canonical fields, lifecycle semantics, ownership, permission meaning, or business truth.

## Engine Boundary

An engine may own only the data listed in its domain contract. It communicates with other engines through canonical entities, typed references, events, Knowledge Records, Evidence Records, Memory, Workflows, and Audit Records.
