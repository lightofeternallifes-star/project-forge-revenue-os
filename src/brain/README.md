# Digital Brain

## Purpose

The Digital Brain is the canonical enterprise intelligence layer for PROJECT FORGE Revenue OS™. It provides the shared language through which every revenue engine, workflow, and Digital Employee communicates.

## Responsibilities

- Define canonical entities, identifiers, relationships, lifecycle states, events, permissions, evidence, memory, and versioning.
- Keep business data independent from providers, models, channels, storage engines, and user interfaces.
- Make provenance, evidence, auditability, tenant isolation, and policy context mandatory parts of material decisions.
- Provide stable contracts for domain engines and future Digital Employees.

## Inputs

Authorized observations, user actions, workflow events, research findings, provider-neutral capability results, policy decisions, outcomes, and feedback.

## Outputs

Canonical entities, immutable versions, evidence links, memory records, domain events, permission decisions, audit records, and read models.

## Future APIs

Entity commands and queries, relationship queries, event subscriptions, evidence retrieval, memory retrieval, permission evaluation, and audit-trail queries. See `docs/digital-brain/Future-API.md`.

## Dependencies

Shared identity, authorization, retention, storage, event, and observability ports. The Digital Brain must never import Explee, Apollo, Clay, OpenAI, Gemini, HubSpot, Salesforce, or any other provider.

## Non-Goals

This directory contains no implementation, business logic, provider adapter, model prompt, UI, or automation.
