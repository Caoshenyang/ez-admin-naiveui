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
    <router-view />
  </n-config-provider>
</template>

<style scoped></style>
