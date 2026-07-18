# Digital Brain Evidence Model

## Evidence Classes

- **Observed fact:** directly captured source observation.
- **Documented claim:** published source or user-provided documentation.
- **Reported statement:** human statement awaiting corroboration.
- **Inference:** conclusion derived from one or more records.
- **Hypothesis:** testable possibility not yet established.
- **Unknown:** intentionally unavailable or unverified.

## Required Provenance

Each Evidence Record identifies source type, publisher or provider, source record ID, locator, captured and observed times, authorization basis, extraction method, confidence, quality assessment, retention class, redaction state, and related canonical entities.

## Evidence Graph

Evidence attaches to fields, relationships, events, scores, Knowledge Records, Research Sessions, workflow decisions, and Digital Employee outputs. The graph supports citation, freshness checks, contradiction discovery, impact analysis, and deletion propagation.

## Trust Rules

- No derived score or recommendation may be presented without factors and evidence references.
- Conflicting evidence is retained and marked; source precedence is policy-driven and field-specific.
- A source is not authoritative merely because it is a named provider.
- Evidence may expire without invalidating the historical fact that it was once observed.
- Redaction preserves a tombstone, reason, authority, and audit reference.
