<script setup lang="ts">
import { ref } from 'vue'
import { zhCN, dateZhCN } from '@/settings/naiveui-locale'
import { useTheme } from '@/hooks/useTheme'

// 使用主题 Hook
const { theme, themeOverrides } = useTheme()

// 全局 Loading 状态（预留接口，可用于特殊加载场景）
const isGlobalLoading = ref(false)
const loadingText = ref('加载中...')
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <!-- 全局 Loading 遮罩 -->
            <n-spin :show="isGlobalLoading" :description="loadingText">
              <n-global-style />
              <router-view />
            </n-spin>
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
