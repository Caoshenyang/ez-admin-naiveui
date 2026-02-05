/**
 * 图标库配置
 *
 * 说明：定义常用图标集合，供图标选择器使用
 * 图标来源：Material Design Icons (MDI)
 * 图标格式：iconify (mdi:xxx)
 */

/**
 * 图标项类型定义
 */
export interface IconItem {
  /** 图标名称 (iconify 格式) */
  name: string
  /** 图标标签（中文描述） */
  label: string
}

/**
 * 常用图标列表
 *
 * 分类说明：
 * - 导航/布局类：页面和布局相关图标
 * - 用户/权限类：用户账户和权限管理图标
 * - 操作类：CRUD 和常用操作图标
 * - 文件/文档类：文件类型和文档管理图标
 * - 设置/配置类：系统设置和配置图标
 * - 组织/系统管理类：组织架构和系统管理图标
 * - 数据/图表类：数据展示和图表图标
 * - 状态/提示类：状态提示和信息反馈图标
 * - 通讯/消息类：消息和通讯相关图标
 * - 导航/箭头类：方向和导航图标
 * - 其他常用：其他常用功能图标
 */
export const popularIcons: IconItem[] = [
  // ==================== 导航/布局类 ====================
  { name: 'mdi:home-outline', label: '首页' },
  { name: 'mdi:view-dashboard-outline', label: '仪表盘' },
  { name: 'mdi:view-grid-outline', label: '网格' },
  { name: 'mdi:view-list-outline', label: '列表' },
  { name: 'mdi:menu', label: '菜单' },
  { name: 'mdi:apps', label: '应用' },

  // ==================== 用户/权限类 ====================
  { name: 'mdi:account-outline', label: '用户' },
  { name: 'mdi:account-group-outline', label: '用户组' },
  { name: 'mdi:account-key-outline', label: '账户密钥' },
  { name: 'mdi:shield-account-outline', label: '账户权限' },
  { name: 'mdi:lock-outline', label: '锁定' },
  { name: 'mdi:lock-open-outline', label: '解锁' },
  { name: 'mdi:key-outline', label: '密钥' },
  { name: 'mdi:shield-outline', label: '权限' },

  // ==================== 操作类（CRUD） ====================
  { name: 'mdi:plus-circle-outline', label: '新增' },
  { name: 'mdi:pencil-outline', label: '编辑' },
  { name: 'mdi:delete-outline', label: '删除' },
  { name: 'mdi:check-circle-outline', label: '确认' },
  { name: 'mdi:close-circle-outline', label: '取消' },
  { name: 'mdi:magnify', label: '搜索' },
  { name: 'mdi:refresh', label: '刷新' },
  { name: 'mdi:download-outline', label: '下载' },
  { name: 'mdi:upload-outline', label: '上传' },
  { name: 'mdi:content-copy', label: '复制' },
  { name: 'mdi:content-save-outline', label: '保存' },

  // ==================== 文件/文档类 ====================
  { name: 'mdi:file-outline', label: '文件' },
  { name: 'mdi:file-document-outline', label: '文档' },
  { name: 'mdi:folder-outline', label: '文件夹' },
  { name: 'mdi:folder-open-outline', label: '打开文件夹' },
  { name: 'mdi:attachment', label: '附件' },
  { name: 'mdi:file-image-outline', label: '图片' },
  { name: 'mdi:file-excel-outline', label: 'Excel' },
  { name: 'mdi:file-pdf-box-outline', label: 'PDF' },

  // ==================== 设置/配置类 ====================
  { name: 'mdi:cog-outline', label: '设置' },
  { name: 'mdi:tune', label: '配置' },
  { name: 'mdi:toolbox-outline', label: '工具' },
  { name: 'mdi:wrench-outline', label: '维护' },
  { name: 'mdi:console', label: '控制台' },

  // ==================== 组织/系统管理类 ====================
  { name: 'mdi:office-building-outline', label: '部门管理' },
  { name: 'mdi:book-open-page-variant-outline', label: '字典管理' },

  // ==================== 数据/图表类 ====================
  { name: 'mdi:chart-line', label: '趋势图' },
  { name: 'mdi:chart-bar', label: '柱状图' },
  { name: 'mdi:chart-pie', label: '饼图' },
  { name: 'mdi:database-outline', label: '数据库' },
  { name: 'mdi:table-large', label: '数据表' },
  { name: 'mdi:analytics', label: '分析' },

  // ==================== 状态/提示类 ====================
  { name: 'mdi:alert-circle-outline', label: '错误' },
  { name: 'mdi:alert-outline', label: '警告' },
  { name: 'mdi:information-outline', label: '信息' },
  { name: 'mdi:help-circle-outline', label: '帮助' },
  { name: 'mdi:emoticon-happy-outline', label: '成功' },
  { name: 'mdi:loading', label: '加载中' },

  // ==================== 通讯/消息类 ====================
  { name: 'mdi:email-outline', label: '邮件' },
  { name: 'mdi:bell-outline', label: '通知' },
  { name: 'mdi:message-outline', label: '消息' },
  { name: 'mdi:chat-outline', label: '聊天' },

  // ==================== 导航/箭头类 ====================
  { name: 'mdi:arrow-left', label: '返回' },
  { name: 'mdi:arrow-right', label: '前进' },
  { name: 'mdi:arrow-up', label: '向上' },
  { name: 'mdi:arrow-down', label: '向下' },
  { name: 'mdi:chevron-left', label: '左箭头' },
  { name: 'mdi:chevron-right', label: '右箭头' },

  // ==================== 其他常用 ====================
  { name: 'mdi:star-outline', label: '收藏' },
  { name: 'mdi:heart-outline', label: '喜欢' },
  { name: 'mdi:eye-outline', label: '查看' },
  { name: 'mdi:eye-off-outline', label: '隐藏' },
  { name: 'mdi:share-variant-outline', label: '分享' },
  { name: 'mdi:printer', label: '打印' },
  { name: 'mdi:qrcode', label: '二维码' },
  { name: 'mdi:link', label: '链接' }
]

/**
 * 默认导出
 */
export default popularIcons
