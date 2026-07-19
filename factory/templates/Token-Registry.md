# Template Token Registry

Templates may use only tokens defined here or explicitly added in a versioned registry change.

| Token | Type | Required |
| --- | --- | --- |
| `{{organization_id}}` | Identifier | Yes |
| `{{employee_number}}` | Identifier | Yes |
| `{{employee_name}}` | String | Yes |
| `{{employee_email}}` | Email | Yes |
| `{{division}}` | Organization reference | Yes |
| `{{department}}` | Organization reference | Yes |
| `{{manager}}` | Person reference | Yes |
| `{{role}}` | Role reference | Yes |
| `{{specializations}}` | List | Yes |
| `{{mission_id}}` | Identifier | Yes for mission packages |
| `{{effective_date}}` | ISO date | Yes |
| `{{review_date}}` | ISO date | Stage dependent |
| `{{evidence_manifest_id}}` | Identifier | Stage dependent |
| `{{approver}}` | Person reference | Stage dependent |
| `{{brand_reference}}` | Canonical asset reference | Yes |
| `{{template_version}}` | Version | Yes |

Unknown, unbound, or escaped tokens fail generation.
