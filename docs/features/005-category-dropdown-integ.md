# Feature 005 - Shared Category Dropdown API Integration

## Goal

Integrate the shared Category Dropdown API that will be reused across the application.

This feature establishes a reusable category data source for modules such as Projects, Skills, Blogs, and Employment Type.

This is **not** the Category Management module.

---

## Required Reading

Before implementation, review the following documents:

1. docs/api-integration-guidelines-rules.md
2. docs/api-docs.md

The backend API contract defined in `docs/api-docs.md` is the single source of truth.

Do not assume request payloads, parameters, or responses.

---

## Goal

Integrate only the shared Category Dropdown API.

Create a reusable hook that can be consumed by any page requiring category selections.

Do not introduce new architectural patterns.

---

## API To Integrate

Integrate only

GET /api/v1/categories/dropdown

The endpoint accepts a query parameter to retrieve page-specific dropdown values.

Supported types include

* PROJECT
* SKILL
* BLOG
* EMPLOYMENT_TYPE

Use the request and response exactly as defined in `docs/api-docs.md`.

Example response

```json
{
  "success": true,
  "message": "Category dropdown retrieved successfully",
  "data": [
    {
      "id": "cmqy7il2k000ahsssjzrh25vj",
      "name": "Frontend"
    },
    {
      "id": "cmqy7ixth000bhsssb6wumnpc",
      "name": "Backend"
    }
  ]
}
```

---

## Existing Structure

Reuse the existing project architecture.

Use

* Shared Axios client
* React Query
* Query Keys
* Category Service
* Shared API Types

Do not duplicate existing logic.

---

## Create / Update

Follow the existing folder structure.

services/

```
category/
    category.service.ts
```

hooks/

```
api/
    category/
        use-category-dropdown.ts
        index.ts
```

If these folders already exist, extend them instead of creating duplicates.

---

## Service Layer

Create a reusable Category Service method.

Responsibilities

* Fetch category dropdown values
* Accept the category type as a parameter
* Return strongly typed responses

The service layer should only handle API communication.

Do not include

* UI logic
* Toast notifications
* Navigation

---

## React Query Hook

Create a reusable hook.

Example

useCategoryDropdown(type)

The hook should

* Accept the category type as an argument
* Fetch dropdown values
* Cache results using React Query
* Use centralized Query Keys

Each category type should have its own cache entry.

---

## Query Keys

Create a dedicated query key for category dropdowns.

The query key should include the category type to ensure each dropdown is cached independently.

Do not hardcode query keys.

---

## TypeScript

Create category dropdown types only if required.

Reuse the shared generic API response types.

Avoid using any.

---

## Authentication

The Category Dropdown API is authenticated.

Reuse the existing authentication flow.

Do not manually attach tokens.

Authentication should continue to be handled by the shared Axios interceptor.

---

## Existing UI

Do not integrate this hook into any page yet.

This feature is responsible only for creating the reusable API layer.

Page integration will be completed in subsequent feature documents.

---

## Code Comments

Keep the code clean.

Only add comments where the implementation is not immediately obvious or where future maintainers would benefit.

Avoid redundant comments.

---

## Code Quality

* Follow SOLID principles.
* Prefer composition over duplication.
* Keep business logic inside hooks and services.
* Follow the established API architecture.

---

## Acceptance Criteria

* Category Dropdown API is integrated.
* Service method is implemented.
* Reusable React Query hook is implemented.
* Category type is accepted as a parameter.
* Query keys include the category type.
* Strong TypeScript types are implemented.
* No UI pages are modified.
* Existing architecture remains unchanged.
* Zero TypeScript errors.
* Zero ESLint errors.

---

## Out of Scope

* Category CRUD APIs
* Category Management UI
* Projects
* Skills
* Blogs
* Experience
* Education
* Certifications

Those modules will consume the reusable `useCategoryDropdown()` hook in their respective feature implementations.

---

## Expected Outcome

After completing this feature, the application should have a reusable Category Dropdown API layer that can be consumed by any future module by simply providing the required category type, without requiring additional API implementation.
