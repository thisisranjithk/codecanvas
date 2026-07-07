# Feature 010 - Projects API Integration

## Goal

Integrate the complete Projects module with the backend Project APIs using the established API architecture.

This feature should follow **the exact same implementation pattern used in the Skills module**. The Skills API integration should be treated as the reference implementation for architecture, folder structure, React Query patterns, services, mutations, cache invalidation, forms, loading states, error handling, and UI behavior.

Reuse the shared Category Dropdown API for Project Category selection.

Do not introduce new patterns unless absolutely required by the Project APIs.

---

## Required Reading

Before implementation, review the following documents:

1. docs/api-integration-guidelines-rules.md
2. docs/api-docs.md

The backend API contract defined in `docs/api-docs.md` is the single source of truth.

Do not assume request payloads, parameters, or responses.

The implementation **must follow all engineering standards** defined in the API Integration Guidelines.

---

## Reference Implementation

Before starting, review the completed **Skills API Integration**.

The Projects module should follow the exact same implementation style including

* Folder structure
* Service layer
* React Query hooks
* Query Keys
* Form handling
* Mutation handling
* Cache invalidation
* Error handling
* Loading states
* Success notifications
* Delete confirmation flow
* Code organization

Keep the implementation consistent with the Skills module.

---

## Goal

Replace all Project mock data with the backend APIs.

Reuse the existing API architecture.

Do not introduce new architectural patterns.

---

## APIs To Integrate

Integrate all Project APIs.

* POST /api/v1/projects
* GET /api/v1/projects
* GET /api/v1/projects/{id}
* PUT /api/v1/projects/{id}
* DELETE /api/v1/projects/{id}

Use the request payloads, parameters, and responses exactly as defined in `docs/api-docs.md`.

---

## Existing Infrastructure

The project already contains the shared API infrastructure.

Strictly reuse the existing implementations.

Use

* Shared Axios Client
* Shared API Routes
* Shared Query Client
* Shared Query Keys
* Shared API Error Helper
* Shared API Types
* React Query
* React Hook Form
* Zod
* Shared Category Dropdown Hook

Do **not** recreate or modify existing infrastructure unless absolutely necessary.

---

## Implementation Rules

Strictly follow these rules.

* Follow the Skills module implementation as the reference.
* Use functional programming only.
* Do not create classes.
* Do not use class-based services.
* Do not introduce object-oriented patterns.
* Do not create additional API clients.
* Do not create another Query Client.
* Do not create another API Routes file.
* Do not duplicate Query Keys.
* Do not duplicate helper functions.
* Do not duplicate API utilities.
* Do not duplicate React Query logic.
* Reuse the existing architecture throughout the implementation.

---

## Create / Update

Follow the existing folder structure.

services/

```
project/
    project.service.ts
```

hooks/

```
api/
    project/
        use-projects.ts
        use-project.ts
        use-create-project.ts
        use-update-project.ts
        use-delete-project.ts
        index.ts
```

Extend existing files if necessary.

Do not create duplicate implementations.

---

## Service Layer

Create reusable service functions.

Responsibilities

* Create Project
* Get Projects
* Get Project By Id
* Update Project
* Delete Project

The service layer should only communicate with the backend.

Do not include

* UI logic
* Toast notifications
* Navigation
* React Query
* Form logic

---

## React Query Hooks

Create dedicated hooks.

### Queries

* useProjects()
* useProject(id)

### Mutations

* useCreateProject()
* useUpdateProject()
* useDeleteProject()

Each hook should have a single responsibility.

Reuse centralized Query Keys.

Invalidate only the required queries after successful mutations.

Show success and error notifications inside mutation hooks.

---

## Project Category

Reuse the shared Category Dropdown API implemented in Feature 005.

Use

`useCategoryDropdown("PROJECT")`

for the Project Category selector.

Do not implement another category API.

Do not duplicate dropdown logic.

---

## Projects Page

Replace all mock data with the backend APIs.

Implement

* List Projects
* Create Project
* Edit Project
* Delete Project

Reuse the existing UI.

Do not redesign the page.

Only replace the data source.

---

## Forms

Reuse the existing

* React Hook Form
* Zod Schema

Populate edit forms using the Project Detail API.

Reuse the shared Category Dropdown hook.

Do not duplicate validation logic.

Follow the same form integration pattern used in the Skills module.

---

## CRUD Flow

### Create

Create Project

↓

POST /projects

↓

Success Notification

↓

Invalidate Projects Query

↓

Refresh List

---

### Update

Edit Project

↓

GET /projects/{id}

↓

Populate Form

↓

PUT /projects/{id}

↓

Success Notification

↓

Invalidate Projects Query

↓

Refresh List

---

### Delete

Delete Project

↓

Shared ConfirmDeleteDialog

↓

DELETE /projects/{id}

↓

Success Notification

↓

Invalidate Projects Query

↓

Refresh List

---

## Shared Components

Reuse existing shared components.

Including

* ConfirmDeleteDialog
* EmptyState
* ErrorState
* FormField
* PageHeader
* StatusBadge
* Loading Components

Do not create duplicate components.

Do not modify components inside `components/ui`.

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

* Projects
* Project Detail

Do not hardcode query keys.

---

## TypeScript

Create Project-specific types only when required.

Reuse shared generic API response types.

Avoid using `any`.

Use explicit interfaces and strict typing.

---

## Authentication

All Project APIs are authenticated.

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

* All Project APIs are integrated.
* Project listing uses the backend API.
* Project detail uses the backend API.
* Project creation is implemented.
* Project update is implemented.
* Project deletion is implemented.
* Project Category selector uses `useCategoryDropdown("PROJECT")`.
* React Query cache is invalidated correctly after mutations.
* Existing UI remains unchanged.
* Existing authentication flow remains unchanged.
* Existing architecture remains unchanged.
* No duplicate API infrastructure is introduced.
* Implementation is consistent with the Skills module.
* Zero TypeScript errors.
* Zero ESLint errors.

---

## Out of Scope

* Blog APIs
* Media Upload improvements
* Public Portfolio integration

These will be implemented in subsequent features.

---

## Expected Outcome

After completing this feature, the Projects module should be fully integrated with the backend APIs while reusing the shared API infrastructure and the Category Dropdown API. The implementation should remain fully consistent with the Skills module, following the same architecture, coding patterns, and reusable React Query workflow established throughout the project.
