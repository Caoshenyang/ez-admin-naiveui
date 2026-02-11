<script setup lang="ts">
import { ref } from 'vue'
import { zhCN, dateZhCN } from '@/settings/naiveui-locale'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

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
