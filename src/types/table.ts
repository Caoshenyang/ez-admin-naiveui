/**
 * 表格工具栏配置
 */
export interface ToolbarConfig {
  /** 工具栏标题 */
  title?: string
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 是否显示全屏按钮 */
  showFullscreen?: boolean
  /** 刷新回调 */
  onRefresh?: () => void
  /** 左侧自定义内容 */
  left?: () => VNode | VNode[]
  /** 右侧自定义内容（按钮组之前） */
  right?: () => VNode | VNode[]
}
