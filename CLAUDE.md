# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server (runs on http://127.0.0.1:3000)
- `pnpm build` - Type check and build for production
- `pnpm build-only` - Build without type checking
- `pnpm type-check` - Run TypeScript type checking via vue-tsc
- `pnpm lint` - Run ESLint with auto-fix and caching
- `pnpm format` - Format code with Prettier

**Node version requirement**: ^20.19.0 || >=22.12.0

## Architecture Overview

Vue 3 admin template with Naive UI, featuring dynamic permission-based routing and configuration-driven CRUD components.

### Dynamic Routing System

Hybrid routing with static routes (login, home, error pages) in `src/router/index.ts` and dynamic routes loaded from backend after authentication.

**Route loading flow:**
1. User logs in → User store fetches user info and routes
2. `RouteManager.loadRoutes()` converts backend data to Vue Router format
3. Routes dynamically added to "Main" layout
4. Menu generated from loaded routes

**Key files:**
- `src/router/index.ts` - Router setup with hash history
- `src/router/permission.ts` - Route guards and permission checks
- `src/utils/routeManager.ts` - `RouteManager` singleton for dynamic route loading
- `src/utils/routes.ts` - Route conversion utilities

### State Management

Pinia stores with `pinia-plugin-persistedstate` for localStorage persistence:

- `src/stores/modules/user.ts` - Authentication, user info, work tabs
- `src/stores/modules/system.ts` - UI state (sidebar collapse, dark mode)

### CRUD Component Architecture

Configuration-driven CRUD with "Ez"-prefixed components:

**Components:**
- `EzTable` - Data table with CRUD actions, pagination, search (generic `<T extends RowData>`)
- `EzForm` - Dynamic form generator with modal wrapper
- `EzSearch` - Debounced search input
- `EzButtonGroup` - Unified action button handling
- `EzDetailModal` - Read-only detail view modal

**Core hooks:**
- `src/hooks/useCrud.ts` - Standardized CRUD operations with full type safety (generic over 5 type params)
- `src/hooks/useTreeCrud.ts` - Tree-specific operations (expand/collapse all, toggle)

```ts
// Usage pattern
const crud = useCrud({
  pageApi: async (params) => { ... },
  createApi: async (data) => { ... },
  updateApi: async (data) => { ... },
  removeApi: async (id) => { ... },
  tableConfig: { columns: [...], showActions: true },
  paginationOptions: { pageSizes: [10, 20, 50] }
})
```

Supports both paginated lists and tree structures via `treeMode` option.

### API Layer

One file per module in `src/api/` using centralized HTTP client (`src/utils/request.ts`):

- Expects `{code, data, message}` response format
- 180s timeout, auto-logout on 401
- Optional `noErrorToast` config to suppress error messages
- Dev proxy: `/dev-api` → `http://127.0.0.1:8080`

### Component & File Organization

**Auto-imports** via `unplugin-vue-components`:
- All components in `src/components/` auto-imported
- Naive UI components auto-imported
- Vue APIs (`ref`, `reactive`, etc.) auto-imported

```
src/
├── components/
│   ├── common/     # EzTable, EzForm, EzSearch, EzButtonGroup, EzDetailModal
│   └── layout/     # AppLayout, AppMenu, AppTopBar, AppWorkTab, AppBreadcrumb
├── api/            # One file per module (user.ts, role.ts, dept.ts, menu.ts, etc.)
├── hooks/          # useCrud.ts, useTreeCrud.ts, useMessage.ts, types/
├── types/modules/  # TypeScript types matching API structure
└── views/          # Pages organized by feature (system/, tool/, etc.)
```

### Build Configuration

**Vite** (`vite.config.ts`):
- Vue 3 + TypeScript, Vue DevTools plugin
- Auto-imports for Vue APIs and Naive UI components
- Tailwind CSS v4 via `@tailwindcss/vite`
- Path alias: `@` → `src/`
- Dev server: port 3000

**ESLint** (`eslint.config.ts`):
- Flat config with Vue + TypeScript recommended
- Prettier integration (formatting skipped in linting)

**TypeScript**:
- Project references for build performance
- Strict mode enabled

## Conventions

1. **"Ez" prefix** for custom reusable components (EzTable, EzForm, EzSearch)
2. **Feature-based organization** (e.g., `src/api/dict.ts`, `src/views/system/dict/`)
3. **No manual imports** for auto-imported Vue APIs, Naive UI components, or local components
4. **Composition API only**
5. **Include `title` in route meta** for breadcrumbs/page titles
6. **Chinese language UI** (这是中文项目)

## Other Notes

- Hash-based routing (`createWebHashHistory`)
- Work tabs with persistence
- Dark mode with localStorage persistence
- Documentation via VitePress in `docs/`

## Styling

- Tailwind CSS v4 for all custom styles
- Naive UI component library for UI components