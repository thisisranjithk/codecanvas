# API Integration Guidelines & Rules

## Purpose

This document defines the engineering standards for integrating backend APIs into the Portfolio CMS frontend.

Every API integration task must follow these guidelines to ensure the project remains scalable, maintainable, predictable, and production-ready.

---

# Tech Stack

- React 19
- TypeScript (Strict Mode)
- Vite
- React Router
- TanStack React Query
- Axios
- React Hook Form
- Zod
- Shadcn UI

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

The application follows this flow.

UI

↓

Page

↓

React Query Hook

↓

Service Layer

↓

Axios Client

↓

Backend API

Pages must never call axios directly.

Pages must never contain business logic.

Pages should only consume reusable hooks.

---

# Folder Structure

API integration should follow this structure.

src/

    api/

    services/

    hooks/
        api/

    providers/

    lib/

    types/

Do not create new architectural patterns unless approved.

---

# Axios Rules

- Only one Axios instance is allowed.
- Never import axios directly inside pages or components.
- Always use the shared API client.
- Configure interceptors centrally.
- Never duplicate request configuration.

---

# React Query Rules

Every API call must use React Query.

Use:

- useQuery
- useMutation
- queryClient.invalidateQueries()

Never use useEffect for fetching API data.

Never use useState to store server state.

---

# Query Keys

Every query must use centralized query keys.

Never hardcode:

["projects"]

Instead use:

queryKeys.projects.all

queryKeys.projects.detail(id)

---

# Service Layer Rules

Every backend module must have its own service.

Example:

services/

    auth/

    project/

    profile/

Each service is responsible only for API communication.

No UI logic.

No toast messages.

No navigation.

---

# Hook Rules

Every CRUD operation should have its own hook.

Example

useProjects()

useProject(id)

useCreateProject()

useUpdateProject()

useDeleteProject()

Hooks own:

- React Query
- cache invalidation
- optimistic updates (when needed)

Hooks should never render UI.

---

# Components

Components must remain presentation-only whenever possible.

Avoid putting API calls inside reusable UI components.

---

# Authentication

Authentication state belongs to Auth Context.

Server data belongs to React Query.

Do not duplicate user state.

The authenticated user should come from:

GET /auth/me

---

# Error Handling

All API errors should be normalized.

Avoid repeating:

error.response?.data?.message

Use centralized helpers.

---

# API Responses

Every endpoint must use strongly typed interfaces.

Never use any.

Use generic response types whenever possible.

Example

ApiResponse<T>

---

# Environment Variables

Never hardcode URLs.

Use:

VITE_API_URL

Future environment variables must also use VITE_ prefix.

---

# Loading States

Always use loading components.

Never leave blank pages while data loads.

---

# Empty States

Every list page should handle:

- Loading
- Empty
- Error
- Success

---

# Delete Operations

Every destructive action must require confirmation.

Use the shared ConfirmDeleteDialog component.

---

# Toast Notifications

Show success and error notifications only after mutations.

Avoid duplicate notifications.

---

# Forms

All forms must use:

React Hook Form

+

Zod

Never use uncontrolled forms.

---

# TypeScript

Strict typing is mandatory.

Avoid:

any

Prefer:

interfaces

utility types

generics

---

# Reusability

If logic is used twice,

extract it.

If UI is used twice,

create a shared component.

---

# Naming Convention

Hooks

useProjects

useProject

useCreateProject

Services

project.service.ts

Types

project.types.ts

Query Keys

queryKeys.projects.all

---

# What Should Never Happen

❌ Axios inside pages

❌ Axios inside components

❌ Duplicate API logic

❌ Duplicate query keys

❌ Hardcoded URLs

❌ useEffect for fetching

❌ useState for server state

❌ any

❌ Business logic inside UI components

❌ Duplicate toast handling

---

# Feature Implementation Rule

Every new feature document inside docs/features must follow these guidelines.

Do not introduce a new pattern unless it improves the existing architecture and is applied consistently across the project.