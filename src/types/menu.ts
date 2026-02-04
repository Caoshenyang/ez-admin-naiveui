/**
 * 菜单类型定义
 */
import type { Component } from 'vue'
import type { MenuTreeVO } from '@/stores/types/user'

/**
 * 后端菜单原始数据类型（复用已有类型）
 */
export type BackendMenu = MenuTreeVO

/**
 * 前端菜单配置类型（用于 NaiveUI 菜单组件）
 */
export interface FrontendMenuItem {
  /** 菜单唯一标识 */
  key: string
  /** 菜单显示名称 */
  label: string
  /** 菜单图标（Iconify 字符串或 Vue 组件） */
  icon?: string | Component
  /** 路由路径 */
  path?: string
  /** 是否隐藏 */
  hidden?: boolean
  /** 子菜单 */
  children?: FrontendMenuItem[]
  /** 外链地址 */
  url?: string
  /** 是否在当前窗口打开外链 */
  isTargetSelf?: boolean
  /** 路由名称 */
  name?: string
  /** 排序 */
  order?: number
}
