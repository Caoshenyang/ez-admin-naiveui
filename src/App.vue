<script setup lang="ts">
import { lightTheme } from './settings/naiveui-theme'
import { zhCN, dateZhCN } from '@/settings/naiveui-locale'

const theme = ref(lightTheme)

// const toggleTheme = () => {
//   theme.value = theme.value === lightTheme ? darkTheme : lightTheme
// }
</script>

<template>
  <n-config-provider :theme-overrides="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
