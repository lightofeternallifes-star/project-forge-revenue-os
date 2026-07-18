# CompanyProfile Schema Contract

## Contract Status

**Status:** Proposed canonical domain contract
**Version:** `0.1`
**Implementation:** None in Mission 005

This document describes future fields in the CompanyProfile aggregate. It is not JSON, code, or a provider schema.

## Envelope And Governance Fields

| Field | Cardinality | Description |
| --- | --- | --- |
| `profile_id` | Required, one | Stable Revenue OS identifier for the company profile |
| `profile_version` | Required, one | Immutable published profile version |
| `schema_version` | Required, one | Version of this contract |
| `tenant_id` | Required, one | Tenant that owns and governs the profile |
| `lifecycle_status` | Required, one | `active`, `inactive`, `merged`, `dissolved`, `prospect`, or `unknown` |
| `created_at` | Required, one | Profile creation timestamp |
| `updated_at` | Required, one | Last published profile timestamp |
| `last_verified_at` | Optional, one | Last time the profile met the verification policy |
| `data_quality` | Required, one | Completeness, freshness, conflict, and verification summary |
| `evidence_refs` | Required, many | References supporting profile-level claims |

## Identity

| Field | Cardinality | Description |
| --- | --- | --- |
| `identity.legal_name` | Required, one | Registered or legally stated organization name when known |
| `identity.display_name` | Required, one | Human-facing name used by the organization |
| `identity.previous_names` | Optional, many | Former names with effective dates and evidence |
| `identity.domains` | Required, many | Verified or observed web domains with status |
| `identity.registration_ids` | Optional, many | Jurisdiction-qualified registration identifiers |
| `identity.tax_ids` | Restricted, many | Tax identifiers only when lawfully collected and governed |
| `identity.source_ids` | Required, many | External identifiers keyed by provider name |
| `identity.parent_company_id` | Optional, one | Canonical parent profile reference |
| `identity.subsidiary_ids` | Optional, many | Canonical child profile references |
| `identity.entity_type` | Required, one | Company, nonprofit, government, partnership, sole proprietor, or other |
| `identity.founded_year` | Optional, one | Year founded with confidence and evidence |

## Locations

`locations` is a list of records with the following fields:

| Field | Cardinality | Description |
| --- | --- | --- |
| `location_id` | Required, one | Stable location identifier |
| `location_type` | Required, one | Headquarters, office, branch, plant, service area, or remote |
| `address` | Optional, one | Structured address with country and region normalization |
| `latitude` and `longitude` | Optional, one each | Coordinates with source and precision metadata |
| `timezone` | Optional, one | IANA timezone for the location |
| `is_primary` | Required, one | Whether the location is the current primary location |
| `status` | Required, one | Active, closed, moved, or unknown |
| `source_refs` | Required, many | Evidence for the location |

## Decision Makers And Departments

`decision_makers` is a list of linked contact references. Each record contains `contact_id`, `name`, `title`, `department_id`, `seniority`, `role_type`, `influence_level`, `relationship_status`, `contact_confidence`, and `evidence_refs`. The Contact Intelligence Engine owns the canonical person record.

`departments` is a list of records containing `department_id`, `name`, `normalized_function`, `headcount_estimate`, `leadership_contact_ids`, `operating_region`, `status`, and `evidence_refs`.

## Industry, Services, And Products

| Field | Cardinality | Description |
| --- | --- | --- |
| `industry.primary` | Required, one | Primary normalized industry classification |
| `industry.secondary` | Optional, many | Additional classifications |
| `industry.taxonomies` | Optional, many | Taxonomy name, code, label, and version |
| `industry.business_model` | Optional, one | B2B, B2C, marketplace, services, software, public sector, or other |
| `services` | Optional, many | Service ID, name, description, target segment, geography, evidence |
| `products` | Optional, many | Product ID, name, category, lifecycle, description, price signal, evidence |

## Signals And Pain Points

Each signal record includes `signal_id`, `signal_type`, `statement`, `value`, `direction`, `strength`, `observed_at`, `expires_at`, `confidence`, `source_refs`, and `status`. Signal types are `revenue`, `hiring`, or `growth`.

Each pain-point record includes `pain_point_id`, `statement`, `affected_function`, `severity`, `evidence_type`, `confidence`, `observed_at`, `status`, and `source_refs`. Pain points are hypotheses unless directly supported by an authorized source.

## Communication Channels

`communication_channels` is a list of records containing `channel_id`, `channel_type`, `address_or_handle`, `purpose`, `status`, `preferred`, `consent_basis`, `verified_at`, `last_seen_at`, `timezone`, and `source_refs`. Channel types may include website form, email, phone, LinkedIn, WhatsApp, social profile, and support channel.

## Digital Presence

`digital_presence` contains `primary_website`, `website_status`, `social_profiles`, `content_languages`, `careers_url`, `support_url`, `documentation_url`, `review_profiles`, `search_presence`, `last_crawled_at`, `presence_confidence`, and `source_refs`.

## Reviews

`reviews` is a list of aggregate or individual observations. Each record contains `review_id`, `source`, `review_type`, `rating`, `rating_scale`, `review_count`, `summary`, `themes`, `published_at`, `observed_at`, `sentiment_confidence`, `url_or_reference`, and `source_refs`. Review text is not required in the canonical profile.

## Technology Stack

`technology_stack` is a list of records containing `technology_id`, `name`, `category`, `version_or_plan`, `detection_method`, `detected_at`, `confidence`, `status`, and `source_refs`. Detection is probabilistic and must not be represented as confirmed procurement.

## Business Hours

`business_hours` is a list of records containing `location_id`, `day`, `opens_at`, `closes_at`, `timezone`, `is_closed`, `seasonal_note`, `observed_at`, and `source_refs`.

## Scores

`scores` contains four score records: `lead_score`, `ai_opportunity_score`, `automation_opportunity_score`, and `risk_score`. Every score record includes `value`, `scale`, `label`, `scoring_policy_version`, `calculated_at`, `confidence`, `factors`, `thresholds`, and `evidence_refs`. Scores are derived assessments, not facts.

## Provenance Record

Every field or nested record may reference a provenance record containing `source_type`, `provider_or_publisher`, `source_record_id`, `source_url_or_locator`, `captured_at`, `observed_at`, `authorization_basis`, `extraction_method`, `confidence`, and `retention_class`.
