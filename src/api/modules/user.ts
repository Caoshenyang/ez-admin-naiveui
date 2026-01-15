import { request } from '../request'
import type {
  PageParams,
  UserListVO,
  UserDetailVO,
  UserCreateDTO,
  UserUpdateDTO
} from '@/types/api'

/**
 * 分页查询用户列表
 */
export function getUserPage(params: PageParams & {
  username?: string
  nickname?: string
  deptId?: number
}) {
  return request.post({
    url: '/system/user/page',
    data: {
      pageNum: params.page,
      pageSize: params.pageSize,
      search: {
        username: params.username,
        nickname: params.nickname,
        deptId: params.deptId
      }
    }
  })
}

/**
 * 根据ID查询用户详情
 */
export function getUserById(userId: number) {
  return request.get<UserDetailVO>(`/system/user/getUserById/${userId}`)
}

/**
 * 新增用户
 */
export function createUser(data: UserCreateDTO) {
  return request.post('/system/user/create', data)
}

/**
 * 修改用户
 */
export function updateUser(data: UserUpdateDTO) {
  return request.post('/system/user/update', data)
}

/**
 * 删除用户
 */
export function deleteUser(userId: number) {
  return request.delete(`/system/user/delete/${userId}`)
}

/**
 * 批量删除用户
 */
export function batchDeleteUsers(userIds: number[]) {
  return request.delete('/system/user/batch-delete', userIds)
}
