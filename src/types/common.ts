// 路由元信息类型定义
export interface RouteMeta {
  // 页面标题
  title?: string;
  // 英文页面标题
  title_en?: string;
  // 是否缓存页面
  keepAlive?: boolean;
  // 是否需要权限检查
  requiresPermission?: boolean;
  // 需要的权限列表
  permissions?: string[];
  // 需要的角色列表
  roles?: string[];
  // 是否显示在侧边栏菜单中
  showInMenu?: boolean;
  // 菜单图标
  icon?: string;
  // 菜单排序
  order?: number;
  // 面包屑导航
  breadcrumb?: boolean;
}

// 工作标签页类型定义
export interface WorkTab {
  // 标签页标题
  title: string;
  // 标签页路径
  path: string;
  // 是否固定标签（不能关闭）
  fixed?: boolean;
}
