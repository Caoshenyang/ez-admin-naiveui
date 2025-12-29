<template>
  <div class="flex justify-end mb-4">
    <n-space size="small">
      <n-button
        v-for="button in visibleButtons"
        :key="button.key"
        :type="button.type"
        :size="button.size || 'small'"
        :disabled="button.disabled"
        :loading="button.loading"
        @click="handleClick(button)"
      >
        <template #icon v-if="button.icon">
          <n-icon :size="button.iconSize || 18">
            <component :is="button.icon" />
          </n-icon>
        </template>
        {{ button.text }}
      </n-button>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { computed, type Component } from 'vue'
import { useUserInfoStore } from '@/stores/modules/user'

export interface ActionButton {
  key: string
  text: string
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'default'
  size?: 'tiny' | 'small' | 'medium' | 'large'
  icon?: Component
  iconSize?: number
  disabled?: boolean
  loading?: boolean
  permission?: string // 权限标识，如果为空则始终显示
  onClick?: () => void
}

interface Props {
  buttons: ActionButton[]
}

const props = defineProps<Props>()

const userStore = useUserInfoStore()

// 根据权限过滤可见的按钮
const visibleButtons = computed(() => {
  const userPermissions = userStore.userInfo.permissions || []
  return props.buttons.filter(button => {
    // 如果没有设置权限标识，则始终显示
    if (!button.permission) return true
    // 检查用户是否有该权限
    return userPermissions.includes(button.permission)
  })
})

// 处理按钮点击
const handleClick = (button: ActionButton) => {
  if (button.onClick && !button.disabled && !button.loading) {
    button.onClick()
  }
}
</script>

<style lang="scss" scoped></style>
