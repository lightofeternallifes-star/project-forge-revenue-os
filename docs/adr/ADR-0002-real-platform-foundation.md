# ADR-0002: Establish the Real Platform Foundation

## Status

Accepted

## Context

The Mission 016 runtime used process-local state, a hardcoded demo credential, and a single unscoped workspace. Those boundaries were unsuitable for customer data, role-aware access, or durable organization operations.

## Decision

Introduce a platform and organization ownership model, password-hash authentication, explicit RBAC, organization provisioning services, scoped repositories, and file-backed authentication persistence. Keep the existing execution engine as the canonical mission runtime and adapt it through organization-owned records.

## Consequences

The portal now requires provisioned credentials. A first administrator is created only from deployment environment variables. Existing Carriersfy AI / Atlas records remain available as the internal organization. Durable production storage and external identity providers can replace the file-backed infrastructure behind the same service boundaries.
