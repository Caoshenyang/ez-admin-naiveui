# 功能特性

## 🎯 核心特性

### 配置化 CRUD 组件

项目提供了高度可配置的 CRUD 组件，支持通过配置快速搭建管理页面：

```typescript
// 表单配置示例
export const userFormConfig: FormConfig = {
  title: '用户表单',
  gridCols: 24,
  fields: [
    { key: 'username', label: '用户名', type: 'input', required: true },
    { key: 'password', label: '密码', type: 'password' },
    { key: 'email', label: '邮箱', type: 'input', inputType: 'email' }
  ],
  rules: formRules
}
```

### 统一的 API 调用

基于 Axios 封装的请求工具，提供统一的 API 调用接口：

```typescript
// API 定义示例
export const userApi = {
  page: (params: UserQuery) => request.get<PageResult<UserListVO>>('/user/page', { params }),
  detail: (id: string) => request.get<UserDetailVO>(`/user/${id}`),
  create: (data: UserCreateDTO) => request.post('/user', data),
  update: (data: UserUpdateDTO) => request.put('/user', data),
  remove: (id: string) => request.delete(`/user/${id}`)
}
```

### 权限控制系统

完整的权限管理系统：

- **路由权限**: 基于路由的访问控制
- **按钮权限**: 页面按钮级别的权限控制
- **菜单权限**: 动态菜单生成
- **角色权限**: 角色-based 的权限分配

### 主题切换

支持亮色和暗色主题切换：

```vue
<n-config-provider :theme="systemStore.getTheme">
  <!-- 应用内容 -->
</n-config-provider>
```

## 🚀 开发体验

### 类型安全

完整的 TypeScript 类型定义：

```typescript
// 类型定义示例
export interface UserListVO {
  userId: number
  username: string
  nickname: string
  email: string
  status: number
  createTime: string
}

export interface UserCreateDTO {
  username: string
  password: string
  nickname: string
  email?: string
}
```

### 自动导入

配置了自动导入，减少手动导入代码：

```typescript
// 自动导入的 API
import { ref, computed, onMounted } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { NButton, NInput } from 'naive-ui'
```

### 组合式函数

提供丰富的组合式函数，提升代码复用性：

```typescript
// CRUD Hook 使用示例
const crud = useCrud(userCrudConfig)
const { loading, dataList, formVisible, handleSearch } = crud
```

## 🎨 用户体验

### 响应式设计

支持响应式布局，适配不同屏幕尺寸：

- 桌面端：完整的布局和功能
- 平板端：优化布局和交互
- 移动端：简化的移动端适配

### 加载状态

完善的加载状态提示：

- 页面加载
- 表单提交
- 数据请求

### 错误处理

统一的错误处理机制：

- 网络错误提示
- 表单验证错误
- 业务逻辑错误

## 📦 扩展性

### 组件扩展

易于扩展的组件系统：

- 自定义表单字段类型
- 自定义表格列渲染
- 自定义操作按钮

### 模块扩展

支持新增业务模块：

- 新增 API 接口
- 新增页面组件
- 新增路由配置
- 新增权限配置

### 主题定制

支持主题定制：

- 自定义颜色方案
- 自定义组件样式
- 自定义布局
