# 3.3 NaiveUI 主题定制

## 本节目标

- ✅ 深度定制 NaiveUI 主题
- ✅ 配置全局组件样式
- ✅ 实现暗黑模式
- ✅ 覆盖默认样式

---

## 1. NaiveUI 主题配置

### 1.1 创建主题配置文件

**src/settings/naiveui-theme.ts**:

```typescript
import type { GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'

/**
 * 浅色主题
 */
export const lightTheme: GlobalTheme = {
  name: 'light',
  common: {
    primaryColor: '#22c55e',
    primaryColorHover: '#16a34a',
    primaryColorPressed: '#15803d',
    primaryColorSuppl: '#16a34a',
  },
  Button: {
    borderRadiusSmall: '4px',
    borderRadiusMedium: '4px',
    borderRadiusLarge: '4px',
  },
  Input: {
    borderRadius: '4px',
  },
  Card: {
    borderRadius: '8px',
  },
}

/**
 * 深色主题
 */
export const darkTheme: GlobalTheme = {
  name: 'dark',
  common: {
    primaryColor: '#22c55e',
    primaryColorHover: '#16a34a',
    primaryColorPressed: '#15803d',
    primaryColorSuppl: '#16a34a',
  },
}
```

### 1.2 使用主题

**App.vue**:

```vue
<script setup lang="ts">
import { lightTheme, darkTheme } from '@/settings/naiveui-theme'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()

const naiveTheme = computed(() => (theme.value === 'dark' ? darkTheme : lightTheme))
</script>

<template>
  <n-config-provider :theme="naiveTheme">
    <router-view />
  </n-config-provider>
</template>
```

---

## 2. 全局配置

### 2.1 组件尺寸配置

**src/settings/naiveui-config.ts**:

```typescript
export const naiveConfig = {
  // 组件尺寸
  componentSize: 'medium' as 'small' | 'medium' | 'large',
  // 表格配置
  table: {
    size: 'medium',
  },
  // 按钮配置
  button: {
    size: 'medium',
  },
}
```

### 2.2 使用配置

**App.vue**:

```vue
<template>
  <n-config-provider
    :theme="naiveTheme"
    :component-size="naiveConfig.componentSize"
  >
    <router-view />
  </n-config-provider>
</template>
```

---

## 3. 样式覆盖

### 3.1 使用 :deep() 覆盖

```vue
<template>
  <n-card>
    <n-button>按钮</n-button>
  </n-card>
</template>

<style scoped>
:deep(.n-card) {
  border-radius: 12px;
}

:deep(.n-button) {
  border-radius: 8px;
}
</style>
```

### 3.2 使用全局样式覆盖

**src/styles/naiveui-overrides.css**:

```css
/* 覆盖按钮圆角 */
.n-button {
  border-radius: 8px;
}

/* 覆盖卡片阴影 */
.n-card {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* 覆盖输入框边框 */
.n-input {
  border-radius: 4px;
}
```

---

## 4. 组件样式定制

### 4.1 表格样式

```vue
<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :bordered="false"
    size="medium"
    :row-props="rowProps"
  />
</template>

<style scoped>
:deep(.n-data-table) {
  --n-td-color: even;
}

:deep(.n-data-table-th) {
  font-weight: 600;
  background-color: #f9fafb;
}

:deep(.n-data-table-td) {
  padding: 12px 16px;
}
</style>
```

### 4.2 表单样式

```vue
<template>
  <n-form label-placement="left" label-width="100px">
    <n-form-item label="用户名">
      <n-input placeholder="请输入用户名" />
    </n-form-item>
  </n-form>
</template>

<style scoped>
:deep(.n-form-item-label) {
  font-weight: 500;
}

:deep(.n-input) {
  --n-border-radius: 4px;
}
</style>
```

---

## 5. 暗黑模式

### 5.1 自动切换

**App.vue**:

```vue
<script setup lang="ts">
import { lightTheme, darkTheme } from '@/settings/naiveui-theme'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()

const naiveTheme = computed(() =>
  theme.value === 'dark' ? darkTheme : lightTheme
)
</script>

<template>
  <n-config-provider :theme="naiveTheme">
    <router-view />
  </n-config-provider>
</template>
```

### 5.2 暗黑模式样式

**src/styles/dark.css**:

```css
.dark {
  color-scheme: dark;
}

/* NaiveUI 暗黑模式调整 */
.dark :deep(.n-card) {
  background-color: #1f2937;
}

.dark :deep(.n-data-table-th) {
  background-color: #374151;
}
```

---

## 6. 国际化配置

### 6.1 配置中文

**App.vue**:

```vue
<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <router-view />
  </n-config-provider>
</template>
```

### 6.2 配置英文

```typescript
import { enUS, dateEnUS } from 'naive-ui'
```

---

## 7. 本节小结

✅ 完成的工作：
- 定制了 NaiveUI 主题
- 配置了全局组件样式
- 实现了暗黑模式
- 掌握了样式覆盖方法

**下一步**: [3.4 响应式布局设计](./04-响应式布局设计.md)
