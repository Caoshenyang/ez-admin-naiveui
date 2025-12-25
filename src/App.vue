<script setup lang="ts">
import { useSystemStore } from './stores/modules/system';
import { zhCN, dateZhCN } from 'naive-ui'

const systemStore = useSystemStore()

</script>

<template>
  <n-config-provider :theme="systemStore.getTheme" :locale="zhCN" :date-locale="dateZhCN">
       <RouterView />
   </n-config-provider>
</template>

<style scoped></style>
