# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server (runs on http://127.0.0.1:3000)
- `pnpm build` - Type check and build for production
- `pnpm build-only` - Build without type checking
- `pnpm type-check` - Run TypeScript type checking via vue-tsc
- `pnpm lint` - Run ESLint with auto-fix and caching
- `pnpm format` - Format code with Prettier

### Documentation

- `pnpm docs:dev` - Start VitePress documentation server
- `pnpm docs:build` - Build documentation for production
- `pnpm docs:preview` - Preview built documentation

### Node Version Requirement

- Node.js ^20.19.0 || >=22.12.0 (check `package.json` engines field)

## Architecture Overview

This is a Vue 3 admin template built with Naive UI, featuring a dynamic permission-based routing system and a configuration-driven CRUD component architecture.

### Dynamic Routing System

The application uses a hybrid routing approach:

- **Static routes** (login, home, error pages) are defined in `src/router/routes.ts`
- **Dynamic routes** are loaded from the backend after user authentication

Key files:

- `src/router/index.ts` - Router setup with hash history and guards
- `src/router/routeManager.ts` - `RouteManager` class singleton that handles dynamic route loading
- `src/stores/modules/user.ts` - User store that triggers route loading after login

Route loading flow:

1. User logs in via `src/api/user.ts:login()`
2. User store fetches user info and routes from backend
3. `RouteManager.loadRoutes()` converts backend data to Vue Router format
4. Routes are dynamically added to the router's "Main" layout
5. Menu is generated from the loaded routes

### State Management

Pinia stores with persistence via `pinia-plugin-persistedstate`:

- `src/stores/modules/user.ts` - Authentication state, user info, work tabs
- `src/stores/modules/system.ts` - UI state (sidebar collapse, dark mode)

Both stores persist to localStorage automatically.

### CRUD Component Architecture

The project uses a configuration-driven approach for CRUD operations:

**Core Custom Components** (prefixed with "Ez"):

- `EzTable` - Data table with built-in CRUD actions, pagination, search
- `EzForm` - Dynamic form generator based on configuration
- `EzSearch` - Debounced search input component
- `EzButtonGroup` - Unified action button handling
- `EzDetailModal` - Modal for viewing item details

**Key Hook:**

- `src/hooks/useCrud.ts` - Composable that provides standardized CRUD operations

Pattern: Define a configuration object (table columns, form fields, API mapping) and pass it to `EzTable` which handles all CRUD operations automatically.

### API Layer

Located in `src/api/` - one file per module (user.ts, role.ts, dept.ts, menu.ts, dict.ts, etc.)

All APIs use a centralized HTTP client (`src/utils/request.ts`) that:

- Wraps Axios with 180s timeout
- Expects standard response format: `{code, data, message}`
- Auto-logs out on 401 errors
- Shows user-friendly error messages (toast)
- Supports `noErrorToast` option to suppress error messages
- Integrates with Naive UI's loading bar

API proxy in development: `/dev-api` → `http://127.0.0.1:8080`

### Component Organization

```
src/components/
├── common/       # Reusable UI components (EzTable, EzForm, EzSearch, etc.)
└── layout/       # Layout components (AppLayout, AppMenu, AppTopBar, AppWorkTab)
```

**Important:** Components are auto-imported via `unplugin-vue-components` - no manual imports needed for components in `src/components/` or Naive UI components.

### Type Definitions

Located in `src/types/modules/` - TypeScript types organized by feature matching the API structure.

### Views Organization

Located in `src/views/` - Page components organized by feature (system/, tool/, etc.)

### Build Configuration

**Vite** (`vite.config.ts`):

- Vue 3 + TypeScript with Vue DevTools plugin
- Auto-import for Vue APIs and Naive UI components
- Tailwind CSS v4 via `@tailwindcss/vite`
- Path alias: `@` → `src/`
- Dev server: port 3000, proxy to backend at port 8080

**ESLint** (`eslint.config.ts`):

- Vue + TypeScript recommended configs
- Prettier integration (formatting skipped in linting)
- Flat config format

**TypeScript**:

- Project references setup for better build performance
- Strict type checking enabled

## Important Conventions

1. **Component Naming**: Custom reusable components use "Ez" prefix (EzTable, EzForm, EzSearch)
2. **File Organization**: By feature/vertical, not by type (e.g., `src/api/dict.ts`, `src/types/modules/dict.ts`, `src/views/system/dict/`)
3. **Auto-Imports**: Vue APIs (`ref`, `reactive`, etc.) and Naive UI components are auto-imported - don't add manual imports
4. **Composition API**: Use Vue 3 Composition API exclusively
5. **Route Meta**: Include `title` in route meta for breadcrumbs and page titles
6. **Permission Checks**: Dynamic routes are loaded based on backend permissions

## Development Notes

- The project uses hash-based routing (`createWebHashHistory`)
- Work tabs feature allows tab-based navigation with persistence
- Dark mode is supported with localStorage persistence
- Documentation is built with VitePress and located in `docs/`
- Chinese language UI and documentation (这是中文项目)

## css 相关

- 项目使用了 tailwindcss v4, 所有样式都通过 tailwindcss 来定义
- 项目使用了 naive-ui 组件库，所有组件的样式都通过 naive-ui 来定义
