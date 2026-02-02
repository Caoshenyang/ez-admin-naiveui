<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  NButton,
  NIcon,
  NBreadcrumb,
  NBreadcrumbItem,
  NDropdown,
  NAvatar,
  NText,
  NSpace,
} from 'naive-ui'
import {
  Menu,
  Person,
  LogOut,
  Settings,
  Moon,
  Sunny,
} from '@vicons/ionicons5'
import { useLayoutStore } from '@/stores/modules/layout'
import { useUserStore } from '@/stores/modules/user'

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
    icon: () => h(Person),
  },
  {
    label: '设置',
    key: 'settings',
    icon: () => h(Settings),
  },
  {
    type: 'divider',
    key: 'divider',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(LogOut),
  },
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
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 用户名
const username = computed(() => userStore.username || 'Admin')

// 头像
const avatar = computed(() => userStore.avatar || '')

// 是否显示面包屑
const showBreadcrumb = computed(() => layoutStore.showBreadcrumb)

// 面包屑（根据当前路由生成）
const breadcrumbs = computed(() => {
  const matched = router.currentRoute.value.matched.filter(
    item => item.meta && item.meta.title && !item.meta.hidden
  )
  return matched.map(item => ({
    name: item.meta?.title as string,
    path: item.path,
  }))
})

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
  <div class="h-16 flex items-center justify-between px-4">
    <!-- 左侧 -->
    <div class="flex items-center space-x-4">
      <!-- 折叠按钮 -->
      <n-button quaternary circle @click="handleToggleSidebar">
        <template #icon>
          <n-icon>
            <Menu />
          </n-icon>
        </template>
      </n-button>

      <!-- 面包屑 -->
      <n-breadcrumb v-if="showBreadcrumb">
        <n-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="item.path"
          @click="index < breadcrumbs.length - 1 && router.push(item.path)"
        >
          {{ item.name }}
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>

    <!-- 右侧 -->
    <n-space :size="12">
      <!-- 全屏切换 -->
      <n-button quaternary circle @click="handleToggleFullscreen">
        <template #icon>
          <n-icon>
            <Sunny />
          </n-icon>
        </template>
      </n-button>

      <!-- 主题切换 -->
      <n-button quaternary circle @click="handleToggleTheme">
        <template #icon>
          <n-icon>
            <Moon />
          </n-icon>
        </template>
      </n-button>

      <!-- 用户下拉菜单 -->
      <n-dropdown
        :options="userDropdownOptions"
        @select="handleUserDropdownClick"
      >
        <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
          <n-avatar
            v-if="avatar"
            round
            :size="32"
            :src="avatar"
          />
          <n-avatar
            v-else
            round
            :size="32"
            class="bg-blue-600"
          >
            {{ username.charAt(0).toUpperCase() }}
          </n-avatar>
          <n-text class="text-sm font-medium">{{ username }}</n-text>
        </div>
      </n-dropdown>
    </n-space>
  </div>
</template>
