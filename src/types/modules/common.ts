// 通用类型定义

// 状态枚举
export enum StatusEnum {
  DISABLE = 0,
  ENABLE = 1
}

// 通用选项类型
export interface OptionItem {
  label: string
  value: string | number
  disabled?: boolean
}
