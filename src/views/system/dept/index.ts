/**
 * 部门管理配置 - 扁平化配置（严格泛型版本）
 *
 * 所有配置集中在一个对象中，类型安全，无 any
 */
import { deptApi } from '@/api/dept'
import { PlusOutlined } from '@vicons/antd'
import { ChevronDownOutline } from '@vicons/ionicons5'
import type { DeptListVO, DeptQuery, DeptCreateDTO, DeptUpdateDTO, DeptDetailVO } from '@/types'
import type { CrudFlatConfig } from '@/hooks/types/crud-config'

// === 基础选项配置 ===
const statusOptions = [
  { label: '启用', value: 1, type: 'success' as const },
  { label: '禁用', value: 0, type: 'error' as const },
]

// === 工具函数：部门树数据转换为表单树形选项 ===
interface TreeOption {
  key: number
  label: string
  children?: TreeOption[]
}

const convertDeptToTreeOption = (dept: DeptListVO): TreeOption => ({
  key: dept.deptId,
  label: dept.deptName,
  children: dept.children?.map(convertDeptToTreeOption),
})

// === 部门管理配置（严格泛型）===
export const deptConfig: CrudFlatConfig<DeptListVO, DeptQuery, DeptCreateDTO, DeptUpdateDTO, DeptDetailVO> = {
  // ========== 基础信息 ==========
  title: '部门管理',
  mode: 'tree',
  idKey: 'deptId',
  nameKey: 'deptName',

  // ========== API 配置 ==========
  api: {
    list: deptApi.tree,
    detail: deptApi.detail,
    create: deptApi.create,
    update: deptApi.update,
    delete: deptApi.remove,
  },

  // ========== 表格列配置 ==========
  columns: [
    { key: 'deptName', title: '部门名称', width: 250 },
    { key: 'status', title: '状态', width: 120, render: 'status', options: statusOptions },
    { key: 'deptSort', title: '排序', width: 120 },
    { key: 'createTime', title: '创建时间', width: 200 },
  ],

  showSelection: true,
  showPagination: false,

  // ========== 页面操作按钮 ==========
  actions: [
    { key: 'add', type: 'primary', text: '新建部门', icon: PlusOutlined },
    { key: 'toggle-expand', text: '展开', icon: ChevronDownOutline },
  ],

  // ========== 行操作按钮 ==========
  rowActions: [
    { key: 'addChild', type: 'primary', icon: PlusOutlined },
    'edit',
    'delete',
  ],
  actionWidth: 220,

  // ========== 表单配置 ==========
  form: {
    title: '部门',
    gridCols: 24,
    size: 'medium',
    fields: [
      { key: 'deptName', label: '部门名称', type: 'input', required: true, placeholder: '请输入部门名称', span: 12 },
      {
        key: 'parentId',
        label: '上级部门',
        type: 'tree-select',
        placeholder: '请选择上级部门',
        span: 12,
        // 字段级联加载：根据编辑/新增模式动态加载上级部门树
        load: async (mode, formData) => {
          const updateFormData = formData as Partial<DeptUpdateDTO> | undefined
          const excludeId = mode === 'update' ? updateFormData?.deptId : undefined
          const treeData = await deptApi.parentTree(excludeId)
          return treeData.map(convertDeptToTreeOption)
        },
      },
      { key: 'deptSort', label: '排序', type: 'number', placeholder: '请输入排序号', span: 12 },
      { key: 'status', label: '状态', type: 'radio', options: statusOptions, required: true, span: 12 },
      { key: 'description', label: '描述', type: 'textarea', placeholder: '请输入部门描述', span: 24 },
    ],
    rules: {
      deptName: [
        { required: true, message: '请输入部门名称', trigger: 'blur' },
        { min: 1, max: 50, message: '部门名称长度应在1-50个字符之间', trigger: 'blur' },
      ],
    },
  },

  // ========== 默认值配置 ==========
  defaults: {
    create: {
      status: 1,
      deptSort: 0,
    },
  },

  // ========== 树形配置 ==========
  tree: {
    childrenKey: 'children',
    defaultExpandAll: false,
  },
}
