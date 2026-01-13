/**
 * 部门管理配置
 *
 * 统一导出所有部门相关的配置项
 */
import type { DeptCrudConfig } from '@/types'
import type { FormConfig } from '@/components/common/EzForm.vue'
import type { FormRules } from 'naive-ui'
import type { DeptCreateDTO, DeptUpdateDTO, DeptListVO } from '@/types'
import { type TableConfigOptions } from '@/hooks/types/table'
import type { ActionButton } from '@/components/common/EzButtonGroup.vue'
import { deptApi } from '@/api/dept'
import { renderStatusTag } from '@/utils/renderers'
import { ChevronDownOutline } from '@vicons/ionicons5'
import { PlusOutlined } from '@vicons/antd'

// === 基础选项配置 ===
const statusOptions = [
  { label: '启用', value: 1, type: 'success' as const },
  { label: '禁用', value: 0, type: 'error' as const },
]

// === 表单验证规则配置 ===
const formRules: FormRules = {
  deptName: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 1, max: 50, message: '部门名称长度应在1-50个字符之间', trigger: 'blur' },
  ],
}

// === 表单配置 ===
export const deptFormConfig: FormConfig<DeptCreateDTO | DeptUpdateDTO> = {
  title: '部门表单',
  gridCols: 24,
  size: 'medium',
  fields: [
    { key: 'deptName', label: '部门名称', type: 'input', required: true, placeholder: '请输入部门名称', span: 12 },
    { key: 'parentId', label: '上级部门', type: 'tree-select', placeholder: '请选择上级部门', span: 12 },
    {
      key: 'deptSort',
      label: '排序',
      type: 'number',
      placeholder: '请输入排序号',
      validator: (value: number) => value >= 0,
      span: 12,
    },
    { key: 'status', label: '状态', type: 'radio', options: statusOptions, required: true, span: 12 },
    { key: 'description', label: '描述', type: 'textarea', placeholder: '请输入部门描述', span: 24 },
  ],
  // 表单验证规则
  rules: formRules,
}

// === 表格配置 ===
export const deptTableConfig: TableConfigOptions<DeptListVO> = {
  columns: [
    { title: '部门名称', key: 'deptName', width: 250 },
    { title: '状态', key: 'status', width: 120, render: renderStatusTag(statusOptions) },
    { title: '排序', key: 'deptSort', width: 120 },
    { title: '创建时间', key: 'createTime', width: 200 },
  ],
  // 操作按钮配置
  actionButtons: {
    custom: [
      {
        type: 'primary' as const,
        tertiary: true,
        icon: PlusOutlined,
        actionKey: 'addChild', // 引用 customActionHandlers 中的函数名
      },
    ],
    edit: true,
    delete: true,
  },
  // 自定义按钮显示顺序：添加子节点 -> 编辑 -> 删除
  actionOrder: ['custom', 'edit', 'delete'],
  // 调整操作列宽度以容纳所有按钮
  actionWidth: 220,
}

// === 操作按钮配置 ===
export const deptActionButtons: ActionButton[] = [
  { key: 'add', text: '新建部门', type: 'primary', icon: PlusOutlined, permission: 'sys:dept:add' },
  { key: 'toggle-expand', text: '展开', icon: ChevronDownOutline, permission: '' },
]

// === CRUD 配置 ===
export const deptCrudConfig: DeptCrudConfig = {
  // 查询参数初始值
  queryParams: {
    keywords: '',
  },
  // 树形模式配置
  treeMode: true,
  paginationOptions: false,
  // 表格配置
  tableConfig: deptTableConfig,
  // API配置（根据接口文档调整）
  treeApi: deptApi.tree,
  detailApi: deptApi.detail, // 编辑功能需要
  createApi: deptApi.create,
  updateApi: deptApi.update,
  removeApi: deptApi.remove,

  // 主键字段（匹配接口文档）
  idKey: 'deptId' as const,

  // 显示名称字段（用于删除确认等）
  nameKey: 'deptName' as const,

  // 新增表单默认值
  createDefaultValues: {
    status: 1, // 默认启用
    deptSort: 0, // 默认排序
  },
}
