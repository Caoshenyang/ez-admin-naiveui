/**
 * 布尔值切换 Composable
 *
 * 提供便捷的布尔值状态管理
 * 适用于：模态框显示/隐藏、侧边栏折叠/展开等场景
 */
import { ref } from 'vue'

/**
 * 创建布尔值切换状态
 * @param initialValue 初始值，默认 false
 * @returns 切换状态和方法
 * @example
 * ```typescript
 * const { value, toggle, setTrue, setFalse } = useToggle(false)
 *
 * // 切换状态
 * toggle()
 *
 * // 设置为 true
 * setTrue()
 *
 * // 设置为 false
 * setFalse()
 * ```
 */
export function useToggle(initialValue = false) {
  const value = ref(initialValue)

  /**
   * 切换状态
   */
  function toggle() {
    value.value = !value.value
  }

  /**
   * 设置为 true
   */
  function setTrue() {
    value.value = true
  }

  /**
   * 设置为 false
   */
  function setFalse() {
    value.value = false
  }

  return {
    value,
    toggle,
    setTrue,
    setFalse
  }
}
