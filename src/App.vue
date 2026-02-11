<script setup lang="ts">
import { ref, watch } from 'vue'
import { zhCN, dateZhCN } from '@/settings/naiveui-locale'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

// 初始化时同步主题状态到 HTML class（刷新页面后保持主题）
watch(
  () => appStore.isDark,
  (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  { immediate: true } // 立即执行一次，确保刷新页面后状态正确
)

// 全局 Loading 状态（预留接口，可用于特殊加载场景）
const isGlobalLoading = ref(false)
const loadingText = ref('加载中...')
</script>

<template>
  <n-config-provider
    :theme="appStore.naiveTheme"
    :theme-overrides="appStore.themeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <n-spin :show="isGlobalLoading" :description="loadingText">
              <router-view />
            </n-spin>
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
