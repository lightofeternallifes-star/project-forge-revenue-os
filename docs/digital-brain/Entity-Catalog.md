# Digital Brain Entity Catalog

All entities use a stable `entity_id`, `organization_id`, `created_at`, `updated_at`, `lifecycle_status`, `schema_version`, `entity_version`, `provenance_refs`, `evidence_refs`, and `audit_refs` unless a field below further constrains them. Required fields are marked **required**.

## 1. Company

- **Purpose:** Canonical organizational identity and business context.
- **Description:** A legal, commercial, nonprofit, public, or other organization represented as one governed profile.
- **Ownership:** Company Intelligence Engine owns the profile; Contact, CRM, and Opportunity engines hold references.
- **Lifecycle:** Discovered, verified, active, inactive, merged, dissolved, archived.
- **Required fields:** company_id, organization_id, legal_name or display_name, entity_type, lifecycle_status, identity_confidence.
- **Optional fields:** domains, registration_ids, parent_id, subsidiary_ids, locations, departments, industries, services, products, digital_presence, technology_stack, business_hours, signals, scores.
- **Relationships:** Belongs to Organization; has Contacts, Leads, Opportunities, Proposals, Conversations, Appointments, Campaign memberships, and Evidence.
- **Events emitted:** CompanyCreated, CompanyResolved, CompanyUpdated, CompanyMerged, CompanyArchived.
- **Events consumed:** EvidenceCaptured, ResearchCompleted, CRMRecordObserved, RevenueEventRecorded.
- **Permissions:** Tenant-scoped read; restricted identity merge and sensitive fields; write through Company Intelligence policy.
- **Retention policy:** Retain while active and for the tenant-defined legal or analytical period after archival; evidence may have shorter retention.
- **Evidence requirements:** Identity, material attributes, scores, and inferences require field-level provenance and evidence or explicit unknown status.
- **Versioning strategy:** Immutable profile versions; observations and policy versions remain linked to each published version.
- **Provider independence:** Provider identifiers are references only; no provider schema is canonical.
- **Future API contract:** get, resolve, create observation, propose update, compare versions, publish, and subscribe to company events.

## 2. Contact

- **Purpose:** Canonical person, role, relationship, and communication context.
- **Description:** A person associated with one or more organizations, including role history and consent state.
- **Ownership:** Contact Intelligence Engine owns the person profile; Company and CRM engines reference it.
- **Lifecycle:** Discovered, verified, active, changed role, unreachable, suppressed, merged, archived.
- **Required fields:** contact_id, organization_id, display_name, identity_confidence, lifecycle_status, consent_state.
- **Optional fields:** email addresses, phone numbers, social handles, titles, departments, seniority, role history, influence, relationship status, timezone, preferences.
- **Relationships:** Linked to Companies, Departments, Leads, Opportunities, Conversations, Appointments, Tasks, and Users where authorized.
- **Events emitted:** ContactCreated, ContactResolved, ContactRoleChanged, ContactConsentChanged, ContactSuppressed, ContactMerged.
- **Events consumed:** CompanyUpdated, EvidenceCaptured, ConversationCompleted, CRMRecordObserved.
- **Permissions:** Tenant-scoped; sensitive channels require purpose limitation and consent-aware access; contact export is governed.
- **Retention policy:** Retain according to consent, jurisdiction, relationship, and tenant policy; suppression records may outlive contact content.
- **Evidence requirements:** Identity, role, channel reachability, consent, and relationship claims require attributable evidence.
- **Versioning strategy:** Version profile and role observations independently; never overwrite consent history.
- **Provider independence:** Source-specific contact IDs remain external references under provenance.
- **Future API contract:** resolve, get, link to company, update consent, record observation, suppress, and subscribe.

## 3. Digital Employee

- **Purpose:** Represent a bounded AI worker role with explicit authority and accountability.
- **Description:** A versioned role definition, not an unconstrained model or autonomous persona.
- **Ownership:** Digital Employee Intelligence Engine owns definitions, capabilities, evaluations, and task history.
- **Lifecycle:** Draft, reviewed, active, paused, restricted, deprecated, retired.
- **Required fields:** employee_id, organization_id, role_name, role_version, capability_policy, lifecycle_status, owner_user_id.
- **Optional fields:** tools, memory_scope, model_policy, approval_policy, escalation_policy, evaluation_set, cost_budget, performance_summary.
- **Relationships:** Uses Workflows, Tasks, Memory, Knowledge, Evidence, Notifications, and canonical business entities.
- **Events emitted:** EmployeePublished, TaskAssigned, ApprovalRequested, ActionApproved, EmployeeEscalated, EmployeeRetired.
- **Events consumed:** TaskCreated, WorkflowTransitioned, PolicyChanged, RevenueEventRecorded, FeedbackRecorded.
- **Permissions:** Least privilege by tool, entity, field, tenant, geography, and action; consequential actions require policy approval.
- **Retention policy:** Keep task, approval, audit, and outcome records according to compliance policy; ephemeral context expires quickly.
- **Evidence requirements:** Recommendations and actions require context references, policy version, confidence, and evidence where factual.
- **Versioning strategy:** Role, capability, prompt/model policy, and evaluation versions are immutable once published.
- **Provider independence:** Model and tool providers are selected through Provider Router, never embedded in the role identity.
- **Future API contract:** register, publish version, assign task, request approval, execute approved action, record outcome, evaluate.

## 4. Conversation

- **Purpose:** Canonical thread of human, Digital Employee, and channel interactions.
- **Description:** A time-ordered interaction context independent of email, voice, WhatsApp, or other channel transport.
- **Ownership:** Conversation and channel engines own thread state; Contact and Company are referenced.
- **Lifecycle:** Opened, active, waiting, escalated, resolved, closed, retained, deleted.
- **Required fields:** conversation_id, organization_id, participant_refs, channel_type, state, started_at, consent_context.
- **Optional fields:** messages, attachments, intent, sentiment, language, priority, owner_ref, summary, next_action, appointment_ref.
- **Relationships:** Involves Contacts, Companies, Leads, Opportunities, Tasks, Appointments, Campaigns, and Digital Employees.
- **Events emitted:** ConversationOpened, MessageRecorded, IntentUpdated, ConversationEscalated, ConversationResolved, ConversationClosed.
- **Events consumed:** ContactConsentChanged, TaskAssigned, AppointmentCreated, PolicyChanged.
- **Permissions:** Participant and tenant scoped; message content, transcripts, and attachments require channel and purpose authorization.
- **Retention policy:** Channel and jurisdiction policy determines content retention; metadata may be retained longer for audit.
- **Evidence requirements:** Summaries, classifications, and decisions link to message or transcript references and confidence.
- **Versioning strategy:** Append-only messages; versioned summaries, classifications, and policy decisions.
- **Provider independence:** Channel transport and model inference are adapters behind the conversation contract.
- **Future API contract:** open, append message, classify, assign, escalate, resolve, retrieve context, and subscribe.

## 5. Lead

- **Purpose:** Represent a potential revenue relationship before qualification is complete.
- **Description:** A canonical prospect record connecting a Company or Contact to an acquisition or qualification context.
- **Ownership:** Lead Qualification Engine owns lead state; Company, Contact, Campaign, and Opportunity engines contribute references.
- **Lifecycle:** Captured, enriched, attempted, engaged, qualified, disqualified, converted, recycled, suppressed.
- **Required fields:** lead_id, organization_id, subject_ref, source_context, lifecycle_status, qualification_state.
- **Optional fields:** campaign_ref, score_refs, intent_signals, owner_ref, consent, next_action, disqualification_reason, conversion_ref.
- **Relationships:** References Company and Contact; may convert to Opportunity and generate Conversations, Tasks, and Appointments.
- **Events emitted:** LeadCaptured, LeadEnriched, LeadEngaged, LeadQualified, LeadDisqualified, LeadConverted, LeadSuppressed.
- **Events consumed:** CompanyUpdated, ContactUpdated, CampaignMemberAdded, ConversationIntentUpdated, ScoreCalculated.
- **Permissions:** Tenant-scoped; qualification write access restricted to policy-approved roles and employees.
- **Retention policy:** Retain active and converted history; suppress or delete personal content per consent and jurisdiction policy.
- **Evidence requirements:** Source, qualification criteria, score factors, and conversion must be evidence-linked.
- **Versioning strategy:** State transitions are evented; lead snapshots are versioned and never silently rewritten.
- **Provider independence:** Source context names a provider-neutral acquisition source class, not a vendor schema.
- **Future API contract:** capture, enrich, qualify, disqualify, convert, suppress, assign, and explain.

## 6. Opportunity

- **Purpose:** Represent a qualified or hypothesized path to revenue.
- **Description:** A governed commercial possibility with value, stage, need, owner, and expected next action.
- **Ownership:** Revenue Opportunity Engine owns opportunity lifecycle and interpretation.
- **Lifecycle:** Hypothesized, qualified, discovery, proposal, negotiation, won, lost, paused, reopened, closed.
- **Required fields:** opportunity_id, organization_id, account_ref, lifecycle_stage, owner_ref, confidence, created_at.
- **Optional fields:** contact_refs, value_estimate, currency, close_target, need_summary, competitor_refs, proposal_ref, appointment_refs, loss_reason.
- **Relationships:** Belongs to Company; involves Contacts, Leads, Conversations, Proposals, Appointments, Tasks, Campaigns, and Revenue Events.
- **Events emitted:** OpportunityDetected, OpportunityQualified, OpportunityStageChanged, OpportunityWon, OpportunityLost, OpportunityReopened.
- **Events consumed:** LeadQualified, AppointmentOutcomeRecorded, ProposalApproved, RevenueEventRecorded, ScoreCalculated.
- **Permissions:** Tenant-scoped; financial estimates and stage changes require role or policy authorization.
- **Retention policy:** Retain commercial history for tenant and regulatory reporting period; redact unnecessary personal content.
- **Evidence requirements:** Stage, value, forecast, and win or loss reason require supporting evidence or explicit confidence.
- **Versioning strategy:** Stage and forecast changes are immutable events; current view is derived.
- **Provider independence:** CRM and payment systems are sources of observations, not opportunity owners.
- **Future API contract:** create hypothesis, qualify, advance, assign, forecast, close, reopen, and explain.

## 7. Proposal

- **Purpose:** Represent a grounded commercial response to an opportunity.
- **Description:** Requirements, solution mapping, commercial assumptions, approvals, and proposal versions.
- **Ownership:** Proposal Intelligence Engine owns proposal intelligence and approval state.
- **Lifecycle:** Requested, drafting, review, approved, sent, revised, accepted, rejected, expired, withdrawn.
- **Required fields:** proposal_id, organization_id, opportunity_ref, version, lifecycle_status, owner_ref.
- **Optional fields:** requirements, solution_mapping, pricing_refs, assumptions, risks, document_ref, recipients, approval_refs, expiration_at.
- **Relationships:** Belongs to Opportunity; references Company, Contact, Product, Service, Evidence, Knowledge, Tasks, and Revenue Events.
- **Events emitted:** ProposalRequested, ProposalDrafted, ProposalReviewRequested, ProposalApproved, ProposalSent, ProposalAccepted, ProposalRejected.
- **Events consumed:** OpportunityStageChanged, ResearchCompleted, CompetitiveObservationRecorded, ApprovalCompleted, ConversationUpdated.
- **Permissions:** Need-to-know by tenant, opportunity, role, and commercial sensitivity; external sharing requires approval.
- **Retention policy:** Retain accepted and rejected proposal history per commercial policy; drafts expire based on sensitivity.
- **Evidence requirements:** Requirements, claims, pricing assumptions, and solution mapping require evidence or explicit assumption labels.
- **Versioning strategy:** Immutable proposal versions; superseding versions preserve prior approvals and content hashes.
- **Provider independence:** Document and e-signature systems are adapters; the proposal contract owns meaning and state.
- **Future API contract:** create, capture requirements, draft, review, approve, send, compare versions, and withdraw.

## 8. Appointment

- **Purpose:** Represent an agreed or proposed time-bound business interaction.
- **Description:** Scheduling intent, participants, purpose, availability, attendance, and outcome independent of calendar provider.
- **Ownership:** Appointment Intelligence Engine owns appointment state and outcome context.
- **Lifecycle:** Requested, proposed, confirmed, rescheduled, started, completed, no-show, cancelled, expired.
- **Required fields:** appointment_id, organization_id, participant_refs, purpose, state, timezone, scheduling_policy.
- **Optional fields:** calendar_ref, location, meeting_link, agenda, preparation_ref, reminders, attendance, outcome, reschedule_history.
- **Relationships:** References Company, Contact, Lead, Opportunity, Conversation, Proposal, Task, User, and Digital Employee.
- **Events emitted:** AppointmentRequested, AppointmentProposed, AppointmentConfirmed, AppointmentRescheduled, AppointmentStarted, AppointmentCompleted, AppointmentCancelled.
- **Events consumed:** QualificationCompleted, AvailabilityFound, ConversationIntentUpdated, ContactConsentChanged, WorkflowTransitioned.
- **Permissions:** Participant, tenant, and calendar-scope authorization; booking or cancellation may require approval.
- **Retention policy:** Retain scheduling and outcome metadata per tenant policy; meeting content follows channel and consent policy.
- **Evidence requirements:** Confirmation, attendance, outcome, and qualification claims require event or participant evidence.
- **Versioning strategy:** Appointment state transitions are evented; briefs and outcomes are versioned records.
- **Provider independence:** Calendars, conferencing, and voice providers are routed capabilities only.
- **Future API contract:** find availability, propose, confirm, reschedule, cancel, start, complete, and record outcome.

## 9. Task

- **Purpose:** Represent accountable work assigned to a human, engine, or Digital Employee.
- **Description:** A bounded unit of work with owner, inputs, policy, due time, state, and outcome.
- **Ownership:** Core Workflow and Orchestrator own task coordination; the originating engine owns task meaning.
- **Lifecycle:** Created, assigned, queued, in progress, blocked, awaiting approval, completed, failed, cancelled, expired.
- **Required fields:** task_id, organization_id, task_type, owner_ref, state, priority, created_at, idempotency_key.
- **Optional fields:** due_at, dependency_refs, input_refs, output_refs, approval_ref, retry_policy, escalation_ref, cost_budget.
- **Relationships:** Created by Workflows; references every business or intelligence entity and may be owned by a User or Digital Employee.
- **Events emitted:** TaskCreated, TaskAssigned, TaskStarted, TaskBlocked, ApprovalRequested, TaskCompleted, TaskFailed, TaskCancelled.
- **Events consumed:** WorkflowTransitioned, PolicyChanged, ApprovalCompleted, ProviderCapabilityChanged, EntityUpdated.
- **Permissions:** Assignment and execution are capability-scoped; task content follows referenced entity permissions.
- **Retention policy:** Keep task state, outcomes, and audit references per operational policy; ephemeral inputs may expire earlier.
- **Evidence requirements:** Completion claims and consequential outputs require output references, actor identity, and policy context.
- **Versioning strategy:** Task definition and execution attempt are versioned; state is an event-derived view.
- **Provider independence:** Tasks call capability contracts through workflows and Provider Router.
- **Future API contract:** create, assign, start, pause, approve, complete, retry, cancel, and retrieve trace.

## 10. Campaign

- **Purpose:** Represent a governed, measurable set of coordinated revenue activities.
- **Description:** Audience, intent, message or channel strategy, eligibility, schedule, budget, and outcome attribution.
- **Ownership:** Campaign engine owns campaign definition and membership policy; Outreach and Analytics consume it.
- **Lifecycle:** Draft, reviewed, active, paused, completed, cancelled, archived.
- **Required fields:** campaign_id, organization_id, name, objective, audience_policy, state, owner_ref.
- **Optional fields:** channel_policy, message_refs, segment_refs, budget, schedule, suppression_policy, experiment_ref, success_criteria.
- **Relationships:** Targets Companies, Contacts, Leads, Opportunities, Conversations, Tasks, and Revenue Events.
- **Events emitted:** CampaignCreated, CampaignReviewed, CampaignActivated, CampaignPaused, CampaignMemberAdded, CampaignCompleted, CampaignCancelled.
- **Events consumed:** AudienceQualified, ConsentChanged, MessageOutcomeRecorded, OpportunityCreated, PolicyChanged.
- **Permissions:** Tenant and role scoped; activation, audience export, and spend require explicit authorization.
- **Retention policy:** Retain campaign definition, membership decisions, and outcomes for attribution period; redact unnecessary content.
- **Evidence requirements:** Audience eligibility, objective, claims, and performance conclusions require evidence and policy references.
- **Versioning strategy:** Immutable campaign definitions and audience snapshots; activation creates a versioned execution plan.
- **Provider independence:** Channels and providers implement capability ports; Campaign owns intent and governance.
- **Future API contract:** create, review, activate, pause, add member, measure, complete, and compare versions.

## 11. Revenue Event

- **Purpose:** Capture an attributable business outcome or material revenue-state change.
- **Description:** A canonical fact such as qualified lead, meeting held, proposal accepted, opportunity won, expansion, churn, or support outcome.
- **Ownership:** Revenue Analytics and the originating domain engine co-own event semantics; the event log owns durability.
- **Lifecycle:** Observed, validated, attributed, corrected, superseded, retained, expired.
- **Required fields:** revenue_event_id, organization_id, event_type, subject_refs, occurred_at, source_ref, confidence.
- **Optional fields:** value, currency, attribution_refs, campaign_ref, opportunity_ref, actor_ref, reason, correction_ref, revenue_period.
- **Relationships:** Refers to Companies, Contacts, Leads, Opportunities, Proposals, Appointments, Campaigns, Conversations, and Users.
- **Events emitted:** RevenueEventRecorded, RevenueEventValidated, RevenueEventAttributed, RevenueEventCorrected, RevenueEventSuperseded.
- **Events consumed:** Every engine outcome and approved external observation.
- **Permissions:** Append by authorized engines; read by tenant roles and analytics policies; financial values may be restricted.
- **Retention policy:** Retain according to financial, contractual, and analytics requirements; corrections never erase original events.
- **Evidence requirements:** Every event has source, actor, timestamp, confidence, and evidence or a declared provisional state.
- **Versioning strategy:** Immutable event identity; corrections and reattribution are new linked events.
- **Provider independence:** Payment, CRM, calendar, and channel systems produce observations only.
- **Future API contract:** record, validate, attribute, correct, query, aggregate, and subscribe.

## 12. Knowledge Record

- **Purpose:** Store governed facts, definitions, policies, and approved interpretations.
- **Description:** A retrievable unit of organizational knowledge with source, scope, confidence, and freshness.
- **Ownership:** Atlas Knowledge Engine owns publication, approval, access, contradiction, and invalidation.
- **Lifecycle:** Draft, proposed, approved, published, superseded, invalidated, archived.
- **Required fields:** knowledge_record_id, organization_id, record_type, statement, status, source_refs, confidence.
- **Optional fields:** subject_refs, policy_refs, tags, embeddings_ref, validity_window, access_scope, review_owner, contradiction_refs.
- **Relationships:** Supports every entity and may be created from Evidence, Research Sessions, Revenue Events, and user decisions.
- **Events emitted:** KnowledgeProposed, KnowledgeApproved, KnowledgePublished, KnowledgeSuperseded, KnowledgeInvalidated.
- **Events consumed:** EvidenceCaptured, ResearchCompleted, PolicyChanged, FeedbackRecorded, EntityUpdated.
- **Permissions:** Field and record access by tenant, role, classification, purpose, and geography; policy records may be narrower.
- **Retention policy:** Retain published knowledge while valid and for historical audit; invalidate rather than silently delete.
- **Evidence requirements:** Facts require evidence; interpretations require evidence and confidence; policy requires owner and approval.
- **Versioning strategy:** Immutable record versions with supersession links and effective dates.
- **Provider independence:** Retrieval, embedding, and model providers are replaceable capabilities.
- **Future API contract:** propose, approve, publish, search, retrieve context, cite, supersede, invalidate, and explain.

## 13. Evidence Record

- **Purpose:** Provide attributable support for facts, inferences, decisions, and outcomes.
- **Description:** A source-backed observation with capture, authorization, quality, retention, and locator metadata.
- **Ownership:** Evidence Engine owns source registration, quality, redaction, retention, and attachment graph.
- **Lifecycle:** Registered, captured, assessed, attached, redacted, expired, disputed, retained.
- **Required fields:** evidence_id, organization_id, source_type, source_ref, observed_at, captured_at, authorization_basis, confidence.
- **Optional fields:** locator, extraction_method, content_hash, redaction_ref, quality_assessment, retention_class, subject_refs, citation_text.
- **Relationships:** Supports all canonical entities, Knowledge Records, Research Sessions, Scores, and Audit Records.
- **Events emitted:** EvidenceCaptured, EvidenceAttached, EvidenceAssessed, EvidenceRedacted, EvidenceExpired, EvidenceDisputed.
- **Events consumed:** ProviderObservationReceived, DocumentUploaded, ResearchFindingCreated, UserCorrectionRecorded.
- **Permissions:** Source and content access is classification and purpose limited; sensitive evidence is separately encrypted or referenced.
- **Retention policy:** Source-specific and jurisdiction-specific; retention state is explicit and deletion is auditable.
- **Evidence requirements:** Evidence records are the requirement itself; each must state authorization, source, time, and confidence.
- **Versioning strategy:** Append-only observations; assessments and redactions are superseding versions.
- **Provider independence:** A provider is a source attribute, never the evidence owner or canonical truth.
- **Future API contract:** register source, capture, attach, assess, cite, redact, expire, retrieve graph, and verify authorization.

## 14. Research Session

- **Purpose:** Organize an authorized investigation into a company, contact, market, opportunity, or workflow question.
- **Description:** Questions, tasks, findings, sources, synthesis, confidence, and completion state for research work.
- **Ownership:** Sales Research or Competitive Intelligence owns session intent; Evidence and Knowledge own supporting records.
- **Lifecycle:** Requested, planned, active, blocked, review, published, expired, cancelled.
- **Required fields:** research_session_id, organization_id, subject_refs, objective, status, owner_ref, started_at.
- **Optional fields:** questions, source_plan, task_refs, finding_refs, synthesis, confidence, review_ref, expires_at.
- **Relationships:** Targets Companies, Contacts, Opportunities, Competitors, Knowledge, Evidence, Tasks, and Digital Employees.
- **Events emitted:** ResearchSessionRequested, ResearchStarted, FindingAdded, ResearchBlocked, ResearchPublished, ResearchExpired.
- **Events consumed:** TaskCompleted, EvidenceCaptured, ProviderCapabilityChanged, KnowledgeUpdated, FeedbackRecorded.
- **Permissions:** Tenant, project, and source-purpose scoped; unpublished research may be restricted to reviewers.
- **Retention policy:** Keep published findings and citations; discard ephemeral scratch context on session expiry.
- **Evidence requirements:** Every published finding links to Evidence Records and identifies fact versus inference.
- **Versioning strategy:** Questions, findings, and synthesis are independently versioned; publication creates a session version.
- **Provider independence:** Research source selection is policy-driven through Provider Router.
- **Future API contract:** create, plan, assign, add finding, assess, publish, refresh, and compare sessions.

## 15. Memory

- **Purpose:** Provide scoped context for decisions and work without becoming an ungoverned data lake.
- **Description:** A governed memory item or collection with scope, lifetime, provenance, relevance, and access policy.
- **Ownership:** Core Memory layer owns memory lifecycle; originating engines own semantic content.
- **Lifecycle:** Created, active, superseded, expired, invalidated, deleted.
- **Required fields:** memory_id, organization_id, memory_scope, content_ref, created_at, expires_at or retention_class, provenance_refs.
- **Optional fields:** subject_refs, relevance, embedding_ref, access_scope, sensitivity, consolidation_ref, supersedes_ref, feedback.
- **Relationships:** References every entity, Workflow, Digital Employee, Knowledge Record, Evidence Record, and Conversation as permitted.
- **Events emitted:** MemoryCreated, MemoryAccessed, MemoryConsolidated, MemorySuperseded, MemoryExpired, MemoryDeleted.
- **Events consumed:** EntityUpdated, ConversationClosed, WorkflowCompleted, KnowledgePublished, RetentionPolicyChanged.
- **Permissions:** Tenant, employee, workflow, field, and purpose scoped; access is logged and can be denied by policy.
- **Retention policy:** Short-term, durable, and episodic classes have explicit TTL and deletion behavior; no indefinite default.
- **Evidence requirements:** Durable facts in memory point to Knowledge or Evidence; transient state points to its workflow and actor.
- **Versioning strategy:** Memory writes are append or superseding records; retrieval snapshots include version and policy context.
- **Provider independence:** Vector, graph, database, and model systems are storage or retrieval capabilities only.
- **Future API contract:** write, retrieve, search, consolidate, invalidate, expire, explain provenance, and evaluate access.

## 16. Workflow

- **Purpose:** Coordinate canonical entities, tasks, approvals, events, and bounded actions.
- **Description:** A versioned definition and an execution instance that moves work through explicit states.
- **Ownership:** Core Workflow and Orchestrator own definitions and execution state; domain engines own business meaning.
- **Lifecycle:** Draft, published, queued, active, blocked, awaiting approval, completed, failed, cancelled, retired.
- **Required fields:** workflow_id, organization_id, workflow_type, definition_version, state, trigger, created_at.
- **Optional fields:** input_refs, step_refs, task_refs, policy_refs, approval_refs, retry_policy, compensation_plan, outcome_ref.
- **Relationships:** Coordinates all entity types and may be initiated by a User, Digital Employee, event, or authorized system.
- **Events emitted:** WorkflowPublished, WorkflowStarted, WorkflowStepCompleted, WorkflowBlocked, WorkflowApprovalRequested, WorkflowCompleted, WorkflowFailed.
- **Events consumed:** Any canonical event permitted by the workflow definition.
- **Permissions:** Definition publishing, execution, approval, and cancellation are separate capabilities; tenant scoped.
- **Retention policy:** Retain definitions and execution traces according to operational and audit policy; ephemeral step context expires.
- **Evidence requirements:** Inputs, decisions, approvals, outputs, and failures reference evidence, policy, or actor context where material.
- **Versioning strategy:** Definitions are immutable after publication; each execution pins one definition version.
- **Provider independence:** Workflows invoke capability contracts through Provider Router, never provider endpoints.
- **Future API contract:** publish, start, pause, resume, approve, cancel, retry, inspect, and replay.

## 17. Organization

- **Purpose:** Define the tenant, ownership, policy, and security boundary for Revenue OS data.
- **Description:** A customer or operating entity that owns users, data, configurations, policies, and billing scope.
- **Ownership:** Organization and identity control plane owns tenant identity and governance.
- **Lifecycle:** Provisioning, active, suspended, closing, closed, deleted.
- **Required fields:** organization_id, legal_name, display_name, lifecycle_status, residency_region, created_at.
- **Optional fields:** domains, policy_refs, entitlements, billing_refs, default_timezone, departments, data_classification_defaults.
- **Relationships:** Owns Users, Companies, Contacts, Digital Employees, Workflows, Campaigns, and all tenant-scoped entities.
- **Events emitted:** OrganizationProvisioned, OrganizationUpdated, OrganizationSuspended, OrganizationClosed, OrganizationDeleted.
- **Events consumed:** BillingStateChanged, SecurityPolicyChanged, RetentionPolicyChanged, UserMembershipChanged.
- **Permissions:** Organization administrators govern membership and policy; platform operators are separately audited and restricted.
- **Retention policy:** Governance and audit records follow legal retention; deletion requires a verified tenant erasure workflow.
- **Evidence requirements:** Legal identity, residency, administrator actions, and policy changes require audit and authorization evidence.
- **Versioning strategy:** Policy and membership snapshots are versioned; organization identity is stable.
- **Provider independence:** Organization identity is not a provider account or CRM workspace.
- **Future API contract:** create, configure, manage members, set policy, suspend, export, and delete.

## 18. User

- **Purpose:** Represent a human identity acting within an Organization.
- **Description:** An authenticated person with memberships, roles, preferences, and delegated authority.
- **Ownership:** Identity and Access layer owns User identity and membership; business engines reference user IDs.
- **Lifecycle:** Invited, active, suspended, deactivated, deleted.
- **Required fields:** user_id, organization_memberships, display_name, authentication_subject, status.
- **Optional fields:** email, phone, timezone, locale, role_assignments, notification_preferences, manager_ref, last_seen_at.
- **Relationships:** Member of Organizations; owns Tasks, Approvals, Campaigns, Opportunities, Appointments, and Digital Employee oversight.
- **Events emitted:** UserInvited, UserActivated, UserRoleChanged, UserSuspended, UserDeactivated, UserDeleted.
- **Events consumed:** OrganizationProvisioned, PermissionPolicyChanged, TaskAssigned, ApprovalRequested.
- **Permissions:** Users receive least-privilege roles and scoped grants; authentication identity and profile data are protected.
- **Retention policy:** Membership and audit references may outlive profile content; personal fields follow deletion policy.
- **Evidence requirements:** Authentication, role changes, approvals, and consequential actions require audit evidence.
- **Versioning strategy:** Membership and role grants are time-bounded versions; identity subject is stable while profile fields change.
- **Provider independence:** Authentication providers are replaceable identity adapters.
- **Future API contract:** invite, activate, update profile, assign role, suspend, revoke session, and retrieve authorization context.

## 19. Notification

- **Purpose:** Deliver governed alerts, approvals, reminders, and status updates to authorized recipients.
- **Description:** A provider-neutral notification intent with audience, urgency, content reference, channel policy, and delivery state.
- **Ownership:** Notification service owns notification lifecycle; originating engines own semantic reason.
- **Lifecycle:** Draft, queued, sent, delivered, acknowledged, dismissed, failed, expired, cancelled.
- **Required fields:** notification_id, organization_id, recipient_refs, notification_type, priority, state, created_at.
- **Optional fields:** subject_ref, message_ref, channel_preferences, action_refs, expires_at, delivery_attempts, acknowledgement, template_version.
- **Relationships:** References Users, Digital Employees, Tasks, Appointments, Conversations, Workflows, Opportunities, and Audit Records.
- **Events emitted:** NotificationCreated, NotificationQueued, NotificationDelivered, NotificationAcknowledged, NotificationFailed, NotificationExpired.
- **Events consumed:** ApprovalRequested, AppointmentReminderDue, TaskAssigned, RiskDetected, WorkflowBlocked, ExecutiveAlertRaised.
- **Permissions:** Recipient and tenant scoped; content must respect referenced entity permissions and channel consent.
- **Retention policy:** Delivery metadata follows operational policy; content and sensitive payloads expire according to classification.
- **Evidence requirements:** Notifications that trigger actions retain template, recipient, policy, and delivery evidence.
- **Versioning strategy:** Template and payload references are versioned; delivery attempts are append-only.
- **Provider independence:** Email, voice, WhatsApp, push, and in-app channels are routed capabilities.
- **Future API contract:** create, queue, deliver, acknowledge, dismiss, cancel, retry, and query delivery.

## 20. Audit Record

- **Purpose:** Preserve immutable accountability for access, decisions, mutations, approvals, and policy enforcement.
- **Description:** A tamper-evident record of who or what did what, to which resource, under which policy, and with what outcome.
- **Ownership:** Audit Engine owns append, integrity, retention, investigation, and authorized export.
- **Lifecycle:** Appended, verified, investigated, exported, retained, expired under policy.
- **Required fields:** audit_id, organization_id, occurred_at, actor_ref, action, resource_ref, decision, correlation_id, integrity_metadata.
- **Optional fields:** before_ref, after_ref, evidence_refs, approval_ref, reason, source_ip, session_ref, retention_state, investigation_ref.
- **Relationships:** References every entity, User, Digital Employee, Workflow, Provider Router decision, Evidence Record, and permission decision.
- **Events emitted:** AuditAppended, AuditVerified, InvestigationOpened, AuditExported, AuditRetentionApplied, AuditAccessDenied.
- **Events consumed:** Every privileged read, write, approval, provider route, employee action, and policy decision.
- **Permissions:** Append is broadly available through the audit boundary; read, export, and investigation require elevated audited permissions.
- **Retention policy:** Immutable records follow legal, security, and tenant retention requirements; expiration itself is audited.
- **Evidence requirements:** The Audit Record is evidence of action and must include actor, resource, policy, and correlation context.
- **Versioning strategy:** Audit records are immutable; corrections append a linked correction record.
- **Provider independence:** Provider names may appear as action context but never define audit semantics.
- **Future API contract:** append, query, verify integrity, investigate, export, attest, and apply retention.
