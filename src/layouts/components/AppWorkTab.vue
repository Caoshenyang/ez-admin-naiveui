<script setup lang="ts">
import { computed, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NDropdown, NButton, NIcon, NSpace } from 'naive-ui'
import type { DropdownProps } from 'naive-ui'
import {
  CloseOutlined,
  MoreOutlined,
  LeftOutlined,
  RightOutlined,
  CloseCircleOutlined,
  ReloadOutlined
} from '@vicons/antd'
import { useLayoutStore } from '@/stores/modules/layout'
import type { TabItem } from '@/types/layout'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()

// 标签页列表
const tabs = computed(() => {
  return layoutStore.tabs.map((tab) => ({
    key: tab.path,
    label: tab.title,
    closable: !tab.affix
  }))
})

const activeKey = computed(() => layoutStore.activeTab) // 当前激活的标签页

// 标签页右键菜单选项（简化版：只保留刷新和关闭单个）
const getDropdownOptions = (key: string) => {
  const tab = layoutStore.tabs.find((t) => t.path === key)
  return [
    {
      label: '刷新',
      key: 'reload',
      icon: () => h(NIcon, null, { default: () => h(ReloadOutlined) })
    },
    {
      label: '关闭',
      key: 'close',
      disabled: tab?.affix,
      icon: () => h(NIcon, null, { default: () => h(CloseOutlined) })
    }
  ]
}

// 右侧操作下拉菜单选项（批量关闭操作）
const actionsDropdownOptions = computed(() => {
  const currentPath = route.path
  const currentIndex = layoutStore.tabs.findIndex((t) => t.path === currentPath)

  // 计算左侧可关闭的标签页数量（排除 affix 标签页）
  const leftTabs = layoutStore.tabs.slice(0, currentIndex)
  const closableLeftCount = leftTabs.filter((t) => !t.affix).length

  // 计算右侧可关闭的标签页数量
  const rightTabs = layoutStore.tabs.slice(currentIndex + 1)
  const closableRightCount = rightTabs.length

  // 计算可关闭的其他标签页数量
  const closableOtherCount = layoutStore.tabs.filter((t) => t.path !== currentPath && !t.affix).length

  return [
    {
      label: '关闭左侧',
      key: 'closeLeft',
      disabled: closableLeftCount === 0,
      icon: () => h(NIcon, null, { default: () => h(LeftOutlined) })
    },
    {
      label: '关闭右侧',
      key: 'closeRight',
      disabled: closableRightCount === 0,
      icon: () => h(NIcon, null, { default: () => h(RightOutlined) })
    },
    {
      label: '关闭其他',
      key: 'closeOther',
      disabled: closableOtherCount === 0,
      icon: () => h(NIcon, null, { default: () => h(CloseOutlined) })
    },
    {
      type: 'divider',
      key: 'd1'
    },
    {
      label: '关闭全部',
      key: 'closeAll',
      disabled: closableOtherCount === 0,
      icon: () => h(NIcon, null, { default: () => h(CloseCircleOutlined) })
    }
  ]
})

// 处理右键菜单选择（刷新、关闭单个）
const handleContextMenuSelect = (tabPath: string, action: string) => {
  switch (action) {
    case 'reload':
      router.go(0)
      break
    case 'close':
      layoutStore.removeTab(tabPath)
      if (tabPath === route.path && layoutStore.activeTab) {
        router.push(layoutStore.activeTab || '/')
      }
      break
  }
}

// 处理右侧操作菜单选择（批量关闭）
const handleActionSelect = (action: string) => {
  const currentPath = route.path

  switch (action) {
    case 'closeLeft':
      layoutStore.closeLeftTabs(currentPath)
      break
    case 'closeRight':
      layoutStore.closeRightTabs(currentPath)
      break
    case 'closeOther':
      layoutStore.closeOtherTabs(currentPath)
      break
    case 'closeAll':
      layoutStore.closeAllTabs()
      break
  }

  // 关闭后跳转到合适的页面
  if (layoutStore.activeTab && layoutStore.activeTab !== currentPath) {
    router.push(layoutStore.activeTab || '/')
  }
}

// 处理标签页切换
const handleTabClick = (path: string) => {
  layoutStore.setActiveTab(path)
  // 空字符串表示首页，需要转换为 '/' 进行路由跳转
  router.push(path || '/')
}

// 处理标签页关闭按钮点击
const handleClose = (path: string) => {
  layoutStore.removeTab(path)
  if (path === route.path && layoutStore.activeTab) {
    router.push(layoutStore.activeTab || '/')
  }
}

// 监听路由变化，自动添加标签页
watch(
  () => route.path,
  () => {
    // 过滤掉 hidden 的路由（如登录页）
    if (route.meta?.title && !route.meta?.hidden) {
      const tab: TabItem = {
        path: route.path,
        title: route.meta.title.toString(),
        name: String(route.name || ''),
        affix: Boolean(route.meta?.affix),
        query: route.query
      }
      layoutStore.addTab(tab)
    }
  },
  { immediate: true }
)

// 是否显示标签页
const showTabs = computed(() => layoutStore.showTabs && layoutStore.tabs.length > 0)

// 标签页样式类（提取为 computed，减少模板中的重复计算）
const getTabClass = (isActive: boolean) => {
  return [
    'flex items-center space-x-2 px-3 py-1.5 text-sm rounded-t-lg border transition-colors cursor-pointer group/tab',
    isActive
      ? 'bg-white border-slate-200 border-b-0 border-t-2 border-t-primary-500'
      : 'bg-slate-50 border-transparent hover:bg-slate-100 text-slate-700'
  ]
}
</script>

<template>
  <div v-if="showTabs" class="h-10 flex items-center px-2 shrink-0 border-b border-slate-200">
    <!-- 标签项列表 -->
    <n-space :size="4" class="flex-1 overflow-hidden">
      <n-dropdown
        v-for="tab in tabs"
        :key="tab.key"
        :options="getDropdownOptions(tab.key)"
        :trigger="'contextmenu' as DropdownProps['trigger']"
        placement="bottom-start"
        @select="(action: string) => handleContextMenuSelect(tab.key, action)"
      >
        <div :class="getTabClass(activeKey === tab.key)" @click="handleTabClick(tab.key)">
          <span class="whitespace-nowrap">{{ tab.label }}</span>
          <button
            v-if="tab.closable"
            class="w-4 h-4 rounded-full hover:bg-red-100 flex items-center justify-center opacity-0 group-hover/tab:opacity-100 transition-opacity"
            @click.stop="handleClose(tab.key)"
          >
            <span class="text-slate-400 opacity-60 hover:text-red-500 text-xs">×</span>
          </button>
        </div>
      </n-dropdown>
    </n-space>

    <!-- 右侧操作按钮 -->
    <n-space :size="0" align="center" class="ml-2 flex-shrink-0">
      <n-dropdown :options="actionsDropdownOptions" placement="bottom-end" @select="handleActionSelect" trigger="click">
        <n-button text size="small" class="h-7 w-7 px-0">
          <template #icon>
            <n-icon :size="16">
              <MoreOutlined />
            </n-icon>
          </template>
        </n-button>
      </n-dropdown>
    </n-space>
  </div>
</template>

