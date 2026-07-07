# API Integration Guidelines & Rules

## Purpose

This document defines the engineering standards for integrating backend APIs into the Portfolio CMS frontend.

Every API integration task must follow these guidelines to ensure the project remains scalable, maintainable, predictable, and production-ready.

---

# Tech Stack

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | Strict Mode | Type safety |
| Vite | Latest | Build tool |
| React Router | Latest | Client-side routing |
| TanStack React Query | Latest | Server state management |
| Axios | Latest | HTTP client |
| React Hook Form | Latest | Form state management |
| Zod | Latest | Schema validation |
| Shadcn UI | Latest | UI component library |

---

# Core Principles

Always follow these principles.

- Single Responsibility Principle
- Composition over inheritance
- Strong TypeScript typing
- Reusable code
- Clean architecture
- Predictable folder structure
- No duplicated logic
- Keep components focused on UI
- Keep business logic outside pages

---

# Architecture

The application follows this strict data-flow.

```
UI Component
     ?
   Page
     ?
React Query Hook  (hooks/api/<domain>/)
     ?
 Service Layer    (services/<domain>/)
     ?
 Axios Client     (api/client.ts)
     ?
 Backend API
```

- Pages must **never** call Axios directly.
- Pages must **never** contain business logic.
- Pages should **only** consume reusable hooks.

---

# Folder Structure

This is the actual, authoritative folder structure for the project.

```
src/
+-- api/                          # Axios client, interceptors, query keys, endpoints
¦   +-- client.ts                 # Single Axios instance
¦   +-- interceptors.ts           # Request/response interceptors
¦   +-- endpoints.ts              # Centralized API endpoint constants
¦   +-- query-keys.ts             # Centralized React Query key factory
¦   +-- query-client.ts           # QueryClient configuration
¦   +-- api-error.ts              # Normalized API error helper
¦   +-- index.ts                  # Barrel export
¦
+-- services/                     # One folder per domain — pure API communication only
¦   +-- auth/
¦   ¦   +-- auth.service.ts
¦   +-- profile/
¦   +-- experience/
¦   +-- education/
¦   +-- skill/
¦   +-- certification/
¦   +-- category/
¦   +-- dashboard/
¦
+-- hooks/
¦   +-- api/                      # React Query hooks — one folder per domain
¦   ¦   +-- auth/
¦   ¦   ¦   +-- use-login.ts
¦   ¦   ¦   +-- use-register.ts
¦   ¦   ¦   +-- use-me.ts
¦   ¦   ¦   +-- index.ts
¦   ¦   +-- profile/
¦   ¦   +-- experience/
¦   ¦   +-- education/
¦   ¦   +-- skill/
¦   ¦   +-- certification/
¦   ¦   +-- category/
¦   ¦   +-- dashboard/
¦   +-- use-auth.ts               # Auth context consumer hook
¦   +-- use-mobile.ts             # Responsive utility hook
¦   +-- use-search.ts             # Global search hook
¦   +-- use-theme.ts              # Theme consumer hook
¦
+-- providers/                    # React context providers
¦   +-- auth-context.tsx          # Authentication context & provider
¦   +-- query-provider.tsx        # React Query provider wrapper
¦   +-- theme-provider.tsx        # Theme context & provider
¦
+-- schemas/                      # Zod validation schemas (form validation)
¦   +-- certification.schema.ts
¦   +-- education.schema.ts
¦   +-- experience.schema.ts
¦   +-- skill.schema.ts
¦   +-- project.schema.ts
¦   +-- settings.schema.ts
¦   +-- blog.schema.ts
¦   +-- index.ts
¦
+-- types/                        # TypeScript interfaces & types
¦   +-- api.ts                    # Generic ApiResponse<T>, PaginatedResponse<T>
¦   +-- models.ts                 # Shared model types
¦   +-- auth.types.ts
¦   +-- profile.types.ts
¦   +-- experience.types.ts
¦   +-- education.types.ts
¦   +-- skill.types.ts
¦   +-- certification.types.ts
¦   +-- category.types.ts
¦   +-- dashboard.types.ts
¦   +-- index.ts
¦
+-- lib/                          # Pure utility functions
¦   +-- utils.ts                  # General utilities (cn, formatters, etc.)
¦   +-- auth-storage.ts           # Token storage helpers
¦
+-- config/                       # App-wide static configuration
¦   +-- navigation.ts             # Sidebar/nav route definitions
¦
+-- components/
¦   +-- shared/                   # Reusable presentation components
¦   ¦   +-- confirm-delete-dialog.tsx
¦   ¦   +-- empty-state.tsx
¦   ¦   +-- error-state.tsx
¦   ¦   +-- form-field.tsx
¦   ¦   +-- page-header.tsx
¦   ¦   +-- status-badge.tsx
¦   ¦   +-- global-search.tsx
¦   ¦   +-- mode-toggle.tsx
¦   +-- layout/                   # Shell layout components
¦   +-- ui/                       # Shadcn UI primitives (do not modify)
¦
+-- pages/                        # Route-level page components
    +-- login/
    +-- register/
    +-- dashboard/
    +-- projects/
    +-- blog/
    +-- skills/
    +-- experience/
    +-- education/
    +-- certifications/
    +-- settings/
    +-- developer/
```

> Do not create new top-level folders under `src/` without team approval.

---

# Axios Rules

- **Only one Axios instance** is allowed ? `api/client.ts`.
- Never import Axios directly inside pages or components.
- Always use the shared API client exported from `api/index.ts`.
- All interceptors (auth token injection, response normalization) live in `api/interceptors.ts`.
- Never duplicate request configuration.

---

# Endpoints

- All API endpoint paths must be defined in `api/endpoints.ts`.
- Never hardcode URL strings inside services or hooks.
- Group endpoints by domain inside the `endpoints.ts` constants object.

```ts
// Correct
import { ENDPOINTS } from '@/api/endpoints';
apiClient.get(ENDPOINTS.AUTH.ME);

// Wrong
apiClient.get('/auth/me');
```

---

# React Query Rules

Every API call must use React Query.

**Queries (read)**
- Use `useQuery` for all data-fetching.
- Never use `useEffect` for fetching API data.
- Never use `useState` to store server state.

**Mutations (write)**
- Use `useMutation` for create, update, and delete operations.
- After a successful mutation, invalidate the relevant query keys using `queryClient.invalidateQueries()`.

---

# Query Keys

All query keys must be defined centrally in `api/query-keys.ts`.

Never hardcode inline query keys.

```ts
// Wrong
useQuery({ queryKey: ['projects'] })

// Correct
useQuery({ queryKey: queryKeys.projects.all })
useQuery({ queryKey: queryKeys.projects.detail(id) })
```

Key factory structure:

```ts
queryKeys.auth.me
queryKeys.projects.all
queryKeys.projects.detail(id)
queryKeys.experience.all
queryKeys.skills.all
```

---

# Service Layer Rules

Every backend domain must have its own service file inside `services/<domain>/`.

**Service responsibilities:**
- Accept typed parameters.
- Call the Axios client with the correct endpoint.
- Return the typed API response.

**Services must NOT contain:**
- UI logic
- Toast notifications
- Navigation / redirects
- React Query logic

```ts
// services/experience/experience.service.ts
export const experienceService = {
  getAll: () =>
    apiClient.get<ApiResponse<Experience[]>>(ENDPOINTS.EXPERIENCE.LIST),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Experience>>(ENDPOINTS.EXPERIENCE.DETAIL(id)),
  create: (data: CreateExperienceDto) =>
    apiClient.post<ApiResponse<Experience>>(ENDPOINTS.EXPERIENCE.LIST, data),
  update: (id: string, data: UpdateExperienceDto) =>
    apiClient.patch<ApiResponse<Experience>>(ENDPOINTS.EXPERIENCE.DETAIL(id), data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(ENDPOINTS.EXPERIENCE.DETAIL(id)),
};
```

---

# Hook Rules

Every CRUD operation must have its own dedicated hook inside `hooks/api/<domain>/`.

**Standard hook set per domain:**

```ts
use<Domain>()         // fetch list
use<Domain>(id)       // fetch single item
useCreate<Domain>()   // create mutation
useUpdate<Domain>()   // update mutation
useDelete<Domain>()   // delete mutation
```

**Hooks are responsible for:**
- Wrapping React Query (`useQuery` / `useMutation`)
- Cache invalidation
- Success / error toast notifications
- Optimistic updates (when needed)

**Hooks must NOT:**
- Render any UI
- Navigate the user (except as a side effect of mutation callbacks)
- Contain raw Axios calls

---

# Schemas

All form validation schemas live in `schemas/<domain>.schema.ts`.

Use Zod for every form schema.

```ts
// schemas/experience.schema.ts
export const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  // ...
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
```

Import schemas via `schemas/index.ts` barrel export.

---

# Types

All TypeScript types and interfaces live in `types/`.

**Naming convention:**
- Domain-specific types ? `<domain>.types.ts`
- Shared API response wrappers ? `types/api.ts`
- Shared model types ? `types/models.ts`

**Rules:**
- Never use `any`.
- Use generic response wrappers for all API responses.

```ts
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
```

---

# Components

## Shared Components (`components/shared/`)

Reusable, stateless UI components. Use them consistently across all pages.

| Component | Purpose |
|---|---|
| `confirm-delete-dialog.tsx` | Confirmation modal for destructive actions |
| `empty-state.tsx` | Empty list placeholder |
| `error-state.tsx` | API error display |
| `form-field.tsx` | React Hook Form field wrapper |
| `page-header.tsx` | Consistent page title + action area |
| `status-badge.tsx` | Status pill/badge |
| `global-search.tsx` | Global search input |
| `mode-toggle.tsx` | Dark/light mode switcher |

**Rules:**
- Components must remain **presentation-only** whenever possible.
- Never put API calls inside reusable UI components.
- If a UI pattern is used more than once, extract it into `components/shared/`.

## UI Components (`components/ui/`)

These are Shadcn UI primitives. **Do not modify these files.**

---

# Providers

All React context providers live in `providers/`.

| Provider | Purpose |
|---|---|
| `auth-context.tsx` | Authentication state (current user, login/logout) |
| `query-provider.tsx` | React Query `QueryClientProvider` wrapper |
| `theme-provider.tsx` | Dark/light theme context |

**Authentication rule:**
- Authentication state belongs to `auth-context.tsx`.
- Server data (e.g. user profile) belongs to React Query.
- Do not duplicate user state between context and React Query.
- The authenticated user must come from `GET /auth/me` via `use-me.ts`.

---

# Error Handling

All API errors must be normalized using the centralized helper in `api/api-error.ts`.

```ts
// Wrong — repeated inline
error.response?.data?.message

// Correct — use centralized helper
import { getErrorMessage } from '@/api/api-error';
getErrorMessage(error)
```

---

# Environment Variables

Never hardcode API URLs.

```ts
// Correct
import.meta.env.VITE_API_URL

// Wrong
'http://localhost:3000'
```

All environment variables must use the `VITE_` prefix. Declare new variables in `.env.example`.

---

# Loading States

- Always show a loading component while data is fetching.
- Never leave a blank or broken page while data loads.
- Use `isPending` / `isLoading` from React Query to conditionally render loading UI.

---

# Empty & Error States

Every list page must handle all four states:

| State | Component |
|---|---|
| Loading | Skeleton or spinner |
| Empty | `<EmptyState />` |
| Error | `<ErrorState />` |
| Success | Actual list content |

---

# Delete Operations

Every destructive action must require user confirmation before executing.

Use the shared `<ConfirmDeleteDialog />` component from `components/shared/confirm-delete-dialog.tsx`.

---

# Toast Notifications

- Show success and error toasts **only** inside mutation hooks (`onSuccess` / `onError` callbacks).
- Never show toasts inside service files.
- Never show duplicate toasts for the same operation.

---

# Forms

All forms must use:

- **React Hook Form** for form state management
- **Zod** (via `zodResolver`) for validation
- **`<FormField />`** from `components/shared/form-field.tsx` for consistent field rendering

Never use uncontrolled forms.

```ts
const form = useForm<ExperienceFormData>({
  resolver: zodResolver(experienceSchema),
  defaultValues: { ... },
});
```

---

# TypeScript

Strict typing is mandatory everywhere.

```ts
// Avoid
const data: any = response.data;

// Prefer
const data: ApiResponse<Experience[]> = response.data;
```

Prefer:
- `interface` for object shapes
- Utility types (`Partial<T>`, `Pick<T, K>`, `Omit<T, K>`)
- Generics for reusable response wrappers

---

# Naming Convention

| Category | Convention | Example |
|---|---|---|
| Hooks | `use-<domain>.ts` (camelCase in code) | `use-login.ts` ? `useLogin()` |
| Services | `<domain>.service.ts` | `auth.service.ts` |
| Schemas | `<domain>.schema.ts` | `experience.schema.ts` |
| Types | `<domain>.types.ts` | `profile.types.ts` |
| Query Keys | `queryKeys.<domain>.<key>` | `queryKeys.projects.all` |
| Endpoints | `ENDPOINTS.<DOMAIN>.<ACTION>` | `ENDPOINTS.AUTH.ME` |

---

# Reusability

- If logic is used **twice**, extract it into a shared hook or utility.
- If a UI pattern is used **twice**, create a shared component in `components/shared/`.

---

# What Should Never Happen

| Rule |
|---|
| Axios inside pages or components |
| Duplicate API logic across hooks or services |
| Duplicate query keys — always use `api/query-keys.ts` |
| Hardcoded URL strings in services or hooks |
| `useEffect` for data fetching |
| `useState` for server state |
| `any` type anywhere |
| Business logic inside UI components |
| Duplicate toast handling |
| Inline Zod schemas inside page components |
| Modifying files inside `components/ui/` |
| Creating new `src/` top-level folders without approval |

---

# Feature Implementation Rule

Every new feature document inside `docs/features/` must follow these guidelines.

Do not introduce a new pattern unless it improves the existing architecture **and** is applied consistently across the entire project.
