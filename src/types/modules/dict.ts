// 字典相关类型定义
import type { PageQuery } from './api'

// 字典类型搜索条件
export interface DictTypeSearchCriteria {
  dictName?: string
  dictType?: string
  status?: number
}

// 字典类型实体
export interface DictTypeItem {
  id: number
  dictName: string
  dictType: string
  status?: number
  remark?: string
  createdTime?: string
}

// 字典类型分页查询参数
export type DictTypeQuery = PageQuery<DictTypeSearchCriteria>

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

// 字典数据实体
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

// 字典数据搜索条件
export interface DictDataSearchCriteria {
  dictType?: string
  dictLabel?: string
  status?: number
}

// 字典数据分页查询参数
export type DictDataQuery = PageQuery<DictDataSearchCriteria>

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
