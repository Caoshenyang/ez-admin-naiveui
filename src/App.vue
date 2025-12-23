<script setup lang="ts">
import { useSystemStore } from './stores/modules/system';


const systemStore = useSystemStore()

</script>

<template>
  <n-config-provider :theme="systemStore.getTheme">
       <RouterView />
   </n-config-provider>
</template>

<style scoped></style>
