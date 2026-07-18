# PROJECT FORGE Revenue OS™ Architecture

## Status

Mission 004 foundation. This document defines production-oriented boundaries and future contracts; it does not describe implemented runtime behavior.

## System Layers

1. **Experience and control plane:** future human and administrative surfaces for approvals, policy, configuration, and audit review. UI is outside this mission.
2. **Core runtime:** orchestrator, workflows, memory ports, and event contracts coordinate work without owning provider details.
3. **Intelligence layer:** companies, contacts, ICP, scoring, enrichment, and research produce typed, explainable revenue context.
4. **Digital Employee layer:** Atlas, Sophia, Nova, Titan, and Echo are bounded roles that propose work through core contracts.
5. **Automation layer:** outreach, follow-ups, CRM, and analytics become executable capabilities only after policy and approval contracts are validated.
6. **Provider layer:** Explee, Apollo, Clay, LinkedIn, Google, OpenAI, and Gemini implement optional adapters behind stable ports.
7. **Knowledge and data layer:** governed knowledge, memory, event history, provenance, and future storage implementations provide durable context.

## Data Flow

1. A typed command or authorized provider observation enters through a core boundary.
2. The orchestrator resolves a versioned workflow and required capabilities.
3. Provider adapters normalize external results into shared types with provenance and confidence.
4. Intelligence modules enrich, resolve, score, or research entities and emit versioned events.
5. Knowledge and memory expose approved context to workflows and Digital Employees according to scope and retention policy.
6. Digital Employees produce recommendations, drafts, or approval requests; they do not bypass policy.
7. Future automation consumes approved plans, emits action and outcome events, and remains auditable.
8. Analytics aggregates outcomes for measurement and the future continuous-learning loop.

## Provider Abstraction

Providers are replaceable adapters, not domain dependencies. Each adapter should implement capability-specific ports, normalize data into shared types, preserve source and timestamp metadata, translate errors, expose health and rate-limit signals, and make unsupported capabilities explicit. The core and intelligence layers must be testable with contract fixtures without importing any provider SDK.

Explee is one optional provider alongside Apollo, Clay, LinkedIn, Google, OpenAI, and Gemini. No module may encode Explee-specific assumptions in a domain model or workflow contract.

## Digital Employees

Digital Employees are bounded role definitions with explicit goals, allowed tools, context scope, approval requirements, escalation rules, and outcome measures. Atlas focuses on prospect and company research; Sophia on ICP and qualification strategy; Nova on outreach intelligence; Titan on CRM and revenue operations; Echo on conversations and support. Their runtime is future work for a later phase.

## Knowledge Layer

Knowledge contains governed facts, definitions, policies, research findings, source references, confidence, freshness, and approval state. It is distinct from raw event history and from short-lived execution state. Every material record should support provenance and invalidation.

## Memory Layer

Memory provides scoped context for a workflow or employee. Short-term memory supports active execution; durable memory supports entity and relationship history; episodic memory supports prior workflow outcomes. Access must be tenant-scoped, policy-aware, freshness-aware, and auditable.

## Future Runtime

The future runtime will combine a command API, workflow scheduler, event bus, memory and knowledge stores, provider registry, policy engine, Digital Employee registry, approval service, and observability layer. Runtime implementation is intentionally deferred. The current architecture establishes the contracts and dependency direction needed to implement those components safely.

## Non-Goals

Mission 004 does not implement provider APIs, business logic, UI, marketing pages, outreach, follow-ups, CRM mutations, or autonomous employee execution.
