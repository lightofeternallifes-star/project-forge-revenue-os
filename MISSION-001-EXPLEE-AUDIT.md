# MISSION 001: OPERATION PROMETHEUS

**Subject:** Explee AutoGTM
**Mission type:** Product audit and opportunity discovery
**Repository role:** Permanent research record for PROJECT FORGE Growth Engine(TM)
**Status:** Framework established; evidence collection pending
**Scope:** Software architecture, UX, AI workflows, business strategy, automation, scalability, and opportunities

## Mission Rules

This mission is read-only. Research may use observable product behavior, screenshots, documentation, public information, and authorized user testing. It must not reverse engineer proprietary code, scrape protected systems, or automate interactions. Credentials, secrets, unnecessary personal data, and protected-system exports must not be stored here.

## Evidence Protocol

Every finding should reference one or more records in [`docs/evidence/EVIDENCE-REGISTER.md`](docs/evidence/EVIDENCE-REGISTER.md). Each record must identify the source type, capture date, observer, environment, steps, observed fact, and limitations. Distinguish observed facts from interpretation and recommendations.

## Audit Framework

Each section has a reusable template in [`docs/templates/`](docs/templates/). The expected output is a report with findings, evidence references, confidence, risks, open questions, and PROJECT FORGE implications.

### 1. Product Overview

Document the product promise, primary jobs-to-be-done, target users, major capabilities, operating assumptions, and observable boundaries. Capture what the product does and does not claim to do.

### 2. User Journey

Trace the end-to-end path from first visit or account setup through lead discovery, outreach, reply handling, conversion, and measurement. Record goals, friction, decisions, handoffs, and failure recovery.

### 3. Information Architecture

Map navigation, entities, screens, permissions, terminology, and relationships between workspaces, campaigns, prospects, messages, replies, and analytics.

### 4. ICP Builder

Assess how an ideal customer profile is defined, refined, validated, stored, reused, and translated into targeting criteria or messaging inputs.

### 5. Lead Discovery Pipeline

Assess source selection, filtering, enrichment, deduplication, qualification, provenance, freshness, consent considerations, and handoff into outreach.

### 6. AI Decision Engine

Document where AI makes recommendations or decisions, what context it receives, how users review or override outputs, and how confidence, errors, and policy constraints are handled.

### 7. Email Generation

Assess personalization inputs, generation controls, brand voice, factuality, approval, variation management, deliverability considerations, and quality feedback loops.

### 8. Follow-up Engine

Assess sequence design, timing, branching, stopping rules, suppression, retries, timezone handling, and human approval or escalation points.

### 9. Reply Management

Assess intent classification, sentiment or urgency handling, suggested actions, assignment, drafting, escalation, and auditability of AI-assisted replies.

### 10. Inbox Workflow

Assess the daily operating loop: triage, prioritization, search, filters, conversation context, tasks, ownership, bulk actions, and recovery from mistakes.

### 11. Analytics

Assess metric definitions, attribution, funnel visibility, cohorting, quality indicators, experiment support, latency, exportability, and whether metrics lead to actionable decisions.

### 12. Integrations

Inventory observable integrations, authentication expectations, synchronization direction, field mapping, rate-limit behavior, failure states, permissions, and data ownership.

### 13. API Opportunities

Identify potential public or partner API surfaces without inspecting proprietary implementation. Prioritize stable domain objects, events, actions, webhooks, governance, and developer experience.

### 14. UX Review

Evaluate clarity, information density, accessibility, interaction cost, trust, feedback, consistency, empty/error/loading states, responsive behavior, and the experience of repeated work.

### 15. Strengths

Record capabilities or design choices that create user value, reduce operational effort, improve trust, or form defensible product advantages. Tie each strength to evidence.

### 16. Weaknesses

Record observed friction, ambiguity, reliability gaps, missing controls, operational costs, and risks to adoption or retention. Separate severity from personal preference.

### 17. Missing Features

Identify unmet user needs and capability gaps. Explain the affected persona, workflow, impact, evidence, and whether the gap is a must-have, differentiator, or speculative opportunity.

### 18. Risks

Assess privacy, compliance, deliverability, model error, automation overreach, data quality, vendor dependency, scalability, security boundaries, and reputational exposure.

### 19. Competitive Advantages

Analyze differentiators against relevant alternatives using comparable dimensions and evidence. Distinguish true advantages from feature parity, positioning, or unverified claims.

### 20. PROJECT FORGE Opportunities

Translate validated findings into platform opportunities for discovering leads, qualifying prospects, personalizing outreach, automating conversations, scheduling appointments, learning from outcomes, and integrating Digital Employees.

## Deliverables

- Completed evidence register and observation records.
- Twenty domain reports using the templates in `docs/templates/`.
- Consolidated audit report in `docs/reports/`.
- Architecture and workflow notes in `docs/architecture/` and `docs/workflows/`.
- Competitive and business-model analyses.
- Prioritized PROJECT FORGE opportunity backlog and roadmap.
- Decision records for assumptions that materially affect future missions.

## Completion Gate

Mission 001 is complete when the audit claims are evidence-linked, material unknowns are explicit, risks and limitations are documented, and opportunities are prioritized without beginning production implementation.

