<script setup lang="ts">
import { computed, watch, onMounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NDropdown, NButton, NIcon } from 'naive-ui'
import {
  CloseOutlined,
  MoreOutlined,
  LeftOutlined,
  RightOutlined,
  CloseCircleOutlined,
  ReloadOutlined
} from '@vicons/antd'
import { useLayoutStore } from '@/stores/modules/layout'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()

// 标签页列表
const tabs = computed(() => {
  return layoutStore.tabs.map(tab => ({
    key: tab.path,
    label: tab.title,
    closable: !tab.affix,
  }))
})

const activeKey = computed(() => layoutStore.activeTab) // 当前激活的标签页

// 标签页右键菜单选项（简化版：只保留刷新和关闭单个）
const getDropdownOptions = (key: string) => {
  const tab = layoutStore.tabs.find(t => t.path === key)
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
  const currentIndex = layoutStore.tabs.findIndex(t => t.path === currentPath)

  // 计算左侧可关闭的标签页数量（排除 affix 标签页）
  const leftTabs = layoutStore.tabs.slice(0, currentIndex)
  const closableLeftCount = leftTabs.filter(t => !t.affix).length

  // 计算右侧可关闭的标签页数量
  const rightTabs = layoutStore.tabs.slice(currentIndex + 1)
  const closableRightCount = rightTabs.length

  // 计算可关闭的其他标签页数量
  const closableOtherCount = layoutStore.tabs.filter(t => t.path !== currentPath && !t.affix).length

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
        router.push(layoutStore.activeTab)
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
    router.push(layoutStore.activeTab)
  }
}

// 处理标签页切换
const handleTabClick = (path: string) => {
  layoutStore.setActiveTab(path)
  router.push(path)
}

// 处理标签页关闭按钮点击
const handleClose = (path: string) => {
  layoutStore.removeTab(path)
  if (path === route.path && layoutStore.activeTab) {
    router.push(layoutStore.activeTab)
  }
}

// 监听路由变化，自动添加标签页
watch(
  () => route.path,
  (path) => {
    // 过滤掉 hidden 的路由（如登录页）
    if (route.meta?.title && !route.meta?.hidden) {
      layoutStore.addTab({
        path,
        title: route.meta.title as string,
        name: route.name as string,
        affix: route.meta?.affix as boolean,
        query: route.query,
      })
    }
  },
  { immediate: true }
)

// 是否显示标签页
const showTabs = computed(() => layoutStore.showTabs && layoutStore.tabs.length > 0)

// 组件挂载时确保首页在第一位
onMounted(() => {
  layoutStore.ensureHomeFirst()
})
</script>

<template>
  <div v-if="showTabs" class="h-10 bg-white dark:bg-[#0D1117] border-b border-slate-200 dark:border-[#30363D] flex items-center px-2 flex-shrink-0">
    <!-- 标签项列表 -->
    <div class="flex items-center space-x-1 flex-1 overflow-hidden">
      <n-dropdown
        v-for="tab in tabs"
        :key="tab.key"
        :options="getDropdownOptions(tab.key as string)"
        :trigger="'contextmenu' as any"
        placement="bottom-start"
        @select="(action: string) => handleContextMenuSelect(tab.key as string, action)"
      >
        <div
          class="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-700 dark:text-[#C9D1D9] rounded-t-lg border transition-colors cursor-pointer group/tab"
          :class="
            activeKey === tab.key
              ? 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] border-b-0 border-t-2 border-t-blue-600 dark:border-t-[#A78BFA]'
              : 'bg-slate-50 dark:bg-[#0D1117] border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
          "
          @click="handleTabClick(tab.key as string)"
        >
          <span class="whitespace-nowrap">{{ tab.label }}</span>
          <button
            v-if="tab.closable"
            class="w-4 h-4 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center opacity-0 group-hover/tab:opacity-100 transition-opacity"
            @click.stop="handleClose(tab.key as string)"
          >
            <span class="text-slate-400 opacity-60 hover:text-red-500 text-xs">×</span>
          </button>
        </div>
      </n-dropdown>
    </div>

    <!-- 右侧操作按钮 -->
    <div class="flex items-center ml-2 flex-shrink-0">
      <n-dropdown :options="actionsDropdownOptions" placement="bottom-end" @select="handleActionSelect" trigger="click">
        <n-button text size="small" class="h-7 w-7 px-0 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all duration-200">
          <template #icon>
            <n-icon :size="16" class="text-slate-500 dark:text-slate-400">
              <MoreOutlined />
            </n-icon>
          </template>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>
