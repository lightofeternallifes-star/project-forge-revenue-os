# Artifact Manifest Contract

Every generated employee package has one manifest.

| Field | Meaning |
| --- | --- |
| `manifest_id` | Immutable package manifest identity |
| `employee_number` | Canonical employee identity |
| `definition_version` | Version of the approved Employee Definition |
| `template_versions` | Exact template versions used |
| `policy_versions` | Lifecycle, brand, retention, and permission policies |
| `artifacts` | Artifact IDs, paths, owners, stages, checksums, and statuses |
| `evidence_manifest_id` | Evidence set supporting generated claims |
| `approvals` | Required and completed approvals |
| `created_at` | Generation timestamp |
| `created_by` | Authorized request actor or system identity |
| `status` | Draft, blocked, approved, active, superseded, or archived |

The manifest is append-only. Regeneration creates a new artifact version and records the superseded version; it never overwrites history.
