<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NLayoutContent } from 'naive-ui'

const route = useRoute()

const keepAlive = computed(() => route.meta?.keepAlive)
</script>

<template>
  <n-layout-content class="app-main" :native-scrollbar="false">
    <router-view v-slot="{ Component }">
      <keep-alive v-if="keepAlive">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
      <component v-else :is="Component" :key="route.fullPath" />
    </router-view>
  </n-layout-content>
</template>
