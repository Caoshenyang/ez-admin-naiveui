<script setup lang="ts">
import { ref } from 'vue'
import { lightTheme } from './settings/naiveui-theme'
import { zhCN, dateZhCN } from '@/settings/naiveui-locale'

const theme = ref(lightTheme)

// 全局 Loading 状态（预留接口，可用于特殊加载场景）
const isGlobalLoading = ref(false)
const loadingText = ref('加载中...')

// const toggleTheme = () => {
//   theme.value = theme.value === lightTheme ? darkTheme : lightTheme
// }
</script>

<template>
  <n-config-provider :theme-overrides="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <!-- 全局 Loading 遮罩 -->
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
