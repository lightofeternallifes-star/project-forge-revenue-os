# PROJECT FORGE Revenue OS™

![Status: Phase I MVP](https://img.shields.io/badge/status-phase%20I%20MVP-2f855a)

Canonical repository slug: `project-forge-revenue-os`

Future repository URL: `https://github.com/PROJECT-FORGE/project-forge-revenue-os`

## Mission

PROJECT FORGE Revenue OS™ is a documentation-first research and product strategy repository for understanding, evaluating, and eventually designing an AI Revenue Operating System. It is the permanent knowledge base for disciplined product discovery: observations are separated from interpretation, assumptions are made visible, and future implementation is gated by evidence.

The platform vision spans the full commercial lifecycle:

- Prospect Intelligence
- Company Intelligence
- ICP Engine
- Sales Research
- Outreach Intelligence
- Email Engine
- LinkedIn Engine
- Voice AI
- WhatsApp AI
- CRM Intelligence
- Appointment Scheduling
- Digital Employees
- Revenue Analytics
- Continuous Learning

The first mission, **OPERATION PROMETHEUS**, is a forensic audit of Explee AutoGTM based only on observable product behavior, screenshots, documentation, public information, and authorized user testing. This repository does not contain proprietary code, protected-system data, or automated interactions with third-party systems.

## Operating Principles

- **Evidence before certainty:** every material claim should link to an evidence item or be labeled as an inference, hypothesis, or open question.
- **Read-only research:** missions may observe and document behavior, but do not reverse engineer proprietary code, scrape protected systems, or automate interactions.
- **Reproducibility:** record source, date, observer, environment, steps, and limitations for each observation.
- **Separation of concerns:** keep product facts, UX interpretation, business strategy, architecture, and opportunity design distinct.
- **Privacy and safety:** minimize personal data, redact sensitive values, and never store credentials or secrets.
- **Decision usefulness:** documentation should clarify what to preserve, what to test, what to build later, and why.

## Repository Map

| Path | Purpose |
| --- | --- |
| [`MISSION-001-EXPLEE-AUDIT.md`](MISSION-001-EXPLEE-AUDIT.md) | Master audit framework and report index |
| [`docs/architecture`](docs/architecture/) | Capability boundaries, system concepts, and non-production architecture notes |
| [`docs/audits`](docs/audits/) | Audit-specific working papers and findings |
| [`docs/evidence`](docs/evidence/) | Evidence register, observation records, and source evaluations |
| [`docs/research`](docs/research/) | Research notes, interviews, public-information reviews, and questions |
| [`docs/reports`](docs/reports/) | Polished mission outputs and executive summaries |
| [`docs/roadmap`](docs/roadmap/) | Strategic sequencing and mission-level roadmap |
| [`docs/vision`](docs/vision/) | Long-term Revenue OS vision |
| [`docs/adr`](docs/adr/) | Architecture decision records |
| [`docs/competitive-analysis`](docs/competitive-analysis/) | Competitor and alternative analyses |
| [`docs/business-model`](docs/business-model/) | ICP, value proposition, monetization, and operating-model hypotheses |
| [`docs/workflows`](docs/workflows/) | User and AI workflow documentation |
| [`docs/screenshots`](docs/screenshots/) | Screenshot index and provenance; media is added only when authorized |
| [`docs/templates`](docs/templates/) | Reusable report templates for all audit domains |
| [`knowledge`](knowledge/) | Curated durable conclusions, glossary, and decision records |
| [`src`](src/) | Reserved for future non-production research utilities; no implementation in Mission 001 |
| [`artifacts`](artifacts/) | Reserved for generated research artifacts and exports |

## Evidence Status

Use these labels consistently:

- `Observed`: directly seen in an authorized session or supplied artifact.
- `Documented`: stated in public or vendor documentation.
- `Reported`: stated by a user or interview participant; corroboration may be pending.
- `Inferred`: reasoned from evidence; not directly verified.
- `Hypothesis`: a testable possibility or design opportunity.
- `Unknown`: information not available within mission scope.

## Mission Workflow

1. Define the question and scope.
2. Capture the observation using the evidence template.
3. Record limitations and privacy handling.
4. Analyze implications for architecture, UX, AI workflows, and business strategy.
5. Convert validated conclusions into a report and a durable knowledge entry.
6. Add roadmap implications only when the evidence supports them.

## Current Status

Phase I now includes a dependency-free executable MVP. The runtime is intentionally bounded: it provides a local authenticated workspace, pipeline management, opportunity records, deterministic evidence-first insights, KPIs, timeline, executive review, and settings. Managed database, external identity providers, and autonomous execution remain behind documented provider-neutral boundaries; the current foundation provides file-backed runtime persistence.

## Run the MVP

```bash
npm install
npm run build
npm test
npm start
```

Open `http://localhost:3000`. Configure `FORGE_BOOTSTRAP_EMAIL`, `FORGE_BOOTSTRAP_PASSWORD`, and `FORGE_PROVISIONING_KEY` before first administration. See [`IMPLEMENTATION-REPORT-MISSION-017.md`](IMPLEMENTATION-REPORT-MISSION-017.md) for the platform foundation.

## GitHub Launch

Launch metadata and pre-push validation are tracked in [`docs/github/GITHUB_LAUNCH_CHECKLIST.md`](docs/github/GITHUB_LAUNCH_CHECKLIST.md).
