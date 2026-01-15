<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useSystemStore } from '@/stores/modules/system'
import { renderIcon } from '@/utils/icon'

const router = useRouter()
const route = useRoute()
const systemStore = useSystemStore()

const isFullscreen = ref(false)
const isRefreshing = ref(false)

const matchedRoutes = computed(() => {
  return route.matched.filter((item) => item.meta?.title)
})

function handleToggle() {
  systemStore.toggleCollapse()
}

function handleRefresh() {
  isRefreshing.value = true
  router.go(0)
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

function handleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function handleLogout() {
  console.log('退出登录')
  // TODO: 实现退出登录逻辑
}

const userOptions = [
  {
    label: '个人中心',
    key: 'profile',
    icon: renderIcon('mdi:user', 18),
  },
  {
    label: '设置',
    key: 'settings',
    icon: renderIcon('mdi:cog', 18),
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('mdi:logout', 18),
  },
]

function handleUserAction(key: string) {
  if (key === 'logout') {
    handleLogout()
  } else if (key === 'profile') {
    router.push('/profile')
  } else if (key === 'settings') {
    router.push('/settings')
  }
}
</script>

<template>
  <div class="flex h-16 items-center justify-between border-b border-gray-200 px-6">
    <!-- 左侧：折叠按钮 + 刷新按钮 + 面包屑 -->
    <div class="flex items-center gap-1">
      <n-button quaternary size="small" @click="handleToggle">
        <template #icon>
          <EzIconRender :icon="systemStore.isCollapse ? 'ep:expand' : 'ep:fold'" :size="20" />
        </template>
      </n-button>
      <n-button quaternary size="small" :loading="isRefreshing" @click="handleRefresh">
        <template #icon>
          <EzIconRender icon="mdi:refresh" :size="20" />
        </template>
      </n-button>
      <n-breadcrumb>
        <n-breadcrumb-item v-for="item in matchedRoutes" :key="item.path">
          {{ item.meta.title }}
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>

    <!-- 右侧：全屏 + 用户下拉菜单 -->
    <div class="flex items-center gap-4">
      <n-button quaternary circle size="small" @click="handleFullscreen">
        <template #icon>
          <EzIconRender :icon="isFullscreen ? 'ep:aim' : 'ep:full-screen'" :size="20" />
        </template>
      </n-button>

      <n-dropdown :options="userOptions" @select="handleUserAction">
        <div class="flex cursor-pointer items-center gap-2">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="avatar"
            class="h-8 w-8 rounded-full bg-primary object-cover"
          />
          <span class="text-sm text-gray-700">Admin</span>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>
