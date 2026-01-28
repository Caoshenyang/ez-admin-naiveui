# 第2章：NaiveUI 组件库集成与主题配置

## 2.1 安装 NaiveUI 及依赖包

### 最新版本信息

| 包名 | 版本 | 说明 |
|------|------|------|
| naive-ui | ^2.43.2 | Vue 3 组件库 |
| @vueuse/core | ^11.0.0 | Vue 组合式函数工具集 |
| unplugin-auto-import | ^21.0.0 | 自动导入 API |
| unplugin-vue-components | ^31.0.0 | 按需引入组件 |
| vfonts | ^0.0.3 | 字体库 |
| @iconify/vue | ^5.0.0 | 图标库 |

### 安装命令

```bash
# 安装 NaiveUI 和核心依赖
pnpm add naive-ui @vueuse/core

# 安装开发依赖
pnpm add -D unplugin-auto-import unplugin-vue-components vfonts @iconify/vue
```

---

## 2.2 按需引入配置

### Vite 配置

**`vite.config.ts`**

```typescript
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    // 自动导入 Vue API
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: 'src/types/auto-imports.d.ts'
    }),
    // 按需引入组件
    Components({
      resolvers: [NaiveUiResolver()],
      dts: 'src/types/components.d.ts'
    })
  ]
})
```

### 自动导入的内容

**Vue API**：`ref`, `computed`, `watch`, `onMounted` 等

**Vue Router API**：`useRouter`, `useRoute` 等

**VueUse API**：`useDark`, `useToggle` 等

**NaiveUI Hooks**：`useDialog`, `useMessage`, `useNotification`, `useLoadingBar`

---

## 2.3 主题定制与 CSS 变量系统

### 主题变量配置

**`src/styles/theme.css`**

```css
:root {
  /* 主题色 */
  --primary-color: #18a058;
  --info-color: #2080f0;
  --success-color: #18a058;
  --warning-color: #f0a020;
  --error-color: #d03050;

  /* 文本颜色 */
  --text-color-1: #333333;
  --text-color-2: #4c4c4c;
  --text-color-3: #666666;

  /* 背景颜色 */
  --bg-color: #ffffff;
  --bg-color-hover: #f7f9fa;

  /* 圆角 */
  --border-radius-small: 4px;
  --border-radius-medium: 8px;
  --border-radius-large: 12px;

  /* 阴影 */
  --shadow-1: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-2: 0 4px 16px rgba(0, 0, 0, 0.12);
}
```

### 暗黑模式

```css
.dark {
  --text-color-1: #ffffff;
  --text-color-2: #e0e0e0;
  --bg-color: #101014;
  --bg-color-hover: #1a1a1f;
}
```

---

## 2.4 暗黑模式实现方案

### useTheme Composable

**`src/composables/useTheme.ts`**

```typescript
import { useDark, useToggle } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark({
    storageKey: 'ez-admin-theme'
  })

  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleTheme: () => toggleDark()
  }
}
```

### 使用方式

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <n-button @click="toggleTheme">
    {{ isDark ? '🌙 暗黑' : '☀️ 明亮' }}
  </n-button>
</template>
```

---

## 2.5 全局组件注册规范

### 组件命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| NaiveUI 组件 | `n-` 前缀 | `<n-button>`, `<n-card>` |
| 自定义全局组件 | `Ez` 前缀 | `<EzButton>`, `<EzTable>` |
| 页面组件 | 语义化 PascalCase | `UserManagement.vue` |
| 布局组件 | `App` 前缀 | `AppHeader.vue`, `AppSidebar.vue` |

### 组件自动导入配置

**`vite.config.ts`**

```typescript
function EzComponentResolver() {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^Ez[A-Z]/)) {
        const componentName = name.replace(/^Ez/, '')
        return {
          name: componentName,
          from: '@/components/common/Ez' + componentName + '.vue'
        }
      }
    }
  }
}

Components({
  resolvers: [
    NaiveUiResolver(),
    EzComponentResolver() // Ez 前缀组件自动导入
  ]
})
```

### 示例：EzButton 组件

**`src/components/common/EzButton.vue`**

```vue
<script setup lang="ts">
export interface EzButtonProps {
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  block?: boolean
}

const props = withDefaults(defineProps<EzButtonProps>(), {
  type: 'default',
  size: 'medium'
})
</script>

<template>
  <n-button v-bind="props" :class="{ 'w-full': block }">
    <slot />
  </n-button>
</template>
```

---

## 项目结构更新

```
src/
├── components/
│   └── common/
│       └── EzButton.vue          # 示例全局组件
├── composables/
│   └── useTheme.ts               # 主题管理
├── styles/
│   ├── theme.css                 # 主题变量
│   └── index.css                 # 全局样式
├── types/
│   ├── auto-imports.d.ts         # 自动导入类型
│   └── components.d.ts           # 组件类型
├── utils/
│   └── componentResolver.ts      # 组件解析器
├── App.vue                       # 根组件（已更新）
└── main.ts                       # 入口文件（已更新）
```

---

## 下一步

**第3章：Tailwind CSS 样式系统搭建**
