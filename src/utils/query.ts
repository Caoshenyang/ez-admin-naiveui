import type { PageQuery } from '@/types/modules/api'

/**
 * 查询参数工具类
 * 用于创建和管理查询参数的默认值
 */

/**
 * 创建默认的查询参数
 * 用于分页查询场景，自动设置初始页码和每页大小
 *
 * @param searchDefaults - 搜索条件的默认值
 * @returns 包含分页信息和搜索条件的查询参数对象
 *
 * @example
 * ```ts
 * const queryParams = createDefaultQueryParams<UserQuery>({
 *   keywords: '',
 *   status: 1
 * })
 * // 结果：{ pageNum: 1, pageSize: 10, search: { keywords: '', status: 1 } }
 * ```
 */
export function createDefaultQueryParams<T extends PageQuery>(searchDefaults: T['search'] = {} as T['search']): T {
  return {
    pageNum: 1,
    pageSize: 10,
    search: searchDefaults,
  } as T
}

