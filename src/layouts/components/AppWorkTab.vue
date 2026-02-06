<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NTabs, NDropdown, type TabOption } from 'naive-ui'
import { useLayoutStore } from '@/stores/modules/layout'
import type { TabItem } from '@/types/layout'

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

// 处理标签页切换
const handleUpdateValue = (key: string) => {
  layoutStore.setActiveTab(key)
  router.push(key)
}

// 处理标签页关闭
const handleClose = (key: string) => {
  const tab = layoutStore.tabs.find(t => t.path === key)
  if (tab && !tab.affix) {
    layoutStore.removeTab(key)
    // 如果关闭的是当前标签页，跳转到最后一个标签页
    if (key === route.path && layoutStore.activeTab) {
      router.push(layoutStore.activeTab)
    }
  }
}

// 标签页右键菜单选项
const getDropdownOptions = (key: string) => {
  const tab = layoutStore.tabs.find(t => t.path === key)
  const options = [
    {
      label: '刷新',
      key: 'reload',
    },
    {
      label: '关闭',
      key: 'close',
      disabled: tab?.affix,
    },
  ]

  if (layoutStore.tabs.length > 1) {
    options.push(
      {
        label: '关闭其他',
        key: 'closeOther',
      },
      {
        label: '关闭左侧',
        key: 'closeLeft',
        disabled: layoutStore.tabs.indexOf(tab!) === 0,
      },
      {
        label: '关闭右侧',
        key: 'closeRight',
        disabled: layoutStore.tabs.indexOf(tab!) === layoutStore.tabs.length - 1,
      }
    )
  }

  options.push({
    label: '关闭全部',
    key: 'closeAll',
  })

  return options
}

// 处理右键菜单选择
const handleSelectDropdown = (key: string, optionKey: string) => {
  switch (optionKey) {
    case 'reload':
      router.go(0)
      break
    case 'close':
      layoutStore.removeTab(key)
      break
    case 'closeOther':
      layoutStore.closeOtherTabs(key)
      break
    case 'closeLeft':
      layoutStore.closeLeftTabs(key)
      break
    case 'closeRight':
      layoutStore.closeRightTabs(key)
      break
    case 'closeAll':
      layoutStore.closeAllTabs()
      break
  }

  // 关闭后跳转到合适的页面
  if (optionKey !== 'reload' && key === route.path && layoutStore.activeTab) {
    router.push(layoutStore.activeTab)
  }
}

// 监听路由变化，自动添加标签页
watch(
  () => route.path,
  (path) => {
    if (route.meta?.title) {
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

const showTabs = computed(() => layoutStore.showTabs && layoutStore.tabs.length > 0) // 是否显示标签页
</script>

<template>
  <div v-if="showTabs" class="h-10 bg-white dark:bg-[#0D1117] border-b border-slate-200 dark:border-[#30363D] flex items-center px-2 flex-shrink-0">
    <!-- 标签项列表 -->
    <div class="flex items-center space-x-1 flex-1 overflow-hidden">
      <n-dropdown
        v-for="tab in tabs"
        :key="tab.key"
        :options="getDropdownOptions(tab.key as string)"
        trigger="contextmenu"
        @select="(key: string) => handleSelectDropdown(tab.key as string, key)"
      >
        <div
          class="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-700 dark:text-[#C9D1D9] rounded-t-lg border transition-colors cursor-pointer group/tab"
          :class="
            activeKey === tab.key
              ? 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] border-b-0 border-t-2 border-t-blue-600 dark:border-t-[#A78BFA]'
              : 'bg-slate-50 dark:bg-[#0D1117] border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
          "
          @click="handleUpdateValue(tab.key as string)"
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
    <div class="flex items-center space-x-1 ml-2">
      <n-button
        text
        size="tiny"
        class="hover:bg-slate-50 dark:hover:bg-white/10 rounded px-2 py-1 transition-colors"
        @click="() => handleSelectDropdown('', 'closeAll')"
      >
        <template #icon>
          <span class="text-slate-400 opacity-60 text-sm">关闭全部</span>
        </template>
      </n-button>
    </div>
  </div>
</template>
