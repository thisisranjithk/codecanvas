# Feature 008 - Education API Integration

## Goal

Integrate the complete Education module with the backend Education APIs using the established API architecture.

This feature should follow **the exact same implementation pattern used in the Skills module**. The Skills API integration should be treated as the reference implementation for architecture, folder structure, React Query patterns, services, mutations, cache invalidation, forms, loading states, and error handling.

Do not introduce new patterns unless absolutely required by the Education APIs.

---

## Required Reading

Before implementation, review the following documents:

1. docs/api-integration-guidelines-rules.md
2. docs/api-docs.md

The backend API contract defined in `docs/api-docs.md` is the single source of truth.

Do not assume request payloads, parameters, or responses.

---

## Reference Implementation

Before starting, review the completed **Skills API Integration**.

The Education module should follow the same implementation style, architecture, naming conventions, React Query patterns, service structure, folder structure, cache invalidation strategy, loading handling, and mutation flow.

Reuse the same implementation approach wherever possible.

---

## Goal

Replace all Education mock data with the backend APIs.

Reuse the existing API architecture.

Do not introduce new architectural patterns.

---

## APIs To Integrate

Integrate all Education APIs.

* POST /api/v1/educations
* GET /api/v1/educations
* GET /api/v1/educations/{id}
* PUT /api/v1/educations/{id}
* DELETE /api/v1/educations/{id}

Use the request payloads, parameters, and responses exactly as defined in `docs/api-docs.md`.

---

## Example Create / Update Payload

```json
{
  "institution": "Harvard University",
  "degree": "Bachelor of Science",
  "fieldOfStudy": "Computer Science",
  "startDate": "2016-09-01T00:00:00Z",
  "endDate": "2020-06-01T00:00:00Z",
  "gpa": "3.8",
  "location": "Cambridge, MA",
  "description": "Studied algorithms and data structures",
  "activities": [
    "Coding Club",
    "Robotics Team"
  ],
  "displayOrder": 0
}
```

Always follow the payload structure defined in `docs/api-docs.md`.

---

## Existing Structure

Reuse the existing project architecture.

Use

* Shared Axios API Client
* Shared API Routes
* Shared Query Client
* Shared Query Keys
* Education Service
* Shared API Types
* React Query
* React Hook Form
* Zod

Do not duplicate existing logic.

---

## Implementation Rules

Strictly follow these rules.

* Follow the Skills module implementation as the reference.
* Use only functional programming patterns.
* Do not create classes.
* Do not introduce object-oriented services.
* Reuse the existing Query Client.
* Reuse the existing Axios Client.
* Reuse the existing API Routes.
* Reuse the existing Query Keys.
* Reuse existing helpers and utilities.
* Do not duplicate infrastructure.

---

## Create / Update

Follow the existing folder structure.

services/

```
education/
    education.service.ts
```

hooks/

```
api/
    education/
        use-educations.ts
        use-education.ts
        use-create-education.ts
        use-update-education.ts
        use-delete-education.ts
        index.ts
```

If these folders already exist, extend them instead of creating duplicates.

---

## Service Layer

Create reusable service functions.

Responsibilities

* Create Education
* Get Educations
* Get Education By Id
* Update Education
* Delete Education

The service layer should only communicate with the backend.

Do not include

* UI logic
* Toast notifications
* Navigation
* React hooks
* Form logic

---

## React Query Hooks

Create dedicated hooks.

### Queries

* useEducations()
* useEducation(id)

### Mutations

* useCreateEducation()
* useUpdateEducation()
* useDeleteEducation()

Each hook should have a single responsibility.

Reuse centralized Query Keys.

Invalidate only the required queries after successful mutations.

---

## Education Page

Replace all mock data with the backend APIs.

Implement

* List Education
* Create Education
* Edit Education
* Delete Education

Reuse the existing UI.

Do not redesign the page.

Only replace the data source.

---

## Forms

Reuse the existing

* React Hook Form
* Zod Schema

Populate edit forms using the Education Detail API.

Do not duplicate validation logic.

Follow the same form integration pattern used in the Skills module.

---

## CRUD Flow

### Create

Create Education

↓

POST /educations

↓

Success Notification

↓

Invalidate Educations Query

↓

Refresh List

---

### Update

Edit Education

↓

GET /educations/{id}

↓

Populate Form

↓

PUT /educations/{id}

↓

Success Notification

↓

Invalidate Educations Query

↓

Refresh List

---

### Delete

Delete Education

↓

Shared ConfirmDeleteDialog

↓

DELETE /educations/{id}

↓

Success Notification

↓

Invalidate Educations Query

↓

Refresh List

---

## Shared Components

Reuse existing shared components.

Including

* ConfirmDeleteDialog
* EmptyState
* ErrorState
* StatusBadge
* Loading Components

Do not create duplicate components.

---

## Loading State

Handle

* Initial loading
* Create loading
* Update loading
* Delete loading

Disable actions while mutations are running.

Avoid duplicate requests.

---

## Error Handling

Handle

* Fetch errors
* Validation errors
* Mutation errors

Use the centralized API error helper.

Display meaningful notifications.

Do not expose raw Axios errors.

---

## Success Handling

Display success notifications after successful mutations.

Avoid duplicate notifications.

---

## Query Keys

Reuse the centralized Query Keys.

Create dedicated keys for

* Educations
* Education Detail

Do not hardcode query keys.

---

## TypeScript

Create Education-specific types only when required.

Reuse shared generic API response types.

Avoid using `any`.

Use explicit interfaces and strict typing.

---

## Authentication

All Education APIs are authenticated.

Reuse the existing authentication flow.

Do not manually attach tokens.

Authentication should continue to be handled by the shared Axios interceptor.

---

## Existing UI

Preserve the existing UI.

Only replace the data source.

Do not modify styling unless required for API integration.

---

## Code Comments

Keep the code clean.

Only add comments where the implementation is not immediately obvious or where future maintainers would benefit.

Avoid redundant comments.

---

## Code Quality

* Follow SOLID principles.
* Prefer composition over duplication.
* Use functional programming patterns.
* Keep pages presentation-focused.
* Keep business logic inside hooks and services.
* Reuse shared components.
* Follow the established API architecture.
* Maintain consistency with the Skills module implementation.

---

## Acceptance Criteria

* All Education APIs are integrated.
* Education listing uses the backend API.
* Education detail uses the backend API.
* Education creation is implemented.
* Education update is implemented.
* Education deletion is implemented.
* React Query cache is invalidated correctly after mutations.
* Existing UI remains unchanged.
* Existing authentication flow remains unchanged.
* Existing architecture remains unchanged.
* Implementation is consistent with the Skills module.
* No duplicate infrastructure is introduced.
* Zero TypeScript errors.
* Zero ESLint errors.

---

## Out of Scope

* Projects
* Experience
* Blogs
* Media Upload
* Public Portfolio

These modules will be integrated in subsequent features following the same architecture.

---

## Expected Outcome

After completing this feature, the Education module should be fully integrated using the shared API infrastructure while maintaining complete consistency with the Skills module. Future CRUD modules should continue following this same implementation pattern to ensure a predictable and maintainable codebase.
