import type { GlobalThemeOverrides } from 'naive-ui'
import { getColor } from '@/utils/color-vars'

/**
 * NaiveUI 主题配置（运行时提取 CSS 变量）
 *
 * 设计理念: 现代优雅风格
 * 参考: Linear, Vercel, Notion 等现代 SaaS 产品
 *
 * 颜色策略:
 * - 主色调: 蓝紫色系 (#5B6BF0 亮色 + #A78BFA 暗色) - 现代、科技感
 * - 亮色主题: 纯白侧边栏 + 清爽配色 - 明亮、通透
 * - 暗色主题: GitHub 风格深色系 - 专业、护眼
 * - 语义色: 标准语义色（成功=绿、警告=橙、错误=红）- 符合用户习惯
 *
 * 技术实现:
 * - 运行时从 Tailwind CSS 定义的变量中提取实际颜色值
 * - 颜色定义在 src/assets/styles/index.css（单一真相源）
 * - 解决 seemly/rgba 无法解析 var() 的问题
 * - 修改颜色只需修改 index.css，NaiveUI 自动同步
 */

/**
 * 亮色主题配置
 *
 * 使用函数形式确保在 DOM 加载后运行
 * 运行时从 CSS 变量中提取实际颜色值
 */
export function createLightTheme(): GlobalThemeOverrides {
  return {
    // 通用配置
    common: {
      // 主色调
      primaryColor: getColor('--color-primary-500'),
      primaryColorHover: getColor('--color-primary-600'),
      primaryColorPressed: getColor('--color-primary-700'),
      primaryColorSuppl: getColor('--color-primary-500'),

      // 语义色
      successColor: getColor('--color-success-500'),
      successColorHover: getColor('--color-success-400'),
      successColorPressed: getColor('--color-success-600'),
      successColorSuppl: getColor('--color-success-500'),

      warningColor: getColor('--color-warning-500'),
      warningColorHover: getColor('--color-warning-400'),
      warningColorPressed: getColor('--color-warning-600'),
      warningColorSuppl: getColor('--color-warning-500'),

      errorColor: getColor('--color-error-500'),
      errorColorHover: getColor('--color-error-400'),
      errorColorPressed: getColor('--color-error-600'),
      errorColorSuppl: getColor('--color-error-500'),

      infoColor: getColor('--color-info-500'),
      infoColorHover: getColor('--color-info-400'),
      infoColorPressed: getColor('--color-info-600'),
      infoColorSuppl: getColor('--color-info-500'),

      // 中性色
      textColorBase: getColor('--color-slate-500'),
      textColor1: getColor('--color-slate-900'),
      textColor2: getColor('--color-slate-600'),
      textColor3: getColor('--color-slate-400'),

      borderColor: getColor('--color-slate-200'),
      dividerColor: getColor('--color-slate-100'),

      bodyColor: getColor('--color-slate-50'),
      cardColor: '#FFFFFF',
      modalColor: '#FFFFFF',
      popoverColor: '#FFFFFF',

      borderRadius: '10px',
      borderRadiusSmall: '6px',
      boxShadow1: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
      boxShadow2: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      boxShadow3: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)'
    },

    // 布局组件（亮色主题 - 纯白侧边栏）
    Layout: {
      color: '#F8FAFC',
      siderColor: '#FFFFFF',
      headerColor: '#FFFFFF',
      footerColor: '#FFFFFF',
      textColor: getColor('--color-slate-500'),
      textColorChild: getColor('--color-slate-400'),
      textColorHover: getColor('--color-primary-500'),
      dividerColor: getColor('--color-slate-100')
    },

    // 菜单组件（亮色主题）
    Menu: {
      itemTextColor: getColor('--color-slate-600'),
      itemTextColorHover: getColor('--color-primary-500'),
      itemTextColorActive: getColor('--color-primary-500'),
      itemTextColorChildActive: getColor('--color-primary-500'),
      itemIconColor: getColor('--color-slate-500'),
      itemIconColorHover: getColor('--color-primary-500'),
      itemIconColorActive: getColor('--color-primary-500'),
      itemIconColorChildActive: getColor('--color-primary-500'),
      itemColorActive: getColor('--color-primary-50'),
      itemColorHover: getColor('--color-slate-50'),
      arrowColor: getColor('--color-slate-500'),
      arrowColorHover: getColor('--color-primary-500'),
      arrowColorChildActive: getColor('--color-primary-500'),
      dividerColor: getColor('--color-slate-100')
    },

    // 标签页组件
    Tabs: {
      tabTextColorBar: getColor('--color-slate-400'),
      tabTextColorActiveBar: getColor('--color-primary-500'),
      tabTextColorHoverBar: getColor('--color-slate-500'),
      tabBarColor: getColor('--color-slate-200'),
      tabColorBar: '#FFFFFF',
      tabColorSegment: getColor('--color-slate-100'),
      tabColorSegmentActive: '#FFFFFF',
      tabTextColorSegment: getColor('--color-slate-500'),
      tabTextColorActiveSegment: getColor('--color-primary-500'),
      tabGap: '12px',
      tabPaddingLarge: '12px 16px'
    },

    // 按钮组件
    Button: {
      textColor: getColor('--color-slate-600'),
      textColorHover: getColor('--color-primary-500'),
      textColorPressed: getColor('--color-primary-600'),
      textColorFocus: getColor('--color-primary-500'),
      textColorDisabled: getColor('--color-slate-300'),
      border: '1px solid #E2E8F0',
      borderHover: '1px solid #5B6BF0',
      borderPressed: '1px solid #4338CA',
      borderFocus: '1px solid #5B6BF0',
      textColorPrimary: '#FFFFFF',
      textColorHoverPrimary: '#FFFFFF',
      textColorPressedPrimary: '#FFFFFF',
      textColorFocusPrimary: '#FFFFFF',
      borderRadius: '8px',
      paddingLarge: '10px 20px',
      colorDisabled: getColor('--color-slate-100'),
      colorDisabledPrimary: 'rgba(91, 107, 240, 0.5)'
    },

    // 输入框组件
    Input: {
      color: '#FFFFFF',
      colorFocus: '#FFFFFF',
      textColor: getColor('--color-slate-800'),
      placeholderColor: getColor('--color-slate-400'),
      border: '1px solid #E2E8F0',
      borderHover: '1px solid #CBD5E1',
      borderFocus: '1px solid #5B6BF0',
      boxShadowFocus: `0 0 0 3px ${getColor('--color-primary-500/08')}`,
      colorDisabled: getColor('--color-slate-50'),
      textColorDisabled: getColor('--color-slate-400'),
      borderDisabled: '1px solid #E2E8F0',
      placeholderColorDisabled: getColor('--color-slate-300'),
      colorActive: '#FFFFFF',
      borderRadius: '8px'
    },

    // 表格组件
    DataTable: {
      thColor: getColor('--color-slate-50'),
      thTextColor: getColor('--color-slate-600'),
      thFontWeight: '600',
      tdColor: '#FFFFFF',
      tdTextColor: getColor('--color-slate-800'),
      tdTextColorHover: getColor('--color-slate-600'),
      borderColor: getColor('--color-slate-100'),
      borderRadius: '10px',
      thPadding: '12px 16px',
      tdPadding: '12px 16px'
    },

    // 卡片组件
    Card: {
      color: '#FFFFFF',
      colorModal: '#FFFFFF',
      colorTarget: getColor('--color-slate-50'),
      colorEmbedded: '#FFFFFF',
      colorEmbeddedModal: '#FFFFFF',
      borderColor: getColor('--color-slate-100'),
      borderRadius: '12px'
    },

    // 弹窗组件
    Modal: {
      color: '#FFFFFF',
      textColor: getColor('--color-slate-800'),
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)'
    },

    // 下拉菜单
    Dropdown: {
      color: '#FFFFFF',
      optionColorHover: getColor('--color-slate-50'),
      optionTextColor: getColor('--color-slate-600'),
      optionTextColorHover: getColor('--color-primary-500'),
      optionIconColor: getColor('--color-slate-400'),
      optionIconColorHover: getColor('--color-primary-500'),
      dividerColor: getColor('--color-slate-100'),
      borderRadius: '10px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
      padding: '8px'
    },

    // 选择器
    Select: {
      peers: {
        InternalSelection: {
          color: '#FFFFFF',
          colorActive: '#FFFFFF',
          textColor: getColor('--color-slate-800'),
          placeholderColor: getColor('--color-slate-400'),
          border: '1px solid #E2E8F0',
          borderHover: '1px solid #CBD5E1',
          borderFocus: '1px solid #5B6BF0',
          borderActive: '1px solid #5B6BF0',
          boxShadowFocus: `0 0 0 3px ${getColor('--color-primary-500/08')}`,
          arrowColor: getColor('--color-slate-400'),
          colorDisabled: getColor('--color-slate-50'),
          borderRadius: '8px'
        }
      }
    },

    // 日期选择器
    DatePicker: {
      panelColor: '#FFFFFF',
      panelTextColor: getColor('--color-slate-800'),
      panelHeaderColor: '#FFFFFF',
      panelActionColor: getColor('--color-slate-50'),
      panelActionHoverColor: getColor('--color-slate-100'),
      calendarDaysTextColor: getColor('--color-slate-600'),
      calendarDaysTextColorHover: getColor('--color-primary-500'),
      calendarDaysTextColorCurrent: getColor('--color-primary-500'),
      calendarDaysColorCurrent: getColor('--color-primary-50'),
      calendarDaysTextColorSelected: '#FFFFFF',
      calendarDaysColorSelected: getColor('--color-primary-500'),
      borderRadius: '10px'
    },

    // 通知组件
    Notification: {
      color: '#FFFFFF',
      textColor: getColor('--color-slate-600'),
      borderRadius: '10px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)'
    },

    // 消息提示
    Message: {
      color: '#FFFFFF',
      textColor: getColor('--color-slate-600'),
      borderRadius: '8px',
      iconColor: getColor('--color-slate-400'),
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)'
    },

    // 标签
    Tag: {
      borderRadius: '6px'
    },

    // 徽标
    Badge: {
      color: getColor('--color-error-500'),
      textColor: '#FFFFFF',
      borderRadius: '12px'
    },

    // 进度条
    Progress: {
      borderRadius: '4px',
      railColor: getColor('--color-slate-100'),
      fillColor: getColor('--color-primary-500'),
      fillColorSuccess: getColor('--color-success-500'),
      fillColorWarning: getColor('--color-warning-500'),
      fillColorError: getColor('--color-error-500')
    },

    // 开关
    Switch: {
      railColor: getColor('--color-slate-200'),
      railColorActive: getColor('--color-primary-500'),
      buttonColor: '#FFFFFF',
      buttonBoxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)'
    },

    // 复选框
    Checkbox: {
      borderColor: getColor('--color-slate-300'),
      borderColorChecked: getColor('--color-primary-500'),
      borderColorDisabled: getColor('--color-slate-100'),
      checkMarkColor: '#FFFFFF',
      color: '#FFFFFF',
      colorDisabled: getColor('--color-slate-50'),
      borderRadius: '6px'
    },

    // 单选框
    Radio: {
      buttonColorActive: getColor('--color-primary-500'),
      buttonBorderColor: getColor('--color-slate-300'),
      buttonBorderColorActive: getColor('--color-primary-500'),
      buttonBorderColorHover: getColor('--color-slate-400'),
      buttonBoxShadow: `0 0 0 4px ${getColor('--color-primary-500/08')}`,
      buttonBoxShadowActive: `0 0 0 4px ${getColor('--color-primary-500/15')}`,
      buttonBoxShadowHover: `0 0 0 4px ${getColor('--color-primary-500/10')}`,
      colorDisabled: getColor('--color-slate-50')
    },

    // 滑块
    Slider: {
      railColor: getColor('--color-slate-100'),
      railColorHover: getColor('--color-slate-200'),
      fillColor: getColor('--color-primary-500'),
      fillColorHover: getColor('--color-primary-400'),
      handleColor: '#FFFFFF',
      handleBoxShadow: '0 2px 6px 0 rgb(0 0 0 / 0.1), 0 1px 3px 0 rgb(0 0 0 / 0.08)',
      dotColor: '#FFFFFF',
      dotBorderColor: getColor('--color-primary-500')
    },

    // 步骤条
    Steps: {
      stepHeaderTextColor: getColor('--color-slate-500'),
      stepHeaderTextColorActive: getColor('--color-primary-500'),
      stepHeaderTextColorFinished: getColor('--color-primary-500'),
      stepIconColor: getColor('--color-slate-200'),
      stepIconColorActive: getColor('--color-primary-500'),
      stepIconColorFinished: getColor('--color-primary-500'),
      stepBorderColor: getColor('--color-slate-100'),
      stepBorderColorActive: getColor('--color-primary-500'),
      stepBorderColorFinished: getColor('--color-primary-500')
    },

    // 面包屑
    Breadcrumb: {
      textColor: getColor('--color-slate-500'),
      textColorHover: getColor('--color-primary-500'),
      textColorActive: getColor('--color-primary-500'),
      separatorColor: getColor('--color-slate-300'),
      fontSize: '14px'
    },

    // 分页
    Pagination: {
      itemColor: '#FFFFFF',
      itemColorHover: getColor('--color-slate-50'),
      itemColorPressed: getColor('--color-slate-100'),
      itemColorActive: getColor('--color-primary-500'),
      itemTextColor: getColor('--color-slate-600'),
      itemTextColorHover: getColor('--color-primary-500'),
      itemTextColorActive: '#FFFFFF',
      itemBorder: '1px solid #E2E8F0',
      itemBorderHover: '1px solid #CBD5E1',
      itemBorderActive: '1px solid #5B6BF0',
      itemDisabledOpacity: 0.5,
      itemSizeLarge: '36px',
      borderRadius: '8px'
    },

    // 空状态
    Empty: {
      textColor: getColor('--color-slate-500'),
      iconColor: getColor('--color-slate-200'),
      extraTextColor: getColor('--color-slate-400')
    },

    // 加载中
    Spin: {
      color: getColor('--color-primary-500'),
      textColor: getColor('--color-slate-500')
    },

    // 结果页
    Result: {
      textColor: getColor('--color-slate-600'),
      titleTextColor: getColor('--color-slate-800'),
      iconColorInfo: getColor('--color-info-500'),
      iconColorSuccess: getColor('--color-success-500'),
      iconColorWarning: getColor('--color-warning-500'),
      iconColorError: getColor('--color-error-500')
    },

    // 统计
    Statistic: {
      labelTextColor: getColor('--color-slate-500'),
      valueTextColor: getColor('--color-slate-900')
    },

    // 时间轴
    Timeline: {
      titleTextColor: getColor('--color-slate-800'),
      contentTextColor: getColor('--color-slate-500'),
      lineColor: getColor('--color-slate-100'),
      iconColor: getColor('--color-primary-500'),
      iconSize: '18px'
    },

    // 工具提示
    Tooltip: {
      color: getColor('--color-slate-800'),
      textColor: getColor('--color-slate-50'),
      borderRadius: '8px',
      fontSize: '13px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)'
    },

    // 气泡确认框
    Popconfirm: {
      color: '#FFFFFF',
      textColor: getColor('--color-slate-600'),
      actionColor: getColor('--color-slate-50'),
      borderRadius: '10px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)'
    },

    LoadingBar: {
      color: getColor('--color-primary-500'),
      colorError: getColor('--color-error-500'),
      colorLoading: getColor('--color-primary-500'),
      height: '2px'
    }
  }
}

/**
 * 暗色主题配置
 *
 * 设计理念: GitHub 风格深色系
 * - 侧边栏: 极深色 (#010409) - 接近纯黑但有层次
 * - 内容区: GitHub 深色背景 (#0D1117) - 专业、护眼
 * - 卡片: 柔和深灰 (#161B22) - 清晰的视觉层次
 * - 主色调: 电光紫 (#A78BFA) - 暗色下更醒目
 *
 * 优化重点:
 * - 提高文字对比度，确保可读性
 * - 增加微妙的光泽感和层次感
 * - 柔和的深色背景，避免纯黑
 * - 强化交互状态的视觉反馈
 *
 * 技术实现:
 * - 运行时从 CSS 变量中提取实际颜色值
 * - 颜色定义在 src/assets/styles/index.css（单一真相源）
 */
export function createDarkTheme(): GlobalThemeOverrides {
  return {
    common: {
      primaryColor: getColor('--color-primary-500'),
      primaryColorHover: getColor('--color-primary-600'),
      primaryColorPressed: getColor('--color-primary-700'),
      primaryColorSuppl: getColor('--color-primary-500'),

      successColor: getColor('--color-success-500'),
      successColorHover: getColor('--color-success-400'),
      successColorPressed: getColor('--color-success-600'),
      successColorSuppl: getColor('--color-success-500'),

      warningColor: getColor('--color-warning-500'),
      warningColorHover: getColor('--color-warning-400'),
      warningColorPressed: getColor('--color-warning-600'),
      warningColorSuppl: getColor('--color-warning-500'),

      errorColor: getColor('--color-error-500'),
      errorColorHover: getColor('--color-error-400'),
      errorColorPressed: getColor('--color-error-600'),
      errorColorSuppl: getColor('--color-error-500'),

      infoColor: getColor('--color-info-500'),
      infoColorHover: getColor('--color-info-400'),
      infoColorPressed: getColor('--color-info-600'),
      infoColorSuppl: getColor('--color-info-500'),

      textColorBase: getColor('--color-dark-text-primary'),
      textColor1: '#FFFFFF',
      textColor2: getColor('--color-dark-text-primary'),
      textColor3: getColor('--color-slate-400'),

      borderColor: getColor('--color-dark-border'),
      dividerColor: '#21262D',

      bodyColor: getColor('--color-dark-bg'),
      cardColor: getColor('--color-dark-card'),
      modalColor: getColor('--color-dark-card'),
      popoverColor: getColor('--color-dark-card'),

      borderRadius: '10px',
      borderRadiusSmall: '6px',

      boxShadow1: '0 1px 3px 0 rgb(0 0 0 / 0.5)',
      boxShadow2: '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
      boxShadow3: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)'
    },

    // 布局组件（暗色主题）
    Layout: {
      color: getColor('--color-dark-bg'),
      siderColor: getColor('--color-dark-sider'),
      headerColor: getColor('--color-dark-card'),
      footerColor: getColor('--color-dark-card'),
      textColor: getColor('--color-dark-text-secondary'),
      textColorChild: getColor('--color-dark-text-tertiary'),
      textColorHover: getColor('--color-dark-text-primary'),
      dividerColor: 'rgba(48, 54, 61, 0.5)'
    },

    // 菜单组件（暗色主题）
    Menu: {
      itemTextColor: getColor('--color-dark-text-primary'),
      itemTextColorHover: '#FFFFFF',
      itemTextColorActive: '#FFFFFF',
      itemTextColorChildActive: getColor('--color-primary-500'),
      itemIconColor: getColor('--color-dark-text-secondary'),
      itemIconColorHover: getColor('--color-primary-400'),
      itemIconColorActive: getColor('--color-primary-500'),
      itemIconColorChildActive: getColor('--color-primary-500'),
      itemColorActive: 'rgba(167, 139, 250, 0.15)',
      itemColorHover: getColor('--color-dark-hover'),
      arrowColor: getColor('--color-dark-text-secondary'),
      arrowColorHover: getColor('--color-dark-text-primary'),
      arrowColorChildActive: getColor('--color-primary-500'),
      dividerColor: 'rgba(48, 54, 61, 0.5)'
    },

    // 标签页（暗色）
    Tabs: {
      tabTextColorBar: getColor('--color-dark-text-secondary'),
      tabTextColorActiveBar: getColor('--color-primary-500'),
      tabTextColorHoverBar: getColor('--color-dark-text-primary'),
      tabBarColor: '#21262D',
      tabColorBar: getColor('--color-dark-bg'),
      tabColorSegment: getColor('--color-dark-card'),
      tabColorSegmentActive: getColor('--color-dark-bg'),
      tabTextColorSegment: getColor('--color-dark-text-secondary'),
      tabTextColorActiveSegment: getColor('--color-primary-500'),
      tabGap: '12px',
      tabPaddingLarge: '12px 16px'
    },

    // 按钮（暗色）
    Button: {
      textColor: getColor('--color-dark-text-primary'),
      textColorHover: '#FFFFFF',
      textColorPressed: '#FFFFFF',
      textColorFocus: '#FFFFFF',
      textColorDisabled: 'rgba(255, 255, 255, 0.35)',
      border: '1px solid #30363D',
      borderHover: '1px solid #8B949E',
      borderPressed: '1px solid #A78BFA',
      borderFocus: '1px solid #A78BFA',
      borderRadius: '8px'
    },

    // 输入框（暗色）
    Input: {
      color: getColor('--color-dark-bg'),
      colorFocus: getColor('--color-dark-bg'),
      textColor: getColor('--color-dark-text-primary'),
      placeholderColor: getColor('--color-dark-text-tertiary'),
      border: '1px solid #30363D',
      borderHover: '1px solid #8B949E',
      borderFocus: '1px solid #A78BFA',
      boxShadowFocus: `0 0 0 3px ${getColor('--color-primary-500/08')}`,
      colorDisabled: getColor('--color-dark-card'),
      textColorDisabled: getColor('--color-dark-text-tertiary'),
      borderDisabled: '1px solid #21262D',
      placeholderColorDisabled: '#484F58',
      colorActive: getColor('--color-dark-bg'),
      borderRadius: '8px'
    },

    // 表格（暗色）
    DataTable: {
      thColor: getColor('--color-dark-card'),
      thTextColor: getColor('--color-dark-text-primary'),
      thFontWeight: '600',
      tdColor: getColor('--color-dark-bg'),
      tdTextColor: getColor('--color-dark-text-primary'),
      tdTextColorHover: '#FFFFFF',
      borderColor: '#21262D',
      borderRadius: '10px',
      thPadding: '12px 16px',
      tdPadding: '12px 16px'
    },

    // 卡片（暗色）
    Card: {
      color: getColor('--color-dark-card'),
      colorModal: getColor('--color-dark-card'),
      colorTarget: getColor('--color-dark-bg'),
      colorEmbedded: getColor('--color-dark-card'),
      colorEmbeddedModal: getColor('--color-dark-card'),
      borderColor: getColor('--color-dark-border'),
      borderRadius: '12px'
    },

    // 弹窗（暗色）
    Modal: {
      color: getColor('--color-dark-card'),
      textColor: getColor('--color-dark-text-primary'),
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.7)'
    },

    // 下拉菜单（暗色）
    Dropdown: {
      color: getColor('--color-dark-card'),
      optionColorHover: '#21262D',
      optionTextColor: getColor('--color-dark-text-primary'),
      optionTextColorHover: getColor('--color-primary-500'),
      optionIconColor: getColor('--color-dark-text-secondary'),
      optionIconColorHover: getColor('--color-primary-500'),
      dividerColor: getColor('--color-dark-border'),
      borderRadius: '10px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.6), 0 4px 6px -4px rgb(0 0 0 / 0.6)',
      padding: '8px'
    },

    // 通知（暗色）
    Notification: {
      color: getColor('--color-dark-card'),
      textColor: getColor('--color-dark-text-primary'),
      borderRadius: '10px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.6)'
    },

    // 消息提示（暗色）
    Message: {
      color: getColor('--color-dark-card'),
      textColor: getColor('--color-dark-text-primary'),
      borderRadius: '8px',
      iconColor: getColor('--color-dark-text-secondary'),
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.6)'
    },

    // 工具提示（暗色）
    Tooltip: {
      color: getColor('--color-dark-card'),
      textColor: getColor('--color-dark-text-primary'),
      borderRadius: '8px',
      fontSize: '13px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.6)'
    },

    // 加载条（暗色）
    LoadingBar: {
      color: getColor('--color-primary-500'),
      colorError: getColor('--color-error-500'),
      colorLoading: getColor('--color-primary-500'),
      height: '2px'
    }
  }
}

// 为了向后兼容，导出默认主题对象
// 注意：这些对象在模块加载时创建，可能需要在 DOM 加载后重新创建
export const lightTheme = createLightTheme()
export const darkTheme = createDarkTheme()
