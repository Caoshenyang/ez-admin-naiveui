<template>
  <div class="flex items-center justify-between px-6 py-2">
    <!-- 标签页列表 -->
    <div class="flex gap-2 flex-1">
      <n-tag
        v-for="item in workTabList"
        :key="item.path"
        :type="item.path === activeTab ? 'success' : 'default'"
        class="work-tab-item cursor-pointer select-none transition-all duration-200 text-sm"
        :closable="!item.fixed"
        @click="changeTab(item.path)"
        @close="removeTab(item.path)"
      >
        {{ item.title }}
      </n-tag>
    </div>

    <!-- 操作按钮 -->
    <div class="shrink-0 ml-2 tab-actions">
      <n-dropdown
        :options="dropdownOptions"
        @select="handleClose"
        trigger="click"
        placement="bottom-end"
      >
        <n-button
          text
          size="small"
          class="action-btn w-8 h-8 rounded transition-all duration-200 hover:bg-gray-100"
        >
          <template #icon>
            <n-icon size="16">
              <MoreOutlined />
            </n-icon>
          </template>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/modules/user'
import { MoreOutlined } from '@vicons/antd'
import type { WorkTab } from '@/types'
import { ROUTE_PATHS } from '@/router'

const router = useRouter()
const route = useRoute()
const userStore = useUserInfoStore()

// 路由常量
const HOME_PAGE = ROUTE_PATHS.HOME

// 当前选中的标签
const activeTab = ref(route.path)

// 获取工作标签页列表（响应式）
const { workTabList } = storeToRefs(userStore)

// 下拉菜单选项
const dropdownOptions = [
  {
    label: '关闭左侧',
    key: 'closeLeft',
    icon: () => h('span', '⬅️'),
  },
  {
    label: '关闭右侧',
    key: 'closeRight',
    icon: () => h('span', '➡️'),
  },
  {
    label: '关闭其他',
    key: 'closeOthers',
    icon: () => h('span', '❌'),
  },
  {
    label: '关闭全部',
    key: 'closeAll',
    icon: () => h('span', '🔄'),
  },
]

/**
 * 切换标签
 * @param tabPath 切换标签路径
 */
const changeTab = (tabPath: string) => {
  activeTab.value = tabPath
  router.push(tabPath)
}

/**
 * 添加标签导航
 * @param tab 添加标签
 */
const addTab = (tab: WorkTab) => {
  // 检查是否已存在相同的标签页
  const existingTab = workTabList.value.find((t) => t.path === tab.path)
  if (!existingTab) {
    userStore.addWorkTab(tab)
  }
}

/**
 * 移除标签
 * @param tabPath 删除标签路径
 */
const removeTab = (tabPath: string) => {
  const tabs = [...workTabList.value]
  let newActiveTab = activeTab.value

  // 判断当前关闭的是否为当前选中的tab
  if (newActiveTab === tabPath) {
    tabs.forEach((tabItem, index) => {
      // 遍历寻找当前关闭的标签索引
      if (tabItem.path === tabPath) {
        // 将选中的标签标记为下一个或者前一个tab
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          newActiveTab = nextTab.path
        }
      }
    })
  }

  // 更新激活标签并跳转
  activeTab.value = newActiveTab
  userStore.removeWorkTab(tabPath)
  changeTab(newActiveTab)
}

/**
 * 关闭标签页操作
 * @param command 命令类型
 */
const handleClose = (command: string) => {
  const currentTab = activeTab.value
  const tabs = [...workTabList.value]
  const homeTab = { title: '首页', path: ROUTE_PATHS.HOME, fixed: true }
  switch (command) {
    case 'closeOthers':
      // 保留首页和当前激活页
      userStore.setWorkTabs(tabs.filter((tab) => tab.path === HOME_PAGE || tab.path === currentTab))
      break

    case 'closeAll':
      userStore.clearWorkTabs()
      changeTab(HOME_PAGE)
      break

    case 'closeLeft':
      if (!currentTab) return
      // 找到当前标签的索引
      const currentIndex = tabs.findIndex((tab) => tab.path === currentTab)
      if (currentIndex <= 0) return // 左侧无标签可关闭

      // 保留当前及右侧标签（如果首页在右侧，会自动保留）
      const remainingTabs = tabs.slice(currentIndex)
      userStore.setWorkTabs([homeTab, ...remainingTabs])
      break
    case 'closeRight':
      if (!currentTab) return
      // 找到当前标签的索引
      const rightIndex = tabs.findIndex((tab) => tab.path === currentTab)
      if (rightIndex === -1 || rightIndex === tabs.length - 1) return // 右侧无标签可关闭

      // 保留左侧及当前标签
      const leftTabs = tabs.slice(0, rightIndex + 1)
      userStore.setWorkTabs(leftTabs)
      break

    default:
      break
  }
}

// 监听路由变化，自动添加当前路由到标签页
watch(
  () => route.path,
  (newPath) => {
    activeTab.value = newPath
    addTab({
      title: (route.meta?.title as string) || '页面',
      path: newPath,
      fixed: newPath === HOME_PAGE, // 首页固定
    })
  },
  { immediate: true },
)
</script>

<style scoped lang="scss"></style>
