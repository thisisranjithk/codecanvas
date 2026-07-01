# Feature 002 - Authentication API Integration

## Goal

Replace the existing mock authentication implementation with the real backend authentication APIs while preserving the existing UI and routing.

The authentication flow should become fully API-driven using React Query, Axios, and the shared API infrastructure created in Feature 001.

---

# Required Reading

Before implementation, review the following documents.

1. docs/api-integration-guidelines-rules.md
2. docs/api-docs.md
3. docs/features/001-api-setup.md

All implementation must strictly follow these documents.

The backend API contract defined in api-docs.md is the source of truth.

Do not assume request or response payloads.

---

# Scope

Integrate only the Authentication module.

Implement

- Login
- Current User (/auth/me)
- Logout
- Route Protection
- Authentication Persistence

Do not integrate any other module.

---

# Existing Code

Reuse the existing project structure whenever possible.

Existing folders

providers/
hooks/
pages/login/
router.tsx

Replace mock implementations only.

Do not rewrite unrelated files.

---

# APIs To Integrate

Use the API definitions from:

docs/api-docs.md

Integrate only:

POST /auth/login

GET /auth/me

Do not implement:

Register

Change Password

Delete Account

Those will be handled later.

---

# Authentication Flow

The application should follow this flow.

Application Starts

↓

Check stored access token

↓

If token exists

↓

Call GET /auth/me

↓

Valid user

↓

Store authenticated user

↓

Navigate normally

↓

Invalid token

↓

Clear storage

↓

Redirect Login

---

Login

↓

POST /auth/login

↓

Store Access Token

↓

Invalidate Current User Query

↓

GET /auth/me

↓

Update Auth Context

↓

Navigate Dashboard

---

Logout

↓

Remove Token

↓

Clear React Query Cache

↓

Clear Auth Context

↓

Redirect Login

---

# Auth Context

Refactor the existing Auth Context.

The context should only expose application authentication state.

Example responsibilities

- user
- isAuthenticated
- loading
- login()
- logout()

Avoid placing API request logic inside the context whenever possible.

React Query should remain responsible for server communication.

---

# Auth Storage

Use the reusable helper created in Feature 001.

Do not access localStorage directly.

Example responsibilities

- Save token
- Read token
- Remove token

---

# React Query Hooks

Create dedicated authentication hooks.

Suggested hooks

hooks/api/auth

use-login.ts

use-me.ts

Keep one responsibility per hook.

---

# Services

Create

services/auth/

auth.service.ts

The service should contain only API communication.

No navigation.

No toast.

No UI logic.

---

# Protected Routes

Update routing to use authenticated state.

Authenticated users

↓

Can access dashboard and protected pages.

Unauthenticated users

↓

Must be redirected to Login.

Prevent authenticated users from accessing Login again unless they logout.

Reuse the existing routing structure.

---

# Axios Integration

Use the shared Axios client.

Do not import Axios directly.

Authorization header must be attached automatically using the interceptor.

---

# Loading Experience

Handle

- Initial authentication loading
- Login loading
- User loading

Avoid flashing protected pages before authentication completes.

---

# Error Handling

Display meaningful error messages using the project's existing toast/notification system.

Do not expose raw Axios errors.

Use the centralized API error helper.

---

# TypeScript

Create authentication-specific types only when necessary.

Use the shared generic API response types created in Feature 001.

Avoid any.

---

# Existing UI

Keep the current Login page UI exactly the same.

Do not redesign.

Do not modify styling unless required for API integration.

---

# Existing Validation

Reuse the existing

React Hook Form

-

Zod

implementation.

Do not replace it.

---

# Code Comments

Keep the code clean.

Only add comments where the implementation is not immediately obvious or where future maintainers would benefit from additional context.

Avoid obvious or redundant comments.

---

# Acceptance Criteria

✓ Mock authentication is completely removed.

✓ Login uses the backend API.

✓ Auth Context is connected to the backend.

✓ Access token is persisted.

✓ GET /auth/me determines the authenticated user.

✓ Protected routes work correctly.

✓ Logout clears authentication state.

✓ React Query cache is managed correctly.

✓ No duplicate authentication logic exists.

✓ Existing UI remains unchanged.

✓ Zero TypeScript errors.

✓ Zero ESLint errors.

---

# Out of Scope

Register

Change Password

Delete Account

Forgot Password

Refresh Token implementation

Dashboard API

Profile API

CRUD modules

These will be implemented in later features.

---

# Expected Outcome

After completing this feature, the application should have a fully functional authentication system backed by the real API.

Authentication should become the foundation for all future API integrations while maintaining a clean separation between UI, business logic, and server state.
