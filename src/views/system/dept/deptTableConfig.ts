import { h } from 'vue'
import { NTag } from 'naive-ui'
import type { DeptListVO } from '@/types/modules/dept'
import { createTableColumns, type TableConfigOptions } from '@/hooks/useTableConfig'

// 部门状态选项
export const deptStatusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
]

// 部门表格配置选项
export const deptTableConfig: TableConfigOptions<DeptListVO> = {
  columns: [
    {
      title: '部门名称',
      key: 'deptName',
      width: 150,
    },
    {
      title: '部门编码',
      key: 'deptCode',
      width: 120,
    },
    {
      title: '排序',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (row: DeptListVO) => {
        const status = deptStatusOptions.find((option) => option.value === row.status)
        return h(
          NTag,
          {
            type: row.status === 1 ? 'success' : 'error',
          },
          {
            default: () => status?.label || '未知',
          }
        )
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 200,
      ellipsis: false,
      cellProps: () => ({
        style: 'white-space: nowrap;',
      }),
    },
  ],
}

// 生成部门表格列配置（保持向后兼容）
export function createDeptTableColumns(
  handleEdit?: (row: DeptListVO) => void,
  handleDelete?: (row: DeptListVO) => void,
) {
  return createTableColumns(deptTableConfig, handleEdit, handleDelete)
}
