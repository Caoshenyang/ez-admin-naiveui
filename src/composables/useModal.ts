import { ref } from 'vue'

/**
 * 对话框 Hook
 */
export function useModal() {
  const visible = ref(false)
  const title = ref('')
  const loading = ref(false)

  /**
   * 打开对话框
   */
  function open(titleText?: string) {
    if (titleText) {
      title.value = titleText
    }
    visible.value = true
  }

  /**
   * 关闭对话框
   */
  function close() {
    visible.value = false
    loading.value = false
  }

  /**
   * 确认
   */
  async function confirm(callback: () => Promise<void>) {
    try {
      loading.value = true
      await callback()
      close()
    } catch (error) {
      console.error('Modal confirm error:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    visible,
    title,
    loading,
    open,
    close,
    confirm
  }
}
