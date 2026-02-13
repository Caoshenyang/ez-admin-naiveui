<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  SearchOutline,
  NotificationsOutline,
  PersonOutline,
  SettingsOutline,
  LogOutOutline,
  ExpandOutline,
  ContractOutline,
  RefreshOutline,
  SunnyOutline,
  MoonOutline
} from '@vicons/ionicons5'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd'
import { useFullscreen } from '@vueuse/core'
import { NLayoutHeader, NTooltip, NButton, NIcon, NSpace, NBadge, NDropdown, NAvatar, NEl } from 'naive-ui'
import { useLayoutStore } from '@/stores/modules/layout'
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'
import { useThemeStore } from '@/stores/modules/theme'
import { dialog, message } from '@/hooks/useNaiveApi'
import AppBreadcrumb from './AppBreadcrumb.vue'

const router = useRouter()
const layoutStore = useLayoutStore()
const userStore = useUserStore()
const appStore = useAppStore()
const themeStore = useThemeStore()

// ========== 主题切换 ==========
const themeIcon = computed(() => (themeStore.isDark ? MoonOutline : SunnyOutline))
const themeTooltip = computed(() => (themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式'))

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
    label: '个人中心',
    key: 'profile',
    icon: () => h(PersonOutline)
  },
  {
    label: '设置',
    key: 'settings',
    icon: () => h(SettingsOutline)
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(LogOutOutline)
  }
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

// 搜索功能（待实现）
const handleSearch = () => {
  console.log('Search')
}

// 刷新当前页面
const handleRefresh = () => {
  // 强制组件重新加载（添加临时 query 参数触发路由变化）
  const route = router.currentRoute.value
  const query = { ...route.query, _t: Date.now() }
  router.replace({ query })
}

// 通知功能（待实现）
const handleNotification = () => {
  console.log('Notification')
}
</script>

<template>
  <n-layout-header
    bordered
    class="h-14 px-4 flex items-center justify-between bg-white border-b border-slate-200 shrink-0"
  >
    <!-- 左侧：折叠按钮 + 刷新按钮 + 面包屑 -->
    <n-space :size="4" class="flex-1 min-w-0">
      <!-- 折叠按钮 -->
      <n-tooltip placement="bottom">
        <template #trigger>
          <n-button quaternary circle size="small" :focusable="false" @click="handleToggleSidebar">
            <template #icon>
              <n-icon>
                <component :is="sidebarToggleIcon" />
              </n-icon>
            </template>
          </n-button>
        </template>
        {{ layoutStore.isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏' }}
      </n-tooltip>

      <!-- 刷新按钮 -->
      <n-tooltip placement="bottom">
        <template #trigger>
          <n-button quaternary circle size="small" :focusable="false" @click="handleRefresh">
            <template #icon>
              <n-icon>
                <RefreshOutline />
              </n-icon>
            </template>
          </n-button>
        </template>
        刷新当前页面
      </n-tooltip>

      <!-- 面包屑 -->
      <app-breadcrumb />
    </n-space>

    <!-- 右侧：功能按钮 -->
    <n-space :size="8" class="items-center">
      <!-- 搜索框（Tailwind 响应式：平板及以上显示） -->
      <n-space
        :size="8"
        class="hidden md:flex h-8 px-3 text-slate-700 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        @click="handleSearch"
      >
        <n-icon class="text-slate-400 opacity-60">
          <SearchOutline />
        </n-icon>
        <n-el
          tag="input"
          type="text"
          placeholder="搜索..."
          class="bg-transparent border-none outline-none text-sm placeholder-slate-400 w-32 lg:w-40"
          readonly
        />
      </n-space>

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
      <n-tooltip placement="bottom">
        <template #trigger>
          <n-button quaternary circle size="small" :focusable="false" @click="toggleFullscreen">
            <template #icon>
              <n-icon>
                <component :is="fullscreenIcon" />
              </n-icon>
            </template>
          </n-button>
        </template>
        {{ isFullscreen ? '退出全屏' : '全屏' }}
      </n-tooltip>

      <!-- 主题切换 -->
      <n-tooltip placement="bottom">
        <template #trigger>
          <n-button quaternary circle size="small" :focusable="false" :aria-label="themeTooltip" @click="themeStore.toggleTheme">
            <template #icon>
              <n-icon>
                <component :is="themeIcon" />
              </n-icon>
            </template>
          </n-button>
        </template>
        {{ themeTooltip }}
      </n-tooltip>

      <!-- 用户下拉菜单 -->
      <n-dropdown :options="userDropdownOptions" @select="handleUserDropdownClick">
        <n-space
          :size="8"
          class="h-8 px-3 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <n-avatar v-if="avatar" round :size="28" :src="avatar" />
          <n-avatar v-else round :size="28" class="bg-blue-600">
            {{ username.charAt(0).toUpperCase() }}
          </n-avatar>
          <n-el tag="span" class="text-sm font-medium hidden lg:block">
            {{ username }}
          </n-el>
        </n-space>
      </n-dropdown>
    </n-space>
  </n-layout-header>
</template>
