<script setup lang="ts">
/**
 * 用户管理页面
 */
import { ref } from 'vue'

const loading = ref(false) // 加载状态
import router from '@/router'
// 去登录页
const handleLoginClick = async () => {
  console.log('🔘 按钮被点击了，准备跳转到登录页')
  console.log('当前路由:', router.currentRoute.value.path)

  try {
    const result = await router.push('/login')
    console.log('✅ router.push 成功，返回值:', result)
  } catch (error) {
    console.log('❌ router.push 失败，错误:', error)
  }

  console.log('📍 router.push 执行后，当前路由:', router.currentRoute.value.path)
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">用户管理</h1>
      <p class="text-slate-500 mt-2">管理系统用户信息、角色权限等</p>
    </div>

    <!-- 页面内容占位 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="text-center text-slate-400 py-12">
        <p>用户管理页面 - 待实现</p>
        <!-- 加个去登录页的按钮 -->
        <n-button type="primary" @click="handleLoginClick">去登录页</n-button>
      </div>
    </div>
  </div>
</template>
