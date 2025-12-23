import type { LoginDTO, UserInfoVO } from '@/types'
import http from '../utils/request'

export const loginApi = {
    // 登录 - 基于Cookie/Session
    login: (data: LoginDTO) => http.post('/auth/login', data),

    // 登出
    logout: () => http.post('/auth/logout'),

    // 获取用户信息
    getUserInfo: () => http.get<UserInfoVO>('/auth/user-info'),

}
