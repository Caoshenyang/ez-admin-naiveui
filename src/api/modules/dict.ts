import { request } from '../request'
import type {
  PageParams,
  DictType,
  DictData,
  DictTypeCreateDTO,
  DictTypeUpdateDTO,
  DictDataCreateDTO,
  DictDataUpdateDTO,
  DictTypeQuery,
  DictDataQuery
} from '@/types/api'

// ========== 字典类型 ==========

/**
 * 字典类型分页查询
 */
export function getDictTypePage(params: PageParams & DictTypeQuery) {
  return request.post({
    url: '/system/dict/type/page',
    data: {
      pageNum: params.page,
      pageSize: params.pageSize,
      search: params
    }
  })
}

/**
 * 字典类型详情
 */
export function getDictTypeDetail(dictId: number) {
  return request.get<DictType>(`/system/dict/type/${dictId}`)
}

/**
 * 新增字典类型
 */
export function createDictType(data: DictTypeCreateDTO) {
  return request.post('/system/dict/type/create', data)
}

/**
 * 更新字典类型
 */
export function updateDictType(data: DictTypeUpdateDTO) {
  return request.post('/system/dict/type/update', data)
}

/**
 * 删除字典类型
 */
export function deleteDictType(dictId: number) {
  return request.delete(`/system/dict/type/${dictId}`)
}

/**
 * 全部字典类型列表
 */
export function getDictTypeListAll() {
  return request.get<DictType[]>('/system/dict/type/list')
}

// ========== 字典数据 ==========

/**
 * 字典数据分页查询
 */
export function getDictDataPage(params: PageParams & DictDataQuery) {
  return request.post({
    url: '/system/dict/data/page',
    data: {
      pageNum: params.page,
      pageSize: params.pageSize,
      search: params
    }
  })
}

/**
 * 字典数据详情
 */
export function getDictDataDetail(dictDataId: number) {
  return request.get<DictData>(`/system/dict/data/${dictDataId}`)
}

/**
 * 新增字典数据
 */
export function createDictData(data: DictDataCreateDTO) {
  return request.post('/system/dict/data/create', data)
}

/**
 * 更新字典数据
 */
export function updateDictData(data: DictDataUpdateDTO) {
  return request.post('/system/dict/data/update', data)
}

/**
 * 删除字典数据
 */
export function deleteDictData(dictDataId: number) {
  return request.delete(`/system/dict/data/${dictDataId}`)
}

/**
 * 根据字典类型ID获取数据列表
 */
export function getDictDataByType(dictId: number) {
  return request.get<DictData[]>(`/system/dict/data/list/${dictId}`)
}

/**
 * 根据字典类型编码获取数据列表
 */
export function getDictDataByDictType(dictType: string) {
  return request.get<DictData[]>(`/system/dict/data/list/type/${dictType}`)
}
