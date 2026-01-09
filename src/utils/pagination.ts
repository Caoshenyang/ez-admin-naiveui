import { reactive } from 'vue'
import type { PaginationConfigOptions } from '@/hooks/types/table'

/**
 * 分页工具类
 * 用于创建和管理分页配置
 */

/**
 * 创建分页配置
 * 根据选项生成分页组件的配置对象
 *
 * @param reloadCallback - 页码或每页大小改变时的回调函数
 * @param options - 分页选项（每页大小选项、是否显示快速跳转等）
 * @returns 响应式的分页配置对象
 */
export function createPagination(reloadCallback?: () => void, options: PaginationConfigOptions = {}) {
  const {
    pageSizes = [10, 15, 30],
    showSizePicker = true,
    showQuickJumper = true,
    prefix = (info: { itemCount: number | undefined }) => {
      return info.itemCount ? `共 ${info.itemCount} 条` : ''
    },
  } = options

  const paginationConfig = reactive({
    page: 1,
    pageSize: pageSizes[0],
    showSizePicker,
    showQuickJumper,
    pageSizes,
    itemCount: 0,
    prefix,
    onChange: (page: number) => {
      paginationConfig.page = page
      reloadCallback?.()
    },
    onUpdatePageSize: (pageSize: number) => {
      paginationConfig.pageSize = pageSize
      paginationConfig.page = 1
      reloadCallback?.()
    },
  })

  return paginationConfig
}

