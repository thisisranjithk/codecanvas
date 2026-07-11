# Feature 011 - Authentication v2 Frontend Migration (Cookie-Based Refresh Authentication)

## Objective

Migrate the existing frontend authentication implementation from localStorage-based token management to the new cookie-based authentication architecture.

The backend has already been upgraded to support Refresh Tokens using HttpOnly cookies.

This feature should update the frontend to consume the new authentication flow while preserving the existing user experience.

The migration should be seamless and should not require changes to any existing feature modules.

---

# Context

Read all documents inside the `docs/` folder before implementation.

Reuse all existing shared infrastructure.

The project already contains

* Axios Client
* API Routes
* React Query
* Query Client
* Auth Context
* Authentication Hooks
* Shared API Helpers

Reuse the existing implementation wherever possible.

Modify only the files required for this migration.

---

# Authentication Flow

The new authentication architecture is

Browser

↓

Login

↓

Backend returns

* Access Token (JSON Response)
* Refresh Token (HttpOnly Cookie)

↓

Frontend stores Access Token **only in memory**

↓

Every protected API request

↓

Authorization Bearer AccessToken

↓

Access Token expires

↓

Axios Interceptor

↓

POST /auth/refresh

↓

Browser automatically sends Refresh Cookie

↓

Backend returns

New Access Token

↓

Retry original request

↓

User continues working

---

# Backend APIs

Reuse the existing authentication APIs.

Updated APIs

```http
POST /api/v1/auth/login

POST /api/v1/auth/refresh

POST /api/v1/auth/logout

GET /api/v1/auth/me

PUT /api/v1/auth/change-password

DELETE /api/v1/auth/account
```

The Register API remains unchanged.

---

# Migration Goals

Replace the existing authentication implementation.

Remove

* localStorage Access Token storage
* localStorage token retrieval
* localStorage token removal

The frontend should no longer persist authentication tokens in localStorage.

---

# Token Storage

The frontend should

* Store the Access Token only in memory
* Never persist the Access Token in localStorage
* Never persist the Access Token in sessionStorage
* Never attempt to read the Refresh Token

The Refresh Token is managed entirely by the browser through HttpOnly cookies.

---

# Axios Configuration

Reuse the existing shared Axios Client.

Update it to support the new authentication flow.

Requirements

* Enable `withCredentials: true`
* Continue attaching the Bearer Access Token automatically
* Continue using the shared Axios instance

Do not create another Axios client.

---

# Axios Response Interceptor

Update the existing response interceptor.

Behavior

If a request fails with

401 Unauthorized

and the request has not already been retried

↓

Call

POST /api/v1/auth/refresh

↓

Receive a new Access Token

↓

Update the in-memory Access Token

↓

Retry the original request automatically

Do not create refresh loops.

Retry only once.

---

# Authentication State

Update the existing Auth Context.

The Auth Context should remain the single source of truth for authentication state.

Responsibilities

* Current User
* isAuthenticated
* login()
* logout()
* loading

Do not duplicate authentication state.

---

# Login Flow

Update the existing Login implementation.

After successful login

* Receive Access Token
* Store Access Token in memory
* Refresh Cookie is automatically stored by the browser
* Fetch Current User
* Update Auth Context
* Navigate to Dashboard

Do not store tokens in localStorage.

---

# Session Restoration

When the application starts

Attempt to restore the session.

Flow

Application Starts

↓

Call GET /auth/me using the current Access Token if available

↓

If Access Token is missing or expired

↓

POST /auth/refresh

↓

If refresh succeeds

↓

Store new Access Token in memory

↓

Retry GET /auth/me

↓

Restore Auth Context

↓

Continue normally

If refresh fails

↓

Redirect to Login

---

# Logout Flow

Update the Logout implementation.

Call

POST /api/v1/auth/logout

The backend will

* Clear the Refresh Cookie
* Invalidate the session

Frontend should

* Clear the in-memory Access Token
* Clear Auth Context
* Clear React Query Cache
* Redirect to Login

---

# Register Flow

The Register API remains unchanged.

Do not modify the existing Register flow.

Do not automatically log users in after registration.

---

# Change Password

After a successful password change

The backend invalidates the session.

Frontend should

* Clear the in-memory Access Token
* Clear Auth Context
* Clear React Query Cache
* Redirect to Login

---

# Delete Account

After successful account deletion

The backend invalidates the session.

Frontend should

* Clear the in-memory Access Token
* Clear Auth Context
* Clear React Query Cache
* Redirect to Login

---

# React Query

Reuse the existing React Query implementation.

Do not modify existing feature hooks unless authentication changes require it.

Authentication migration should remain transparent to

* Dashboard
* Profile
* Skills
* Education
* Experience
* Certifications
* Projects

Those modules should continue working without modification.

---

# Existing Infrastructure

Strictly reuse

* Shared Axios Client
* Shared Query Client
* Shared Query Keys
* Shared API Routes
* Shared API Helpers
* Existing Auth Hooks
* Existing Auth Context

Do not duplicate infrastructure.

---

# Implementation Rules

Strictly follow these rules.

* Use functional programming only.
* Do not create classes.
* Do not introduce new architectural patterns.
* Do not create another Axios client.
* Do not create another Query Client.
* Do not duplicate API Routes.
* Do not duplicate authentication logic.
* Keep authentication centralized.
* Reuse the existing architecture.

---

# Error Handling

Handle

* Expired Access Token
* Invalid Refresh Token
* Expired Refresh Token
* Missing Refresh Cookie
* Unauthorized Requests

If refresh fails

Automatically logout the user.

Do not create infinite retry loops.

---

# TypeScript

Reuse existing shared types.

Avoid using `any`.

Use strict typing throughout the migration.

---

# Existing UI

Do not redesign any pages.

Do not modify existing layouts.

Only migrate the authentication implementation.

---

# Code Comments

Keep the code clean.

Only add comments where the implementation is not immediately obvious or where future maintainers would benefit.

Avoid redundant comments.

---

# Acceptance Criteria

Verify

✓ No authentication tokens are stored in localStorage.

✓ Access Token exists only in memory.

✓ Refresh Token is managed entirely through HttpOnly cookies.

✓ Axios automatically refreshes expired Access Tokens.

✓ Original request is retried automatically after successful refresh.

✓ Refresh loops are prevented.

✓ Login works correctly.

✓ Logout works correctly.

✓ Session restoration works after page refresh.

✓ Password change forces logout.

✓ Account deletion forces logout.

✓ Existing feature modules continue working without modification.

✓ Existing UI remains unchanged.

✓ Zero TypeScript errors.

✓ Zero ESLint errors.

---

# Verification

Test

```text
Login

↓

Navigate through protected pages

↓

Wait until Access Token expires

↓

Perform an authenticated request

↓

Automatic Refresh

↓

Original request succeeds

↓

Logout

↓

Attempt authenticated request

↓

Redirect to Login
```

Also verify

* Browser stores only the HttpOnly Refresh Cookie.
* No authentication tokens exist in localStorage.
* No duplicate authentication requests occur.
* React Query cache behaves correctly after logout.

---

# AI Implementation Rules

* Implement only the migration described above.
* Reuse all existing authentication infrastructure.
* Do not modify unrelated feature modules.
* Keep authentication centralized.
* Follow SOLID principles.
* Use functional programming only.
* Keep the implementation production-ready, secure, reusable, and maintainable.
* Preserve backward compatibility for all existing integrated features.
