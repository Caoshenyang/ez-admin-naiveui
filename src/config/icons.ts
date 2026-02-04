/**
 * 图标映射配置
 * 将后端返回的图标名称映射到前端图标组件
 */
import {
  HomeOutline,
  DesktopOutline,
  SettingsOutline,
  PersonOutline,
  PeopleOutline,
  DocumentTextOutline,
  BarChartOutline,
  GridOutline,
  AnalyticsOutline,
  FileTrayOutline,
  StatsChartOutline,
  ListOutline,
  BuildOutline,
  LockClosedOutline,
  KeyOutline,
  ShieldCheckmarkOutline
} from '@vicons/ionicons5'

/**
 * 后端菜单图标名称 -> 前端图标组件映射
 * 后端返回字符串（如 "Home"），前端映射为对应组件
 */
export const iconMap: Record<string, any> = {
  // 首页相关
  Home: HomeOutline,
  Desktop: DesktopOutline,
  Dashboard: BarChartOutline,

  // 仪表盘相关
  Overview: GridOutline,
  Analytics: AnalyticsOutline,
  StatsChart: StatsChartOutline,
  FileTray: FileTrayOutline,

  // 系统管理相关
  Settings: SettingsOutline,
  System: SettingsOutline,
  Person: PersonOutline,
  User: PersonOutline,
  Group: PeopleOutline,
  Role: PeopleOutline,

  // 文档相关
  Document: DocumentTextOutline,
  List: ListOutline,

  // 工具相关
  Build: BuildOutline,
  LockClosed: LockClosedOutline,
  Key: KeyOutline,
  ShieldCheckmark: ShieldCheckmarkOutline
}

/**
 * 根据图标名称获取图标组件
 */
export function getIconComponent(iconName?: string) {
  return iconName ? iconMap[iconName] : undefined
}
