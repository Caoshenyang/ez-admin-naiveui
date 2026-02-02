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

// 当前激活的标签页
const activeKey = computed(() => layoutStore.activeTab)

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

// 是否显示标签页
const showTabs = computed(() => layoutStore.showTabs && layoutStore.tabs.length > 0)
</script>

<template>
  <div v-if="showTabs" class="border-b border-gray-200 bg-white px-4">
    <n-tabs
      :value="activeKey"
      :tabs="tabs"
      type="card"
      size="small"
      @update:value="handleUpdateValue"
      @close="handleClose"
    >
      <template #prefix>
        <!-- 可选：左侧操作按钮 -->
      </template>
      <template #tab="{ tab, onClose }">
        <n-dropdown
          :options="getDropdownOptions(tab.key as string)"
          trigger="contextmenu"
          @select="(key: string) => handleSelectDropdown(tab.key as string, key)"
        >
          <div class="flex items-center space-x-2 px-1 cursor-pointer">
            <span>{{ tab.label }}</span>
          </div>
        </n-dropdown>
      </template>
    </n-tabs>
  </div>
</template>
