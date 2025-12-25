// 日志相关类型定义
import type { PageQuery } from './api'

// 操作日志实体
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
  costTime?: number
}

// 操作日志搜索条件
export interface OperationLogSearchCriteria {
  title?: string
  operName?: string
  businessType?: number
  status?: number
  beginTime?: string
  endTime?: string
}

// 操作日志分页查询参数
export type OperationLogQuery = PageQuery<OperationLogSearchCriteria>

// 登录日志实体
export interface LoginLogItem {
  id: number
  loginName: string
  ipaddr: string
  loginLocation?: string
  browser: string
  os: string
  status: number
  msg: string
  loginTime: string
}

// 登录日志搜索条件
export interface LoginLogSearchCriteria {
  loginName?: string
  ipaddr?: string
  status?: number
  beginTime?: string
  endTime?: string
}

// 登录日志分页查询参数
export type LoginLogQuery = PageQuery<LoginLogSearchCriteria>
