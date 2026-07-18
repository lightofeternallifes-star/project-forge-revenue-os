# Digital Brain Example

**Scenario:** Fictional organization Northstar Field Systems evaluates an AI-assisted revenue workflow.

## Canonical Graph

- Organization `org_northstar` owns User `user_maya` and Digital Employee `atlas_northstar`.
- Company `company_northstar` represents Northstar Field Systems.
- Contact `contact_jon` is linked to the Company and participates in Conversation `conversation_01`.
- Lead `lead_01` is created from a Research Session and later qualified into Opportunity `opportunity_01`.
- Opportunity `opportunity_01` creates Proposal `proposal_01` and Appointment `appointment_01`.
- Workflow `workflow_qualification_01` creates Tasks for Atlas and User Maya.
- Evidence Records `evidence_01` through `evidence_04` support company, contact, qualification, and appointment facts.
- Knowledge Record `knowledge_01` consolidates the approved qualification context.
- Memory `memory_01` stores scoped workflow context and expires after completion.
- Revenue Events record qualification, appointment completion, and proposal acceptance or rejection.
- Notifications inform User Maya of approval and appointment outcomes.
- Audit Records capture every read of protected contact data, employee recommendation, approval, and state change.

## Example Decision

Atlas proposes that the Lead is ready for human qualification because the Company Profile is current, the Contact role is supported by recent evidence, and a Research Session identified a documented operations problem. Sophia cannot convert the Lead directly: it emits a recommendation with evidence and confidence. The Workflow requests User approval, creates an Appointment after approval, and emits Revenue Events after attendance and outcome capture.

## Provider Independence

The graph does not change if company evidence came from a website, CRM, Apollo, Clay, or another authorized source. The provider appears only in Evidence provenance and Provider Router audit context.
