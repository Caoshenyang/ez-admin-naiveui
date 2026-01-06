# 角色接口

::: warning 注意
角色管理模块正在开发中，目前仅提供基础 API 接口定义。完整功能将在后续版本中提供。
:::

角色管理相关的 API 接口，提供角色的增删改查等操作。

## 接口列表

| 接口 | 方法 | 路径 | 描述 | 状态 |
|------|------|------|------|------|
| 分页查询 | POST | `/system/role/page` | 分页查询角色列表 | ✅ |
| 新增角色 | POST | `/system/role` | 创建新角色 | ✅ |
| 更新角色 | PUT | `/system/role` | 更新角色信息 | ✅ |
| 删除角色 | DELETE | `/system/role/{id}` | 删除单个角色 | ✅ |
| 批量删除 | DELETE | `/system/role/batch` | 批量删除角色 | ✅ |
| 角色详情 | GET | `/system/role/{id}` | 获取角色详细信息 | ✅ |

## 接口详情

### 分页查询

分页查询角色列表。

**请求参数**

```typescript
interface RoleQuery {
  page?: number       // 页码
  size?: number       // 页大小
  roleName?: string   // 角色名称
  roleKey?: string    // 角色标识
}
```

**响应数据**

```typescript
interface PageResult<T> {
  records: T[]        // 角色列表
  total: number       // 总记录数
}

interface RoleItem {
  id: number          // 角色ID
  roleName: string    // 角色名称
  roleKey: string     // 角色标识
  description?: string // 描述
  status?: number     // 状态
  createdTime?: string // 创建时间
}
```

### 新增角色

**请求参数**

```typescript
interface SaveRoleDTO {
  roleName: string    // 角色名称
  roleKey: string     // 角色标识
  description?: string // 描述
  status?: number     // 状态
}
```

### 更新角色

**请求参数**

```typescript
interface SaveRoleDTO {
  id: number          // 角色ID
  roleName: string    // 角色名称
  roleKey: string     // 角色标识
  description?: string // 描述
  status?: number     // 状态
}
```

### 删除角色

**路径参数**: `id` - 角色ID

### 批量删除

**请求参数**: `ids: number[]` - 角色ID数组

### 角色详情

**路径参数**: `id` - 角色ID

**响应数据**: `RoleItem`

## 开发状态

- [x] API 接口定义
- [ ] 前端页面实现
- [ ] 权限分配功能
- [ ] 用户角色关联
