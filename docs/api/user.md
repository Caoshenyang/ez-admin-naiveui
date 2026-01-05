# 用户接口

用户管理相关的 API 接口，提供用户的增删改查等操作。

## 接口列表

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| [分页查询](#分页查询) | POST | `/system/user/page` | 分页查询用户列表 |
| [新增用户](#新增用户) | POST | `/system/user/create` | 创建新用户 |
| [更新用户](#更新用户) | POST | `/system/user/update` | 更新用户信息 |
| [删除用户](#删除用户) | DELETE | `/system/user/delete/{id}` | 删除单个用户 |
| [批量删除](#批量删除) | DELETE | `/system/user/batch-delete` | 批量删除用户 |
| [用户详情](#用户详情) | GET | `/system/user/getUserById/{id}` | 获取用户详细信息 |
| [更新状态](#更新状态) | PUT | `/system/user/{id}/status` | 更新用户状态 |

## 接口详情

### 分页查询

分页查询用户列表，支持关键词搜索和条件筛选。

**请求信息**

- **方法**: `POST`
- **路径**: `/system/user/page`
- **权限**: `sys:user:view`

**请求参数**

```typescript
interface UserQuery {
  pageNum: number      // 页码，从1开始
  pageSize: number     // 页大小，默认10
  search?: {
    keywords?: string  // 搜索关键词（用户名、昵称、邮箱）
    status?: number    // 用户状态（1:启用 0:禁用）
    deptId?: number    // 部门ID
  }
  sort?: {
    field?: string    // 排序字段
    order?: 'asc' | 'desc' // 排序顺序
  }
}
```

**请求示例**

```json
{
  "pageNum": 1,
  "pageSize": 10,
  "search": {
    "keywords": "admin",
    "status": 1
  },
  "sort": {
    "field": "createTime",
    "order": "desc"
  }
}
```

**响应数据**

```typescript
interface PageResult<UserListVO> {
  records: UserListVO[] // 用户列表
  total: number         // 总记录数
  pageNum: number       // 当前页码
  pageSize: number      // 页大小
  pages: number         // 总页数
}

interface UserListVO {
  userId: number       // 用户ID
  username: string     // 用户名
  nickname: string     // 昵称
  email: string        // 邮箱
  phoneNumber?: string // 手机号
  gender?: number      // 性别（1:男 2:女）
  status: number       // 状态（1:启用 0:禁用）
  deptId?: number      // 部门ID
  deptName?: string    // 部门名称
  createTime: string   // 创建时间
  updateTime?: string  // 更新时间
}
```

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "userId": 1,
        "username": "admin",
        "nickname": "管理员",
        "email": "admin@example.com",
        "phoneNumber": "13800138000",
        "gender": 1,
        "status": 1,
        "deptId": 1,
        "deptName": "技术部",
        "createTime": "2023-01-01 12:00:00",
        "updateTime": "2023-01-01 12:00:00"
      }
    ],
    "total": 1,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 1
  }
}
```

### 新增用户

创建新用户。

**请求信息**

- **方法**: `POST`
- **路径**: `/system/user/create`
- **权限**: `sys:user:add`

**请求参数**

```typescript
interface UserCreateDTO {
  username: string     // 用户名（必填，唯一）
  password: string     // 密码（必填）
  nickname: string     // 昵称（必填）
  email?: string       // 邮箱（选填）
  phoneNumber?: string // 手机号（选填）
  gender?: number      // 性别（1:男 2:女）
  status: number       // 状态（1:启用 0:禁用，必填）
  deptId?: number      // 部门ID（选填）
}
```

**请求示例**

```json
{
  "username": "zhangsan",
  "password": "123456",
  "nickname": "张三",
  "email": "zhangsan@example.com",
  "phoneNumber": "13800138001",
  "gender": 1,
  "status": 1,
  "deptId": 1
}
```

**响应数据**

```typescript
// 成功时无数据返回
```

### 更新用户

更新用户信息。

**请求信息**

- **方法**: `POST`
- **路径**: `/system/user/update`
- **权限**: `sys:user:edit`

**请求参数**

```typescript
interface UserUpdateDTO extends UserCreateDTO {
  userId: number // 用户ID（必填）
}
```

**请求示例**

```json
{
  "userId": 2,
  "username": "zhangsan",
  "nickname": "张三",
  "email": "zhangsan@example.com",
  "phoneNumber": "13800138001",
  "gender": 1,
  "status": 1,
  "deptId": 1
}
```

**响应数据**

```typescript
// 成功时无数据返回
```

### 删除用户

删除单个用户。

**请求信息**

- **方法**: `DELETE`
- **路径**: `/system/user/delete/{id}`
- **权限**: `sys:user:delete`

**路径参数**

- `id`: 用户ID

**请求示例**

```
DELETE /system/user/delete/2
```

**响应数据**

```typescript
// 成功时无数据返回
```

### 批量删除

批量删除用户。

**请求信息**

- **方法**: `DELETE`
- **路径**: `/system/user/batch-delete`
- **权限**: `sys:user:delete`

**请求参数**

```typescript
interface BatchDeleteRequest {
  ids: (string | number)[] // 用户ID数组
}
```

**请求示例**

```json
{
  "ids": [2, 3, 4]
}
```

**响应数据**

```typescript
// 成功时无数据返回
```

### 用户详情

获取用户详细信息。

**请求信息**

- **方法**: `GET`
- **路径**: `/system/user/getUserById/{id}`
- **权限**: `sys:user:view`

**路径参数**

- `id`: 用户ID

**请求示例**

```
GET /system/user/getUserById/1
```

**响应数据**

```typescript
interface UserDetailVO extends UserListVO {
  // 包含 UserListVO 的所有字段
  // 可扩展更多详情字段
}
```

### 更新状态

更新用户状态（启用/禁用）。

**请求信息**

- **方法**: `PUT`
- **路径**: `/system/user/{id}/status`
- **权限**: `sys:user:edit`

**路径参数**

- `id`: 用户ID

**请求参数**

```typescript
interface UpdateStatusRequest {
  status: number // 用户状态（1:启用 0:禁用）
}
```

**请求示例**

```json
{
  "status": 0
}
```

**响应数据**

```typescript
// 成功时无数据返回
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 用户不存在 |
| 409 | 用户名已存在 |
| 500 | 服务器内部错误 |

## 注意事项

1. 用户名在系统中必须唯一
2. 删除用户前需要检查是否有相关联的业务数据
3. 密码字段在更新时如果为空则保持原密码不变
4. 邮箱和手机号格式需要验证
5. 状态更新会立即生效，影响用户登录
