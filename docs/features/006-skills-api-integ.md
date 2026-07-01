# Feature 006 - Skills API Integration

## Goal

Integrate the complete Skills module with the backend Skills APIs using the established API architecture.

This feature should follow the same architecture and coding patterns established in previous features while reusing the shared Category Dropdown API for category selection.

---

## Required Reading

Before implementation, review the following documents:

1. docs/api-integration-guidelines-rules.md
2. docs/api-docs.md

The backend API contract defined in `docs/api-docs.md` is the single source of truth.

Do not assume request payloads, parameters, or responses.

---

## Goal

Replace all Skills mock data with the backend APIs.

Reuse the existing API architecture.

Do not introduce new architectural patterns.

---

## APIs To Integrate

Integrate all Skills APIs.

* POST /api/v1/skills
* GET /api/v1/skills
* GET /api/v1/skills/{id}
* PUT /api/v1/skills/{id}
* DELETE /api/v1/skills/{id}

Use the request payloads, parameters, and responses exactly as defined in `docs/api-docs.md`.

---

## Existing Structure

Reuse the existing project architecture.

Use

* Shared Axios client
* React Query
* Query Keys
* Skill Service
* Shared API Types
* React Hook Form
* Zod
* Shared Category Dropdown Hook

Do not duplicate existing logic.

---

## Create / Update

Follow the existing folder structure.

services/

```
skill/
    skill.service.ts
```

hooks/

```
api/
    skill/
        use-skills.ts
        use-skill.ts
        use-create-skill.ts
        use-update-skill.ts
        use-delete-skill.ts
        index.ts
```

If these folders already exist, extend them instead of creating duplicates.

---

## Service Layer

Create a dedicated Skill Service.

Responsibilities

* Create Skill
* Get Skills
* Get Skill By Id
* Update Skill
* Delete Skill

The service layer should only handle API communication.

Do not include

* UI logic
* Toast notifications
* Navigation
* Form logic

---

## React Query Hooks

Create dedicated hooks.

### Queries

* useSkills()
* useSkill(id)

### Mutations

* useCreateSkill()
* useUpdateSkill()
* useDeleteSkill()

Each hook should have a single responsibility.

Use centralized Query Keys.

Invalidate only the required queries after mutations.

---

## Category Dropdown

Reuse the shared Category Dropdown API created in Feature 005.

Use

useCategoryDropdown("SKILL")

for the Skill Category selector.

Do not implement a separate category API.

Do not duplicate dropdown logic.

---

## Skills Page

Replace all mock data with the backend APIs.

Implement

* List Skills
* Create Skill
* Edit Skill
* Delete Skill

Reuse the existing UI.

Do not redesign the page.

Only replace the data source.

---

## Forms

Reuse the existing

* React Hook Form
* Zod Schema

Populate edit forms using the Skill Detail API.

Reuse the shared Category Dropdown hook for category selection.

Do not duplicate validation logic.

---

## CRUD Flow

### Create

Create Skill

↓

POST /skills

↓

Success Notification

↓

Invalidate Skills Query

↓

Refresh List

---

### Update

Edit Skill

↓

GET /skills/{id}

↓

Populate Form

↓

PUT /skills/{id}

↓

Success Notification

↓

Invalidate Skills Query

↓

Refresh List

---

### Delete

Delete Skill

↓

Shared Confirmation Dialog

↓

DELETE /skills/{id}

↓

Success Notification

↓

Invalidate Skills Query

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

Create dedicated query keys for

* Skills
* Skill Detail

Reuse the centralized Query Keys.

Do not hardcode query keys.

---

## TypeScript

Create Skill-specific types only when required.

Reuse shared generic API response types.

Avoid using any.

---

## Authentication

All Skill APIs are authenticated.

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
* Keep pages presentation-focused.
* Keep business logic inside hooks and services.
* Reuse shared components.
* Follow the established API architecture.

---

## Acceptance Criteria

* All Skill APIs are integrated.
* Skills listing uses the backend API.
* Skill detail uses the backend API.
* Skill creation is implemented.
* Skill update is implemented.
* Skill deletion is implemented.
* Skill Category selector uses `useCategoryDropdown("SKILL")`.
* React Query cache is invalidated correctly after mutations.
* Existing UI remains unchanged.
* Existing authentication flow remains unchanged.
* Existing architecture remains unchanged.
* Zero TypeScript errors.
* Zero ESLint errors.

---

## Out of Scope

* Projects
* Experience
* Education
* Certifications
* Blogs
* Media Upload
* Public Portfolio

These modules will follow the same architecture in subsequent features.

---

## Expected Outcome

After completing this feature, the Skills module should be fully integrated with the backend APIs while reusing the shared Category Dropdown API for category selection.

This implementation should serve as the reference for the remaining CRUD modules, ensuring consistent service, hook, form, cache, and mutation patterns throughout the application.
