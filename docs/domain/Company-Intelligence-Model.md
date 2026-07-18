# Company Intelligence Model

## Purpose

This document defines the canonical domain model for the Company Intelligence Engine. It is intentionally independent of source schema, vendor API, storage engine, and runtime implementation.

## Canonical Aggregate

`CompanyProfile` is the aggregate root. It represents one organization as understood by Revenue OS at a point in time. The profile contains normalized facts, linked entities, derived signals, scores, provenance, and version metadata.

## Entity Relationships

```text
CompanyProfile
├── Identity
├── Locations[]
├── DecisionMakers[] ── belongs to Department
├── Departments[]
├── IndustryProfile
├── Services[]
├── Products[]
├── RevenueSignals[]
├── HiringSignals[]
├── GrowthSignals[]
├── PainPoints[]
├── CommunicationChannels[]
├── DigitalPresence
├── Reviews[]
├── TechnologyStack[]
├── BusinessHours[]
├── Scores
└── Evidence[]
```

Relationships are references by stable internal IDs. A Decision Maker may be linked to one or more Departments. A Location may be a headquarters, office, service area, or remote operating location. Services and Products are distinct offerings and may reference one another. Signals and Pain Points are observations or inferences about the Company, not guaranteed facts.

## Entity Ownership

| Entity | Canonical owner | Mutability | Notes |
| --- | --- | --- | --- |
| CompanyProfile | Company Intelligence Engine | Versioned | Aggregate root and publication boundary |
| Identity | Company Intelligence Engine | Superseding observations | External identifiers remain source-specific |
| Location | Company Intelligence Engine | Versioned | Address and operating status require freshness |
| DecisionMaker | Contact Intelligence Engine | Linked reference | Company profile stores relationship context, not a second contact master |
| Department | Company Intelligence Engine | Versioned | May be inferred from roles and public organization data |
| IndustryProfile | Company Intelligence Engine | Versioned | Taxonomies and confidence must be recorded |
| Services and Products | Company Intelligence Engine | Versioned | Source-backed descriptions preferred |
| Signals and PainPoints | Intelligence and Research layers | Append-only observations | Derived summaries must retain supporting observations |
| CommunicationChannels | Company Intelligence Engine | Versioned | Consent and channel status are policy-governed |
| DigitalPresence | Company Intelligence Engine | Versioned | URLs and platform presence require verification |
| Reviews | Research and Evidence layers | Append-only observations | Preserve source, date, rating, and review context |
| TechnologyStack | Company Intelligence Engine | Versioned observations | Detection is probabilistic and time-sensitive |
| BusinessHours | Company Intelligence Engine | Versioned | Local timezone and seasonal exceptions matter |
| Scores | Scoring Intelligence | Recomputed | Profile stores results and explanations, not scoring ownership |
| Evidence | Evidence and Knowledge layers | Append-only | Evidence is never overwritten by normalization |

## Normalization Strategy

1. **Ingest an observation:** retain source, source record ID, capture time, observed time, raw claim summary, and authorization context.
2. **Resolve identity:** match domains, legal names, registration identifiers, addresses, phone numbers, and source IDs using a versioned identity policy.
3. **Map to canonical fields:** translate source-specific names and values into the CompanyProfile vocabulary. Preserve unmapped source attributes as quarantined extensions, never as silent fields.
4. **Normalize values:** standardize country and region codes, domains, URLs, phone formats, currencies, timezones, taxonomies, units, and timestamps.
5. **Assess quality:** calculate confidence, freshness, completeness, conflict state, and evidence quality for each material attribute.
6. **Resolve conflicts:** prefer policy-approved source precedence only when appropriate; retain competing observations and explain the selected value.
7. **Derive intelligence:** calculate signals and scores from current evidence using named, versioned policies. Derived data must link to its factors.
8. **Publish a profile version:** make the normalized snapshot immutable and emit a change event with affected fields.

## Provider Mapping

| Provider or source | Primary observations | Mapping rule |
| --- | --- | --- |
| Explee | Prospect context, company attributes, engagement context | Treat as an optional observation source; never use its schema as canonical |
| Apollo | Firmographics, contacts, roles, domains, enrichment | Map to Identity, Departments, DecisionMakers, and company attributes with source confidence |
| Clay | Research and enrichment results | Preserve each upstream source in provenance and map only validated fields |
| Google | Maps, business presence, locations, business hours, reviews where authorized | Keep location, hours, review, and presence observations separate |
| LinkedIn | Company presence, departments, roles, growth and hiring indicators where authorized | Mark detection time and authorization; do not infer certainty from presence alone |
| CRM | Internal account identity, ownership, lifecycle, activities, outcomes | CRM ownership and lifecycle remain distinct from external company facts |
| Company Website | Identity, digital presence, products, services, locations, hiring, contact channels | Capture URL and page evidence with retrieval time |
| Public APIs | Structured public company or market data | Store publisher, license, terms, timestamp, and field-level provenance |
| Documents | Contracts, filings, brochures, reports, uploaded research | Store document reference, page or section locator, extraction confidence, and access policy |
| Reviews | Customer or employee sentiment and experience observations | Preserve review source, rating scale, date, text reference, and aggregation method |
| Maps | Locations, service areas, hours, categories, public reviews | Treat as location evidence and retain map-provider provenance |

No provider is authoritative for every field. Source precedence is field-specific, policy-driven, time-aware, and reviewable.

## Future APIs

The future service boundary may expose:

- `getProfile(companyId, version?)`
- `resolveIdentity(identityClaims)`
- `recordObservation(observation)`
- `getEvidence(companyId, field?)`
- `proposeEnrichment(companyId, fields)`
- `getSignals(companyId, signalType?)`
- `getScores(companyId, scoreSetVersion?)`
- `compareVersions(companyId, from, to)`
- `publishVersion(companyId, approvalContext)`

API design must support tenant scope, authorization, pagination, field selection, provenance expansion, confidence thresholds, and explicit version selection.

## Versioning Strategy

- **Schema version:** changes to field meaning, cardinality, type, or requiredness. Use a compatibility-reviewed major or minor version.
- **Profile version:** immutable normalized snapshot published after an approved change set.
- **Observation version:** append-only source claim with capture and observed timestamps.
- **Policy version:** identity, normalization, source precedence, and scoring policy used to produce a result.
- **Provider mapping version:** translation rules from a source schema to the canonical model.

Backward-compatible fields may be added as optional fields. Meaning changes require a new schema or policy version and a migration note. Scores and derived signals must always state the policy version used. Historical profile versions remain queryable for audit and learning.

## Data Quality And Trust

The model separates fact, inference, and hypothesis. Every inference has a confidence and supporting evidence set. Freshness is field-specific; a company name may remain valid for years while hiring signals or business hours may expire quickly. Sensitive information uses stricter access and retention controls than public company facts.
