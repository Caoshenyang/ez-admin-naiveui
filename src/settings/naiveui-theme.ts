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
 * 暗色主题配置（现代优雅风格）
 *
 * 设计理念: 参考GitHub、VS Code、Linear等现代应用的暗色模式
 * - 侧边栏: 深灰蓝 (#0D1117) - GitHub暗色风格
 * - 内容区: 柔和深灰 (#161B22) - 减少眼疲劳
 * - 卡片: 略浅层次 (#21262D) - 清晰的视觉层次
 * - 主色调: 电光紫 (#A78BFA) - 暗色下更醒目
 *
 * 优化重点:
 * - 提高文字对比度，确保可读性
 * - 增加微妙的光泽感和层次感
 * - 柔和的深色背景，避免纯黑
 * - 强化交互状态的视觉反馈
 */
export const darkTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#A78BFA', // 电光紫（暗色模式下更醒目，类似 VS Code）
    primaryColorHover: '#C4B5FD',
    primaryColorPressed: '#8B5CF6',
    primaryColorSuppl: '#A78BFA',

    successColor: '#34D399', // 翠绿（暗色下更清晰）
    successColorHover: '#6EE7B7',
    successColorPressed: '#10B981',
    successColorSuppl: '#34D399',

    warningColor: '#FBBF24', // 琥珀金（比橙色更温暖）
    warningColorHover: '#FCD34D',
    warningColorPressed: '#F59E0B',
    warningColorSuppl: '#FBBF24',

    errorColor: '#F87171', // 柔和红（避免过于刺眼）
    errorColorHover: '#FCA5A5',
    errorColorPressed: '#EF4444',
    errorColorSuppl: '#F87171',

    infoColor: '#60A5FA', // 天空蓝
    infoColorHover: '#93C5FD',
    infoColorPressed: '#3B82F6',
    infoColorSuppl: '#60A5FA',

    // 文字颜色（提高对比度）
    textColorBase: '#E2E8F0', // 基础文字更亮
    textColor1: '#FFFFFF', // 标题纯白（最高对比度）
    textColor2: '#E2E8F0', // 正文清晰可读
    textColor3: '#94A3B8', // 次要文字

    borderColor: '#30363D', // GitHub暗色边框
    dividerColor: '#21262D', // 更明显的分隔线

    bodyColor: '#0D1117', // GitHub暗色背景
    cardColor: '#161B22', // 柔和深灰
    modalColor: '#161B22',
    popoverColor: '#161B22',

    borderRadius: '10px',
    borderRadiusSmall: '6px',

    boxShadow1: '0 1px 3px 0 rgb(0 0 0 / 0.5)',
    boxShadow2: '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
    boxShadow3: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)'
  },

  // 布局组件（暗色主题）
  Layout: {
    color: '#0D1117', // GitHub深色背景
    siderColor: '#010409', // 极深侧边栏（接近纯黑但有层次）
    headerColor: '#161B22', // 统一的卡片色
    footerColor: '#161B22',
    textColor: '#8B949E', // GitHub次要文字
    textColorChild: '#6E7681', // 更浅的子项
    textColorHover: '#C9D1D9', // GitHub hover色
    dividerColor: 'rgba(48, 54, 61, 0.5)' // 更明显的分隔线
  },

  // 菜单组件（暗色主题）
  Menu: {
    itemTextColor: '#C9D1D9', // GitHub菜单文字
    itemTextColorHover: '#FFFFFF', // hover纯白
    itemTextColorActive: '#FFFFFF', // active纯白
    itemTextColorChildActive: '#A78BFA', // 电光紫高亮
    itemIconColor: '#8B949E', // GitHub图标色
    itemIconColorHover: '#C4B5FD', // 电光紫hover
    itemIconColorActive: '#A78BFA', // 电光紫active
    itemIconColorChildActive: '#A78BFA', // 子菜单激活时父节点高亮
    itemColorActive: 'rgba(167, 139, 250, 0.15)', // 电光紫半透明背景（增强）
    itemColorHover: 'rgba(255, 255, 255, 0.08)', // 更明显的hover效果
    arrowColor: '#8B949E',
    arrowColorHover: '#C9D1D9',
    arrowColorChildActive: '#A78BFA',
    dividerColor: 'rgba(48, 54, 61, 0.5)'
  },

  // 标签页（暗色）
  Tabs: {
    tabTextColorBar: '#8B949E',
    tabTextColorActiveBar: '#A78BFA', // 电光紫
    tabTextColorHoverBar: '#C9D1D9',
    tabBarColor: '#21262D',
    tabColorBar: '#0D1117',
    tabColorSegment: '#161B22',
    tabColorSegmentActive: '#0D1117',
    tabTextColorSegment: '#8B949E',
    tabTextColorActiveSegment: '#A78BFA',
    tabGap: '12px',
    tabPaddingLarge: '12px 16px'
  },

  // 按钮（暗色）
  Button: {
    textColor: '#C9D1D9', // GitHub按钮文字
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
    color: '#0D1117', // 输入框背景
    colorFocus: '#0D1117',
    textColor: '#C9D1D9', // GitHub输入框文字
    placeholderColor: '#6E7681', // GitHub占位符
    border: '1px solid #30363D',
    borderHover: '1px solid #8B949E',
    borderFocus: '1px solid #A78BFA',
    boxShadowFocus: '0 0 0 3px rgba(167, 139, 250, 0.2)', // 增强焦点效果
    colorDisabled: '#161B22',
    textColorDisabled: '#6E7681',
    borderDisabled: '1px solid #21262D',
    placeholderColorDisabled: '#484F58',
    colorActive: '#0D1117',
    borderRadius: '8px'
  },

  // 表格（暗色）
  DataTable: {
    thColor: '#161B22', // 表头与卡片统一
    thTextColor: '#C9D1D9',
    thFontWeight: '600',
    tdColor: '#0D1117', // 单元格与背景统一
    tdTextColor: '#C9D1D9',
    tdTextColorHover: '#FFFFFF',
    borderColor: '#21262D',
    borderRadius: '10px',
    thPadding: '12px 16px',
    tdPadding: '12px 16px'
  },

  // 卡片（暗色）
  Card: {
    color: '#161B22', // 统一卡片色
    colorModal: '#161B22',
    colorTarget: '#0D1117',
    colorEmbedded: '#161B22',
    colorEmbeddedModal: '#161B22',
    borderColor: '#30363D',
    borderRadius: '12px'
  },

  // 弹窗（暗色）
  Modal: {
    color: '#161B22',
    textColor: '#C9D1D9',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.7)' // 更深的阴影
  },

  // 下拉菜单（暗色）
  Dropdown: {
    color: '#161B22',
    optionColorHover: '#21262D',
    optionTextColor: '#C9D1D9',
    optionTextColorHover: '#A78BFA', // 电光紫高亮
    optionIconColor: '#8B949E',
    optionIconColorHover: '#A78BFA',
    dividerColor: '#30363D',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.6), 0 4px 6px -4px rgb(0 0 0 / 0.6)',
    padding: '8px'
  },

  // 通知（暗色）
  Notification: {
    color: '#161B22',
    textColor: '#C9D1D9',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.6)'
  },

  // 消息提示（暗色）
  Message: {
    color: '#161B22',
    textColor: '#C9D1D9',
    borderRadius: '8px',
    iconColor: '#8B949E',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.6)'
  },

  // 工具提示（暗色）
  Tooltip: {
    color: '#161B22',
    textColor: '#C9D1D9',
    borderRadius: '8px',
    fontSize: '13px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.6)'
  },

  // 加载条（暗色）
  LoadingBar: {
    color: '#A78BFA', // 电光紫
    colorError: '#F87171', // 柔和红
    colorLoading: '#A78BFA',
    height: '2px'
  }
}
