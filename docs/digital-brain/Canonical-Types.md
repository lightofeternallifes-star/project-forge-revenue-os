# Canonical Types

## Identity Types

`EntityId`, `OrganizationId`, `UserId`, `DigitalEmployeeId`, `ExternalReference`, `RelationshipId`, and `VersionId` are stable opaque identifiers. External references contain source class, source name, source ID, and observed time; they are never used as canonical identity.

## Shared Value Types

`Timestamp`, `DateRange`, `Money`, `Score`, `Confidence`, `Freshness`, `Location`, `Address`, `ChannelAddress`, `LifecycleStatus`, `Classification`, `PolicyReference`, `EvidenceReference`, `ProvenanceReference`, `RetentionClass`, and `DataResidency` must have explicit units, scales, timezones, and policy semantics.

## Contract Rules

- All entity IDs are opaque and non-reused.
- All timestamps are unambiguous and include timezone or UTC semantics.
- Money includes currency and valuation basis.
- Scores include scale, direction, policy version, calculation time, confidence, and factors.
- Enumerations are versioned and allow an explicit unknown or other value.
- Optional fields are absent when unknown; null is not used to mean false, empty, or deleted.
- Sensitive values are references or classified fields with purpose-bound access.
- Every command has actor, organization, idempotency, policy, and correlation context.
- Every event has schema version and canonical resource reference.
