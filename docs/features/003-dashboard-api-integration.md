# Feature 003 - Dashboard API Integration

## Goal

Integrate the Dashboard page with the backend Dashboard API using the API architecture established in Features 001 and 002.

This feature validates the complete API integration flow for authenticated business modules.

---

## Required Reading

Before implementation, review the following documents:

1. docs/api-integration-guidelines-rules.md
2. docs/api-docs.md

Follow the established architecture.

The backend API contract defined in `docs/api-docs.md` is the single source of truth.

Do not assume request or response structures.

---

## Goal

Replace all mock dashboard data with the real backend API.

Do not modify any existing authentication logic.

Do not introduce new architectural patterns.

---

## API To Integrate

GET /api/v1/dashboard

Use the exact request and response defined in `docs/api-docs.md`.

---

## Existing Structure

Reuse the existing project architecture.

Use

- Shared Axios client
- React Query
- Query Keys
- Dashboard Service
- Shared API Types

Do not duplicate existing code.

---

## Create / Update

Follow the existing folder structure.

services/

    dashboard/
        dashboard.service.ts

hooks/

    api/
        dashboard/
            use-dashboard.ts

If these folders already exist, extend them instead of creating duplicates.

---

## Service Layer

Create a dedicated Dashboard Service responsible only for API communication.

Responsibilities

- Fetch dashboard data
- Return typed responses
- No UI logic
- No toast notifications
- No navigation

---

## React Query Hook

Create a dedicated Dashboard query hook.

Responsibilities

- Fetch dashboard data
- Manage loading state
- Manage error state
- Cache dashboard data
- Use centralized query keys

Do not fetch data using useEffect.

Do not store server state using useState.

---

## Dashboard Page

Replace all mock data with the API response.

Remove dependencies on

src/data/stats.ts

or any other dashboard mock data.

Do not modify the existing UI layout.

Only replace the data source.

---

## Loading State

While fetching data

- Reuse existing Skeleton components where appropriate.
- Avoid layout shifts.
- Preserve the current user experience.

---

## Error State

If the API request fails

- Display the existing shared Error State component.
- Use centralized API error handling.
- Do not expose raw Axios errors.

---

## Empty State

If the backend returns no dashboard data

Reuse the existing Empty State component when appropriate.

Do not create new empty state components unless required.

---

## Query Keys

Use the centralized Query Keys created in Feature 001.

Do not hardcode query keys.

---

## TypeScript

Create dashboard-specific types only if required.

Reuse the shared generic API response types.

Avoid using any.

---

## Authentication

The Dashboard API is authenticated.

Reuse the existing authentication flow.

Do not manually attach tokens.

The Axios interceptor should handle authentication automatically.

---

## Code Comments

Keep the code clean.

Only add comments where the implementation is not immediately obvious or where future maintainers would benefit.

Avoid redundant comments.

---

## Code Quality

- Follow SOLID principles.
- Prefer composition over duplication.
- Keep components presentation-focused.
- Keep business logic inside hooks and services.
- Reuse existing shared components wherever possible.

---

## Acceptance Criteria

- Dashboard page uses the backend API.
- No mock dashboard data remains.
- Dashboard Service is implemented.
- Dashboard React Query hook is implemented.
- Loading state is handled.
- Error state is handled.
- Empty state is handled where applicable.
- Existing UI remains unchanged.
- Existing authentication flow remains unchanged.
- Existing architecture remains unchanged.
- Zero TypeScript errors.
- Zero ESLint errors.

---

## Out of Scope

- Profile APIs
- Category APIs
- CRUD modules
- Media Upload
- Public Portfolio APIs
- Dashboard mutations

This feature is strictly for read-only dashboard integration.

---

## Expected Outcome

After completing this feature, the Dashboard should retrieve all its data from the backend API through the established API architecture.

This feature should confirm that the shared API infrastructure is working correctly before moving on to CRUD-based modules.
