# Portal Architecture Review

## Decision

Use the existing dependency-free Node HTTP runtime and browser modules as the first Portal implementation. Keep portal presentation separate from canonical runtime domain and factory contracts.

## Layers

Canonical model, service/API adapter, view model, route controller, reusable components, and browser state.

## Scale Path

The API contract supports replacement of the in-memory store with a durable multi-tenant store, event bus, policy service, artifact store, and observability layer without changing Portal screen contracts.

## Risks

The current runtime is a single-process demo foundation. Authentication, persistence, authorization, audit storage, and background execution require production infrastructure before external use.
