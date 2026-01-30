<script setup lang="ts">
import { ref } from 'vue'
import { lightTheme } from './settings/naiveui-theme'
import { zhCN, dateZhCN } from '@/settings/naiveui-locale'
import { useLoading } from '@/hooks/useLoading'
import EzLoadingBar from '@/components/EzLoadingBar.vue'

const theme = ref(lightTheme)

// 全局 Loading 状态
const { isGlobalLoading, loadingText } = useLoading()

// const toggleTheme = () => {
//   theme.value = theme.value === lightTheme ? darkTheme : lightTheme
// }
</script>

<template>
  <n-config-provider :theme-overrides="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <EzLoadingBar>
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
      </EzLoadingBar>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
