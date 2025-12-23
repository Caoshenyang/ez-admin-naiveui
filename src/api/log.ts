import http from '../utils/request'

// 操作日志查询参数
export interface OperationLogQuery {
  page?: number
  size?: number
  title?: string
  operName?: string
  businessType?: number
  status?: number
  beginTime?: string
  endTime?: string
}

// 操作日志项
export interface OperationLogItem {
  id: number
  title: string
  businessType: number
  businessTypes?: string
  method: string
  requestMethod: string
  operatorType: number
  operName: string
  deptName?: string
  operUrl: string
  operIp: string
  operLocation?: string
  operParam?: string
  jsonResult?: string
  status: number
  errorMsg?: string
  operTime: string
  costTime: number
}

// 分页结果
export interface PageResult<T> {
  records: T[]
  total: number
}

// 登录日志查询参数
export interface LoginLogQuery {
  page?: number
  size?: number
  userName?: string
  status?: string
  beginTime?: string
  endTime?: string
}

// 登录日志项
export interface LoginLogItem {
  id: number
  userName: string
  status: string
  ipaddr: string
  loginLocation?: string
  browser: string
  os: string
  msg: string
  loginTime: string
}

// 操作日志API
export const operLogApi = {
  // 分页查询操作日志列表
  page: (params: OperationLogQuery) =>
    http.get<PageResult<OperationLogItem>>('/monitor/operlog/page', { params }),

  // 删除操作日志
  remove: (id: number) =>
    http.delete<void>(`/monitor/operlog/${id}`),

  // 批量删除操作日志
  batchRemove: (ids: number[]) =>
    http.delete<void>('/monitor/operlog/batch', { data: ids }),

  // 清空操作日志
  clean: () =>
    http.delete<void>('/monitor/operlog/clean'),

  // 导出操作日志
  export: (params: OperationLogQuery) =>
    http.get('/monitor/operlog/export', { params, responseType: 'blob' }),
}

// 登录日志API
export const loginLogApi = {
  // 分页查询登录日志列表
  page: (params: LoginLogQuery) =>
    http.get<PageResult<LoginLogItem>>('/monitor/loginlog/page', { params }),

  // 删除登录日志
  remove: (id: number) =>
    http.delete<void>(`/monitor/loginlog/${id}`),

  // 批量删除登录日志
  batchRemove: (ids: number[]) =>
    http.delete<void>('/monitor/loginlog/batch', { data: ids }),

  // 清空登录日志
  clean: () =>
    http.delete<void>('/monitor/loginlog/clean'),

  // 导出登录日志
  export: (params: LoginLogQuery) =>
    http.get('/monitor/loginlog/export', { params, responseType: 'blob' }),
}