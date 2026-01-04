<script setup lang="ts">
import { ref, reactive } from 'vue'

 import { UserOutlined, LockOutlined } from '@vicons/antd'
import router, { ROUTE_PATHS } from '../../router'
import type { LoginDTO, UserInfoVO } from '@/types'
import { useUserInfoStore } from '@/stores/modules/user'
import type { FormRules } from 'naive-ui'
import { logger } from '@/hooks/useMessage'


// 登录表单数据
const loginFormData = reactive<LoginDTO>({
  username: 'admin',
  password: '123456',
})

// 登录表单ref
const loginFormRef = ref()

// 加载动画
const loading = ref(false)

// 获取用户信息缓存仓库
const userStore = useUserInfoStore()

// 表单验证规则
const rules = ref<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// 登录
const handleLogin = async () => {
  // 表单验证
  const valid = await loginFormRef.value?.validate()
  // 校验不成功直接 return
  if (!valid) {
    return false
  }
  // 校验成功进行后续操作
  // 1.加载 loading
  loading.value = true
  try {
    // 2.登录请求（基于Cookie/Session）
    await userStore.login(loginFormData)
    // 3.获取用户信息
    await userStore.getUserInfo()
    // 4.跳转到首页（由于权限守卫会处理路由加载，这里只需要跳转即可）
    await router.push(ROUTE_PATHS.HOME)
  } catch (error) {
    logger.error('登录失败:', error)
    // 登录失败时重置登录状态
    userStore.isLogin = false
    userStore.userInfo = {} as UserInfoVO
  } finally {
    // 验证结束，隐藏loading
    loading.value = false
  }
}
</script>

<template>
  <div class="h-screen">
    <n-grid class="h-full">
      <n-gi span="14">
        <div class="relative h-full bg-[url('../../images/login_bg.webp')] bg-center bg-cover bg-no-repeat">
          <span class="absolute top-5 left-5 text-2xl font-bold text-white">EZ-ADMIN</span>
          <span class="absolute bottom-30 left-1/2 -translate-x-1/2 text-xl text-nowrap text-white">
            相信自己我能行， 老天不会辜负你所付出的努力！
          </span>
        </div>
      </n-gi>
      <n-gi span="10">
        <div class="h-full flex flex-col items-center justify-center px-15">
          <div class="text-3xl font-bold text-black text-center">欢迎登录</div>
          <div class="w-full flex items-center justify-center flex-nowrap gap-1 my-5">
            <div class="w-16 h-px bg-slate-400"></div>
            <span class="text-nowrap text-slate-400">账号密码登录</span>
            <div class="w-16 h-px bg-slate-400"></div>
          </div>
          <!-- 表单 -->
          <n-form
            class="w-50 sm:w-50 md:w-75 lg:w-90"
            :show-label="false"
            ref="loginFormRef"
            :model="loginFormData"
            :rules="rules"
            size="large"
          >
            <n-form-item path="username">
              <n-input v-model:value="loginFormData.username" placeholder="请输入用户名">
                <template #prefix>
                  <n-icon :component="UserOutlined" class="text-slate-400" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="password">
              <n-input
                v-model:value="loginFormData.password"
                show-password-on="mousedown"
                type="password"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <n-icon :component="LockOutlined" class="text-slate-400" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item>
              <n-button block type="primary" size="large" :loading="loading" @click="handleLogin">登 录</n-button>
            </n-form-item>
          </n-form>
        </div>
      </n-gi>
    </n-grid>
  </div>
</template>

<style scoped lang="scss">
/* 登录页面样式 可按需扩展 */
</style>
