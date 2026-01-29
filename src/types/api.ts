/**
 * API 通用响应结构
 */
export interface ApiResponse<T = any> {
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 时间戳 */
  timestamp?: number
}

/**
 * 分页请求参数
 */
export interface PageParams {
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface PageData<T = any> {
  /** 数据列表 */
  list: T[]
  /** 总条数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}
