# Feature 001 - API Infrastructure Setup

## Goal

Build the complete frontend API foundation before integrating any feature APIs.

No business module (Auth, Dashboard, Projects, etc.) should be integrated until this setup is complete.

---

# Objective

Implement a scalable API architecture using:

- Axios
- TanStack React Query
- TypeScript
- Context
- Clean Architecture

The setup should support all future modules without requiring architectural changes.

---

# Must Follow

Before implementation, read:

docs/api-integration-guidelines-rules.md

Every implementation must comply with those standards.

---

# Scope

Only implement the shared API infrastructure.

Do NOT integrate any business APIs yet.

Do NOT replace existing UI.

Do NOT modify page layouts.

---

# Create Structure

Create only the required folders/files.

src/

    api/

        client.ts

        endpoints.ts

        interceptors.ts

        query-client.ts

        query-keys.ts

        api-error.ts

        index.ts

    services/

    hooks/

        api/

    types/

        api.ts

    lib/

        auth-storage.ts

---

# Axios Client

Create a shared Axios instance.

Requirements

- Base URL from environment variables
- JSON headers
- Timeout configuration
- Export singleton client

No business logic.

---

# Interceptors

Implement request and response interceptors.

Request

- Attach Authorization header when token exists.

Response

- Normalize API errors.
- Prepare for future token refresh support.
- Do not implement refresh-token logic yet.

---

# Auth Storage

Create reusable helpers for:

- Save access token
- Get access token
- Remove access token

No direct localStorage usage outside this helper.

---

# API Endpoints

Centralize all endpoint definitions.

Structure endpoints by module.

Example

AUTH

PROFILE

PROJECTS

BLOGS

SKILLS

MEDIA

DASHBOARD

PORTFOLIO

No hardcoded endpoint strings elsewhere.

---

# Query Client

Configure React Query.

Include

- sensible staleTime
- gcTime
- retry strategy
- default mutation options

Keep configuration centralized.

---

# Query Keys

Create centralized query keys for every module.

Support

List

Detail

Infinite queries (future ready)

Search (future ready)

---

# API Types

Create reusable generic API types.

Examples

ApiResponse<T>

Pagination

ApiError

ValidationError

Do not create module-specific types yet.

---

# Providers

Create a React Query provider.

Integrate it into the application.

Do not break the existing ThemeProvider or AuthProvider.

---

# Environment

Use

VITE_API_URL

No hardcoded URLs.

---

# Acceptance Criteria

- Axios client is fully configured.
- React Query is configured.
- Query Provider is integrated.
- Query Keys are centralized.
- API Endpoints are centralized.
- Auth storage helper exists.
- Generic API types exist.
- No business APIs integrated.
- Existing UI works without regressions.
- Project builds successfully with zero TypeScript errors.

---

# Out of Scope

- Login API
- Dashboard API
- CRUD APIs
- File Upload
- Auth Context changes
- Route protection changes

Those will be completed in subsequent feature documents.

---

# Expected Outcome

After completing this feature, the frontend should have a solid, production-ready API foundation. All future API integrations should only need to add services and hooks without changing the core architecture.