import { storage } from './storage'

const TOKEN_KEY = 'ez_admin_token'
const REFRESH_TOKEN_KEY = 'ez_admin_refresh_token'

/**
 * 获取访问令牌
 */
export function getToken(): string | null {
  return storage.get<string>(TOKEN_KEY)
}

/**
 * 设置访问令牌
 */
export function setToken(token: string): void {
  storage.set(TOKEN_KEY, token)
}

/**
 * 移除访问令牌
 */
export function removeToken(): void {
  storage.remove(TOKEN_KEY)
}

/**
 * 获取刷新令牌
 */
export function getRefreshToken(): string | null {
  return storage.get<string>(REFRESH_TOKEN_KEY)
}

/**
 * 设置刷新令牌
 */
export function setRefreshToken(token: string): void {
  storage.set(REFRESH_TOKEN_KEY, token)
}

/**
 * 移除刷新令牌
 */
export function removeRefreshToken(): void {
  storage.remove(REFRESH_TOKEN_KEY)
}

/**
 * 清除所有令牌
 */
export function clearTokens(): void {
  removeToken()
  removeRefreshToken()
}
