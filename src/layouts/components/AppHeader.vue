<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { NLayoutHeader, NButton, NIcon, NBreadcrumb, NBreadcrumbItem, NDropdown, NAvatar, NSpace } from 'naive-ui'
import { MenuOutline, SearchOutline, NotificationsOutline, PersonOutline, SettingsOutline, LogOutOutline } from '@vicons/ionicons5'
import { useLayoutStore } from '@/stores/modules/layout'
import { useUserStore } from '@/stores/modules/user'
import { dialog, message } from '@/hooks/useNaiveApi'

const router = useRouter()
const layoutStore = useLayoutStore()
const userStore = useUserStore()

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
const showBreadcrumb = computed(() => layoutStore.showBreadcrumb) // 是否显示面包屑

// 面包屑（根据当前路由生成）
const breadcrumbs = computed(() => {
  const matched = router.currentRoute.value.matched.filter((item) => item.meta && item.meta.title && !item.meta.hidden)
  return matched.map((item) => ({
    name: item.meta?.title as string,
    path: item.path
  }))
})

// 搜索功能（待实现）
const handleSearch = () => {
  console.log('Search')
}

// 通知功能（待实现）
const handleNotification = () => {
  console.log('Notification')
}

// 主题切换（待实现）
const handleToggleTheme = () => {
  console.log('Toggle theme')
}

// 全屏切换（待实现）
const handleToggleFullscreen = () => {
  console.log('Toggle fullscreen')
}
</script>

<template>
  <n-layout-header bordered class="h-14 px-4 flex items-center justify-between bg-white border-b border-slate-200 flex-shrink-0">
    <!-- 左侧：折叠按钮 + 面包屑 -->
    <div class="flex items-center space-x-4 flex-1 min-w-0">
      <!-- 折叠按钮 -->
      <n-button quaternary circle size="small" class="hover:bg-slate-50 transition-colors flex-shrink-0" @click="handleToggleSidebar">
        <template #icon>
          <n-icon>
            <MenuOutline />
          </n-icon>
        </template>
      </n-button>

      <!-- 面包屑 -->
      <n-breadcrumb v-if="showBreadcrumb" class="text-sm flex-1">
        <n-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="item.path"
          class="cursor-pointer hover:text-blue-600 transition-colors"
          @click="index < breadcrumbs.length - 1 && router.push(item.path)"
        >
          {{ item.name }}
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>

    <!-- 右侧：功能按钮 -->
    <n-space :size="8">
      <!-- 搜索框（Tailwind 响应式：平板及以上显示） -->
      <div class="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer" @click="handleSearch">
        <n-icon class="text-slate-400">
          <SearchOutline />
        </n-icon>
        <input
          type="text"
          placeholder="搜索..."
          class="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-32 lg:w-40"
          readonly
        />
      </div>

      <!-- 通知按钮 -->
      <n-button quaternary circle size="small" class="relative hover:bg-slate-50 transition-colors" @click="handleNotification">
        <template #icon>
          <n-icon>
            <NotificationsOutline />
          </n-icon>
        </template>
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </n-button>

      <!-- 主题切换 -->
      <n-button quaternary circle size="small" class="hover:bg-slate-50 transition-colors" @click="handleToggleTheme">
        <template #icon>
          <n-icon>
            <MenuOutline />
          </n-icon>
        </template>
      </n-button>

      <!-- 用户下拉菜单 -->
      <n-dropdown :options="userDropdownOptions" @select="handleUserDropdownClick">
        <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          <n-avatar v-if="avatar" round :size="28" :src="avatar" />
          <n-avatar v-else round :size="28" class="bg-blue-600">
            {{ username.charAt(0).toUpperCase() }}
          </n-avatar>
          <span class="text-sm font-medium text-slate-700 hidden lg:block">
            {{ username }}
          </span>
        </div>
      </n-dropdown>
    </n-space>
  </n-layout-header>
</template>
