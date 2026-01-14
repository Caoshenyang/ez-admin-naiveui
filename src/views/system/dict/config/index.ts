/**
 * 字典管理配置
 *
 * 统一导出所有字典相关的配置项
 */
import type { CrudConfig } from '@/hooks/useCrud'
import type { FormConfig } from '@/components/common/EzForm.vue'
import type { FormRules } from 'naive-ui'
import type {
  DictTypeItem,
  DictDataItem,
  DictTypeCreateDTO,
  DictTypeUpdateDTO,
  DictDataCreateDTO,
  DictDataUpdateDTO,
  DictTypeQuery,
  DictDataQuery
} from '@/types'
import type { TableConfigOptions } from '@/hooks/types/table'
import { dictTypeApi, dictDataApi } from '@/api/dict'

// === 基础选项配置 ===
const statusOptions = [
  { label: '启用', value: 1, type: 'success' as const },
  { label: '禁用', value: 0, type: 'error' as const },
]

// === 表单验证规则配置 ===

// 字典类型表单验证规则
const dictTypeFormRules: FormRules = {
  dictName: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
    { min: 1, max: 100, message: '字典名称长度应在1-100个字符之间', trigger: 'blur' },
  ],
  dictType: [
    { required: true, message: '请输入字典类型', trigger: 'blur' },
    { min: 1, max: 100, message: '字典类型长度应在1-100个字符之间', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '字典类型只能包含字母、数字和下划线',
      trigger: 'blur'
    },
  ],
}

// 字典数据表单验证规则
const dictDataFormRules: FormRules = {
  dictLabel: [
    { required: true, message: '请输入字典标签', trigger: 'blur' },
    { min: 1, max: 100, message: '字典标签长度应在1-100个字符之间', trigger: 'blur' },
  ],
  dictValue: [
    { required: true, message: '请输入字典键值', trigger: 'blur' },
    { min: 1, max: 100, message: '字典键值长度应在1-100个字符之间', trigger: 'blur' },
  ],
}

// === 表单配置 ===

// 字典类型表单配置
export const dictTypeFormConfig: FormConfig<Record<string, unknown>> = {
  title: '字典类型表单',
  gridCols: 24,
  size: 'medium',
  fields: [
    {
      key: 'dictName',
      label: '字典名称',
      type: 'input',
      required: true,
      placeholder: '请输入字典名称',
      span: 24
    },
    {
      key: 'dictType',
      label: '字典类型',
      type: 'input',
      required: true,
      placeholder: '请输入字典类型',
      span: 24
    },
    {
      key: 'status',
      label: '状态',
      type: 'radio',
      options: statusOptions,
      required: true,
      span: 24
    },
    {
      key: 'remark',
      label: '备注',
      type: 'textarea',
      placeholder: '请输入备注',
      span: 24
    },
  ],
  rules: dictTypeFormRules,
}

// 字典数据表单配置
export const dictDataFormConfig: FormConfig<Record<string, unknown>> = {
  title: '字典数据表单',
  gridCols: 24,
  size: 'medium',
  fields: [
    {
      key: 'dictType',
      label: '字典类型',
      type: 'input',
      required: true,
      placeholder: '请输入字典类型',
      disabled: true,
      span: 12
    },
    {
      key: 'dictLabel',
      label: '字典标签',
      type: 'input',
      required: true,
      placeholder: '请输入字典标签',
      span: 12
    },
    {
      key: 'dictValue',
      label: '字典键值',
      type: 'input',
      required: true,
      placeholder: '请输入字典键值',
      span: 12
    },
    {
      key: 'dictSort',
      label: '排序',
      type: 'number',
      placeholder: '请输入排序号',
      validator: (value: number) => value >= 0,
      span: 12
    },
    {
      key: 'status',
      label: '状态',
      type: 'radio',
      options: statusOptions,
      required: true,
      span: 24
    },
    {
      key: 'remark',
      label: '备注',
      type: 'textarea',
      placeholder: '请输入备注',
      span: 24
    },
  ],
  rules: dictDataFormRules,
}

// === 表格配置 ===

// 字典类型表格配置
export const dictTypeTableConfig: TableConfigOptions<DictTypeItem> = {
  columns: [
    { title: '字典名称', key: 'dictName', width: 200 },
    { title: '字典类型', key: 'dictType', width: 200 },
    { title: '状态', key: 'status', width: 100, render: (row) => {
      const status = statusOptions.find(opt => opt.value === row.status)
      return status ? status.label : '-'
    }},
    { title: '备注', key: 'remark', width: 200 },
    { title: '创建时间', key: 'createdTime', width: 180 },
  ],
  actionButtons: {
    edit: true,
    delete: true,
  },
  actionOrder: ['edit', 'delete'],
  actionWidth: 120,
}

// 字典数据表格配置
export const dictDataTableConfig: TableConfigOptions<DictDataItem> = {
  columns: [
    { title: '字典标签', key: 'dictLabel', width: 150 },
    { title: '字典键值', key: 'dictValue', width: 150 },
    { title: '排序', key: 'dictSort', width: 100 },
    { title: '状态', key: 'status', width: 100, render: (row) => {
      const status = statusOptions.find(opt => opt.value === row.status)
      return status ? status.label : '-'
    }},
    { title: '备注', key: 'remark', width: 200 },
    { title: '创建时间', key: 'createdTime', width: 180 },
  ],
  actionButtons: {
    edit: true,
    delete: true,
  },
  actionOrder: ['edit', 'delete'],
  actionWidth: 120,
}

// === CRUD 配置 ===

// 字典类型CRUD配置
export const dictTypeCrudConfig: CrudConfig<DictTypeItem, DictTypeQuery, DictTypeCreateDTO, DictTypeUpdateDTO, DictTypeItem> = {
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    search: {
      dictName: '',
      dictType: '',
      status: undefined,
    },
  },
  paginationOptions: {
    pageSizes: [10, 20, 50],
  },
  tableConfig: dictTypeTableConfig,
  pageApi: dictTypeApi.page,
  detailApi: dictTypeApi.detail,
  createApi: dictTypeApi.create,
  updateApi: dictTypeApi.update,
  removeApi: dictTypeApi.remove,
  batchRemoveApi: dictTypeApi.batchRemove,
  idKey: 'id',
  nameKey: 'dictName',
  createDefaultValues: {
    status: 1,
  },
}

// 字典数据CRUD配置
export const dictDataCrudConfig: CrudConfig<DictDataItem, DictDataQuery, DictDataCreateDTO, DictDataUpdateDTO, DictDataItem> = {
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    search: {
      dictType: '',
      dictLabel: '',
      status: undefined,
    },
  },
  paginationOptions: {
    pageSizes: [10, 20, 50],
  },
  tableConfig: dictDataTableConfig,
  pageApi: dictDataApi.page,
  detailApi: dictDataApi.detail,
  createApi: dictDataApi.create,
  updateApi: dictDataApi.update,
  removeApi: dictDataApi.remove,
  batchRemoveApi: dictDataApi.batchRemove,
  idKey: 'id',
  nameKey: 'dictLabel',
  createDefaultValues: {
    status: 1,
    dictSort: 0,
  },
}
