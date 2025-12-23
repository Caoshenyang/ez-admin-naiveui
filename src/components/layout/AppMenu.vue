<template>
  <div class="app-menu">
    <n-menu
      :options="menuOptions"
      :collapsed="systemStore.isCollapse"
      :collapsed-width="MenuWidthEnum.CLOSE"
      :default-value="defaultMenuKey"
      @update:value="handleMenuSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { HomeOutlined } from '@vicons/antd'
import { useSystemStore, MenuWidthEnum } from '@/stores/modules/system'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { renderIcon } from '@/utils/icon'

const systemStore = useSystemStore()
const router = useRouter()

// 一级菜单列表，这里只包含首页
const menuOptions = [
  {
    label: '首页',
    key: '/home',
    icon: renderIcon(HomeOutlined),
  },
]

const defaultMenuKey = ref('/home')

// 菜单点击事件
function handleMenuSelect(key: string) {
  if (key === '/home') {
    router.push({ path: '/home' })
  }
}
</script>

<style scoped lang="scss"></style>
