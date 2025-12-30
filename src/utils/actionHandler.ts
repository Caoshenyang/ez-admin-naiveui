/**
 * 操作按钮事件处理器工具类
 *
 * 提供统一的按钮action处理逻辑，让页面组件只关注业务映射配置
 */

/**
 * 按钮处理函数类型
 */
export type ActionHandler = () => void | Promise<void>

/**
 * 按钮映射表类型
 */
export type ActionMap = Record<string, ActionHandler>

/**
 * 处理按钮action事件
 *
 * @param key - 按钮的唯一标识
 * @param actionMap - 按钮key到处理函数的映射表
 * @param onUnknownKey - 当遇到未知key时的回调函数（可选）
 *
 * @example
 * ```typescript
 * const actionMap = {
 *   add: handleAdd,
 *   delete: handleDelete,
 *   refresh: handleRefresh,
 * }
 *
 * const handleAction = (key: string) => {
 *   handleButtonAction(key, actionMap)
 * }
 * ```
 */
export const handleButtonAction = (
  key: string,
  actionMap: ActionMap,
  onUnknownKey?: (key: string) => void
): void => {
  const handler = actionMap[key]

  if (handler) {
    handler()
  } else if (onUnknownKey) {
    onUnknownKey(key)
  } else {
    // 默认处理未知key的情况
    console.warn(`未知的按钮key: ${key}`)
  }
}

/**
 * 创建action处理器（便捷方法）
 * 直接传入映射表，返回处理函数，一步到位
 *
 * @param actionMap - 按钮key到处理函数的映射表
 * @param onUnknownKey - 当遇到未知key时的回调函数（可选）
 * @returns 处理函数
 *
 * @example
 * ```typescript
 * // 一步创建action处理器
 * const handleAction = handleButtonActions({
 *   add: handleAdd,
 *   delete: handleDelete,
 *   refresh: handleRefresh,
 * })
 * ```
 */
export const handleButtonActions = (
  actionMap: ActionMap,
  onUnknownKey?: (key: string) => void
) => {
  return (key: string) => {
    handleButtonAction(key, actionMap, onUnknownKey)
  }
}
