export interface IconMeta {
  name: string
  label: string
  category: string
}

/**
 * 图标元数据配置
 * 用于图标选择器展示
 * 实际使用时可通过 Iconify API 动态获取
 */
export const ICON_SETS: IconMeta[] = [
  // 基础图标
  { name: 'mdi:home', label: '首页', category: '基础' },
  { name: 'mdi:dashboard', label: '仪表盘', category: '基础' },
  { name: 'mdi:view-dashboard', label: '面板', category: '基础' },

  // 系统管理
  { name: 'mdi:cog', label: '设置', category: '系统' },
  { name: 'mdi:account', label: '用户', category: '系统' },
  { name: 'mdi:shield-account', label: '角色', category: '系统' },
  { name: 'mdi:menu', label: '菜单', category: '系统' },
  { name: 'mdi:lock', label: '权限', category: '系统' },
  { name: 'mdi:database', label: '数据字典', category: '系统' },

  // 文件
  { name: 'mdi:file', label: '文件', category: '文件' },
  { name: 'mdi:folder', label: '文件夹', category: '文件' },
  { name: 'mdi:download', label: '下载', category: '文件' },
  { name: 'mdi:upload', label: '上传', category: '文件' },

  // 操作
  { name: 'mdi:pencil', label: '编辑', category: '操作' },
  { name: 'mdi:delete', label: '删除', category: '操作' },
  { name: 'mdi:plus', label: '添加', category: '操作' },
  { name: 'mdi:magnify', label: '搜索', category: '操作' },
  { name: 'mdi:content-save', label: '保存', category: '操作' },
  { name: 'mdi:refresh', label: '刷新', category: '操作' },

  // 界面
  { name: 'mdi:bell', label: '通知', category: '界面' },
  { name: 'mdi:message', label: '消息', category: '界面' },
  { name: 'mdi:help-circle', label: '帮助', category: '界面' },
  { name: 'mdi:information', label: '信息', category: '界面' },
  { name: 'mdi:alert-circle', label: '警告', category: '界面' },

  // 导航
  { name: 'mdi:arrow-left', label: '返回', category: '导航' },
  { name: 'mdi:arrow-right', label: '前进', category: '导航' },
  { name: 'mdi:arrow-up', label: '向上', category: '导航' },
  { name: 'mdi:arrow-down', label: '向下', category: '导航' },

  // 图表
  { name: 'mdi:chart-line', label: '折线图', category: '图表' },
  { name: 'mdi:chart-bar', label: '柱状图', category: '图表' },
  { name: 'mdi:chart-pie', label: '饼图', category: '图表' },

  // 其他
  { name: 'mdi:star', label: '收藏', category: '其他' },
  { name: 'mdi:heart', label: '喜欢', category: '其他' },
  { name: 'mdi:close', label: '关闭', category: '其他' },
  { name: 'mdi:check', label: '确认', category: '其他' },
]

/**
 * 按分类获取图标
 */
export function getIconsByCategory(category: string): IconMeta[] {
  return ICON_SETS.filter((icon) => icon.category === category)
}

/**
 * 获取所有分类
 */
export function getIconCategories(): string[] {
  return Array.from(new Set(ICON_SETS.map((icon) => icon.category)))
}

/**
 * 根据名称搜索图标
 */
export function searchIcons(keyword: string): IconMeta[] {
  const lowerKeyword = keyword.toLowerCase()
  return ICON_SETS.filter(
    (icon) =>
      icon.name.toLowerCase().includes(lowerKeyword) ||
      icon.label.toLowerCase().includes(lowerKeyword)
  )
}
