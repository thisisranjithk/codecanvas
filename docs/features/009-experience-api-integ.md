# Feature 009 - Experience API Integration

## Goal

Integrate the complete Experience module with the backend Experience APIs using the established API architecture.

This feature should follow **the exact same implementation pattern used in the Skills module**. The Skills API integration should be treated as the reference implementation for architecture, folder structure, React Query patterns, services, mutations, cache invalidation, forms, loading states, and error handling.

Reuse the shared Category Dropdown API for **Employment Type** selection.

Do not introduce new patterns unless absolutely required by the Experience APIs.

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

The Experience module should follow the same implementation style, architecture, naming conventions, React Query patterns, service structure, folder structure, cache invalidation strategy, loading handling, and mutation flow.

Reuse the same implementation approach wherever possible.

---

## Goal

Replace all Experience mock data with the backend APIs.

Reuse the existing API architecture.

Do not introduce new architectural patterns.

---

## APIs To Integrate

Integrate all Experience APIs.

* POST /api/v1/experiences
* GET /api/v1/experiences
* GET /api/v1/experiences/{id}
* PUT /api/v1/experiences/{id}
* DELETE /api/v1/experiences/{id}

Use the request payloads, parameters, and responses exactly as defined in `docs/api-docs.md`.

---

## Example Create / Update Payload

```json
{
  "company": "Google",
  "role": "Software Engineer",
  "employmentTypeId": "cuid_value_here",
  "location": "Mountain View, CA",
  "startDate": "2020-01-01T00:00:00Z",
  "endDate": "2023-01-01T00:00:00Z",
  "isCurrent": false,
  "description": "Worked on Google Cloud Platform",
  "responsibilities": [
    "Built things",
    "Fixed bugs"
  ],
  "technologies": [
    "Go",
    "Kubernetes"
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
* Experience Service
* Shared API Types
* React Query
* React Hook Form
* Zod
* Shared Category Dropdown Hook

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
experience/
    experience.service.ts
```

hooks/

```
api/
    experience/
        use-experiences.ts
        use-experience.ts
        use-create-experience.ts
        use-update-experience.ts
        use-delete-experience.ts
        index.ts
```

If these folders already exist, extend them instead of creating duplicates.

---

## Service Layer

Create reusable service functions.

Responsibilities

* Create Experience
* Get Experiences
* Get Experience By Id
* Update Experience
* Delete Experience

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

* useExperiences()
* useExperience(id)

### Mutations

* useCreateExperience()
* useUpdateExperience()
* useDeleteExperience()

Each hook should have a single responsibility.

Reuse centralized Query Keys.

Invalidate only the required queries after successful mutations.

---

## Employment Type Dropdown

Reuse the shared Category Dropdown API implemented in Feature 005.

Use

`useCategoryDropdown("EMPLOYMENT_TYPE")`

for the Employment Type selector.

Do not create a separate API or duplicate dropdown logic.

---

## Experience Page

Replace all mock data with the backend APIs.

Implement

* List Experiences
* Create Experience
* Edit Experience
* Delete Experience

Reuse the existing UI.

Do not redesign the page.

Only replace the data source.

---

## Forms

Reuse the existing

* React Hook Form
* Zod Schema

Populate edit forms using the Experience Detail API.

Reuse the shared Employment Type dropdown hook.

Do not duplicate validation logic.

Follow the same form integration pattern used in the Skills module.

---

## CRUD Flow

### Create

Create Experience

↓

POST /experiences

↓

Success Notification

↓

Invalidate Experiences Query

↓

Refresh List

---

### Update

Edit Experience

↓

GET /experiences/{id}

↓

Populate Form

↓

PUT /experiences/{id}

↓

Success Notification

↓

Invalidate Experiences Query

↓

Refresh List

---

### Delete

Delete Experience

↓

Shared ConfirmDeleteDialog

↓

DELETE /experiences/{id}

↓

Success Notification

↓

Invalidate Experiences Query

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

* Experiences
* Experience Detail

Do not hardcode query keys.

---

## TypeScript

Create Experience-specific types only when required.

Reuse shared generic API response types.

Avoid using `any`.

Use explicit interfaces and strict typing.

---

## Authentication

All Experience APIs are authenticated.

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

* All Experience APIs are integrated.
* Experience listing uses the backend API.
* Experience detail uses the backend API.
* Experience creation is implemented.
* Experience update is implemented.
* Experience deletion is implemented.
* Employment Type selector uses `useCategoryDropdown("EMPLOYMENT_TYPE")`.
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
* Blogs
* Media Upload
* Public Portfolio

These modules will be integrated in subsequent features following the same architecture.

---

## Expected Outcome

After completing this feature, the Experience module should be fully integrated using the shared API infrastructure while maintaining complete consistency with the Skills module. The shared Employment Type dropdown should be reused, and the implementation should serve as another consistent CRUD reference for the remaining modules.
