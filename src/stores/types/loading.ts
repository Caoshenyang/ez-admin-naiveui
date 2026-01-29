/**
 * Loading 状态类型定义
 */
export type LoadingKey = string

/**
 * Loading 状态集合
 */
export type LoadingState = Set<LoadingKey>

/**
 * Loading 配置选项
 */
export interface LoadingOptions {
  /**
   * Loading 唯一标识，用于区分不同的 loading 状态
   */
  key: LoadingKey

  /**
   * 是否全局加载（全屏 loading）
   * @default false
   */
  global?: boolean

  /**
   * 加载提示文本
   */
  text?: string
}
