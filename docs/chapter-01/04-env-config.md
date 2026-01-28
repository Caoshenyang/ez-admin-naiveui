# 1.4 环境变量管理与模式说明

## Vite 环境变量

Vite 使用 `.env` 文件管理环境变量，**必须以 `VITE_` 开头**才能在客户端代码中访问。

## 环境模式

| 模式 | 文件 | 说明 | 命令 |
|------|------|------|------|
| development | `.env.development` | 开发环境 | `pnpm dev` |
| production | `.env.production` | 生产环境 | `pnpm build` |
| test | `.env.test` | 测试环境 | `pnpm test` |

## 环境变量优先级

```
.env.local → .env.[mode].local → .env.[mode] → .env
```

**注意**：`.local` 文件会被 git 忽略，用于本地覆盖配置。

## 环境变量定义

### `.env`（通用配置）

```bash
# 应用信息
VITE_APP_TITLE=Ez-Admin
VITE_APP_VERSION=1.0.0

# API 配置
VITE_API_BASE_URL=/api
VITE_UPLOAD_URL=/api/upload

# 默认设置
VITE_DEFAULT_LOCALE=zh-CN
VITE_DEFAULT_THEME=light
```

### `.env.development`（开发环境）

```bash
VITE_API_BASE_URL=/api
VITE_DEV_SERVER_PORT=5173
VITE_USE_MOCK=false
VITE_DEVTOOLS=true
VITE_LOG_LEVEL=debug
```

### `.env.production`（生产环境）

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=error
VITE_DEVTOOLS=false
```

### `.env.local`（本地覆盖，不提交）

```bash
# 本地开发配置
VITE_API_BASE_URL=http://localhost:3000
```

## TypeScript 类型定义

**`src/types/env.d.ts`**

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  // ... 更多类型定义
}
```

## 使用方式

```typescript
// 在代码中访问环境变量
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

## 常用内置变量

| 变量 | 类型 | 说明 |
|------|------|------|
| `import.meta.env.MODE` | string | 当前模式（development/production） |
| `import.meta.env.DEV` | boolean | 是否开发环境 |
| `import.meta.env.PROD` | boolean | 是否生产环境 |
| `import.meta.env.SSR` | boolean | 是否服务端渲染 |

---

**下一步**：1.5 路径别名配置（@/src 映射）
