/**
 * 窗口大小监听 Composable
 * 用于响应式处理窗口尺寸变化
 * @param callback 窗口大小变化时的回调函数
 * @param options 配置选项
 */
export function useResize(
  callback: () => void,
  options?: {
    immediate?: boolean // 是否立即执行一次
  }
) {
  const { immediate = true } = options ?? {}

  onMounted(() => {
    if (immediate) {
      callback()
    }
    window.addEventListener('resize', callback)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', callback)
  })
}
