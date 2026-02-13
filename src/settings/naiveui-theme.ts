/**
 * NaiveUI 主题配置（极简版 + 中缀式命名）
 *
 * 设计理念：
 * - NaiveUI 主题为主，运行时提取颜色值
 * - 只配置 common 核心颜色（~40 行）
 * - 移除所有组件级配置（300+ 行 → ~40 行）
 * - 使用中缀式命名：--{name}-dark-{scale}
 *
 * 使用方式：
 * - 在 App.vue 中通过 n-config-provider 应用主题
 * - 主题切换由 stores/modules/theme.ts 控制
 */
import type { GlobalThemeOverrides } from 'naive-ui'
import { getColor, getDarkColor } from '@/utils/color-vars'

export function createNaiveTheme(isDark: boolean): GlobalThemeOverrides {
  return {
    common: {
      // 主色调（根据主题自动选择）
      primaryColor: isDark ? getDarkColor('--primary-500') : getColor('--primary-500'),
      primaryColorHover: isDark ? getDarkColor('--primary-600') : getColor('--primary-600'),
      primaryColorPressed: isDark ? getDarkColor('--primary-700') : getColor('--primary-700'),
      primaryColorSuppl: isDark ? getDarkColor('--primary-400') : getColor('--primary-400'),

      // 语义色（固定值，不分主题）
      successColor: getColor('--success-500'),
      successColorHover: getColor('--success-600'),
      successColorPressed: getColor('--success-700'),
      warningColor: getColor('--warning-500'),
      warningColorHover: getColor('--warning-600'),
      warningColorPressed: getColor('--warning-700'),
      errorColor: getColor('--error-500'),
      errorColorHover: getColor('--error-600'),
      errorColorPressed: getColor('--error-700'),
      infoColor: getColor('--info-500'),
      infoColorHover: getColor('--info-600'),
      infoColorPressed: getColor('--info-700')
    }
  }
}
