# Portal View Model

Portal views may derive presentation fields from the canonical employee model, but they may not persist new business truth.

## Derived Examples

- `status_label` from employment, certification, and deployment status.
- `completion_percent` from lifecycle stage evidence.
- `document_count` from document references.
- `open_issues` from the latest audit report.
- `recent_activity` from timeline events.

View models expire at request scope and must be regenerated from the canonical API response.
