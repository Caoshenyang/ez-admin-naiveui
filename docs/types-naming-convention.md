# 类型命名规范

## 概述

本项目采用统一的类型命名规范，确保代码的可读性和一致性。参考了阿里巴巴Java开发手册和行业最佳实践。

## 图片使用示例

### 放置图片

将图片文件放在 `docs/.vitepress/public/images/` 目录下。

### 引用图片

```markdown
<!-- 方式1：绝对路径 -->

![类型命名示例](/images/types-example.png)

<!-- 方式2：相对路径 -->

![架构图](./images/architecture.png)
```

## 命名模式

### 1. 数据传输对象 (DTO)

#### 创建DTO

- 命名格式：`{Entity}CreateDTO`
- 用途：用于创建实体时的数据传输
- 示例：`UserCreateDTO`, `DeptCreateDTO`

#### 更新DTO

- 命名格式：`{Entity}UpdateDTO`
- 用途：用于更新实体时的数据传输
- 继承关系：通常继承自对应的CreateDTO，并添加ID字段
- 示例：`UserUpdateDTO`, `DeptUpdateDTO`

### 2. 视图对象 (VO)

#### 列表VO

- 命名格式：`{Entity}ListVO`
- 用途：用于列表展示的数据传输，包含列表展示所需的所有字段
- 示例：`UserListVO`, `DeptListVO`

#### 详情VO

- 命名格式：`{Entity}DetailVO`
- 用途：用于详情页展示的数据传输，包含详情页所需的所有字段
- 示例：`UserDetailVO`, `DeptDetailVO`

### 3. 查询对象

#### 查询参数

- 命名格式：`{Entity}Query`
- 用途：用于分页查询的参数类型
- 示例：`UserQuery`, `DeptQuery`

#### 搜索条件

- 命名格式：`{Entity}SearchCriteria`
- 用途：查询参数中的搜索条件部分
- 示例：`UserSearchCriteria`, `DeptSearchCriteria`

## CRUD 配置类型

- 命名格式：`{Entity}CrudConfig`
- 定义：`CrudConfig<ListVO, Query, CreateDTO, UpdateDTO, DetailVO>`
- 示例：`UserCrudConfig`, `DeptCrudConfig`

## 完整示例

以用户管理为例：

```typescript
// 列表展示
export interface UserListVO {
  userId: string
  username: string
  nickname: string
  email?: string
  status: number
  createTime: string
}

// 详情展示
export interface UserDetailVO {
  userId: string
  username: string
  nickname: string
  email?: string
  phoneNumber?: string
  avatar?: string
  status: number
  createTime: string
  updateTime?: string
}

// 创建数据
export interface UserCreateDTO {
  username: string
  password: string
  nickname: string
  email?: string
  phoneNumber?: string
  gender?: number
  status?: number
}

// 更新数据
export interface UserUpdateDTO extends UserCreateDTO {
  userId: string
}

// 查询参数
export interface UserSearchCriteria {
  username?: string
  nickname?: string
  email?: string
  status?: number
  keywords?: string
}

export type UserQuery = PageQuery<UserSearchCriteria>

// CRUD配置
export type UserCrudConfig = CrudConfig<UserListVO, UserQuery, UserCreateDTO, UserUpdateDTO, UserDetailVO>
```

## 设计原则

### 1. 职责分离

- **CreateDTO/UpdateDTO**：专注于数据传输，不包含业务逻辑
- **ListVO/DetailVO**：专注于数据展示，包含展示逻辑
- **Query**：专注于查询参数的组织

### 2. 继承复用

- UpdateDTO 通常继承 CreateDTO，避免重复定义字段
- 通过添加 ID 字段来区分创建和更新操作

### 3. 字段精简

- 不同场景使用不同的对象，避免传递不必要的数据
- ListVO 字段相对较少，DetailVO 字段相对较多

### 4. 类型安全

- 使用 TypeScript 的类型系统确保数据结构的一致性
- 通过泛型约束 CRUD 操作的类型安全

## 实施指南

### 新增实体时

1. 定义 `EntityListVO` - 列表展示字段
2. 定义 `EntityDetailVO` - 详情展示字段
3. 定义 `EntityCreateDTO` - 创建时需要的字段
4. 定义 `EntityUpdateDTO` - 更新时需要的字段（继承CreateDTO）
5. 定义 `EntitySearchCriteria` - 搜索条件
6. 定义 `EntityQuery` - 查询参数类型
7. 定义 `EntityCrudConfig` - CRUD配置类型

### 现有实体修改

- 遵循上述命名规范
- 保持向后兼容性
- 逐步迁移旧的命名

## 注意事项

1. **命名一致性**：所有相关类型都应遵循相同的命名模式
2. **版本控制**：类型定义的变更需要考虑向后兼容性
3. **文档同步**：类型定义变更时应同步更新相关文档
4. **团队沟通**：类型命名规范应在团队中达成共识
