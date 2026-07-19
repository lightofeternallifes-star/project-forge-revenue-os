# Digital Employee Execution Engine™

The Execution Engine turns a canonical Digital Employee and a bounded mission into an auditable runtime workflow.

## Runtime Components

- Mission Domain: types, states, transitions, and input validation.
- Mission Store: process-local mission records for the current runtime foundation.
- Dispatcher: assignment and controlled transition routing through the Portal API.
- Execution Engine: knowledge loading, deterministic local work, logs, and closure.
- Evidence Engine: provenance-backed execution and human evidence records.
- Performance Engine: mission, quality, success, revenue, and knowledge metrics.
- Knowledge Loop: lessons, reusable knowledge, references, improvements, and automation candidates.
- Promotion Engine: evidence-based promotion evaluation.
- ROI Calculator: attributable revenue and declared impact calculations.

The current store is intentionally replaceable. Production deployment requires a durable mission store and event bus without changing the mission contract.
