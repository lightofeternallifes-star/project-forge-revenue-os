# Digital Brain Event Catalog

## Event Envelope

Every event includes event_id, event_type, schema_version, organization_id, actor_ref, occurred_at, recorded_at, correlation_id, causation_id, resource_ref, policy_version, evidence_refs, data_classification, idempotency_key, and retention_class.

## Entity Events

| Entity | Event families |
| --- | --- |
| Company | CompanyCreated, CompanyResolved, CompanyUpdated, CompanyMerged, CompanyArchived |
| Contact | ContactCreated, ContactResolved, ContactRoleChanged, ContactConsentChanged, ContactSuppressed |
| Digital Employee | EmployeePublished, TaskAssigned, ApprovalRequested, ActionApproved, EmployeeEscalated, EmployeeRetired |
| Conversation | ConversationOpened, MessageRecorded, IntentUpdated, ConversationEscalated, ConversationResolved |
| Lead | LeadCaptured, LeadEnriched, LeadEngaged, LeadQualified, LeadDisqualified, LeadConverted |
| Opportunity | OpportunityDetected, OpportunityQualified, OpportunityStageChanged, OpportunityWon, OpportunityLost |
| Proposal | ProposalRequested, ProposalDrafted, ProposalApproved, ProposalSent, ProposalAccepted, ProposalRejected |
| Appointment | AppointmentRequested, AppointmentConfirmed, AppointmentRescheduled, AppointmentStarted, AppointmentCompleted, AppointmentCancelled |
| Task | TaskCreated, TaskAssigned, TaskStarted, ApprovalRequested, TaskCompleted, TaskFailed, TaskCancelled |
| Campaign | CampaignCreated, CampaignActivated, CampaignPaused, CampaignMemberAdded, CampaignCompleted |
| Revenue Event | RevenueEventRecorded, RevenueEventValidated, RevenueEventAttributed, RevenueEventCorrected |
| Knowledge Record | KnowledgeProposed, KnowledgeApproved, KnowledgePublished, KnowledgeSuperseded, KnowledgeInvalidated |
| Evidence Record | EvidenceCaptured, EvidenceAttached, EvidenceAssessed, EvidenceRedacted, EvidenceExpired |
| Research Session | ResearchSessionRequested, ResearchStarted, FindingAdded, ResearchPublished, ResearchExpired |
| Memory | MemoryCreated, MemoryAccessed, MemoryConsolidated, MemorySuperseded, MemoryExpired |
| Workflow | WorkflowPublished, WorkflowStarted, WorkflowStepCompleted, WorkflowBlocked, WorkflowCompleted, WorkflowFailed |
| Organization | OrganizationProvisioned, OrganizationUpdated, OrganizationSuspended, OrganizationClosed |
| User | UserInvited, UserActivated, UserRoleChanged, UserSuspended, UserDeactivated |
| Notification | NotificationCreated, NotificationQueued, NotificationDelivered, NotificationAcknowledged, NotificationFailed |
| Audit Record | AuditAppended, AuditVerified, InvestigationOpened, AuditExported, AuditRetentionApplied |

## Consumption Rules

Events are facts, not commands. Consumers must be idempotent, tolerate retries and reordering, checkpoint progress, validate schema versions, and emit a new event for correction. Event payloads reference canonical entities and evidence rather than duplicating sensitive content.
