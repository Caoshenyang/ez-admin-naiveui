<script setup lang="ts">
import { useSystemStore } from '@/stores/modules/system'
import { MenuFoldOutlined, MenuUnfoldOutlined, SyncOutlined } from '@vicons/antd'
import { MoonOutline, SunnyOutline } from '@vicons/ionicons5'

const systemStore = useSystemStore()

const refresh = () => {
  location.reload() // 强制浏览器刷新
}

// 暂时不需要自定义渲染，使用默认的下拉菜单渲染
</script>
<template>
  <div class="h-16 flex items-center justify-between">
    <!-- 左边部分 折叠按钮、刷新按钮、面包屑 -->
    <div class="flex items-center px-5">
      <n-button :focusable="false" quaternary size="small" @click="systemStore.switchFolding">
        <template #icon>
          <n-icon
            size="20"
            :component="systemStore.isCollapse ? MenuUnfoldOutlined : MenuFoldOutlined"
          />
        </template>
      </n-button>
      <n-button :focusable="false" quaternary size="small" class="group">
        <template #icon>
          <n-icon
            size="20"
            @click="refresh"
            :component="SyncOutlined"
            class="group-hover:rotate-180 transition-transform duration-500"
          />
        </template>
      </n-button>
      <!-- 面包屑 -->
      <div class="flex items-center px-2">
        <AppBreadcrumb />
      </div>
    </div>
    <!-- 右边部分 搜索、国际化、消息提醒、聊天、设置、黑夜模式、用户头像 -->
    <div class="flex items-center px-5 mr-4">
      <n-button :focusable="false" quaternary size="small" @click="systemStore.switchNight">
        <template #icon>
          <n-icon size="20" :component="systemStore.isNight ? MoonOutline : SunnyOutline" />
        </template>
      </n-button>

      <!-- 用户头像下拉菜单 -->
      <div class="flex items-center px-2">
        <n-avatar
          round
          :size="24"
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          class="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 transition-all duration-200"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
