import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * NaiveUI 主题配置
 *
 * 设计理念: 现代优雅风格
 * 参考: Linear, Vercel, Notion 等现代 SaaS 产品
 *
 * 颜色策略:
 * - 主色调: 蓝紫渐变 (#5B6BF0 + #8B5CF6) - 现代、科技感
 * - 亮色主题: 纯白侧边栏 + 清爽配色 - 明亮、通透
 * - 暗色主题: 极深黑蓝侧边栏 - 沉浸式、高端
 * - 成功/警告/错误: 柔和状态色 - 不刺眼
 *
 * 设计原则:
 * - 极简主义 - 减少视觉干扰
 * - 柔和对比 - 长时间使用不疲劳
 * - 微妙渐变 - 提升质感
 * - 圆润边角 - 现代感
 */
export const lightTheme: GlobalThemeOverrides = {
  // 通用配置
  common: {
    primaryColor: '#5B6BF0', // 现代蓝紫
    primaryColorHover: '#7C85F7',
    primaryColorPressed: '#4A57D9',
    primaryColorSuppl: '#5B6BF0',

    // 成功色 - 使用主题色（统一视觉风格）
    successColor: '#5B6BF0', // 与主色一致
    successColorHover: '#7C85F7', // 与主色 hover 一致
    successColorPressed: '#4A57D9', // 与主色 pressed 一致
    successColorSuppl: '#5B6BF0',

    // 警告色 - 温暖橙
    warningColor: '#F59E0B',
    warningColorHover: '#FBBF24',
    warningColorPressed: '#D97706',
    warningColorSuppl: '#F59E0B',

    // 错误色 - 柔和红
    errorColor: '#EF4444',
    errorColorHover: '#F87171',
    errorColorPressed: '#DC2626',
    errorColorSuppl: '#EF4444',

    // 信息色 - 清亮蓝
    infoColor: '#3B82F6',
    infoColorHover: '#60A5FA',
    infoColorPressed: '#2563EB',
    infoColorSuppl: '#3B82F6',

    // 文字颜色 - 柔和层次
    textColorBase: '#64748B', // slate-500
    textColor1: '#0F172A', // slate-900 (标题)
    textColor2: '#475569', // slate-600 (正文)
    textColor3: '#94A3B8', // slate-400 (次要)

    // 边框颜色 - 极淡灰色
    borderColor: '#E2E8F0', // slate-200
    dividerColor: '#F1F5F9', // slate-100

    // 背景颜色
    bodyColor: '#F8FAFC', // slate-50
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
    color: '#F8FAFC', // 浅灰背景
    siderColor: '#FFFFFF', // 纯白侧边栏（亮色主题）
    headerColor: '#FFFFFF', // 白色顶栏
    footerColor: '#FFFFFF',
    textColor: '#64748B', // slate-500 (侧边栏文字)
    textColorChild: '#94A3B8', // slate-400 (侧边栏子项)
    textColorHover: '#5B6BF0', // 主色 hover
    dividerColor: '#F1F5F9' // 极淡分隔线
  },

  // 菜单组件（亮色主题）
  Menu: {
    itemTextColor: '#475569', // slate-600（加深，更清晰）
    itemTextColorHover: '#5B6BF0', // 主色 hover
    itemTextColorActive: '#5B6BF0', // 主色 active
    itemTextColorChildActive: '#5B6BF0', // 主色（子菜单激活时父节点高亮）
    itemIconColor: '#64748B', // slate-500（加深图标）
    itemIconColorHover: '#5B6BF0', // 主色 hover
    itemIconColorActive: '#5B6BF0', // 主色 active
    itemIconColorChildActive: '#5B6BF0', // 主色（子菜单激活时父节点图标高亮）
    itemColorActive: '#EEF2FF', // 极淡蓝紫背景
    itemColorHover: '#F8FAFC', // 浅灰 hover
    arrowColor: '#64748B', // slate-500（加深箭头）
    arrowColorHover: '#5B6BF0',
    arrowColorChildActive: '#5B6BF0', // 主色（子菜单激活时父节点箭头高亮）
    dividerColor: '#F1F5F9' // 极淡分隔线
  },

  // 标签页组件
  Tabs: {
    tabTextColorBar: '#94A3B8', // slate-400
    tabTextColorActiveBar: '#5B6BF0', // 主色
    tabTextColorHoverBar: '#64748B',
    tabBarColor: '#E2E8F0',
    tabColorBar: '#FFFFFF',
    tabColorSegment: '#F1F5F9',
    tabColorSegmentActive: '#FFFFFF',
    tabTextColorSegment: '#64748B',
    tabTextColorActiveSegment: '#5B6BF0',
    tabGap: '12px',
    tabPaddingLarge: '12px 16px'
  },

  // 按钮组件
  Button: {
    // 普通按钮文字颜色
    textColor: '#475569', // slate-600
    textColorHover: '#5B6BF0', // 主色 hover
    textColorPressed: '#4A57D9', // 主色 pressed
    textColorFocus: '#5B6BF0', // 主色 focus
    textColorDisabled: '#CBD5E1', // slate-300
    // 普通按钮边框
    border: '1px solid #CBD5E1', // slate-300 (更明显)
    borderHover: '1px solid #5B6BF0', // 主色 hover
    borderPressed: '1px solid #4A57D9', // 主色 pressed
    borderFocus: '1px solid #5B6BF0', // 主色 focus
    // 主要按钮文字（保持白色）
    textColorPrimary: '#FFFFFF',
    textColorHoverPrimary: '#FFFFFF',
    textColorPressedPrimary: '#FFFFFF',
    textColorFocusPrimary: '#FFFFFF',
    // 圆角和内边距
    borderRadius: '8px',
    paddingLarge: '10px 20px',
    // 禁用状态
    colorDisabled: '#F1F5F9',
    colorDisabledPrimary: 'rgba(91, 107, 240, 0.5)'
  },

  // 输入框组件
  Input: {
    color: '#FFFFFF',
    colorFocus: '#FFFFFF',
    textColor: '#1E293B',
    placeholderColor: '#94A3B8',
    border: '1px solid #E2E8F0',
    borderHover: '1px solid #CBD5E1',
    borderFocus: '1px solid #5B6BF0',
    boxShadowFocus: '0 0 0 3px rgb(91, 107, 240, 0.08)',
    colorDisabled: '#F8FAFC',
    textColorDisabled: '#94A3B8',
    borderDisabled: '1px solid #E2E8F0',
    placeholderColorDisabled: '#CBD5E1',
    colorActive: '#FFFFFF',
    borderRadius: '8px'
  },

  // 表格组件
  DataTable: {
    thColor: '#F8FAFC', // 表头浅灰
    thTextColor: '#475569', // 表头文字
    thFontWeight: '600',
    tdColor: '#FFFFFF',
    tdTextColor: '#1E293B',
    tdTextColorHover: '#475569',
    borderColor: '#F1F5F9',
    borderRadius: '10px',
    thPadding: '12px 16px',
    tdPadding: '12px 16px'
  },

  // 卡片组件
  Card: {
    color: '#FFFFFF',
    colorModal: '#FFFFFF',
    colorTarget: '#F8FAFC',
    colorEmbedded: '#FFFFFF',
    colorEmbeddedModal: '#FFFFFF',
    borderColor: '#F1F5F9',
    borderRadius: '12px'
  },

  // 弹窗组件
  Modal: {
    color: '#FFFFFF',
    textColor: '#1E293B',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)'
  },

  // 下拉菜单
  Dropdown: {
    color: '#FFFFFF',
    optionColorHover: '#F8FAFC',
    optionTextColor: '#475569',
    optionTextColorHover: '#5B6BF0',
    optionIconColor: '#94A3B8',
    optionIconColorHover: '#5B6BF0',
    dividerColor: '#F1F5F9',
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
        textColor: '#1E293B',
        placeholderColor: '#94A3B8',
        border: '1px solid #E2E8F0',
        borderHover: '1px solid #CBD5E1',
        borderFocus: '1px solid #5B6BF0',
        borderActive: '1px solid #5B6BF0',
        boxShadowFocus: '0 0 0 3px rgb(91, 107, 240, 0.08)',
        arrowColor: '#94A3B8',
        colorDisabled: '#F8FAFC',
        borderRadius: '8px'
      }
    }
  },

  // 日期选择器
  DatePicker: {
    panelColor: '#FFFFFF',
    panelTextColor: '#1E293B',
    panelHeaderColor: '#FFFFFF',
    panelActionColor: '#F8FAFC',
    panelActionHoverColor: '#F1F5F9',
    calendarDaysTextColor: '#475569',
    calendarDaysTextColorHover: '#5B6BF0',
    calendarDaysTextColorCurrent: '#5B6BF0',
    calendarDaysColorCurrent: '#EEF2FF',
    calendarDaysTextColorSelected: '#FFFFFF',
    calendarDaysColorSelected: '#5B6BF0',
    borderRadius: '10px'
  },

  // 通知组件
  Notification: {
    color: '#FFFFFF',
    textColor: '#475569',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)'
  },

  // 消息提示
  Message: {
    color: '#FFFFFF',
    textColor: '#475569',
    borderRadius: '8px',
    iconColor: '#94A3B8',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)'
  },

  // 标签
  Tag: {
    borderRadius: '6px'
  },

  // 徽标
  Badge: {
    color: '#EF4444',
    textColor: '#FFFFFF',
    borderRadius: '12px'
  },

  // 进度条
  Progress: {
    borderRadius: '4px',
    railColor: '#F1F5F9',
    fillColor: '#5B6BF0',
    fillColorSuccess: '#5B6BF0', // 与主题色一致
    fillColorWarning: '#F59E0B',
    fillColorError: '#EF4444'
  },

  // 开关
  Switch: {
    railColor: '#E2E8F0',
    railColorActive: '#5B6BF0',
    buttonColor: '#FFFFFF',
    buttonBoxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)'
  },

  // 复选框
  Checkbox: {
    borderColor: '#CBD5E1',
    borderColorChecked: '#5B6BF0',
    borderColorDisabled: '#F1F5F9',
    checkMarkColor: '#FFFFFF',
    color: '#FFFFFF',
    colorDisabled: '#F8FAFC',
    borderRadius: '6px'
  },

  // 单选框
  Radio: {
    buttonColorActive: '#5B6BF0',
    buttonBorderColor: '#CBD5E1',
    buttonBorderColorActive: '#5B6BF0',
    buttonBorderColorHover: '#94A3B8',
    buttonBoxShadow: '0 0 0 4px rgb(91, 107, 240, 0.08)',
    buttonBoxShadowActive: '0 0 0 4px rgb(91, 107, 240, 0.15)',
    buttonBoxShadowHover: '0 0 0 4px rgb(91, 107, 240, 0.12)',
    colorDisabled: '#F8FAFC'
  },

  // 滑块
  Slider: {
    railColor: '#F1F5F9',
    railColorHover: '#E2E8F0',
    fillColor: '#5B6BF0',
    fillColorHover: '#7C85F7',
    handleColor: '#FFFFFF',
    handleBoxShadow: '0 2px 6px 0 rgb(0 0 0 / 0.1), 0 1px 3px 0 rgb(0 0 0 / 0.08)',
    dotColor: '#FFFFFF',
    dotBorderColor: '#5B6BF0'
  },

  // 步骤条
  Steps: {
    stepHeaderTextColor: '#64748B',
    stepHeaderTextColorActive: '#5B6BF0',
    stepHeaderTextColorFinished: '#5B6BF0', // 与主题色一致
    stepIconColor: '#E2E8F0',
    stepIconColorActive: '#5B6BF0',
    stepIconColorFinished: '#5B6BF0', // 与主题色一致
    stepBorderColor: '#F1F5F9',
    stepBorderColorActive: '#5B6BF0',
    stepBorderColorFinished: '#5B6BF0' // 与主题色一致
  },

  // 面包屑
  Breadcrumb: {
    textColor: '#64748B',
    textColorHover: '#5B6BF0',
    textColorActive: '#5B6BF0',
    separatorColor: '#CBD5E1',
    fontSize: '14px'
  },

  // 分页
  Pagination: {
    itemColor: '#FFFFFF',
    itemColorHover: '#F8FAFC',
    itemColorPressed: '#F1F5F9',
    itemColorActive: '#5B6BF0',
    itemTextColor: '#475569',
    itemTextColorHover: '#5B6BF0',
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
    textColor: '#64748B',
    iconColor: '#E2E8F0',
    extraTextColor: '#94A3B8'
  },

  // 加载中
  Spin: {
    color: '#5B6BF0',
    textColor: '#64748B'
  },

  // 结果页
  Result: {
    textColor: '#475569',
    titleTextColor: '#1E293B',
    iconColorInfo: '#3B82F6',
    iconColorSuccess: '#5B6BF0', // 与主题色一致
    iconColorWarning: '#F59E0B',
    iconColorError: '#EF4444'
  },

  // 统计
  Statistic: {
    labelTextColor: '#64748B',
    valueTextColor: '#0F172A'
  },

  // 时间轴
  Timeline: {
    titleTextColor: '#1E293B',
    contentTextColor: '#64748B',
    lineColor: '#F1F5F9',
    iconColor: '#5B6BF0',
    iconSize: '18px'
  },

  // 工具提示
  Tooltip: {
    color: '#1E293B',
    textColor: '#F8FAFC',
    borderRadius: '8px',
    fontSize: '13px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)'
  },

  // 气泡确认框
  Popconfirm: {
    color: '#FFFFFF',
    textColor: '#475569',
    actionColor: '#F8FAFC',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)'
  },

  LoadingBar: {
    color: '#5B6BF0', // 默认颜色（主题色）
    colorError: '#EF4444', // 错误时红色
    colorLoading: '#5B6BF0', // 加载中颜色
    height: '2px' // 进度条高度
  }
}

/**
 * 暗色主题配置（沉浸式深色风格）
 *
 * 专为长时间工作场景设计，减少眼睛疲劳
 * - 侧边栏: 极深黑蓝 (#0B0F19)
 * - 内容区: 深色背景 (#0F172A)
 * - 卡片: 中等深度 (#1E293B)
 */
export const darkTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#818CF8', // 亮紫（暗色模式下更明亮）
    primaryColorHover: '#A5B4FC',
    primaryColorPressed: '#6366F1',
    primaryColorSuppl: '#818CF8',

    successColor: '#818CF8', // 与主色一致（暗色模式）
    successColorHover: '#A5B4FC',
    successColorPressed: '#6366F1',
    successColorSuppl: '#818CF8',

    warningColor: '#F59E0B',
    warningColorHover: '#FBBF24',
    warningColorPressed: '#D97706',
    warningColorSuppl: '#F59E0B',

    errorColor: '#EF4444',
    errorColorHover: '#F87171',
    errorColorPressed: '#DC2626',
    errorColorSuppl: '#EF4444',

    infoColor: '#3B82F6',
    infoColorHover: '#60A5FA',
    infoColorPressed: '#2563EB',
    infoColorSuppl: '#3B82F6',

    // 文字颜色（暗色模式）
    textColorBase: '#CBD5E1', // slate-300
    textColor1: '#F8FAFC', // slate-50 (标题)
    textColor2: '#E2E8F0', // slate-200 (正文)
    textColor3: '#94A3B8', // slate-400 (次要)

    borderColor: '#334155', // slate-700
    dividerColor: '#1E293B', // slate-800

    bodyColor: '#0F172A', // slate-900
    cardColor: '#1E293B', // slate-800
    modalColor: '#1E293B',
    popoverColor: '#1E293B',

    borderRadius: '10px',
    borderRadiusSmall: '6px',

    boxShadow1: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    boxShadow2: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    boxShadow3: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)'
  },

  // 布局组件（暗色主题 - 深色侧边栏）
  Layout: {
    color: '#0F172A', // 深色背景
    siderColor: '#0B0F19', // 极深黑蓝侧边栏
    headerColor: '#1E293B', // 深色顶栏
    footerColor: '#1E293B',
    textColor: '#94A3B8', // slate-400 (侧边栏文字)
    textColorChild: '#64748B', // slate-500 (侧边栏子项)
    textColorHover: '#E2E8F0', // slate-200 hover
    dividerColor: 'rgba(255, 255, 255, 0.06)'
  },

  // 菜单组件（暗色主题）
  Menu: {
    itemTextColor: 'rgb(148, 163, 184)', // slate-400
    itemTextColorHover: '#F1F5F9', // slate-100 hover
    itemTextColorActive: '#FFFFFF', // 白色 active
    itemTextColorChildActive: '#818CF8', // 亮紫（子菜单激活时父节点高亮）
    itemIconColor: 'rgb(100, 116, 139)', // slate-500
    itemIconColorHover: '#A5B4FC', // 淡紫 hover
    itemIconColorActive: '#818CF8', // 亮紫 active
    itemIconColorChildActive: '#818CF8', // 亮紫（子菜单激活时父节点图标高亮）
    itemColorActive: 'rgba(129, 140, 248, 0.15)', // 亮紫半透明背景
    itemColorHover: 'rgba(255, 255, 255, 0.04)',
    arrowColor: 'rgb(100, 116, 139)',
    arrowColorHover: '#E2E8F0',
    arrowColorChildActive: '#818CF8', // 亮紫（子菜单激活时父节点箭头高亮）
    dividerColor: 'rgba(255, 255, 255, 0.06)'
  },

  // 标签页（暗色）
  Tabs: {
    tabTextColorBar: '#94A3B8',
    tabTextColorActiveBar: '#818CF8',
    tabTextColorHoverBar: '#CBD5E1',
    tabBarColor: '#1E293B',
    tabColorBar: '#0F172A',
    tabColorSegment: '#1E293B',
    tabColorSegmentActive: '#0F172A',
    tabTextColorSegment: '#94A3B8',
    tabTextColorActiveSegment: '#818CF8',
    tabGap: '12px',
    tabPaddingLarge: '12px 16px'
  },

  // 按钮（暗色）
  Button: {
    textColor: '#FFFFFF',
    textColorHover: '#FFFFFF',
    textColorPressed: '#FFFFFF',
    textColorFocus: '#FFFFFF',
    textColorDisabled: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid #334155',
    borderHover: '1px solid #475569',
    borderPressed: '1px solid #64748B',
    borderFocus: '1px solid #818CF8',
    borderRadius: '8px'
  },

  // 输入框（暗色）
  Input: {
    color: '#1E293B',
    colorFocus: '#1E293B',
    textColor: '#E2E8F0',
    placeholderColor: '#64748B',
    border: '1px solid #334155',
    borderHover: '1px solid #475569',
    borderFocus: '1px solid #818CF8',
    boxShadowFocus: '0 0 0 3px rgb(129, 140, 248, 0.15)',
    colorDisabled: '#0F172A',
    textColorDisabled: '#64748B',
    borderDisabled: '1px solid #1E293B',
    placeholderColorDisabled: '#475569',
    colorActive: '#1E293B',
    borderRadius: '8px'
  },

  // 表格（暗色）
  DataTable: {
    thColor: '#1E293B',
    thTextColor: '#E2E8F0',
    thFontWeight: '600',
    tdColor: '#0F172A',
    tdTextColor: '#CBD5E1',
    tdTextColorHover: '#E2E8F0',
    borderColor: '#1E293B',
    borderRadius: '10px',
    thPadding: '12px 16px',
    tdPadding: '12px 16px'
  },

  // 卡片（暗色）
  Card: {
    color: '#1E293B',
    colorModal: '#1E293B',
    colorTarget: '#0F172A',
    colorEmbedded: '#1E293B',
    colorEmbeddedModal: '#1E293B',
    borderColor: '#334155',
    borderRadius: '12px'
  },

  // 弹窗（暗色）
  Modal: {
    color: '#1E293B',
    textColor: '#E2E8F0',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)'
  },

  // 下拉菜单（暗色）
  Dropdown: {
    color: '#1E293B',
    optionColorHover: '#334155',
    optionTextColor: '#CBD5E1',
    optionTextColorHover: '#818CF8',
    optionIconColor: '#64748B',
    optionIconColorHover: '#818CF8',
    dividerColor: '#334155',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    padding: '8px'
  },

  // 其他组件...
  Notification: {
    color: '#1E293B',
    textColor: '#CBD5E1',
    borderRadius: '10px'
  },

  Message: {
    color: '#1E293B',
    textColor: '#CBD5E1',
    borderRadius: '8px',
    iconColor: '#64748B'
  },

  Tooltip: {
    color: '#1E293B',
    textColor: '#E2E8F0',
    borderRadius: '8px',
    fontSize: '13px'
  },

  LoadingBar: {
    color: '#818CF8', // 暗色模式使用更亮的紫色
    colorError: '#EF4444', // 错误色保持红色
    colorLoading: '#818CF8', // 加载中也是亮紫色
    height: '2px'
  }
}
