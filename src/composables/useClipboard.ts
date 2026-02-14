/**
 * 剪贴板操作 Composable
 *
 * 封装 Clipboard API，提供复制功能
 * 适用于：复制链接、复制代码等场景
 */
import { ref, isRef, type Ref } from 'vue'
import { message } from './useNaiveApi'

/**
 * 创建剪贴板操作
 * @returns 剪贴板状态和方法
 * @example
 * ```typescript
 * const { text, supported, copying, copy } = useClipboard()
 *
 * // 复制纯文本
 * await copy('Hello World')
 *
 * // 复制响应式数据
 * const url = ref('https://example.com')
 * await copy(url)
 * ```
 */
export function useClipboard() {
  const text = ref('')
  const supported = ref(!!navigator.clipboard)
  const copying = ref(false)

  /**
   * 复制文本到剪贴板
   * @param source 要复制的文本（可以是字符串或 ref）
   * @returns 是否复制成功
   */
  async function copy(source: string | Ref<string>): Promise<boolean> {
    if (!supported.value) {
      message.error('当前浏览器不支持剪贴板 API')
      return false
    }

    copying.value = true
    try {
      const value = isRef(source) ? source.value : source
      await navigator.clipboard.writeText(value)
      text.value = value
      message.success('复制成功')
      return true
    } catch {
      message.error('复制失败')
      return false
    } finally {
      copying.value = false
    }
  }

  return {
    text,
    supported,
    copying,
    copy
  }
}
