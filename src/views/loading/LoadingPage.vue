<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NSpin } from 'naive-ui'
import { useUserStore } from '@/stores/modules/user'
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import { convertMenusToRoutes } from '@/utils/route'
import { setHasGetInfo } from '@/router/permission'

const routerInstance = useRouter()
const route = useRoute()
const userStore = useUserStore()

onMounted(async () => {
  try {
    // 获取用户信息和菜单
    await userStore.getUserInfo()

    // 根据菜单动态生成路由
    const menus = userStore.userInfo?.menus || []
    const dynamicRoutes = convertMenusToRoutes(menus)

    // 动态添加路由到 Layout 的 children 中
    dynamicRoutes.forEach((routeConfig: RouteRecordRaw) => {
      router.addRoute('Layout', routeConfig)
    })

    // 标记已获取用户信息，避免重复加载
    setHasGetInfo(true)

    // 跳转到目标页面
    const redirect = (route.query.redirect as string) || '/'
    routerInstance.replace(redirect)
  } catch (error) {
    console.error('加载失败:', error)
    userStore.resetUserState()
    routerInstance.replace(`/login?redirect=${route.path}`)
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
    <div class="text-center">
      <NSpin size="large">
        <template #description>
          <p class="mt-6 text-slate-600 text-sm font-medium">正在加载资源，请稍候...</p>
        </template>
      </NSpin>
    </div>
  </div>
</template>
