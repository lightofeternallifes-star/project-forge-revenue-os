# PROJECT FORGE Revenue OS™ Canonical Engine Architecture

## Status

Mission 006 architecture milestone. This document defines provider-agnostic engine boundaries for an AI Revenue Company. It contains no implementation, provider SDK contract, UI specification, or executable business logic.

## Architectural Rules

- Each engine owns a bounded domain and its authoritative records.
- Read models may be composed across engines, but ownership is never duplicated silently.
- Public interfaces are capability contracts, not provider APIs.
- Events are versioned, tenant-scoped, causally linked, idempotent, and auditable.
- Evidence, confidence, freshness, policy version, and actor identity accompany material decisions.
- Digital Employees propose or execute only within explicit tools, permissions, approvals, and escalation policies.
- Every engine supports partitioning, replay, backpressure, retention, and regional data controls at scale.
- No engine depends directly on Explee or any other named provider.

## Shared Contract Vocabulary

- **Owned data:** records for which an engine is the system of record and lifecycle owner.
- **Public interfaces:** future provider-neutral commands, queries, and subscriptions.
- **Events:** facts emitted after a state transition or material observation; consumers must tolerate duplicates and reordering.
- **Evidence:** attributable support for a fact, inference, score, or recommendation.
- **Digital Employee:** a bounded role that uses engine interfaces under policy, not an unconstrained autonomous agent.

## Engine Catalog

### 1. Company Intelligence Engine

**Purpose:** Maintain the canonical, normalized view of organizations across authorized sources.

**Responsibilities:** Resolve company identity; normalize legal and display names, locations, industries, offerings, technology, presence, reviews, hours, and business signals; assess freshness and conflicts; publish explainable Company Profiles.

**Owned data:** CompanyProfile, identity keys, locations, departments, company-level services and products, digital presence, business hours, technology observations, company evidence links, and profile versions.

**Public interfaces:** Get or compare CompanyProfile; resolve identity; record observation; propose enrichment; retrieve evidence; publish profile version; subscribe to company changes.

**Events:** CompanyCreated, CompanyIdentityResolved, CompanyObservationRecorded, CompanyProfileUpdated, CompanyMerged, CompanyDeactivated, CompanyEvidenceExpired.

**Dependencies:** Shared types, Evidence Engine, Knowledge Engine, memory ports, provider-neutral observation ports, Contact Intelligence references, and policy registry.

**Future Digital Employees:** Atlas for company research; Sophia for ICP fit interpretation; Titan for account-data stewardship.

**KPIs:** Identity resolution precision; profile completeness; field freshness; conflict rate; evidence coverage; merge accuracy; profile update latency; cost per maintained profile.

### 2. Contact Intelligence Engine

**Purpose:** Maintain canonical people, roles, relationships, and communication context connected to companies.

**Responsibilities:** Resolve person identity; normalize titles and departments; model seniority, influence, relationship, consent, channel reachability, and contact freshness; protect sensitive contact data.

**Owned data:** ContactProfile, external identifiers, role history, department links, company relationships, communication-channel records, consent status, contact evidence, and contact versions.

**Public interfaces:** Resolve contact; get profile; link contact to company or department; record observation; manage consent state; retrieve relationship context; publish contact version.

**Events:** ContactCreated, ContactIdentityResolved, ContactRoleChanged, ContactRelationshipUpdated, ContactConsentChanged, ContactChannelVerified, ContactSuppressed.

**Dependencies:** Company Intelligence, Evidence Engine, Knowledge Engine, memory, policy, and provider-neutral contact observations.

**Future Digital Employees:** Atlas for research; Echo for conversation context; Titan for ownership and CRM hygiene.

**KPIs:** Identity precision; valid reachable-contact rate; stale-contact rate; consent coverage; duplicate rate; relationship completeness; suppression accuracy; resolution latency.

### 3. Digital Employee Intelligence Engine

**Purpose:** Govern the registry, capability model, context access, and performance intelligence of Digital Employees.

**Responsibilities:** Define roles, tools, permissions, policies, task contracts, approval requirements, escalation boundaries, memory scopes, evaluation sets, and outcome attribution.

**Owned data:** Employee definitions, versions, capability grants, tool policies, task assignments, approval records, execution traces, evaluation results, and employee performance metrics.

**Public interfaces:** Register employee role; plan task; request context; request approval; grant or revoke capability; record outcome; evaluate behavior; retrieve audit trace.

**Events:** EmployeeRegistered, EmployeeVersionPublished, EmployeeTaskAssigned, EmployeeApprovalRequested, EmployeeActionApproved, EmployeeEscalated, EmployeeOutcomeRecorded, EmployeeCapabilityRevoked.

**Dependencies:** Core Orchestrator, Workflows, Memory, Knowledge, Evidence, Audit, Provider Router, and every engine that exposes an approved capability.

**Future Digital Employees:** Atlas, Sophia, Nova, Titan, Echo, plus future specialized roles with bounded scopes.

**KPIs:** Task success rate; human override rate; escalation rate; policy violation rate; approval latency; outcome lift; context retrieval quality; cost per successful task.

### 4. Revenue Opportunity Engine

**Purpose:** Identify, represent, prioritize, and lifecycle-manage revenue opportunities across accounts, contacts, and interactions.

**Responsibilities:** Combine fit, intent, timing, relationship, need, and outcome signals; deduplicate opportunities; model stage and next action; expose explanations and uncertainty.

**Owned data:** Opportunity, opportunity hypotheses, opportunity stage, signal associations, value estimates, next-action proposals, ownership, confidence, and opportunity history.

**Public interfaces:** Create opportunity hypothesis; qualify; update stage; attach signal; assign owner; calculate priority; forecast value; close or reopen; retrieve explanation.

**Events:** OpportunityDetected, OpportunityQualified, OpportunityStageChanged, OpportunityAssigned, OpportunityPrioritized, OpportunityWon, OpportunityLost, OpportunityReopened.

**Dependencies:** Company, Contact, Revenue Scoring, Lead Qualification, Sales Research, Appointment, CRM, Evidence, and Analytics engines.

**Future Digital Employees:** Sophia for opportunity interpretation; Atlas for signal discovery; Titan for ownership and stage hygiene.

**KPIs:** Opportunity precision; qualified-opportunity rate; time to qualification; stage conversion; opportunity aging; forecast accuracy; source-to-opportunity attribution; false-positive rate.

### 5. AI Readiness Engine

**Purpose:** Assess whether a company, workflow, data estate, and operating context are ready for responsible AI adoption.

**Responsibilities:** Evaluate data quality, workflow repeatability, system access, governance, human capacity, risk, use-case fit, and expected value; produce a staged readiness assessment.

**Owned data:** Readiness assessment, dimension scores, evidence requirements, blockers, recommendations, maturity level, reassessment history, and readiness policy versions.

**Public interfaces:** Start assessment; submit evidence; calculate readiness; explain dimension; create remediation plan; compare assessments; schedule reassessment.

**Events:** ReadinessAssessmentStarted, ReadinessEvidenceAdded, ReadinessCalculated, ReadinessBlockerDetected, ReadinessImproved, ReadinessExpired.

**Dependencies:** Company Intelligence, Evidence, Audit, Knowledge, Revenue Scoring, Research, CRM, and policy registry.

**Future Digital Employees:** Sophia for use-case fit; Atlas for evidence collection; Nova for readiness recommendations.

**KPIs:** Assessment completion; evidence coverage; blocker resolution time; readiness score calibration; recommended-use-case adoption; risk escape rate; reassessment freshness.

### 6. Voice AI Engine

**Purpose:** Govern voice conversations as a provider-neutral revenue and support channel.

**Responsibilities:** Model calls, participants, consent, routing, transcription references, intent, handoffs, outcomes, retention, and human escalation without coupling to a telephony or model provider.

**Owned data:** Voice session, call policy, participant consent, call state, transcript reference, intent summary, action proposal, handoff, and call outcome.

**Public interfaces:** Schedule session; authorize channel; start or end call; attach transcript; classify intent; request human handoff; record outcome; enforce retention.

**Events:** VoiceSessionScheduled, VoiceConsentGranted, VoiceSessionStarted, VoiceTranscriptAvailable, VoiceIntentClassified, VoiceHandoffRequested, VoiceSessionCompleted, VoiceRetentionApplied.

**Dependencies:** Provider Router, Contact, Company, Appointment, Evidence, Audit, Knowledge, Digital Employee Intelligence, and policy controls.

**Future Digital Employees:** Echo for conversation handling; Nova for outreach context; Titan for handoff and CRM updates.

**KPIs:** Consent compliance; connection rate; intent accuracy; handoff success; containment rate; appointment conversion; latency; cost per resolved conversation; retention compliance.

### 7. WhatsApp AI Engine

**Purpose:** Govern WhatsApp conversations and business messaging as a provider-neutral channel.

**Responsibilities:** Model opt-in, templates, conversations, message state, intent, attachments, stop rules, human handoff, and channel policy.

**Owned data:** WhatsApp conversation, participant consent, message envelope, template approval reference, delivery state, intent, handoff, suppression, and outcome.

**Public interfaces:** Register channel; verify opt-in; send approved message; receive message event; classify intent; pause or suppress; hand off; retrieve conversation context.

**Events:** WhatsAppOptInRecorded, WhatsAppConversationOpened, WhatsAppMessageProposed, WhatsAppMessageSent, WhatsAppDeliveryUpdated, WhatsAppIntentClassified, WhatsAppSuppressed, WhatsAppHandoffRequested.

**Dependencies:** Provider Router, Contact, Company, Knowledge, Evidence, Audit, Digital Employee Intelligence, Outreach policy, and CRM Intelligence.

**Future Digital Employees:** Echo for conversation; Nova for grounded messaging; Titan for CRM handoff.

**KPIs:** Opt-in compliance; delivery rate; response rate; intent accuracy; resolution rate; handoff rate; template rejection rate; suppression accuracy; cost per resolved conversation.

### 8. CRM Intelligence Engine

**Purpose:** Maintain a provider-neutral intelligence model of customer records, lifecycle, ownership, and operational state.

**Responsibilities:** Normalize account, contact, opportunity, activity, owner, pipeline, and handoff records; detect conflicts; prepare changes; preserve CRM source authority and audit history.

**Owned data:** Canonical CRM account view, relationship state, lifecycle state, ownership, mapping definitions, sync cursor, conflict records, proposed changes, and handoff receipts.

**Public interfaces:** Get record view; map fields; propose change; approve change; reconcile records; assign owner; create handoff; retrieve sync health.

**Events:** CRMRecordObserved, CRMMappingPublished, CRMChangeProposed, CRMChangeApproved, CRMConflictDetected, CRMRecordReconciled, CRMHandoffCreated, CRMSyncFailed.

**Dependencies:** Company, Contact, Opportunity, Appointment, Evidence, Audit, Provider Router, and policy registry.

**Future Digital Employees:** Titan as steward; Echo for conversation handoff; Sophia for lifecycle interpretation.

**KPIs:** Record completeness; sync freshness; conflict rate; reconciliation accuracy; duplicate rate; handoff acceptance; change failure rate; time to operational consistency.

### 9. Sales Research Engine

**Purpose:** Produce structured, attributable research that improves revenue decisions and employee context.

**Responsibilities:** Define research questions, collect authorized observations, cite sources, separate fact from inference, assess source quality, manage freshness, and publish research briefs.

**Owned data:** Research brief, question, finding, source assessment, citation, confidence, open question, research plan, and research version.

**Public interfaces:** Create brief; assign question; add finding; assess source; request refresh; publish brief; compare research versions; retrieve citations.

**Events:** ResearchRequested, ResearchQuestionAssigned, ResearchFindingAdded, ResearchSourceAssessed, ResearchBriefPublished, ResearchBriefExpired.

**Dependencies:** Company, Contact, Competitive Intelligence, Evidence, Knowledge, Provider Router, Memory, and Digital Employee Intelligence.

**Future Digital Employees:** Atlas for evidence collection; Sophia for synthesis; Nova for outreach context.

**KPIs:** Brief completion time; citation coverage; source quality; finding confidence; stale-brief rate; research reuse; decision lift; cost per accepted brief.

### 10. Competitive Intelligence Engine

**Purpose:** Maintain evidence-backed intelligence about competitors, alternatives, markets, and positioning.

**Responsibilities:** Identify alternatives, normalize competitor profiles, track capabilities, pricing signals, positioning, customer evidence, market movements, and comparison confidence.

**Owned data:** CompetitorProfile, alternative relationship, capability matrix, market signal, positioning claim, pricing observation, source assessment, and comparison version.

**Public interfaces:** Resolve competitor; record observation; compare alternatives; publish matrix; track movement; explain claim; request refresh.

**Events:** CompetitorResolved, CompetitorObservationRecorded, CapabilityChanged, PricingObserved, MarketSignalDetected, ComparisonPublished, CompetitiveEvidenceExpired.

**Dependencies:** Sales Research, Company, Evidence, Knowledge, Audit, Provider Router, and Analytics.

**Future Digital Employees:** Atlas for collection; Sophia for strategic synthesis; Nova for positioning context.

**KPIs:** Competitor coverage; observation freshness; claim evidence coverage; comparison reuse; change detection precision; source diversity; strategic decision adoption.

### 11. Lead Qualification Engine

**Purpose:** Convert company, contact, behavior, and research evidence into explicit qualification decisions.

**Responsibilities:** Apply qualification frameworks, capture missing criteria, model disqualification, request human review, explain decisions, and retain decision history.

**Owned data:** Qualification case, criteria, answers, evidence links, qualification state, disqualification reason, reviewer, policy version, and decision history.

**Public interfaces:** Start case; add evidence; evaluate criteria; request review; qualify; disqualify; reopen; explain decision.

**Events:** QualificationStarted, CriterionEvaluated, QualificationReviewRequested, LeadQualified, LeadDisqualified, QualificationReopened.

**Dependencies:** Company, Contact, Opportunity, Sales Research, Revenue Scoring, Evidence, Knowledge, and Digital Employee Intelligence.

**Future Digital Employees:** Sophia for qualification reasoning; Atlas for missing evidence; Titan for CRM state.

**KPIs:** Qualification precision; decision time; evidence completeness; reviewer agreement; disqualification accuracy; reopen rate; qualified-to-opportunity conversion.

### 12. Revenue Scoring Engine

**Purpose:** Produce versioned, explainable scores for fit, intent, opportunity, readiness, prioritization, and risk.

**Responsibilities:** Manage scoring policies, features, calibration, thresholds, confidence, drift, overrides, and score explanations across revenue domains.

**Owned data:** Score definition, scoring policy, feature snapshot, score result, factor contribution, threshold set, calibration record, override, and drift report.

**Public interfaces:** Define policy; calculate score; explain score; calibrate; compare versions; record override; detect drift; publish policy.

**Events:** ScoringPolicyPublished, ScoreCalculated, ScoreOverridden, ScoreThresholdChanged, ScoreDriftDetected, ScoreInvalidated.

**Dependencies:** Company, Contact, Opportunity, Qualification, AI Readiness, Evidence, Analytics, Knowledge, and model-neutral inference ports.

**Future Digital Employees:** Sophia for interpretation; Atlas for feature evidence; Titan for operational prioritization.

**KPIs:** Calibration error; lift over baseline; score stability; explanation coverage; override rate; drift detection time; false-positive and false-negative rates; compute cost.

### 13. Proposal Intelligence Engine

**Purpose:** Turn qualified opportunity context into grounded, reviewable proposal intelligence.

**Responsibilities:** Assemble requirements, map capabilities to needs, track assumptions, identify gaps, recommend structure, cite evidence, and manage proposal versions.

**Owned data:** Proposal brief, requirements, solution mapping, assumptions, commercial inputs, risk notes, evidence links, approval state, and proposal version.

**Public interfaces:** Create brief; import requirements; map solution; identify gap; draft section proposal; request review; compare versions; publish approved brief.

**Events:** ProposalRequested, RequirementCaptured, SolutionMapped, ProposalGapDetected, ProposalReviewRequested, ProposalApproved, ProposalSuperseded.

**Dependencies:** Opportunity, Company, Contact, Sales Research, Competitive Intelligence, Knowledge, Evidence, CRM, and Digital Employee Intelligence.

**Future Digital Employees:** Nova for narrative; Sophia for fit and risk; Titan for commercial and CRM coordination.

**KPIs:** Proposal cycle time; requirement coverage; evidence coverage; review rework; approval rate; proposal-to-win conversion; unsupported-claim rate; reuse rate.

### 14. Appointment Intelligence Engine

**Purpose:** Coordinate appointment intent, availability, qualification context, preparation, attendance, and outcomes.

**Responsibilities:** Represent scheduling constraints, participant consent, meeting purpose, qualification state, calendar availability, handoffs, reminders, attendance, and post-meeting outcomes.

**Owned data:** Appointment, availability policy, participant set, scheduling session, meeting brief, attendance, outcome, reschedule history, and follow-up requirement.

**Public interfaces:** Find availability; propose appointment; confirm; reschedule; cancel; generate brief; record attendance; record outcome; create follow-up.

**Events:** AppointmentRequested, AvailabilityFound, AppointmentProposed, AppointmentConfirmed, AppointmentRescheduled, AppointmentCancelled, AppointmentStarted, AppointmentOutcomeRecorded.

**Dependencies:** Google or future calendar providers through Provider Router, Company, Contact, Qualification, Opportunity, CRM, Voice, WhatsApp, Evidence, and Audit.

**Future Digital Employees:** Echo for coordination; Titan for ownership and CRM; Sophia for meeting preparation.

**KPIs:** Time to book; booking conversion; attendance rate; reschedule rate; qualification-to-meeting rate; meeting-to-opportunity rate; preparation completeness; scheduling failure rate.

### 15. Continuous Learning Engine

**Purpose:** Improve policies, scores, research, Digital Employees, and workflows from governed outcomes and feedback.

**Responsibilities:** Capture labels, outcomes, experiments, drift, evaluation sets, policy changes, rollback points, and learning provenance without changing production behavior implicitly.

**Owned data:** Learning case, outcome label, feedback, experiment, evaluation set, model or policy candidate, result, approval, deployment record, and rollback marker.

**Public interfaces:** Record outcome; create evaluation set; run comparison; propose policy update; approve change; publish version; rollback; explain learning source.

**Events:** OutcomeRecorded, EvaluationSetCreated, ExperimentCompleted, PolicyChangeProposed, PolicyChangeApproved, LearningVersionPublished, LearningVersionRolledBack.

**Dependencies:** Analytics, Evidence, Audit, Knowledge, Revenue Scoring, Digital Employee Intelligence, and every engine that emits outcomes.

**Future Digital Employees:** Atlas for evidence curation; Sophia for evaluation interpretation; a future Learning Steward for governed change proposals.

**KPIs:** Outcome-label coverage; learning cycle time; validated lift; regression rate; drift detection time; rollback time; feedback acceptance; improvement attribution.

### 16. Atlas Knowledge Engine

**Purpose:** Provide governed, retrievable business knowledge for companies, contacts, employees, workflows, and decisions.

**Responsibilities:** Manage facts, definitions, policies, research, source lineage, confidence, freshness, access scope, approvals, contradictions, and invalidation.

**Owned data:** Knowledge record, fact, policy, definition, source, citation, embedding or retrieval reference, access rule, approval state, freshness state, and contradiction set.

**Public interfaces:** Publish knowledge; retrieve context; search; cite source; approve; invalidate; resolve contradiction; explain provenance; enforce access scope.

**Events:** KnowledgePublished, KnowledgeApproved, KnowledgeSuperseded, KnowledgeInvalidated, KnowledgeContradictionDetected, KnowledgeAccessDenied.

**Dependencies:** Evidence, Memory, Audit, shared types, provider-neutral retrieval and model ports, and all engines that publish or consume governed knowledge.

**Future Digital Employees:** Atlas as curator; Sophia as policy interpreter; every employee as a scoped consumer.

**KPIs:** Retrieval precision; citation coverage; freshness compliance; contradiction resolution time; unauthorized access rate; knowledge reuse; context acceptance rate.

### 17. Executive Dashboard

**Purpose:** Provide an executive read model of revenue health, intelligence quality, employee performance, risk, and learning.

**Responsibilities:** Define metric contracts, permissions, aggregation windows, drill-downs, alerts, narrative provenance, freshness, and tenant-safe cross-engine views.

**Owned data:** Dashboard definitions, metric definitions, materialized read models, alert rules, audience permissions, snapshot metadata, and narrative evidence references. It does not own source facts.

**Public interfaces:** Define dashboard; query metric; retrieve snapshot; drill into evidence; subscribe to alert; export authorized view; acknowledge alert.

**Events:** DashboardPublished, MetricSnapshotReady, ExecutiveAlertRaised, ExecutiveAlertAcknowledged, DashboardPermissionChanged.

**Dependencies:** Analytics, all engine event streams, Evidence, Audit, Knowledge, CRM, Opportunity, and tenant authorization.

**Future Digital Employees:** Titan for operational summaries; Sophia for strategic interpretation; a future Executive Briefing Employee.

**KPIs:** Metric freshness; dashboard query latency; evidence drill-down rate; alert precision; executive adoption; data completeness; permission violation rate.

### 18. Provider Router

**Purpose:** Select, govern, and observe provider capabilities without allowing domain engines to depend on provider identity.

**Responsibilities:** Register capabilities, route by policy and tenant, enforce credentials and data residency, manage fallback, rate limits, cost, health, quotas, retries, and provider contract versions.

**Owned data:** Provider registry, capability catalog, routing policy, tenant entitlement, credential reference, health state, quota state, cost record, fallback decision, and provider contract version.

**Public interfaces:** Discover capability; request route; execute capability call; report health; estimate cost; select fallback; inspect route decision; revoke provider access.

**Events:** ProviderRegistered, ProviderCapabilityChanged, RouteSelected, ProviderHealthChanged, ProviderQuotaExceeded, ProviderFallbackUsed, ProviderAccessRevoked.

**Dependencies:** Shared types, Audit, policy registry, secret boundary, observability, and all provider adapters. It must not own Company, Contact, or revenue domain data.

**Future Digital Employees:** Titan for operations; a future Provider Steward for cost and reliability governance.

**KPIs:** Route success rate; provider failover time; cost per capability call; quota utilization; latency; data-residency compliance; unsupported-capability rate; provider concentration risk.

### 19. Evidence Engine

**Purpose:** Make every material company, revenue, AI, and employee claim attributable, reviewable, and time-aware.

**Responsibilities:** Capture source records, observations, citations, authorization, extraction method, confidence, retention, redaction, freshness, and evidence relationships.

**Owned data:** Evidence record, source, observation, citation, authorization record, redaction record, confidence assessment, retention class, and evidence graph edges.

**Public interfaces:** Register source; capture observation; attach evidence; assess quality; cite; redact; expire; retrieve evidence graph; verify authorization.

**Events:** SourceRegistered, EvidenceCaptured, EvidenceAttached, EvidenceQualityAssessed, EvidenceRedacted, EvidenceExpired, EvidenceAuthorizationFailed.

**Dependencies:** Shared types, Knowledge, Audit, storage and retention ports, and every engine that produces or requires factual support.

**Future Digital Employees:** Atlas for collection; Sophia for evidence assessment; a future Evidence Steward for retention and quality.

**KPIs:** Evidence coverage; citation validity; source freshness; authorization failure rate; redaction accuracy; evidence retrieval latency; unresolved claim rate; retention compliance.

### 20. Audit Engine

**Purpose:** Provide immutable, queryable accountability for data access, decisions, policies, provider calls, employee actions, and administrative changes.

**Responsibilities:** Capture actor and tenant, intent, action, inputs and outputs references, policy decision, approval, outcome, correlation, retention, tamper evidence, and investigation workflows.

**Owned data:** Audit event, actor identity, tenant scope, action category, resource reference, policy decision, approval reference, correlation ID, integrity metadata, retention state, and investigation case.

**Public interfaces:** Append audit event; query trail; verify integrity; open investigation; export authorized record; apply retention; attest review.

**Events:** AuditEventAppended, AuditIntegrityVerified, AuditInvestigationOpened, AuditExportCreated, AuditRetentionApplied, AuditAccessDenied.

**Dependencies:** Core Events, Evidence, Knowledge policies, identity and authorization, retention, observability, and every engine that performs a state change or privileged read.

**Future Digital Employees:** Titan for operational review; a future Compliance Steward for investigations and attestations.

**KPIs:** Audit coverage; append durability; integrity verification rate; investigation time; unauthorized access detection; export accuracy; retention compliance; audit query latency.

## Cross-Engine Event Architecture

Events use a shared envelope containing event ID, event type, schema version, tenant ID, actor or system identity, occurred-at time, recorded-at time, correlation ID, causation ID, resource reference, policy version, evidence references, and data classification. Consumers use idempotency keys and checkpoints. Events are immutable; corrections are new events.

## Enterprise Scale For Millions Of Companies

- Partition by tenant and stable company or account key; isolate noisy tenants with quotas and workload pools.
- Keep authoritative records separate from derived read models, scores, embeddings, aggregates, and dashboard snapshots.
- Use append-only observations and events with independently managed retention and replay.
- Support regional residency, tenant-level encryption boundaries, deletion workflows, and policy-driven redaction.
- Design interfaces for asynchronous jobs, pagination, bulk operations, partial failure, backpressure, and resumability.
- Maintain schema registries and compatibility checks for every public interface and event.
- Make provider routing, cost, latency, quality, and concentration observable per tenant and capability.
- Enforce least privilege across employees, engines, evidence, memory, and audit records.
- Treat all derived intelligence as reproducible from versioned inputs, policies, evidence, and model references.

## Dependency Direction

Provider adapters point into Provider Router. Provider Router exposes capabilities to domain engines. Domain engines publish owned facts and decisions through shared types and events. Digital Employees consume approved interfaces through the Orchestrator. Evidence and Audit cross-cut every boundary without becoming substitutes for domain ownership.
