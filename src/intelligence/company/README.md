# Company Intelligence Engine

## Purpose

Define the canonical, provider-agnostic domain model for organizational intelligence in PROJECT FORGE Revenue OS™. The engine converts observations from many authorized sources into one explainable Company Profile.

## Responsibilities

- Resolve and maintain a canonical company identity.
- Normalize company, location, department, contact, market, technology, and operating signals.
- Preserve source provenance, observation time, freshness, confidence, and conflict history.
- Expose derived scores with explainable factors and versioned scoring policies.
- Publish change events and reviewable enrichment proposals for downstream intelligence.
- Keep provider-specific fields and transport concerns outside the domain model.

## Inputs

Authorized observations from Explee, Apollo, Clay, Google, LinkedIn, CRM systems, company websites, public APIs, documents, reviews, maps, and future providers. Inputs may include structured records, documents, human corrections, research findings, and outcome signals.

## Outputs

Versioned Company Profiles, normalized entity records, evidence-linked signals, data-quality findings, score explanations, enrichment proposals, and Company Profile change events.

## Future APIs

- `CompanyProfile.create` and `CompanyProfile.get`
- `CompanyProfile.resolveIdentity`
- `CompanyProfile.recordObservation`
- `CompanyProfile.proposeUpdate`
- `CompanyProfile.getHistory`
- `CompanyProfile.explainScore`
- `CompanyProfile.publishVersion`

These are future contracts only. Mission 005 contains no implementation or provider integration.

## Dependencies

Shared types, core memory and event contracts, the knowledge layer, provider-neutral observation ports, and future scoring and enrichment policies. This module must not import provider SDKs or depend on a specific source.

## Domain Invariants

- Every profile has a stable internal ID and a separately tracked set of external identifiers.
- Every material attribute has provenance, observed-at time, confidence, and freshness state.
- A derived score is never stored without its scoring-policy version and contributing factors.
- Conflicting observations remain attributable; normalization does not silently destroy disagreement.
- Sensitive contact or communication data is scoped and governed separately from public company facts.
- A profile version is immutable after publication; corrections create a new version or an explicit superseding observation.
