# 1.5 路径别名配置（@/src 映射）

## 为什么需要路径别名

使用相对路径导入模块会导致代码难以维护：

```typescript
// ❌ 使用相对路径 - 难以维护
import { Button } from '../../../components/Button.vue'
import { useUserStore } from '../../stores/user'

// ✅ 使用路径别名 - 清晰简洁
import { Button } from '@/components/Button.vue'
import { useUserStore } from '@/stores/user'
```

## Vite 路径别名配置

**`vite.config.ts`**

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@/views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@/layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@/stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@/router': fileURLToPath(new URL('./src/router', import.meta.url)),
      '@/api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@/types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@/composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
      '@/styles': fileURLToPath(new URL('./src/styles', import.meta.url))
    }
  }
})
```

## TypeScript 路径映射配置

**`tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/views/*": ["./src/views/*"],
      "@/layouts/*": ["./src/layouts/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/router/*": ["./src/router/*"],
      "@/api/*": ["./src/api/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/composables/*": ["./src/composables/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  }
}
```

## 可用路径别名

| 别名 | 映射到 | 用途 |
|------|--------|------|
| `@/*` | `src/*` | 通用路径（默认） |
| `@/components/*` | `src/components/*` | 通用组件 |
| `@/views/*` | `src/views/*` | 页面视图 |
| `@/layouts/*` | `src/layouts/*` | 布局组件 |
| `@/stores/*` | `src/stores/*` | Pinia Store |
| `@/router/*` | `src/router/*` | 路由配置 |
| `@/api/*` | `src/api/*` | API 请求 |
| `@/utils/*` | `src/utils/*` | 工具函数 |
| `@/types/*` | `src/types/*` | 类型定义 |
| `@/assets/*` | `src/assets/*` | 静态资源 |
| `@/composables/*` | `src/composables/*` | 组合式函数 |
| `@/styles/*` | `src/styles/*` | 全局样式 |

## 使用示例

```typescript
// 组件导入
import EzButton from '@/components/EzButton.vue'
import EzTable from '@/components/EzTable.vue'

// 页面导入
import UserManagement from '@/views/user/UserManagement.vue'

// Store 导入
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

// 工具函数导入
import { formatDate, debounce } from '@/utils/format'

// 类型导入
import type { User, ApiResponse } from '@/types'

// API 导入
import { getUserList } from '@/api/user'

// 样式导入
import '@/styles/main.css'
```

## 开发服务器配置

**`vite.config.ts`** 同时配置了开发服务器：

```typescript
export default defineConfig({
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

---

**下一步**：1.6 第1章总结文章输出
