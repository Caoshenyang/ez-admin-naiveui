/**
 * 响应式断点 Composable
 *
 * 监听窗口宽度变化，返回当前的断点状态
 * 适用于：响应式布局、移动端适配
 */
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'

/**
 * 断点配置
 */
export interface Breakpoints {
  /** 移动端 < 768px */
  isMobile: Ref<boolean>
  /** 平板 >= 768px && < 1024px */
  isTablet: Ref<boolean>
  /** 桌面端 >= 1024px */
  isDesktop: Ref<boolean>
}

/**
 * 创建响应式断点监听
 * @returns 断点状态对象
 * @example
 * ```typescript
 * const { isMobile, isTablet, isDesktop } = useBreakpoints()
 *
 * if (isMobile.value) {
 *   console.log('当前是移动端')
 * }
 * ```
 */
export function useBreakpoints(): Breakpoints {
  const width = ref(window.innerWidth)

  // 更新窗口宽度
  const updateWidth = () => {
    width.value = window.innerWidth
  }

  // 监听窗口 resize 事件
  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })

  // 组件卸载时清理事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  // 断点状态
  const breakpoints: Breakpoints = {
    isMobile: ref(false),
    isTablet: ref(false),
    isDesktop: ref(false)
  }

  // 监听宽度变化，更新断点状态
  watch(
    width,
    (newWidth) => {
      breakpoints.isMobile.value = newWidth < 768
      breakpoints.isTablet.value = newWidth >= 768 && newWidth < 1024
      breakpoints.isDesktop.value = newWidth >= 1024
    },
    { immediate: true }
  )

  return breakpoints
}
