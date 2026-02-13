/**
 * NaiveUI 离散式 API 封装
 *
 * 主题支持：
 * - 使用 createDiscreteApi 创建独立的消息、对话框等组件
 * - 支持亮色/暗色模式实时切换
 */
import { ref } from 'vue'
import { createDiscreteApi, darkTheme } from 'naive-ui'
import { createNaiveTheme } from '@/settings/naiveui-theme'

/**
 * 响应式主题配置（通过监听 DOM class 变化自动更新）
 */
const themeConfig = ref({
  theme: document.documentElement.classList.contains('dark') ? darkTheme : null,
  themeOverrides: createNaiveTheme()
})

/**
 * 监听 html class 变化，自动更新主题配置
 */
const observer = new MutationObserver(() => {
  const isDark = document.documentElement.classList.contains('dark')
  themeConfig.value = {
    theme: isDark ? darkTheme : null,
    themeOverrides: createNaiveTheme(isDark ? 'dark' : 'light')
  }
})

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
})

/**
 * 创建离散式 API（带动态主题支持）
 */
const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
  {
    configProviderProps: themeConfig
  }
)

/**
 * 导出所有 NaiveUI 离散式 API
 */
export { message, notification, dialog, loadingBar, modal }
