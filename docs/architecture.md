# 项目架构

## 目录结构

```
src/
├── api/                    # API 接口层
│   ├── user.ts            # 用户相关接口
│   ├── role.ts            # 角色相关接口
│   ├── menu.ts            # 菜单相关接口
│   ├── department.ts      # 部门相关接口
│   ├── dict.ts            # 字典相关接口
│   ├── file.ts            # 文件相关接口
│   └── log.ts             # 日志相关接口
├── components/             # 组件层
│   ├── common/            # 公共组件
│   │   ├── EzTable.vue    # 通用表格组件
│   │   ├── EzForm.vue     # 通用表单组件
│   │   ├── EzSearch.vue   # 搜索组件
│   │   └── EzDetailModal.vue # 详情模态框
│   └── layout/            # 布局组件
│       ├── AppLayout.vue  # 主布局
│       ├── AppMenu.vue    # 菜单组件
│       ├── AppTopBar.vue  # 顶部栏
│       └── AppBreadcrumb.vue # 面包屑
├── hooks/                  # 组合式函数
│   ├── useCrud.ts         # CRUD 逻辑 Hook
│   ├── useMessage.ts      # 消息提示 Hook
│   └── types/             # Hook 相关类型
├── router/                 # 路由层
│   ├── index.ts           # 路由配置
│   └── permission.ts      # 路由权限控制
├── stores/                 # 状态管理
│   ├── index.ts           # Store 配置
│   └── modules/           # Store 模块
│       ├── user.ts        # 用户状态
│       └── system.ts      # 系统状态
├── types/                  # 类型定义
│   ├── index.ts           # 类型导出
│   └── modules/           # 类型模块
│       ├── api.ts         # API 相关类型
│       ├── user.ts        # 用户相关类型
│       └── common.ts      # 公共类型
├── utils/                  # 工具函数
│   ├── request.ts         # HTTP 请求工具
│   ├── formRules.ts       # 表单验证规则
│   ├── renderers.ts       # 渲染器工具
│   ├── routes.ts          # 路由工具
│   └── actionHandler.ts   # 操作处理器
├── views/                  # 视图层
│   ├── system/            # 系统管理页面
│   │   ├── user/          # 用户管理
│   │   ├── role/          # 角色管理
│   │   ├── menu/          # 菜单管理
│   │   ├── dept/          # 部门管理
│   │   └── dict/          # 字典管理
│   ├── dashboard/         # 仪表板
│   ├── login/             # 登录页面
│   └── error/             # 错误页面
└── main.ts                 # 应用入口
```

## 架构设计

### 分层架构

项目采用分层架构设计，各层职责明确：

1. **视图层 (Views)**: 页面组件，负责用户交互和数据展示
2. **组件层 (Components)**: 可复用的 UI 组件
3. **业务逻辑层 (Hooks)**: 组合式函数，封装业务逻辑
4. **服务层 (API)**: API 接口封装
5. **工具层 (Utils)**: 通用工具函数
6. **类型层 (Types)**: TypeScript 类型定义

### 数据流

```
用户操作 → 视图层 → 业务逻辑层 → API 层 → 后端服务
    ↑                                                ↓
    ← 响应处理 ← 状态更新 ← 数据更新 ← 网络响应 ←
```

## 核心模块

### CRUD 组件系统

项目提供了一套完整的 CRUD 组件系统：

- **EzTable**: 通用表格组件，支持分页、排序、选择等功能
- **EzForm**: 通用表单组件，支持多种字段类型和验证
- **EzSearch**: 搜索组件，支持关键词搜索
- **EzDetailModal**: 详情模态框组件

### Hook 系统

- **useCrud**: 封装完整的 CRUD 逻辑
- **useMessage**: 统一的消息提示处理

### 状态管理

- **用户状态**: 用户信息、登录状态管理
- **系统状态**: 主题、语言等系统配置

### 路由系统

- **静态路由**: 登录、首页等固定路由
- **动态路由**: 基于权限的后端动态路由
- **路由守卫**: 权限验证和重定向

## 配置化开发

### 表单配置

```typescript
export const userFormConfig: FormConfig = {
  title: '用户表单',
  gridCols: 24,
  fields: [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      span: 12
    }
  ],
  rules: formRules
}
```

### 表格配置

```typescript
export const userTableConfig: TableConfigOptions = {
  columns: [
    { title: '用户名', key: 'username', width: 100 }
  ],
  actionButtons: {
    view: true,
    edit: true,
    delete: true
  }
}
```

### CRUD 配置

```typescript
export const userCrudConfig: UserCrudConfig = {
  tableConfig: userTableConfig,
  detailConfig: userDetailConfig,
  pageApi: userApi.page,
  createApi: userApi.create,
  // ...
}
```

## 类型安全

项目采用严格的 TypeScript 配置：

- 完整的类型定义
- 泛型支持
- 接口继承
- 枚举类型

```typescript
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

## 扩展性

### 新增模块

1. 在 `api/` 目录创建 API 文件
2. 在 `types/modules/` 目录创建类型定义
3. 在 `views/system/` 目录创建页面组件
4. 在路由配置中添加路由
5. 配置权限规则

### 自定义组件

1. 在 `components/` 目录创建组件
2. 配置自动导入
3. 在需要的地方使用

### 主题定制

通过 CSS 变量和 Tailwind 配置进行主题定制。
