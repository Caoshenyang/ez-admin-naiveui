/**
 * NaiveUI 主题配置
 *
 * 设计理念：
 * - 从 CSS 变量中提取颜色值（通过 getColor 工具函数）
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
 * 主色系：#5B6BF0（蓝紫色） - 现代、科技感
 */
export function createLightTheme(): GlobalThemeOverrides {
  return {
    // ===== 全局通用配置 =====
    common: {
      primaryColor: getColor('--ez-primary-light'), // 主色：#5B6BF0
      primaryColorHover: getColor('--ez-primary-600-light'), // 主色悬停：#4F46E5
      primaryColorPressed: getColor('--ez-primary-700-light'), // 主色按下：#4338CA
      primaryColorSuppl: getColor('--ez-primary-200-light'), // 主色补充：#C7D2FE

      // 语义色
      successColor: getColor('--ez-success-500'), // 成功色：#10B981
      successColorHover: getColor('--ez-success-600'), // 成功悬停：#059669
      successColorPressed: getColor('--ez-success-700'), // 成功按下：#047857
      successColorSuppl: getColor('--ez-success-50'), // 成功补充：#ECFDF5

      warningColor: getColor('--ez-warning-500'), // 警告色：#F59E0B
      warningColorHover: getColor('--ez-warning-600'), // 警告悬停：#D97706
      warningColorPressed: getColor('--ez-warning-700'), // 警告按下：#B45309
      warningColorSuppl: getColor('--ez-warning-50'), // 警告补充：#FFFBEB

      errorColor: getColor('--ez-error-500'), // 错误色：#EF4444
      errorColorHover: getColor('--ez-error-600'), // 错误悬停：#DC2626
      errorColorPressed: getColor('--ez-error-700'), // 错误按下：#B91C1C
      errorColorSuppl: getColor('--ez-error-50'), // 错误补充：#FEF2F2

      infoColor: getColor('--ez-info-500'), // 信息色：#3B82F6
      infoColorHover: getColor('--ez-info-600'), // 信息悬停：#2563EB
      infoColorPressed: getColor('--ez-info-700'), // 信息按下：#1D4ED8
      infoColorSuppl: getColor('--ez-info-50'), // 信息补充：#EFF6FF

      // 文本色
      textColorBase: getColor('--ez-slate-900'), // 主要文字：#0F172A
      textColor1: getColor('--ez-slate-800'), // 一级文字：#1E293B
      textColor2: getColor('--ez-slate-700'), // 二级文字：#334155
      textColor3: getColor('--ez-slate-500'), // 三级文字：#64748B
      textColorDisabled: getColor('--ez-slate-300'), // 禁用文字：#CBD5E1

      // 边框色
      borderColor: getColor('--ez-border-light'), // 边框：#E2E8F0

      // 分割线
      dividerColor: getColor('--ez-slate-200'), // 分割线：#E2E8F0

      // 背景色
      bodyColor: getColor('--ez-body-bg-light'), // 页面背景：#F8FAFC
      cardColor: getColor('--ez-white'), // 卡片背景：#FFFFFF
      modalColor: getColor('--ez-white'), // 模态框背景：#FFFFFF
      popoverColor: getColor('--ez-white'), // 气泡背景：#FFFFFF

      // 禁用状态
      placeholderColor: getColor('--ez-slate-400') // 占位符：#94A3B8
    },

    // ===== 布局组件 =====
    Layout: {
      siderColor: getColor('--ez-sider-bg'), // 侧边栏背景：#FFFFFF
      headerColor: getColor('--ez-header-bg'), // 顶部栏背景：#FFFFFF
      color: getColor('--ez-body-bg-light') // 内容区背景：#F8FAFC
    },

    // ===== 按钮组件 =====
    Button: {
      textColor: getColor('--ez-primary-light'), // 文本按钮主色
      textColorHover: getColor('--ez-primary-600-light'),
      textColorPressed: getColor('--ez-primary-700-light'),
      textColorFocus: getColor('--ez-primary-600-light'),
      textColorDisabled: getColor('--ez-slate-300')
    },

    // ===== 输入框组件 =====
    Input: {
      color: getColor('--ez-white'), // 输入框背景
      colorFocus: getColor('--ez-white'), // 聚焦背景
      colorDisabled: getColor('--ez-slate-50'), // 禁用背景
      borderColor: getColor('--ez-border-light'), // 边框
      borderColorFocus: getColor('--ez-primary-light'), // 聚焦边框
      placeholderColor: getColor('--ez-slate-400') // 占位符
    },

    // ===== 表格组件 =====
    DataTable: {
      thColor: getColor('--ez-slate-50'), // 表头背景：#F8FAFC
      thTextColor: getColor('--ez-slate-700'), // 表头文字：#334155
      tdColor: getColor('--ez-white'), // 单元格背景
      tdTextColor: getColor('--ez-slate-700'), // 单元格文字
      tdColorHover: getColor('--ez-slate-50'), // 单元格悬停
      borderColor: getColor('--ez-slate-200'), // 边框
      thColorModal: getColor('--ez-slate-50'),
      tdColorModal: getColor('--ez-white'),
      tdColorStriped: getColor('--ez-slate-50') // 斑马纹
    },

    // ===== 选择器组件 =====
    Select: {
      colors: getColor('--ez-white'),
      colorsModal: getColor('--ez-white'),
      peers: {
        InternalSelection: {
          color: getColor('--ez-white'),
          colorActive: getColor('--ez-primary-50-light'),
          textColor: getColor('--ez-slate-700'),
          placeholderColor: getColor('--ez-slate-400')
        }
      }
    },

    // ===== 标签页组件 =====
    Tabs: {
      tabTextColorBar: getColor('--ez-slate-600'), // 标签文字
      tabTextColorActiveBar: getColor('--ez-primary-light'), // 激活标签
      tabTextColorHoverBar: getColor('--ez-primary-light'),
      barColor: getColor('--ez-primary-light'), // 指示条颜色
      paneColor: getColor('--ez-white') // 内容区背景
    },

    // ===== 菜单组件 =====
    Menu: {
      itemTextColor: getColor('--ez-slate-700'), // 菜单项文字
      itemTextColorHover: getColor('--ez-primary-light'), // 悬停文字
      itemTextColorActive: getColor('--ez-primary-light'), // 激活文字
      itemIconColor: getColor('--ez-slate-500'), // 图标颜色
      itemIconColorHover: getColor('--ez-primary-light'),
      itemIconColorActive: getColor('--ez-primary-light'),
      itemColorActive: getColor('--ez-primary-50-light'), // 激活背景
      itemColorHover: getColor('--ez-slate-50'), // 悬停背景
      itemColorActiveCollapsed: getColor('--ez-primary-50-light'),
      arrowColor: getColor('--ez-slate-400'), // 箭头颜色
      arrowColorHover: getColor('--ez-primary-light'),
      arrowColorActive: getColor('--ez-primary-light'),
      dropdownColor: getColor('--ez-white') // 下拉菜单背景
    },

    // ===== 消息组件 =====
    Message: {
      color: getColor('--ez-white'),
      iconColor: getColor('--ez-primary-light')
    },

    // ===== 气泡确认框 =====
    Popconfirm: {
      color: getColor('--ez-white')
    },

    // ===== 抽屉组件 =====
    Drawer: {
      color: getColor('--ez-white'),
      bodyColor: getColor('--ez-white')
    },

    // ===== 进度条 =====
    Progress: {
      railColor: getColor('--ez-slate-200') // 轨道颜色
    }
  }
}

/**
 * 创建暗色主题配置
 *
 * 颜色来源：src/assets/styles/colors.css
 * 主色系：#A78BFA（亮紫色） - 醒目、优雅
 * 背景色：GitHub 深色风格
 */
export function createDarkTheme(): GlobalThemeOverrides {
  return {
    // ===== 全局通用配置 =====
    common: {
      primaryColor: getColor('--ez-primary-dark'), // 主色：#A78BFA
      primaryColorHover: getColor('--ez-primary-600-dark'), // 主色悬停：#9333EA
      primaryColorPressed: getColor('--ez-primary-700-dark'), // 主色按下：#7E22CE
      primaryColorSuppl: getColor('--ez-primary-200-dark'), // 主色补充：#E9D5FF

      // 语义色（保持与亮色一致）
      successColor: getColor('--ez-success-500'),
      successColorHover: getColor('--ez-success-600'),
      successColorPressed: getColor('--ez-success-700'),
      successColorSuppl: getColor('--ez-success-50'),

      warningColor: getColor('--ez-warning-500'),
      warningColorHover: getColor('--ez-warning-600'),
      warningColorPressed: getColor('--ez-warning-700'),
      warningColorSuppl: getColor('--ez-warning-50'),

      errorColor: getColor('--ez-error-500'),
      errorColorHover: getColor('--ez-error-600'),
      errorColorPressed: getColor('--ez-error-700'),
      errorColorSuppl: getColor('--ez-error-50'),

      infoColor: getColor('--ez-info-500'),
      infoColorHover: getColor('--ez-info-600'),
      infoColorPressed: getColor('--ez-info-700'),
      infoColorSuppl: getColor('--ez-info-50'),

      // 文本色（GitHub 风格）
      textColorBase: getColor('--ez-text-primary-dark'), // 主要文字：#C9D1D9
      textColor1: getColor('--ez-text-primary-dark'), // 一级文字：#C9D1D9
      textColor2: getColor('--ez-text-secondary-dark'), // 二级文字：#8B949E
      textColor3: getColor('--ez-text-tertiary-dark'), // 三级文字：#6E7681
      textColorDisabled: getColor('--ez-text-disabled-transparent-dark'), // 禁用文字：rgba(255,255,255,0.35)

      // 边框色
      borderColor: getColor('--ez-border-dark'), // 边框：#30363D

      // 分割线
      dividerColor: getColor('--ez-divider-dark'), // 分割线：#21262D

      // 背景色（GitHub 风格）
      bodyColor: getColor('--ez-body-bg-dark'), // 页面背景：#0D1117
      cardColor: getColor('--ez-body-bg-dark'), // 卡片背景：#0D1117
      modalColor: getColor('--ez-body-bg-dark'), // 模态框背景：#0D1117
      popoverColor: getColor('--ez-body-bg-dark'), // 气泡背景：#0D1117

      // 禁用状态
      placeholderColor: getColor('--ez-text-tertiary-dark') // 占位符：#6E7681
    },

    // ===== 布局组件 =====
    Layout: {
      siderColor: getColor('--color-dark-sider'), // 侧边栏背景：#010409（极深）
      headerColor: getColor('--color-dark-sider'), // 顶部栏背景：#010409
      color: getColor('--ez-body-bg-dark') // 内容区背景：#0D1117
    },

    // ===== 按钮组件 =====
    Button: {
      textColor: getColor('--ez-primary-dark'), // 文本按钮主色
      textColorHover: getColor('--ez-primary-600-dark'),
      textColorPressed: getColor('--ez-primary-700-dark'),
      textColorFocus: getColor('--ez-primary-600-dark'),
      textColorDisabled: getColor('--ez-text-disabled-transparent-dark')
    },

    // ===== 输入框组件 =====
    Input: {
      color: getColor('--ez-body-bg-dark'), // 输入框背景
      colorFocus: getColor('--ez-body-bg-dark'), // 聚焦背景
      colorDisabled: getColor('--ez-divider-dark'), // 禁用背景
      borderColor: getColor('--ez-border-dark'), // 边框
      borderColorFocus: getColor('--ez-primary-dark'), // 聚焦边框
      placeholderColor: getColor('--ez-text-tertiary-dark') // 占位符
    },

    // ===== 表格组件 =====
    DataTable: {
      thColor: getColor('--color-dark-sider'), // 表头背景：#010409
      thTextColor: getColor('--ez-text-primary-dark'), // 表头文字：#C9D1D9
      tdColor: getColor('--ez-body-bg-dark'), // 单元格背景：#0D1117
      tdTextColor: getColor('--ez-text-primary-dark'), // 单元格文字：#C9D1D9
      tdColorHover: getColor('--color-dark-hover'), // 单元格悬停：rgba(255,255,255,0.08)
      borderColor: getColor('--ez-border-dark'), // 边框：#30363D
      thColorModal: getColor('--color-dark-sider'),
      tdColorModal: getColor('--ez-body-bg-dark'),
      tdColorStriped: getColor('--ez-divider-dark') // 斑马纹：#21262D
    },

    // ===== 选择器组件 =====
    Select: {
      colors: getColor('--ez-body-bg-dark'), // 下拉框背景
      colorsModal: getColor('--ez-body-bg-dark'),
      peers: {
        InternalSelection: {
          color: getColor('--ez-body-bg-dark'),
          colorActive: getColor('--color-dark-hover'),
          textColor: getColor('--ez-text-primary-dark'),
          placeholderColor: getColor('--ez-text-tertiary-dark')
        }
      }
    },

    // ===== 标签页组件 =====
    Tabs: {
      tabTextColorBar: getColor('--ez-text-secondary-dark'), // 标签文字：#8B949E
      tabTextColorActiveBar: getColor('--ez-primary-dark'), // 激活标签：#A78BFA
      tabTextColorHoverBar: getColor('--ez-primary-dark'),
      barColor: getColor('--ez-primary-dark'), // 指示条颜色
      paneColor: getColor('--ez-body-bg-dark') // 内容区背景：#0D1117
    },

    // ===== 菜单组件 =====
    Menu: {
      itemTextColor: getColor('--ez-text-secondary-dark'), // 菜单项文字：#8B949E
      itemTextColorHover: getColor('--ez-primary-dark'), // 悬停文字：#A78BFA
      itemTextColorActive: getColor('--ez-primary-dark'), // 激活文字
      itemIconColor: getColor('--ez-text-tertiary-dark'), // 图标颜色：#6E7681
      itemIconColorHover: getColor('--ez-primary-dark'),
      itemIconColorActive: getColor('--ez-primary-dark'),
      itemColorActive: getColor('--color-dark-hover'), // 激活背景：rgba(255,255,255,0.08)
      itemColorHover: getColor('--color-dark-hover'), // 悬停背景
      itemColorActiveCollapsed: getColor('--color-dark-hover'),
      arrowColor: getColor('--ez-text-tertiary-dark'), // 箭头颜色
      arrowColorHover: getColor('--ez-primary-dark'),
      arrowColorActive: getColor('--ez-primary-dark'),
      dropdownColor: getColor('--color-dark-card') // 下拉菜单背景：#0D1117
    },

    // ===== 消息组件 =====
    Message: {
      color: getColor('--color-dark-card'), // 消息背景
      iconColor: getColor('--ez-primary-dark')
    },

    // ===== 气泡确认框 =====
    Popconfirm: {
      color: getColor('--color-dark-card')
    },

    // ===== 抽屉组件 =====
    Drawer: {
      color: getColor('--color-dark-card'),
      bodyColor: getColor('--color-dark-card')
    },

    // ===== 进度条 =====
    Progress: {
      railColor: getColor('--ez-border-dark') // 轨道颜色：#30363D
    }
  }
}

// 导出主题配置实例
export const lightTheme = createLightTheme()
export const darkTheme = createDarkTheme()
