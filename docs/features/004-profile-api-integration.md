# Feature 004 - Profile API Integration

## Goal

Integrate the complete Profile module with the backend Profile APIs using the established API architecture.

This feature introduces the first complete read/write domain and should become the reference implementation for all future CRUD modules.

---

## Required Reading

Before implementation, review the following documents:

1. docs/api-integration-guidelines-rules.md
2. docs/api-docs.md

The backend API contract defined in `docs/api-docs.md` is the single source of truth.

Do not assume request or response structures.

---

## Goal

Replace all profile-related mock data with the backend APIs.

Reuse the existing API architecture.

Do not introduce new architectural patterns.

---

## APIs To Integrate

Integrate all Profile APIs.

### Profile

* POST /api/v1/profile
* GET /api/v1/profile
* PUT /api/v1/profile

### Portfolio Settings

* GET /api/v1/profile/portfolio-settings
* PUT /api/v1/profile/portfolio-settings

Use the request payloads, parameters, and responses exactly as defined in `docs/api-docs.md`.

---

## Existing Structure

Reuse the existing project architecture.

Use

* Shared Axios client
* React Query
* Query Keys
* Profile Service
* Shared API Types
* React Hook Form
* Zod

Do not duplicate existing logic.

---

## Create / Update

Follow the existing folder structure.

services/

```
profile/
    profile.service.ts
```

hooks/

```
api/
    profile/
        use-create-profile.ts
        use-profile.ts
        use-update-profile.ts
        use-portfolio-settings.ts
        use-update-portfolio-settings.ts
        index.ts
```

If these folders already exist, extend them instead of creating duplicates.

---

## Service Layer

Create a dedicated Profile Service.

Responsibilities

* Create Profile
* Get Profile
* Update Profile
* Get Portfolio Settings
* Update Portfolio Settings

The service layer should only be responsible for API communication.

Do not include

* UI logic
* Toast notifications
* Navigation
* Form logic

---

## React Query Hooks

Create dedicated hooks.

### Profile

* useCreateProfile()
* useProfile()
* useUpdateProfile()

### Portfolio Settings

* usePortfolioSettings()
* useUpdatePortfolioSettings()

Responsibilities

* Fetch data
* Perform mutations
* Handle loading state
* Handle error state
* Invalidate related queries after successful mutations

Keep one responsibility per hook.

Do not place business logic inside pages.

---

## Profile Page

Replace all mock profile data with the backend APIs.

Populate the existing form using the Profile API.

Do not redesign the UI.

Do not modify the existing layout.

Only replace the data source.

---

## Portfolio Settings

Integrate the existing Portfolio Settings section using the dedicated Portfolio Settings APIs.

Reuse the existing UI.

Do not redesign the page.

If Portfolio Settings already exist within the Settings page, integrate them there while preserving the current UI.

---

## Form Integration

Reuse the existing

* React Hook Form
* Zod Schemas

Populate forms using the fetched API data.

Use proper React Hook Form techniques for asynchronously loaded values.

Avoid unnecessary re-renders.

Do not duplicate validation logic.

---

## Profile Creation

Implement profile creation according to the backend API behavior documented in `docs/api-docs.md`.

Do not assume when the Create Profile API should be called.

If the backend automatically creates a profile during registration, respect that behavior.

If profile creation is a separate user action, implement it accordingly.

Follow the API contract.

---

## Update Flow

### Profile

Profile Page

↓

Fetch Profile

↓

Populate Form

↓

User Updates Data

↓

PUT /profile

↓

Success Notification

↓

Invalidate Profile Query

↓

Refresh Cached Data

---

### Portfolio Settings

Settings Page

↓

Fetch Portfolio Settings

↓

Populate Form

↓

User Updates Settings

↓

PUT /profile/portfolio-settings

↓

Success Notification

↓

Invalidate Portfolio Settings Query

↓

Refresh Cached Data

Do not manually refresh the page.

---

## Loading State

Handle

* Initial page loading
* Profile loading
* Portfolio Settings loading
* Form submission loading

Disable submit actions while requests are in progress.

Reuse existing loading components.

---

## Error Handling

Handle

* Fetch errors
* Validation errors
* Mutation errors

Use the centralized API error helper.

Display meaningful messages using the existing notification system.

Do not expose raw Axios errors.

---

## Success Handling

Display success notifications after successful mutations.

Avoid duplicate notifications.

---

## Query Keys

Use centralized Query Keys.

Create dedicated keys for

* Profile
* Portfolio Settings

Do not hardcode query keys.

---

## TypeScript

Create Profile-specific types only when required.

Reuse the shared generic API response types.

Avoid using any.

---

## Authentication

All Profile APIs are authenticated.

Reuse the existing authentication flow.

Do not manually attach tokens.

Authentication should continue to be handled by the shared Axios interceptor.

---

## Existing UI

Preserve all existing UI.

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
* Reuse existing shared components.
* Follow the established API architecture.

---

## Acceptance Criteria

* All Profile APIs are integrated.
* Profile loads using GET /profile.
* Profile creation is implemented according to the backend API contract.
* Profile updates using PUT /profile.
* Portfolio Settings load using GET /profile/portfolio-settings.
* Portfolio Settings update using PUT /profile/portfolio-settings.
* Existing forms are populated from API data.
* React Query cache is invalidated correctly after mutations.
* Loading, success, and error states are handled properly.
* Existing UI remains unchanged.
* Existing authentication flow remains unchanged.
* Existing architecture remains unchanged.
* Zero TypeScript errors.
* Zero ESLint errors.

---

## Out of Scope

* Categories
* Projects
* Skills
* Experience
* Education
* Certifications
* Blogs
* Media Upload
* Public Portfolio
* Account Management APIs (Change Password, Delete Account)

These will be implemented in subsequent features.

---

## Expected Outcome

After completing this feature, the entire Profile module should be fully integrated with the backend APIs.

This implementation should serve as the reference architecture for all remaining CRUD modules, ensuring consistent patterns for services, React Query hooks, forms, cache management, loading states, error handling, and mutations throughout the application.
