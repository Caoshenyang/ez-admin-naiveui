import http from '../utils/request'
import type { PageResult } from '@/types'

// 字典类型查询参数
export interface DictTypeQuery {
  pageNum?: number
  pageSize?: number
  dictName?: string
  dictType?: string
  status?: string | number
}

// 字典类型项
export interface DictTypeItem {
  id: number
  dictName: string
  dictType: string
  status?: number
  remark?: string
  createdTime?: string
}

// 字典数据查询参数
export interface DictDataQuery {
  pageNum?: number
  pageSize?: number
  dictType?: string
  dictLabel?: string
  status?: string | number
}

// 字典数据项
export interface DictDataItem {
  id: number
  dictType: string
  dictLabel: string
  dictValue: string
  dictSort?: number
  status?: number
  remark?: string
  createdTime?: string
}

// 字典类型创建DTO
export interface DictTypeCreateDTO {
  dictName: string
  dictType: string
  status?: number
  remark?: string
}

// 字典类型更新DTO
export interface DictTypeUpdateDTO {
  id: number
  dictName: string
  dictType: string
  status?: number
  remark?: string
}

// 字典数据创建DTO
export interface DictDataCreateDTO {
  dictType: string
  dictLabel: string
  dictValue: string
  dictSort?: number
  status?: number
  remark?: string
}

// 字典数据更新DTO
export interface DictDataUpdateDTO {
  id: number
  dictType: string
  dictLabel: string
  dictValue: string
  dictSort?: number
  status?: number
  remark?: string
}

// 字典类型API
export const dictTypeApi = {
  // 分页查询字典类型列表
  page: (params: DictTypeQuery) => {
    const { pageNum = 1, pageSize = 10, ...search } = params
    return http.post<PageResult<DictTypeItem>>('/system/dict/type/page', {
      pageNum,
      pageSize,
      search
    })
  },

  // 获取所有字典类型
  list: () =>
    http.get<DictTypeItem[]>('/system/dict/type/list'),

  // 新增字典类型
  create: (data: DictTypeCreateDTO) =>
    http.post<void>('/system/dict/type/create', data),

  // 更新字典类型
  update: (data: DictTypeUpdateDTO) =>
    http.post<void>('/system/dict/type/update', data),

  // 删除字典类型
  remove: (id: string | number) =>
    http.delete<void>(`/system/dict/type/${id}`),

  // 获取详情
  detail: (id: string | number) =>
    http.get<DictTypeItem>(`/system/dict/type/${id}`),

  // 批量删除
  batchRemove: (ids: (string | number)[]) =>
    http.delete<void>('/system/dict/type/batch', { data: ids }),
}

// 字典数据API
export const dictDataApi = {
  // 分页查询字典数据列表
  page: (params: DictDataQuery) => {
    const { pageNum = 1, pageSize = 10, ...search } = params
    return http.post<PageResult<DictDataItem>>('/system/dict/data/page', {
      pageNum,
      pageSize,
      search
    })
  },

  // 根据字典类型获取字典数据
  listByType: (dictType: string) =>
    http.get<DictDataItem[]>(`/system/dict/data/list/type/${dictType}`),

  // 新增字典数据
  create: (data: DictDataCreateDTO) =>
    http.post<void>('/system/dict/data/create', data),

  // 更新字典数据
  update: (data: DictDataUpdateDTO) =>
    http.post<void>('/system/dict/data/update', data),

  // 删除字典数据
  remove: (id: string | number) =>
    http.delete<void>(`/system/dict/data/${id}`),

  // 获取详情
  detail: (id: string | number) =>
    http.get<DictDataItem>(`/system/dict/data/${id}`),

  // 批量删除
  batchRemove: (ids: (string | number)[]) =>
    http.delete<void>('/system/dict/data/batch', { data: ids }),
}