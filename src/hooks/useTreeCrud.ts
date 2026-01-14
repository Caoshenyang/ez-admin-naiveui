/**
 * useTreeCrud - 树形结构增强 Hook
 *
 * 提供树形结构的通用操作功能：
 * - 展开/收起所有节点
 * - 切换展开/收起状态
 * - 跟踪展开状态
 *
 * 使用示例：
 * ```ts
 * const treeCrud = useTreeCrud({
 *   treeData: dataList, // 树形数据
 *   childrenKey: 'children', // 子节点字段名
 *   idKey: 'id', // ID字段名
 * })
 *
 * // 使用
 * treeCrud.expandAll() // 展开所有
 * treeCrud.collapseAll() // 收起所有
 * treeCrud.toggleExpand() // 切换
 * ```
 */
import { ref, computed, type Ref } from 'vue'

/**
 * useTreeCrud 配置接口
 */
export interface UseTreeCrudConfig {
  /** 树形数据 */
  treeData: Ref<any[]>
  /** 子节点字段名（默认 'children'） */
  childrenKey?: string
  /** ID字段名（默认 'id'） */
  idKey?: string
}

/**
 * useTreeCrud Hook
 *
 * @param config - 配置对象
 * @returns 树形操作方法和状态
 */
export function useTreeCrud(config: UseTreeCrudConfig) {
  const { treeData, childrenKey = 'children', idKey = 'id' } = config

  // 展开的节点 keys
  const expandedKeys = ref<(string | number)[]>([])

  /**
   * 收集所有可展开的节点 ID
   */
  const collectExpandableKeys = (data: any[]): (string | number)[] => {
    const keys: (string | number)[] = []
    const traverse = (nodes: any[]) => {
      nodes.forEach((node) => {
        const children = node[childrenKey]
        if (children && children.length > 0) {
          keys.push(node[idKey] as string | number)
          traverse(children)
        }
      })
    }
    traverse(data)
    return keys
  }

  /**
   * 展开所有节点
   */
  const expandAll = () => {
    expandedKeys.value = collectExpandableKeys(treeData.value)
  }

  /**
   * 收起所有节点
   */
  const collapseAll = () => {
    expandedKeys.value = []
  }

  /**
   * 切换展开/收起状态
   */
  const toggleExpand = () => {
    expandedKeys.value.length > 0 ? collapseAll() : expandAll()
  }

  /**
   * 是否有展开的节点
   */
  const isExpanded = computed(() => expandedKeys.value.length > 0)

  /**
   * 展开节点的数量
   */
  const expandedCount = computed(() => expandedKeys.value.length)

  return {
    /** 展开的节点 keys */
    expandedKeys,
    /** 展开所有 */
    expandAll,
    /** 收起所有 */
    collapseAll,
    /** 切换展开/收起 */
    toggleExpand,
    /** 是否有展开的节点 */
    isExpanded,
    /** 展开节点的数量 */
    expandedCount,
  }
}
