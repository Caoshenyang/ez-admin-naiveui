import http from '../utils/request'

// 字典类型查询参数
export interface DictTypeQuery {
  page?: number
  size?: number
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
  page?: number
  size?: number
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

// 分页结果
export interface PageResult<T> {
  records: T[]
  total: number
}

// 保存字典类型DTO
export interface SaveDictTypeDTO {
  id?: number
  dictName: string
  dictType: string
  status?: number
  remark?: string
}

// 保存字典数据DTO
export interface SaveDictDataDTO {
  id?: number
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
  page: (params: DictTypeQuery) =>
    http.get<PageResult<DictTypeItem>>('/system/dict/type/page', { params }),

  // 获取所有字典类型
  list: () =>
    http.get<DictTypeItem[]>('/system/dict/type/list'),

  // 新增字典类型
  create: (data: SaveDictTypeDTO) =>
    http.post<void>('/system/dict/type', data),

  // 更新字典类型
  update: (data: SaveDictTypeDTO) =>
    http.put<void>('/system/dict/type', data),

  // 删除字典类型
  remove: (id: number) =>
    http.delete<void>(`/system/dict/type/${id}`),

  // 批量删除
  batchRemove: (ids: number[]) =>
    http.delete<void>('/system/dict/type/batch', { data: ids }),

  // 获取详情
  detail: (id: number) =>
    http.get<DictTypeItem>(`/system/dict/type/${id}`),
}

// 字典数据API
export const dictDataApi = {
  // 分页查询字典数据列表
  page: (params: DictDataQuery) =>
    http.get<PageResult<DictDataItem>>('/system/dict/data/page', { params }),

  // 根据字典类型获取字典数据
  listByType: (dictType: string) =>
    http.get<DictDataItem[]>(`/system/dict/data/type/${dictType}`),

  // 新增字典数据
  create: (data: SaveDictDataDTO) =>
    http.post<void>('/system/dict/data', data),

  // 更新字典数据
  update: (data: SaveDictDataDTO) =>
    http.put<void>('/system/dict/data', data),

  // 删除字典数据
  remove: (id: number) =>
    http.delete<void>(`/system/dict/data/${id}`),

  // 批量删除
  batchRemove: (ids: number[]) =>
    http.delete<void>('/system/dict/data/batch', { data: ids }),

  // 获取详情
  detail: (id: number) =>
    http.get<DictDataItem>(`/system/dict/data/${id}`),
}