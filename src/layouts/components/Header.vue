<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { NLayoutHeader, NButton, NDropdown, NIcon, NAvatar } from 'naive-ui'
import { MenuOutline, PersonOutline, LogOutOutline, MoonOutline, SunnyOutline } from '@vicons/ionicons5'

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const userInfo = computed(() => authStore.userInfo)
const themeIcon = computed(() => (appStore.theme === 'dark' ? MoonOutline : SunnyOutline))

const dropdownOptions = [
  {
    label: '个人中心',
    key: 'profile',
    icon: () => h(NIcon, null, { default: () => h(PersonOutline) })
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogOutOutline) })
  }
]

function toggleSidebar() {
  appStore.toggleSidebar()
}

function toggleTheme() {
  appStore.toggleTheme()
}

async function handleDropdownClick(key: string) {
  if (key === 'logout') {
    await authStore.logout()
  } else if (key === 'profile') {
    router.push('/profile')
  }
}
</script>

<template>
  <n-layout-header bordered class="app-header">
    <div class="header-left">
      <n-button quaternary circle @click="toggleSidebar">
        <template #icon>
          <n-icon><MenuOutline /></n-icon>
        </template>
      </n-button>
    </div>

    <div class="header-right">
      <n-button quaternary circle @click="toggleTheme">
        <template #icon>
          <n-icon :component="themeIcon" />
        </template>
      </n-button>

      <n-dropdown :options="dropdownOptions" @select="handleDropdownClick">
        <div class="user-info">
          <n-avatar round size="small" :src="userInfo?.avatar">
            {{ userInfo?.nickname?.charAt(0) || 'U' }}
          </n-avatar>
          <span class="username">{{ userInfo?.nickname || '用户' }}</span>
        </div>
      </n-dropdown>
    </div>
  </n-layout-header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: var(--n-color);
}

.username {
  font-size: 14px;
}
</style>
