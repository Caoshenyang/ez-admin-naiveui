import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * NaiveUI 主题配置（引用 Tailwind CSS 变量）
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
 * 设计原则:
 * - 极简主义 - 减少视觉干扰
 * - 柔和对比 - 长时间使用不疲劳
 * - 微妙渐变 - 提升质感
 * - 圆润边角 - 现代感
 *
 * 技术实现:
 * - 所有颜色引用 Tailwind CSS 变量（统一管理）
 * - 修改主题只需修改 src/assets/styles/index.css
 */
export const lightTheme: GlobalThemeOverrides = {
  // 通用配置
  common: {
    primaryColor: 'var(--color-primary-500)',
    primaryColorHover: 'var(--color-primary-600)',
    primaryColorPressed: 'var(--color-primary-700)',
    primaryColorSuppl: 'var(--color-primary-500)',

    // 成功色 - 标准绿色（符合用户习惯）
    successColor: 'var(--color-success-500)',
    successColorHover: 'var(--color-success-400)',
    successColorPressed: 'var(--color-success-600)',
    successColorSuppl: 'var(--color-success-500)',

    // 警告色 - 琥珀色
    warningColor: 'var(--color-warning-500)',
    warningColorHover: 'var(--color-warning-400)',
    warningColorPressed: 'var(--color-warning-600)',
    warningColorSuppl: 'var(--color-warning-500)',

    // 错误色 - 柔和红
    errorColor: 'var(--color-error-500)',
    errorColorHover: 'var(--color-error-400)',
    errorColorPressed: 'var(--color-error-600)',
    errorColorSuppl: 'var(--color-error-500)',

    // 信息色 - 清亮蓝
    infoColor: 'var(--color-info-500)',
    infoColorHover: 'var(--color-info-400)',
    infoColorPressed: 'var(--color-info-600)',
    infoColorSuppl: 'var(--color-info-500)',

    // 文字颜色 - 柔和层次
    textColorBase: 'var(--color-slate-500)',
    textColor1: 'var(--color-slate-900)', // 标题
    textColor2: 'var(--color-slate-600)', // 正文
    textColor3: 'var(--color-slate-400)', // 次要

    // 边框颜色 - 极淡灰色
    borderColor: 'var(--color-slate-200)',
    dividerColor: 'var(--color-slate-100)',

    // 背景颜色
    bodyColor: 'var(--color-slate-50)',
    cardColor: '#FFFFFF',
    modalColor: '#FFFFFF',
    popoverColor: '#FFFFFF',

    // 圆角 - 现代圆润
    borderRadius: '10px',
    borderRadiusSmall: '6px',

    // 阴影 - 极柔细腻
    boxShadow1: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    boxShadow2: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    boxShadow3: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)'
  },

  // 布局组件（亮色主题 - 纯白侧边栏）
  Layout: {
    color: 'var(--color-slate-50)',
    siderColor: '#FFFFFF',
    headerColor: '#FFFFFF',
    footerColor: '#FFFFFF',
    textColor: 'var(--color-slate-500)',
    textColorChild: 'var(--color-slate-400)',
    textColorHover: 'var(--color-primary-500)',
    dividerColor: 'var(--color-slate-100)'
  },

  // 菜单组件（亮色主题）
  Menu: {
    itemTextColor: 'var(--color-slate-600)',
    itemTextColorHover: 'var(--color-primary-500)',
    itemTextColorActive: 'var(--color-primary-500)',
    itemTextColorChildActive: 'var(--color-primary-500)',
    itemIconColor: 'var(--color-slate-500)',
    itemIconColorHover: 'var(--color-primary-500)',
    itemIconColorActive: 'var(--color-primary-500)',
    itemIconColorChildActive: 'var(--color-primary-500)',
    itemColorActive: 'var(--color-primary-50)',
    itemColorHover: 'var(--color-slate-50)',
    arrowColor: 'var(--color-slate-500)',
    arrowColorHover: 'var(--color-primary-500)',
    arrowColorChildActive: 'var(--color-primary-500)',
    dividerColor: 'var(--color-slate-100)'
  },

  // 标签页组件
  Tabs: {
    tabTextColorBar: 'var(--color-slate-400)',
    tabTextColorActiveBar: 'var(--color-primary-500)',
    tabTextColorHoverBar: 'var(--color-slate-500)',
    tabBarColor: 'var(--color-slate-200)',
    tabColorBar: '#FFFFFF',
    tabColorSegment: 'var(--color-slate-100)',
    tabColorSegmentActive: '#FFFFFF',
    tabTextColorSegment: 'var(--color-slate-500)',
    tabTextColorActiveSegment: 'var(--color-primary-500)',
    tabGap: '12px',
    tabPaddingLarge: '12px 16px'
  },

  // 按钮组件
  Button: {
    textColor: 'var(--color-slate-600)',
    textColorHover: 'var(--color-primary-500)',
    textColorPressed: 'var(--color-primary-600)',
    textColorFocus: 'var(--color-primary-500)',
    textColorDisabled: 'var(--color-slate-300)',
    border: '1px solid var(--color-slate-300)',
    borderHover: '1px solid var(--color-primary-500)',
    borderPressed: '1px solid var(--color-primary-600)',
    borderFocus: '1px solid var(--color-primary-500)',
    textColorPrimary: '#FFFFFF',
    textColorHoverPrimary: '#FFFFFF',
    textColorPressedPrimary: '#FFFFFF',
    textColorFocusPrimary: '#FFFFFF',
    borderRadius: '8px',
    paddingLarge: '10px 20px',
    colorDisabled: 'var(--color-slate-100)',
    colorDisabledPrimary: 'rgba(91, 107, 240, 0.5)'
  },

  // 输入框组件
  Input: {
    color: '#FFFFFF',
    colorFocus: '#FFFFFF',
    textColor: 'var(--color-slate-800)',
    placeholderColor: 'var(--color-slate-400)',
    border: '1px solid var(--color-slate-200)',
    borderHover: '1px solid var(--color-slate-300)',
    borderFocus: '1px solid var(--color-primary-500)',
    boxShadowFocus: '0 0 0 3px rgb(91, 107, 240, 0.08)',
    colorDisabled: 'var(--color-slate-50)',
    textColorDisabled: 'var(--color-slate-400)',
    borderDisabled: '1px solid var(--color-slate-200)',
    placeholderColorDisabled: 'var(--color-slate-300)',
    colorActive: '#FFFFFF',
    borderRadius: '8px'
  },

  // 表格组件
  DataTable: {
    thColor: 'var(--color-slate-50)',
    thTextColor: 'var(--color-slate-600)',
    thFontWeight: '600',
    tdColor: '#FFFFFF',
    tdTextColor: 'var(--color-slate-800)',
    tdTextColorHover: 'var(--color-slate-600)',
    borderColor: 'var(--color-slate-100)',
    borderRadius: '10px',
    thPadding: '12px 16px',
    tdPadding: '12px 16px'
  },

  // 卡片组件
  Card: {
    color: '#FFFFFF',
    colorModal: '#FFFFFF',
    colorTarget: 'var(--color-slate-50)',
    colorEmbedded: '#FFFFFF',
    colorEmbeddedModal: '#FFFFFF',
    borderColor: 'var(--color-slate-100)',
    borderRadius: '12px'
  },

  // 弹窗组件
  Modal: {
    color: '#FFFFFF',
    textColor: 'var(--color-slate-800)',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)'
  },

  // 下拉菜单
  Dropdown: {
    color: '#FFFFFF',
    optionColorHover: 'var(--color-slate-50)',
    optionTextColor: 'var(--color-slate-600)',
    optionTextColorHover: 'var(--color-primary-500)',
    optionIconColor: 'var(--color-slate-400)',
    optionIconColorHover: 'var(--color-primary-500)',
    dividerColor: 'var(--color-slate-100)',
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
        textColor: 'var(--color-slate-800)',
        placeholderColor: 'var(--color-slate-400)',
        border: '1px solid var(--color-slate-200)',
        borderHover: '1px solid var(--color-slate-300)',
        borderFocus: '1px solid var(--color-primary-500)',
        borderActive: '1px solid var(--color-primary-500)',
        boxShadowFocus: '0 0 0 3px rgb(91, 107, 240, 0.08)',
        arrowColor: 'var(--color-slate-400)',
        colorDisabled: 'var(--color-slate-50)',
        borderRadius: '8px'
      }
    }
  },

  // 日期选择器
  DatePicker: {
    panelColor: '#FFFFFF',
    panelTextColor: 'var(--color-slate-800)',
    panelHeaderColor: '#FFFFFF',
    panelActionColor: 'var(--color-slate-50)',
    panelActionHoverColor: 'var(--color-slate-100)',
    calendarDaysTextColor: 'var(--color-slate-600)',
    calendarDaysTextColorHover: 'var(--color-primary-500)',
    calendarDaysTextColorCurrent: 'var(--color-primary-500)',
    calendarDaysColorCurrent: 'var(--color-primary-50)',
    calendarDaysTextColorSelected: '#FFFFFF',
    calendarDaysColorSelected: 'var(--color-primary-500)',
    borderRadius: '10px'
  },

  // 通知组件
  Notification: {
    color: '#FFFFFF',
    textColor: 'var(--color-slate-600)',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)'
  },

  // 消息提示
  Message: {
    color: '#FFFFFF',
    textColor: 'var(--color-slate-600)',
    borderRadius: '8px',
    iconColor: 'var(--color-slate-400)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)'
  },

  // 标签
  Tag: {
    borderRadius: '6px'
  },

  // 徽标
  Badge: {
    color: 'var(--color-error-500)',
    textColor: '#FFFFFF',
    borderRadius: '12px'
  },

  // 进度条
  Progress: {
    borderRadius: '4px',
    railColor: 'var(--color-slate-100)',
    fillColor: 'var(--color-primary-500)',
    fillColorSuccess: 'var(--color-success-500)',
    fillColorWarning: 'var(--color-warning-500)',
    fillColorError: 'var(--color-error-500)'
  },

  // 开关
  Switch: {
    railColor: 'var(--color-slate-200)',
    railColorActive: 'var(--color-primary-500)',
    buttonColor: '#FFFFFF',
    buttonBoxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)'
  },

  // 复选框
  Checkbox: {
    borderColor: 'var(--color-slate-300)',
    borderColorChecked: 'var(--color-primary-500)',
    borderColorDisabled: 'var(--color-slate-100)',
    checkMarkColor: '#FFFFFF',
    color: '#FFFFFF',
    colorDisabled: 'var(--color-slate-50)',
    borderRadius: '6px'
  },

  // 单选框
  Radio: {
    buttonColorActive: 'var(--color-primary-500)',
    buttonBorderColor: 'var(--color-slate-300)',
    buttonBorderColorActive: 'var(--color-primary-500)',
    buttonBorderColorHover: 'var(--color-slate-400)',
    buttonBoxShadow: '0 0 0 4px rgb(91, 107, 240, 0.08)',
    buttonBoxShadowActive: '0 0 0 4px rgb(91, 107, 240, 0.15)',
    buttonBoxShadowHover: '0 0 0 4px rgb(91, 107, 240, 0.12)',
    colorDisabled: 'var(--color-slate-50)'
  },

  // 滑块
  Slider: {
    railColor: 'var(--color-slate-100)',
    railColorHover: 'var(--color-slate-200)',
    fillColor: 'var(--color-primary-500)',
    fillColorHover: 'var(--color-primary-400)',
    handleColor: '#FFFFFF',
    handleBoxShadow: '0 2px 6px 0 rgb(0 0 0 / 0.1), 0 1px 3px 0 rgb(0 0 0 / 0.08)',
    dotColor: '#FFFFFF',
    dotBorderColor: 'var(--color-primary-500)'
  },

  // 步骤条
  Steps: {
    stepHeaderTextColor: 'var(--color-slate-500)',
    stepHeaderTextColorActive: 'var(--color-primary-500)',
    stepHeaderTextColorFinished: 'var(--color-primary-500)',
    stepIconColor: 'var(--color-slate-200)',
    stepIconColorActive: 'var(--color-primary-500)',
    stepIconColorFinished: 'var(--color-primary-500)',
    stepBorderColor: 'var(--color-slate-100)',
    stepBorderColorActive: 'var(--color-primary-500)',
    stepBorderColorFinished: 'var(--color-primary-500)'
  },

  // 面包屑
  Breadcrumb: {
    textColor: 'var(--color-slate-500)',
    textColorHover: 'var(--color-primary-500)',
    textColorActive: 'var(--color-primary-500)',
    separatorColor: 'var(--color-slate-300)',
    fontSize: '14px'
  },

  // 分页
  Pagination: {
    itemColor: '#FFFFFF',
    itemColorHover: 'var(--color-slate-50)',
    itemColorPressed: 'var(--color-slate-100)',
    itemColorActive: 'var(--color-primary-500)',
    itemTextColor: 'var(--color-slate-600)',
    itemTextColorHover: 'var(--color-primary-500)',
    itemTextColorActive: '#FFFFFF',
    itemBorder: '1px solid var(--color-slate-200)',
    itemBorderHover: '1px solid var(--color-slate-300)',
    itemBorderActive: '1px solid var(--color-primary-500)',
    itemDisabledOpacity: 0.5,
    itemSizeLarge: '36px',
    borderRadius: '8px'
  },

  // 空状态
  Empty: {
    textColor: 'var(--color-slate-500)',
    iconColor: 'var(--color-slate-200)',
    extraTextColor: 'var(--color-slate-400)'
  },

  // 加载中
  Spin: {
    color: 'var(--color-primary-500)',
    textColor: 'var(--color-slate-500)'
  },

  // 结果页
  Result: {
    textColor: 'var(--color-slate-600)',
    titleTextColor: 'var(--color-slate-800)',
    iconColorInfo: 'var(--color-info-500)',
    iconColorSuccess: 'var(--color-success-500)',
    iconColorWarning: 'var(--color-warning-500)',
    iconColorError: 'var(--color-error-500)'
  },

  // 统计
  Statistic: {
    labelTextColor: 'var(--color-slate-500)',
    valueTextColor: 'var(--color-slate-900)'
  },

  // 时间轴
  Timeline: {
    titleTextColor: 'var(--color-slate-800)',
    contentTextColor: 'var(--color-slate-500)',
    lineColor: 'var(--color-slate-100)',
    iconColor: 'var(--color-primary-500)',
    iconSize: '18px'
  },

  // 工具提示
  Tooltip: {
    color: 'var(--color-slate-800)',
    textColor: 'var(--color-slate-50)',
    borderRadius: '8px',
    fontSize: '13px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)'
  },

  // 气泡确认框
  Popconfirm: {
    color: '#FFFFFF',
    textColor: 'var(--color-slate-600)',
    actionColor: 'var(--color-slate-50)',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)'
  },

  LoadingBar: {
    color: 'var(--color-primary-500)',
    colorError: 'var(--color-error-500)',
    colorLoading: 'var(--color-primary-500)',
    height: '2px'
  }
}

/**
 * 暗色主题配置（引用 Tailwind CSS 变量）
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
 * - 所有颜色引用 Tailwind CSS 变量（统一管理）
 * - 修改主题只需修改 src/assets/styles/index.css
 */
export const darkTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: 'var(--color-primary-dark-500)',
    primaryColorHover: 'var(--color-primary-dark-400)',
    primaryColorPressed: 'var(--color-primary-dark-600)',
    primaryColorSuppl: 'var(--color-primary-dark-500)',

    successColor: 'var(--color-success-400)',
    successColorHover: 'var(--color-success-500)',
    successColorPressed: 'var(--color-success-600)',
    successColorSuppl: 'var(--color-success-400)',

    warningColor: 'var(--color-warning-400)',
    warningColorHover: 'var(--color-warning-500)',
    warningColorPressed: 'var(--color-warning-600)',
    warningColorSuppl: 'var(--color-warning-400)',

    errorColor: 'var(--color-error-400)',
    errorColorHover: 'var(--color-error-500)',
    errorColorPressed: 'var(--color-error-600)',
    errorColorSuppl: 'var(--color-error-400)',

    infoColor: 'var(--color-info-400)',
    infoColorHover: 'var(--color-info-500)',
    infoColorPressed: 'var(--color-info-600)',
    infoColorSuppl: 'var(--color-info-400)',

    textColorBase: 'var(--color-dark-text-primary)',
    textColor1: '#FFFFFF',
    textColor2: 'var(--color-dark-text-primary)',
    textColor3: 'var(--color-slate-400)',

    borderColor: 'var(--color-dark-border)',
    dividerColor: '#21262D',

    bodyColor: 'var(--color-dark-bg)',
    cardColor: 'var(--color-dark-card)',
    modalColor: 'var(--color-dark-card)',
    popoverColor: 'var(--color-dark-card)',

    borderRadius: '10px',
    borderRadiusSmall: '6px',

    boxShadow1: '0 1px 3px 0 rgb(0 0 0 / 0.5)',
    boxShadow2: '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
    boxShadow3: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)'
  },

  // 布局组件（暗色主题）
  Layout: {
    color: 'var(--color-dark-bg)',
    siderColor: 'var(--color-dark-sider)',
    headerColor: 'var(--color-dark-card)',
    footerColor: 'var(--color-dark-card)',
    textColor: 'var(--color-dark-text-secondary)',
    textColorChild: 'var(--color-dark-text-tertiary)',
    textColorHover: 'var(--color-dark-text-primary)',
    dividerColor: 'rgba(48, 54, 61, 0.5)'
  },

  // 菜单组件（暗色主题）
  Menu: {
    itemTextColor: 'var(--color-dark-text-primary)',
    itemTextColorHover: '#FFFFFF',
    itemTextColorActive: '#FFFFFF',
    itemTextColorChildActive: 'var(--color-primary-dark-500)',
    itemIconColor: 'var(--color-dark-text-secondary)',
    itemIconColorHover: 'var(--color-primary-dark-400)',
    itemIconColorActive: 'var(--color-primary-dark-500)',
    itemIconColorChildActive: 'var(--color-primary-dark-500)',
    itemColorActive: 'rgba(167, 139, 250, 0.15)',
    itemColorHover: 'var(--color-dark-hover)',
    arrowColor: 'var(--color-dark-text-secondary)',
    arrowColorHover: 'var(--color-dark-text-primary)',
    arrowColorChildActive: 'var(--color-primary-dark-500)',
    dividerColor: 'rgba(48, 54, 61, 0.5)'
  },

  // 标签页（暗色）
  Tabs: {
    tabTextColorBar: 'var(--color-dark-text-secondary)',
    tabTextColorActiveBar: 'var(--color-primary-dark-500)',
    tabTextColorHoverBar: 'var(--color-dark-text-primary)',
    tabBarColor: '#21262D',
    tabColorBar: 'var(--color-dark-bg)',
    tabColorSegment: 'var(--color-dark-card)',
    tabColorSegmentActive: 'var(--color-dark-bg)',
    tabTextColorSegment: 'var(--color-dark-text-secondary)',
    tabTextColorActiveSegment: 'var(--color-primary-dark-500)',
    tabGap: '12px',
    tabPaddingLarge: '12px 16px'
  },

  // 按钮（暗色）
  Button: {
    textColor: 'var(--color-dark-text-primary)',
    textColorHover: '#FFFFFF',
    textColorPressed: '#FFFFFF',
    textColorFocus: '#FFFFFF',
    textColorDisabled: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid var(--color-dark-border)',
    borderHover: '1px solid var(--color-dark-text-secondary)',
    borderPressed: '1px solid var(--color-primary-dark-500)',
    borderFocus: '1px solid var(--color-primary-dark-500)',
    borderRadius: '8px'
  },

  // 输入框（暗色）
  Input: {
    color: 'var(--color-dark-bg)',
    colorFocus: 'var(--color-dark-bg)',
    textColor: 'var(--color-dark-text-primary)',
    placeholderColor: 'var(--color-dark-text-tertiary)',
    border: '1px solid var(--color-dark-border)',
    borderHover: '1px solid var(--color-dark-text-secondary)',
    borderFocus: '1px solid var(--color-primary-dark-500)',
    boxShadowFocus: '0 0 0 3px rgba(167, 139, 250, 0.2)',
    colorDisabled: 'var(--color-dark-card)',
    textColorDisabled: 'var(--color-dark-text-tertiary)',
    borderDisabled: '1px solid #21262D',
    placeholderColorDisabled: '#484F58',
    colorActive: 'var(--color-dark-bg)',
    borderRadius: '8px'
  },

  // 表格（暗色）
  DataTable: {
    thColor: 'var(--color-dark-card)',
    thTextColor: 'var(--color-dark-text-primary)',
    thFontWeight: '600',
    tdColor: 'var(--color-dark-bg)',
    tdTextColor: 'var(--color-dark-text-primary)',
    tdTextColorHover: '#FFFFFF',
    borderColor: '#21262D',
    borderRadius: '10px',
    thPadding: '12px 16px',
    tdPadding: '12px 16px'
  },

  // 卡片（暗色）
  Card: {
    color: 'var(--color-dark-card)',
    colorModal: 'var(--color-dark-card)',
    colorTarget: 'var(--color-dark-bg)',
    colorEmbedded: 'var(--color-dark-card)',
    colorEmbeddedModal: 'var(--color-dark-card)',
    borderColor: 'var(--color-dark-border)',
    borderRadius: '12px'
  },

  // 弹窗（暗色）
  Modal: {
    color: 'var(--color-dark-card)',
    textColor: 'var(--color-dark-text-primary)',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.7)'
  },

  // 下拉菜单（暗色）
  Dropdown: {
    color: 'var(--color-dark-card)',
    optionColorHover: '#21262D',
    optionTextColor: 'var(--color-dark-text-primary)',
    optionTextColorHover: 'var(--color-primary-dark-500)',
    optionIconColor: 'var(--color-dark-text-secondary)',
    optionIconColorHover: 'var(--color-primary-dark-500)',
    dividerColor: 'var(--color-dark-border)',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.6), 0 4px 6px -4px rgb(0 0 0 / 0.6)',
    padding: '8px'
  },

  // 通知（暗色）
  Notification: {
    color: 'var(--color-dark-card)',
    textColor: 'var(--color-dark-text-primary)',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.6)'
  },

  // 消息提示（暗色）
  Message: {
    color: 'var(--color-dark-card)',
    textColor: 'var(--color-dark-text-primary)',
    borderRadius: '8px',
    iconColor: 'var(--color-dark-text-secondary)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.6)'
  },

  // 工具提示（暗色）
  Tooltip: {
    color: 'var(--color-dark-card)',
    textColor: 'var(--color-dark-text-primary)',
    borderRadius: '8px',
    fontSize: '13px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.6)'
  },

  // 加载条（暗色）
  LoadingBar: {
    color: 'var(--color-primary-dark-500)',
    colorError: 'var(--color-error-400)',
    colorLoading: 'var(--color-primary-dark-500)',
    height: '2px'
  }
}
