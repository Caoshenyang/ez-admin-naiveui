import http from '../utils/request'
import type { PageQuery, PageResult, UserListVO } from '../types'

// 这里的接口路径和字段需要根据你的 Swagger 文档适当调整
// 下面采用常见的 REST 风格作为默认实现

// 用户搜索条件
export interface UserSearchCriteria {
    username?: string
    nickname?: string
    deptId?: number
    status?: number
}

// 用户分页查询参数
export type UserQuery = PageQuery<UserSearchCriteria>

export interface UserItem {
    id: number
    username: string
    nickname?: string
    email?: string
    phone?: string
    status?: number
    createdTime?: string
    roleNames?: string[]
}


export interface SaveUserDTO {
    id?: number
    username: string
    password?: string
    nickname?: string
    email?: string
    phone?: string
    status?: number
    roleIds?: number[]
}

export const userApi = {
    // 分页查询用户列表
    page: (params: UserQuery) =>
        http.post<PageResult<UserListVO>>('/system/user/page', params),

    // 新增用户
    create: (data: SaveUserDTO) =>
        http.post<void>('/system/user', data),

    // 更新用户
    update: (data: SaveUserDTO) =>
        http.put<void>('/system/user', data),

    // 删除单个用户
    remove: (id: number) =>
        http.delete<void>(`/system/user/${id}`),

    // 批量删除
    batchRemove: (ids: number[]) =>
        http.delete<void>('/system/user/batch', { data: ids }),

    // 获取详情
    detail: (id: number) =>
        http.get<UserItem>(`/system/user/${id}`),

    // 更新用户状态
    updateStatus: (id: number, status: number) =>
        http.put<void>(`/system/user/${id}/status`, { status }),
}
