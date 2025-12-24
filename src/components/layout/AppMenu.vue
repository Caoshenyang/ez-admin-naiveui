<template>
  <div class="app-menu">
    <n-menu
      :options="menuOptions"
      :collapsed="systemStore.isCollapse"
      :collapsed-width="MenuWidthEnum.CLOSE"
      :value="defaultMenuKey"
      @update:value="handleMenuSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { HomeOutlined } from '@vicons/antd'
import { Settings, Build } from '@vicons/ionicons5'
import { Person, People, Menu, Business, Book } from '@vicons/ionicons5'
import { useSystemStore, MenuWidthEnum } from '@/stores/modules/system'
import { useUserInfoStore } from '@/stores/modules/user'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { renderIcon } from '@/utils/icon'
import type { MenuTreeVO } from '@/types'
import type { MenuOption } from 'naive-ui'

const systemStore = useSystemStore()
const userStore = useUserInfoStore()
const router = useRouter()
const route = useRoute()

// 图标映射
const iconMap: Record<string, unknown> = {
  settings: Settings,
  tool: Build,
  person: Person,
  people: People,
  menu: Menu,
  'office-building': Business,
  book: Book,
}

// 获取默认图标
function getIcon(iconName?: string) {
  if (!iconName) return undefined
  const icon = iconMap[iconName]
  return icon ? renderIcon(icon) : undefined
}

// 递归转换菜单数据为 Naive UI 菜单格式
function convertMenu(menuList: MenuTreeVO[], parentPath = ''): MenuOption[] {
  return menuList
    .filter((menu) => menu.menuType !== 3) // 过滤掉按钮权限
    .sort((a, b) => (a.menuSort || 0) - (b.menuSort || 0)) // 按排序字段排序
    .map((menu) => {
      // 处理路由路径，拼接父节点路径
      let fullPath = menu.routePath || `/${menu.menuId}`
      if (parentPath && menu.routePath) {
        // 如果父路径存在且当前菜单有路由路径，进行拼接
        fullPath = `${parentPath}${menu.routePath}`
      } else if (parentPath && !menu.routePath) {
        // 如果父路径存在但当前菜单没有路由路径，使用父路径
        fullPath = parentPath
      }

      const menuOption: MenuOption = {
        label: menu.menuName,
        key: fullPath,
        icon: getIcon(menu.menuIcon),
      }

      // 只有目录类型（menuType = 1）才递归处理子节点，菜单类型（menuType = 2）不处理子节点
      if (menu.menuType === 1 && menu.children && menu.children.length > 0) {
        menuOption.children = convertMenu(menu.children, fullPath)
      }

      return menuOption
    })
}

// 计算菜单选项
const menuOptions = computed((): MenuOption[] => {
  const menus = userStore.menuList || []

  // 添加首页作为默认项
  const homeMenu: MenuOption = {
    label: '首页',
    key: '/home',
    icon: renderIcon(HomeOutlined),
  }

  return [homeMenu, ...convertMenu(menus, '')]
})

// 菜单高亮 key，与当前路由路径同步
const defaultMenuKey = computed(() => {
  return route.path
})

// 菜单点击事件
function handleMenuSelect(key: string) {
  router.push({ path: key })
}
</script>

<style scoped lang="scss"></style>
