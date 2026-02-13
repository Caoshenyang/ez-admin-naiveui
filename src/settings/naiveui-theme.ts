/**
 * NaiveUI 主题配置（精简版）
 *
 * 设计理念：
 * - 从精简后的 7 个核心 CSS 变量中提取颜色值
 * - 确保 NaiveUI 组件与 Tailwind 颜色系统保持一致
 * - 支持亮色/暗色两种主题模式
 *
 * 使用方式：
 * - 在 App.vue 中通过 n-config-provider 应用主题
 * - 主题切换由 stores/modules/app.ts 控制
 */
import type { GlobalThemeOverrides } from 'naive-ui'
import { getColor } from '@/utils/color-vars'

export function createNaiveTheme(): GlobalThemeOverrides {
  return {
    // ===== 全局通用配置 =====
    common: {
      // 主色
      primaryColor: getColor('--primary') // 主色：#5B6BF0
    }
  }
}
