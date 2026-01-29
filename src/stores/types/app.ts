/**
 * 应用 Store 类型定义
 */

export type DeviceType = 'desktop' | 'mobile'

export interface AppState {
  sidebarOpened: boolean
  device: DeviceType
}
