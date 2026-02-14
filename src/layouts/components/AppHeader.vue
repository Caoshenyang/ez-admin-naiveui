<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  SearchOutline,
  NotificationsOutline,
  SettingsOutline,
  LogOutOutline,
  ExpandOutline,
  ContractOutline,
  ReloadOutline,
  SunnyOutline,
  MoonOutline,
  PersonCircleOutline
} from '@vicons/ionicons5'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd'
import { useFullscreen } from '@vueuse/core'
import { NButton, NIcon, NSpace, NBadge, NDropdown, NAvatar } from 'naive-ui'
import { useLayoutStore } from '@/stores/modules/layout'
import { useUserStore } from '@/stores/modules/user'
import { useThemeStore } from '@/stores/modules/theme'
import { dialog, message } from '@/hooks/useNaiveApi'
import AppBreadcrumb from './AppBreadcrumb.vue'

const router = useRouter()
const layoutStore = useLayoutStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

// 图标渲染工具
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// ========== 主题切换 ==========
const themeIcon = computed(() => (themeStore.isDark ? MoonOutline : SunnyOutline))

// 使用全屏功能（VueUse）
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(document.documentElement)

// 全屏图标切换
const fullscreenIcon = computed(() => (isFullscreen.value ? ContractOutline : ExpandOutline))

// 折叠按钮图标（展开状态 → MenuFoldOutlined，折叠状态 → MenuUnfoldOutlined）
const sidebarToggleIcon = computed(() => (layoutStore.isSidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined))

// 切换侧边栏
const handleToggleSidebar = () => {
  layoutStore.toggleSidebar()
}

// 用户下拉菜单选项
const userDropdownOptions = computed(() => [
  {
    key: 'header',
    type: 'render',
    render: () =>
      h('div', { class: 'px-3 py-3' }, [
        h('div', { class: 'flex items-center gap-3' }, [
          h(NAvatar, {
            round: true,
            size: 'large',
            src: avatar.value || undefined,
            style: 'min-width: 40px;'
          }),
          h('div', { class: 'flex flex-col gap-0.5' }, [
            h(
              'div',
              { class: 'text-sm font-semibold text-slate-900 dark:text-slate-100' },
              username.value || '未知用户'
            ),
            h('div', { class: 'text-xs text-slate-500 dark:text-slate-400' }, '查看个人资料')
          ])
        ])
      ])
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
  { label: '个人中心', key: 'profile', icon: renderIcon(PersonCircleOutline) },
  { label: '设置', key: 'settings', icon: renderIcon(SettingsOutline) },
  { type: 'divider', key: 'divider' },
  { label: '退出登录', key: 'logout', icon: renderIcon(LogOutOutline) }
])

// 处理用户下拉菜单点击
const handleUserDropdownClick = (key: string) => {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
async function handleLogout() {
  dialog.warning({
    title: '退出登录',
    content: '确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await userStore.logout()
        message.success('已退出登录')
        router.push('/login')
      } catch {
        message.error('退出登录失败，请重试')
      }
    }
  })
}

const username = computed(() => userStore.username || 'Admin') // 用户名
const avatar = computed(() => userStore.avatar || '') // 头像

// 刷新当前页面
const handleRefresh = () => {
  // 强制组件重新加载（添加临时 query 参数触发路由变化）
  const route = router.currentRoute.value
  const query = { ...route.query, _t: Date.now() }
  router.replace({ query })
}

// 搜索功能（待实现）
const handleSearch = () => {
  console.log('Search')
}

// 通知功能（待实现）
const handleNotification = () => {
  console.log('Notification')
}
</script>

<template>
  <n-space justify="space-between" class="h-14 px-4 flex items-center">
    <!-- 左侧：折叠按钮 + 刷新按钮 + 面包屑 -->
    <n-space justify="space-between" :size="4" class="flex-1 min-w-0 items-center">
      <!-- 折叠按钮 -->
      <n-button quaternary circle size="small" :focusable="false" @click="handleToggleSidebar">
        <template #icon>
          <n-icon>
            <component :is="sidebarToggleIcon" />
          </n-icon>
        </template>
      </n-button>

      <!-- 刷新按钮 -->
      <n-button quaternary circle size="small" :focusable="false" @click="handleRefresh">
        <template #icon>
          <n-icon>
            <ReloadOutline />
          </n-icon>
        </template>
      </n-button>
      <!-- 面包屑 -->
      <app-breadcrumb />
    </n-space>

    <!-- 右侧：功能按钮 -->
    <n-space :size="12" class="items-center">
      <!-- 搜索框 -->
      <div
        class="flex h-8 items-center gap-2 px-3 text-slate-500 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
        @click="handleSearch"
      >
        <n-icon size="16">
          <SearchOutline />
        </n-icon>
        <input
          type="text"
          placeholder="搜索..."
          class="bg-transparent border-none outline-none text-sm placeholder-slate-400 w-32"
          readonly
        />
      </div>

      <!-- 通知按钮 -->
      <n-button quaternary circle size="small" :focusable="false" @click="handleNotification">
        <template #icon>
          <n-badge dot processing>
            <n-icon>
              <NotificationsOutline />
            </n-icon>
          </n-badge>
        </template>
      </n-button>

      <!-- 全屏切换 -->
      <n-button quaternary circle size="small" :focusable="false" @click="toggleFullscreen">
        <template #icon>
          <n-icon>
            <component :is="fullscreenIcon" />
          </n-icon>
        </template>
      </n-button>

      <!-- 主题切换 -->
      <n-button quaternary circle size="small" :focusable="false" @click="themeStore.toggleTheme">
        <template #icon>
          <n-icon>
            <component :is="themeIcon" />
          </n-icon>
        </template>
      </n-button>

      <!-- 用户下拉菜单 -->
      <n-dropdown
        :options="userDropdownOptions"
        @select="handleUserDropdownClick"
        trigger="click"
        placement="bottom-end"
        :style="{ minWidth: '200px' }"
      >
        <div
          class="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200"
        >
          <n-avatar
            round
            :size="32"
            :src="avatar || undefined"
            class="border-2 border-transparent hover:border-primary-500/30 transition-all duration-200"
          >
            {{ !avatar ? username.charAt(0).toUpperCase() : '' }}
          </n-avatar>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
            {{ username }}
          </span>
        </div>
      </n-dropdown>
    </n-space>
  </n-space>
</template>
