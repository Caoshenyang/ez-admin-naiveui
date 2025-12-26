<script setup lang="ts">
import { MenuWidthEnum, useSystemStore } from '@/stores/modules/system'

const systemStore = useSystemStore()
</script>
<template>
  <div class="h-screen w-full">
    <n-layout has-sider class="h-full w-full">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="MenuWidthEnum.CLOSE"
        :width="MenuWidthEnum.OPEN"
        :native-scrollbar="false"
        :collapsed="systemStore.isCollapse"
      >
        <AppLogo />
        <AppMenu />
      </n-layout-sider>
      <n-layout class="h-full w-full">
        <n-layout-header>
          <AppTopBar />
        </n-layout-header>
        <AppWorkTab />
        <n-layout-content class="px-6 py-1">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>
<style scoped lang="scss"></style>
