import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * 浅色主题配置
 * 只覆盖需要自定义的颜色变量，其他使用 NaiveUI 默认值
 */
export const lightTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a',
  },
}

/**
 * 深色主题配置
 * 只覆盖需要自定义的颜色变量，其他使用 NaiveUI 默认值
 */
export const darkTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a',
  },
}
