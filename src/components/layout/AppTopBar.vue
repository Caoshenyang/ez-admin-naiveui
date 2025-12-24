<script setup lang="ts">
import router from '@/router'
import { useSystemStore } from '@/stores/modules/system'
import { useUserInfoStore } from '@/stores/modules/user'
import { renderIcon } from '@/utils/icon'
import { MenuFoldOutlined, MenuUnfoldOutlined, SyncOutlined } from '@vicons/antd'
import { MoonOutline, SunnyOutline, PersonCircleOutline, LogOutOutline } from '@vicons/ionicons5'
import { NAvatar, NText } from 'naive-ui'
import { h } from 'vue'

const systemStore = useSystemStore()
const userStore = useUserInfoStore()

const refresh = () => {
  location.reload() // 强制浏览器刷新
}

function renderCustomHeader() {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;',
    },
    [
      h(NAvatar, {
        round: true,
        style: 'margin-right: 12px;',
        src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG',
      }),
      h('div', null, [
        h('div', null, [
          h(
            NText,
            { depth: 2 },
            { default: () => `昵称：${userStore.userInfo.nickname || '未知'}` },
          ),
        ]),
        h('div', { style: 'font-size: 12px;' }, [
          h(
            NText,
            { depth: 3 },
            { default: () => `用户名：${userStore.userInfo.username || '未知'}` },
          ),
        ]),
      ]),
    ],
  )
}

const options = [
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader,
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: '用户资料',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline),
  },
]

function handleSelect(key: string) {
  switch (key) {
    case 'profile':
      // 跳转到用户详情页（比如 /profile，具体路由视项目而定）
      router.push({ path: '/profile' })
      break
    case 'logout':
      // 发起登出请求
      userStore.logout()
      break
    default:
      break
  }
}
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
        <n-dropdown
          :show-arrow="true"
          @select="handleSelect"
          placement="bottom-start"
          :options="options"
        >
          <n-avatar
            round
            :size="24"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            class="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 transition-all duration-200"
          />
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
