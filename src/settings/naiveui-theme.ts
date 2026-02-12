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

/**
 * 创建亮色主题配置
 *
 * 颜色来源：src/assets/styles/colors.css
 * - 只定义 7 个核心变量（primary, page-bg, card-bg, success 等）
 * - 删除所有 Tailwind 默认值的重复定义
 */
export function createLightTheme(): GlobalThemeOverrides {
  return {
    // ===== 全局通用配置 =====
    common: {
      // 主色
      primaryColor: getColor('--primary') // 主色：#5B6BF0
    }
  }
}

/**
 * 创建暗色主题配置
 *
 * 颜色来源：src/assets/styles/colors.css
 * - 主色系：#A78BFA（亮紫色） - 醒目、优雅
 * - 背景色：GitHub 深色风格
 */
export function createDarkTheme(): GlobalThemeOverrides {
  return {
    // ===== 全局通用配置 =====
    common: {
      // 主色（暗色）
      primaryColor: getColor('--primary-dark') // 主色：#A78BFA
    }
  }
}
