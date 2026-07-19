# Digital Employee Execution Engine Architecture

## Lifecycle

`Created -> Assigned -> Preparing -> Knowledge Loaded -> Executing -> Completed -> Archived`

`Waiting`, `Failed`, and `Cancelled` are controlled side states. Every transition records actor, timestamp, state, and comment.

## Execution Contract

1. CEO creates a bounded mission.
2. Dispatcher assigns an authorized employee.
3. Employee accepts or rejects the assignment.
4. Engine loads the employee knowledge profile and document references.
5. Executor performs provider-agnostic local work within the mission scope.
6. Evidence Engine captures output and provenance.
7. Employee or manager closes the mission.
8. Performance Engine updates the profile.
9. Knowledge Loop records reusable feedback.
10. Promotion Engine evaluates future scope without granting authority automatically.

## Safety Boundaries

The first runtime performs no external side effects. It does not send messages, change CRM records, call providers, or claim revenue that was not supplied as mission input. External execution requires an approved provider tool contract and permission grant.

## API Surface

`POST /api/missions`, `POST /api/missions/:id/assign`, `accept`, `reject`, `start`, `pause`, `resume`, `complete`, `cancel`, `archive`, `evidence`, `report`, `review`; `GET /api/missions`, `GET /api/missions/:id`, `GET /api/missions/:id/timeline`, and `GET /api/execution/dashboard`.
