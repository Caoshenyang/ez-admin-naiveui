/**
 * 菜单管理配置
 *
 * 统一导出所有菜单相关的配置项
 */
import type { MenuCrudConfig } from '@/types'
import type { FormConfig } from '@/components/common/EzForm.vue'
import type { FormRules } from 'naive-ui'
import type { SaveMenuDTO, MenuTreeVO } from '@/types'
import { type TableConfigOptions } from '@/hooks/types/table'
import type { ActionButton } from '@/components/common/EzButtonGroup.vue'
import { menuApi } from '@/api/menu'
import { renderStatusTag, renderTag } from '@/utils/renderers'
import { ChevronDownOutline } from '@vicons/ionicons5'
import { PlusOutlined } from '@vicons/antd'

// === 基础选项配置 ===
const statusOptions = [
  { label: '启用', value: 1, type: 'success' as const },
  { label: '禁用', value: 0, type: 'error' as const },
]

const menuTypeOptions = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 },
]

const hiddenOptions = [
  { label: '显示', value: 0 },
  { label: '隐藏', value: 1 },
]

// === 表单验证规则配置 ===
const formRules: FormRules = {
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 1, max: 50, message: '菜单名称长度应在1-50个字符之间', trigger: 'blur' },
  ],
  routePath: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
    { min: 1, max: 200, message: '路由路径长度应在1-200个字符之间', trigger: 'blur' },
  ],
  menuType: [
    {
      required: true,
      message: '请选择菜单类型',
      trigger: ['change', 'input'],
      validator: (rule: unknown, value: unknown) => {
        return value !== undefined && value !== null && value !== '' && [1, 2, 3].includes(Number(value))
      }
    },
  ],
}

// === 表单配置 ===
export const menuFormConfig: FormConfig<SaveMenuDTO> = {
  title: '菜单表单',
  gridCols: 24,
  size: 'medium',
  fields: [
    { key: 'menuName', label: '菜单名称', type: 'input', required: true, placeholder: '请输入菜单名称', span: 12 },
    { key: 'parentId', label: '上级菜单', type: 'tree-select', placeholder: '请选择上级菜单', span: 12 },
    { key: 'menuType', label: '菜单类型', type: 'select', options: menuTypeOptions, required: true, placeholder: '请选择菜单类型', span: 12 },
    { key: 'routePath', label: '路由路径', type: 'input', required: true, placeholder: '请输入路由路径', span: 12 },
    { key: 'componentPath', label: '组件路径', type: 'input', placeholder: '请输入组件路径', span: 12 },
    { key: 'menuIcon', label: '菜单图标', type: 'input', placeholder: '请输入菜单图标', span: 12 },
    { key: 'menuPerm', label: '权限标识', type: 'input', placeholder: '请输入权限标识', span: 12 },
    {
      key: 'menuSort',
      label: '排序',
      type: 'number',
      placeholder: '请输入排序号',
      validator: (value: number) => value >= 0,
      span: 12,
    },
    { key: 'hidden', label: '是否隐藏', type: 'radio', options: hiddenOptions, span: 12 },
    { key: 'status', label: '状态', type: 'radio', options: statusOptions, required: true, span: 12 },
    { key: 'redirect', label: '重定向地址', type: 'input', placeholder: '请输入重定向地址', span: 24 },
  ],
  // 表单验证规则
  rules: formRules,
}

// 菜单类型渲染函数
const renderMenuType = (row: MenuTreeVO) => {
  const typeMap = {
    1: { text: '目录', type: 'info' as const },
    2: { text: '菜单', type: 'primary' as const },
    3: { text: '按钮', type: 'warning' as const },
  }
  const config = typeMap[row.menuType as keyof typeof typeMap]
  return config ? renderTag(config.text, { type: config.type })() : renderTag(String(row.menuType))()
}

// 隐藏状态渲染函数
const renderHiddenTag = (row: MenuTreeVO) => {
  const typeMap = {
    0: { text: '显示', type: 'success' as const },
    1: { text: '隐藏', type: 'default' as const },
  }
  const config = typeMap[row.hidden as keyof typeof typeMap]
  return config ? renderTag(config.text, { type: config.type })() : renderTag(String(row.hidden))()
}

// === 表格配置 ===
export const menuTableConfig: TableConfigOptions<MenuTreeVO> = {
  columns: [
    { title: '菜单名称', key: 'menuName', width: 200 },
    { title: '菜单类型', key: 'menuType', width: 100, render: renderMenuType },
    { title: '路由路径', key: 'routePath', width: 200 },
    { title: '权限标识', key: 'menuPerm', width: 150 },
    { title: '排序', key: 'menuSort', width: 80 },
    { title: '隐藏', key: 'hidden', width: 80, render: renderHiddenTag },
    { title: '状态', key: 'status', width: 80, render: renderStatusTag(statusOptions) },
    { title: '创建时间', key: 'createTime', width: 180 },
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
export const menuActionButtons: ActionButton[] = [
  { key: 'add', text: '新建菜单', type: 'primary', icon: PlusOutlined, permission: 'sys:menu:add' },
  { key: 'toggle-expand', text: '展开', icon: ChevronDownOutline, permission: '' },
]

// === CRUD 配置 ===
// TODO: 迁移到 CrudFlatConfig 扁平化配置结构
export const menuCrudConfig: any = {
  // 查询参数初始值
  queryParams: {
    keywords: '',
  },
  // 树形模式配置
  treeMode: true,
  paginationOptions: false,
  // 表格配置
  tableConfig: menuTableConfig,
  // API配置（根据接口文档调整）
  treeApi: menuApi.tree,
  detailApi: menuApi.detail, // 编辑功能需要
  createApi: menuApi.create,
  updateApi: menuApi.update,
  removeApi: menuApi.remove,

  // 主键字段（匹配接口文档）
  idKey: 'menuId' as const,

  // 显示名称字段（用于删除确认等）
  nameKey: 'menuName' as const,

  // 新增表单默认值
  createDefaultValues: {
    menuType: 1, // 默认目录
    status: 1, // 默认启用
    hidden: 0, // 默认显示
    menuSort: 0, // 默认排序
    parentId: 0, // 默认根节点
  },
}
