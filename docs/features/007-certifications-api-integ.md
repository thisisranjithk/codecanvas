# Feature 007 - Certifications API Integration

## Goal

Integrate the complete Certifications module with the backend Certification APIs using the established API architecture.

Reuse all shared infrastructure created in previous features. Do not introduce new patterns or duplicate existing utilities.

---

## Required Reading

Before implementation, review the following documents:

1. docs/api-integration-guidelines-rules.md
2. docs/api-docs.md

The backend API contract defined in `docs/api-docs.md` is the single source of truth.

Do not assume request payloads, parameters, or responses.

---

## Goal

Replace all Certification mock data with the backend APIs.

Reuse the existing architecture.

Do not introduce new architectural patterns.

---

## APIs To Integrate

Integrate all Certification APIs.

* POST /api/v1/certifications
* GET /api/v1/certifications
* GET /api/v1/certifications/{id}
* PUT /api/v1/certifications/{id}
* DELETE /api/v1/certifications/{id}

Use the request payloads, parameters, and responses exactly as defined in `docs/api-docs.md`.

---

## Existing Structure

Reuse the existing project architecture.

Use

* Shared Axios API Client
* Shared API Routes
* Shared Query Client
* Shared Query Keys
* Certification Service
* Shared API Types
* React Query
* React Hook Form
* Zod

Do not duplicate existing logic.

---

## Implementation Rules

Strictly follow these rules.

* Use only functional programming patterns.
* Do not create classes.
* Do not use class-based services.
* Do not introduce object-oriented service layers.
* Use reusable functions throughout the implementation.

Reuse the existing infrastructure.

Do not recreate

* Query Client
* Axios Client
* API Routes
* Query Keys
* API Helpers
* Error Helpers

Always use the shared implementations already available in the project.

Do not duplicate existing utilities.

---

## Create / Update

Follow the existing folder structure.

services/

```
certification/
    certification.service.ts
```

hooks/

```
api/
    certification/
        use-certifications.ts
        use-certification.ts
        use-create-certification.ts
        use-update-certification.ts
        use-delete-certification.ts
        index.ts
```

If these folders already exist, extend them instead of creating duplicates.

---

## Service Layer

Create reusable service functions.

Responsibilities

* Create Certification
* Get Certifications
* Get Certification By Id
* Update Certification
* Delete Certification

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

* useCertifications()
* useCertification(id)

### Mutations

* useCreateCertification()
* useUpdateCertification()
* useDeleteCertification()

Each hook should have a single responsibility.

Reuse centralized Query Keys.

Invalidate only the required queries after successful mutations.

---

## Certifications Page

Replace all mock data with the backend APIs.

Implement

* List Certifications
* Create Certification
* Edit Certification
* Delete Certification

Reuse the existing UI.

Do not redesign the page.

Only replace the data source.

---

## Forms

Reuse the existing

* React Hook Form
* Zod Schema

Populate edit forms using the Certification Detail API.

Do not duplicate validation logic.

---

## CRUD Flow

### Create

Create Certification

↓

POST /certifications

↓

Success Notification

↓

Invalidate Certifications Query

↓

Refresh List

---

### Update

Edit Certification

↓

GET /certifications/{id}

↓

Populate Form

↓

PUT /certifications/{id}

↓

Success Notification

↓

Invalidate Certifications Query

↓

Refresh List

---

### Delete

Delete Certification

↓

Shared ConfirmDeleteDialog

↓

DELETE /certifications/{id}

↓

Success Notification

↓

Invalidate Certifications Query

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

* Certifications
* Certification Detail

Do not hardcode query keys.

---

## TypeScript

Create Certification-specific types only when required.

Reuse shared generic API response types.

Avoid using `any`.

Use explicit interfaces and strict typing.

---

## Authentication

All Certification APIs are authenticated.

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

---

## Acceptance Criteria

* All Certification APIs are integrated.
* Certification listing uses the backend API.
* Certification detail uses the backend API.
* Certification creation is implemented.
* Certification update is implemented.
* Certification deletion is implemented.
* React Query cache is invalidated correctly after mutations.
* Existing UI remains unchanged.
* Existing authentication flow remains unchanged.
* Existing architecture remains unchanged.
* No duplicate infrastructure is introduced.
* Zero TypeScript errors.
* Zero ESLint errors.

---

## Out of Scope

* Projects
* Skills
* Experience
* Education
* Blogs
* Media Upload
* Public Portfolio

These modules will be integrated in subsequent features following the same architecture.

---

## Expected Outcome

After completing this feature, the Certifications module should be fully integrated using the shared API infrastructure established in previous features. The implementation should remain fully functional, reusable, consistent, and aligned with the project's architecture without introducing duplicate utilities or alternative implementation patterns.
