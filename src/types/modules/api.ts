// API相关类型定义

// 排序项
export interface OrderItem {
  // 排序字段
  column: string
  // 是否升序
  asc: boolean
}

// 基础搜索条件
export interface BaseSearchCriteria {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // 扩展字段
}

// 分页查询参数
export interface PageQuery<T = BaseSearchCriteria> {
  // 页码 (从0开始)
  pageNum: number
  // 每页大小
  pageSize: number
  // 排序项列表
  orderItems?: OrderItem[]
  // 搜索条件
  search: T
}

// 分页查询响应
export interface PageResult<T> {
  // 数据列表
  records: T[]
  // 总记录数
  total: number
  // 总页数
  pages: number
}
