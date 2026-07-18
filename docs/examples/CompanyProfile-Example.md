# CompanyProfile Example: Northstar Field Systems

**Purpose:** Fictional, fully populated example of the proposed CompanyProfile contract.
**Status:** Illustrative only; no real company or provider data is represented.

## Envelope And Governance

- `profile_id`: `company_nfs_0001`
- `profile_version`: `7`
- `schema_version`: `0.1`
- `tenant_id`: `tenant_example_revenue_team`
- `lifecycle_status`: `active`
- `created_at`: `2031-04-12T14:00:00Z`
- `updated_at`: `2031-06-18T16:30:00Z`
- `last_verified_at`: `2031-06-18T16:00:00Z`
- `data_quality`: 92% complete; 88% fresh; 1 unresolved conflict; verification level `reviewed`
- `evidence_refs`: `ev_nfs_website_01`, `ev_nfs_doc_01`, `ev_nfs_review_01`, `ev_nfs_crm_01`

## Identity

- `legal_name`: Northstar Field Systems, Inc.
- `display_name`: Northstar Field Systems
- `previous_names`: Northstar Field Operations (2018-2022)
- `domains`: `northstarfield.example` verified; `northstarfs.example` redirect observed
- `registration_ids`: US-DE fictitious registration `NF-204811`
- `tax_ids`: restricted; not collected
- `source_ids`: Apollo `apollo_co_4411`; CRM `account_8821`; website domain `northstarfield.example`
- `parent_company_id`: none
- `subsidiary_ids`: `company_nfs_services_01`
- `entity_type`: corporation
- `founded_year`: 2018

## Locations

1. `location_id` `loc_nfs_boston`; type headquarters; address 18 Harbor Way, Boston, Massachusetts, US; latitude 42.355; longitude -71.062; timezone America/New_York; primary true; status active; source `ev_nfs_website_01`.
2. `location_id` `loc_nfs_northeast`; type service area; address Northeast United States; latitude and longitude not applicable; timezone America/New_York; primary false; status active; source `ev_nfs_maps_01`.
3. `location_id` `loc_nfs_remote`; type remote; address United States remote workforce; latitude and longitude not applicable; timezone America/New_York; primary false; status active; source `ev_nfs_doc_01`.

## Departments

1. `department_id` `dept_nfs_exec`; name Executive; normalized function executive; estimated headcount 4; leadership `contact_nfs_maya`; operating region Northeast; status active; source `ev_nfs_org_01`.
2. `department_id` `dept_nfs_ops`; name Field Operations; normalized function operations; estimated headcount 38; leadership `contact_nfs_jon`; operating region Northeast; status active; source `ev_nfs_org_01`.
3. `department_id` `dept_nfs_rev`; name Revenue; normalized function revenue; estimated headcount 9; leadership `contact_nfs_oliver`; operating region Northeast; status active; source `ev_nfs_org_01`.

## Decision Makers

1. `contact_id` `contact_nfs_maya`; Maya Chen; CEO; `dept_nfs_exec`; seniority executive; role type economic buyer; influence high; relationship unknown; contact confidence high; evidence `ev_nfs_org_01`.
2. `contact_id` `contact_nfs_jon`; Jon Bell; VP Field Operations; `dept_nfs_ops`; seniority vice president; role type champion and economic influencer; influence high; relationship warm; contact confidence medium; evidence `ev_nfs_crm_01`.
3. `contact_id` `contact_nfs_oliver`; Oliver Grant; Head of Revenue; `dept_nfs_rev`; seniority head; role type budget owner; influence high; relationship prospect; contact confidence high; evidence `ev_nfs_crm_01`.

## Industry

- `primary`: Field service management software
- `secondary`: B2B SaaS; logistics technology
- `taxonomies`: NAICS 541511 v2022; internal category FSM-SaaS v1
- `business_model`: B2B subscription software

## Services

1. Implementation services for regional field service teams; target segment mid-market operations; active.
2. Workflow consulting for dispatch and technician utilization; target segment enterprise operations; active.

## Products

1. Northstar Dispatch; category scheduling; lifecycle generally available; price signal annual subscription.
2. Northstar Mobile; category technician app; lifecycle generally available; price signal per-user subscription.
3. Northstar Insights; category analytics; lifecycle beta; price signal expansion module.

## Revenue Signals

1. `signal_id` `sig_nfs_rev_01`; type revenue; statement three enterprise plan pages appeared in the last quarter; value `3`; direction positive; strength medium; observed 2031-06-10; expires 2031-09-10; confidence medium; source `ev_nfs_website_02`; status active.

## Hiring Signals

1. `signal_id` `sig_nfs_hire_01`; type hiring; statement two revenue operations roles opened within 45 days; value `2`; direction positive; strength high; observed 2031-06-15; expires 2031-08-15; confidence high; source `ev_nfs_careers_01`; status active.

## Growth Signals

1. `signal_id` `sig_nfs_growth_01`; type growth; statement company announced a Northeast expansion partnership; value `1`; direction positive; strength medium; observed 2031-05-22; expires 2031-11-22; confidence medium; source `ev_nfs_news_01`; status active.

## Pain Points

1. `pain_point_id` `pain_nfs_01`; statement dispatch teams report manual handoffs between scheduling and billing; affected function Field Operations; severity high; evidence type customer review synthesis; confidence medium; observed 2031-06-16; status hypothesis; source `ev_nfs_review_01`.
2. `pain_point_id` `pain_nfs_02`; statement revenue team lacks a unified view of expansion accounts; affected function Revenue; severity medium; evidence type internal CRM note; confidence high; observed 2031-06-17; status observed; source `ev_nfs_crm_01`.

## Communication Channels

1. `channel_id` `chan_nfs_form`; type website form; address or handle `https://northstarfield.example/contact`; purpose sales; status active; preferred true; consent basis user-submitted; verified 2031-06-18; last seen 2031-06-18; timezone America/New_York; source `ev_nfs_website_01`.
2. `channel_id` `chan_nfs_email`; type email; address or handle `hello@northstarfield.example`; purpose general inquiries; status active; preferred false; consent basis public business contact; verified 2031-06-18; last seen 2031-06-18; timezone America/New_York; source `ev_nfs_website_01`.
3. `channel_id` `chan_nfs_linkedin`; type LinkedIn; address or handle `linkedin.com/company/northstar-field-systems`; purpose company presence; status active; preferred false; consent basis public company page; verified 2031-06-12; last seen 2031-06-12; timezone America/New_York; source `ev_nfs_linkedin_01`.
4. `channel_id` `chan_nfs_phone`; type phone; address or handle `+1-617-555-0148`; purpose main office; status active; preferred false; consent basis public business contact; verified 2031-05-30; last seen 2031-06-18; timezone America/New_York; source `ev_nfs_website_01`.

## Digital Presence

- `primary_website`: `https://northstarfield.example`
- `website_status`: reachable; HTTPS; company identity matches
- `social_profiles`: LinkedIn company page; YouTube product channel
- `content_languages`: English
- `careers_url`: `https://northstarfield.example/careers`
- `support_url`: `https://northstarfield.example/support`
- `documentation_url`: `https://northstarfield.example/docs`
- `review_profiles`: fictional review profile on ReviewHarbor
- `search_presence`: branded search result and three product-category results
- `last_crawled_at`: 2031-06-18T15:00:00Z
- `presence_confidence`: high

## Reviews

1. `review_id` `review_nfs_customer_01`; source ReviewHarbor; review type customer; rating 4.2; rating scale 5; review count 37; summary praises dispatch visibility; themes `dispatch`, `visibility`, `implementation`; published 2030-2031; observed 2031-06-16; sentiment confidence medium; URL or reference `reviewharbor.example/northstar`; source `ev_nfs_review_01`.
2. `review_id` `review_nfs_employee_01`; source WorkView; review type employee; rating 3.8; rating scale 5; review count 22; summary indicates rapid growth and process strain; themes `growth`, `process`, `leadership`; published 2030-2031; observed 2031-06-16; sentiment confidence medium; URL or reference `workview.example/northstar`; source `ev_nfs_review_02`.

## Technology Stack

1. `technology_id` `tech_nfs_react`; React; category web application; version unknown; detection method public job description; detected 2031-06-14; confidence medium; status observed; source `ev_nfs_job_01`.
2. `technology_id` `tech_nfs_segment`; Segment; category analytics; version unknown; detection method authorized website observation; detected 2031-06-18; confidence medium; status observed; source `ev_nfs_website_03`.
3. `technology_id` `tech_nfs_salesforce`; Salesforce; category CRM; plan unknown; detection method public hiring description; detected 2031-06-11; confidence medium; status probable; source `ev_nfs_job_02`.

## Business Hours

- `location_id` `loc_nfs_boston`; Monday-Friday; opens 09:00; closes 17:00; timezone America/New_York; is closed false; seasonal note none; observed 2031-06-18; source `ev_nfs_hours_01`.
- `location_id` `loc_nfs_boston`; Saturday-Sunday; opens and closes not applicable; timezone America/New_York; is closed true; seasonal note none; observed 2031-06-18; source `ev_nfs_hours_01`.
- `location_id` `loc_nfs_boston`; Monday-Friday seasonal support; opens 09:00; closes 19:00; timezone America/New_York; is closed false; seasonal note June-September; observed 2031-06-18; source `ev_nfs_hours_02`.

## Scores

- `lead_score`: value 78; scale 0-100; label high; policy `lead-fit-v1`; calculated 2031-06-18; confidence medium; factors ICP fit 32, hiring signal 20, company size 16, engagement 10; thresholds low 0-39, medium 40-69, high 70-100; evidence `ev_nfs_score_01`.
- `ai_opportunity_score`: value 84; scale 0-100; label high; policy `ai-opportunity-v1`; calculated 2031-06-18; confidence medium; factors research burden 30, data fragmentation 24, decision volume 18, urgency 12; thresholds low 0-39, medium 40-69, high 70-100; evidence `ev_nfs_score_02`.
- `automation_opportunity_score`: value 71; scale 0-100; label medium-high; policy `automation-opportunity-v1`; calculated 2031-06-18; confidence medium; factors repeatability 25, workflow clarity 20, integration readiness 14, exception rate 12; thresholds low 0-39, medium 40-69, high 70-100; evidence `ev_nfs_score_03`.
- `risk_score`: value 29; scale 0-100 where higher means more risk; label low-to-medium risk; policy `risk-v1`; calculated 2031-06-18; confidence low; factors data conflict 12, buying uncertainty 9, channel uncertainty 8; thresholds low 0-29, medium 30-59, high 60-100; evidence `ev_nfs_score_04`.

## Provenance

All fields above reference one or more fictional evidence records. Website observations were captured 2031-06-18, CRM observations 2031-06-17, public profile observations 2031-06-12, and review aggregates 2031-06-16. Authorization basis is public observation, tenant-provided CRM access, or fictional document review as indicated per record. Each provenance record has a source type, provider or publisher, source record ID, URL or locator, captured and observed timestamps, authorization basis, extraction method, confidence, and retention class `research-90-days`.
