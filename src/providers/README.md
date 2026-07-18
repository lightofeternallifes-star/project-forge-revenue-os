# Providers

## Purpose
Adapt external systems to stable Revenue OS capability contracts.

## Responsibilities
Own authentication adapters, request mapping, response normalization, rate limits, capability discovery, error translation, and observability.

## Inputs
Provider-neutral commands, tenant context, and future managed credentials.

## Outputs
Normalized entities, provider-neutral events, capability metadata, typed errors, and provenance.

## Future APIs
Provider registry, capability discovery, health checks, and ports for company search, enrichment, messaging, calendar, and model inference.

## Dependencies
Shared types and core ports only. Domain intelligence must not depend on a concrete provider.
