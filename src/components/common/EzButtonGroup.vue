<!--
  EzButtonGroup 操作按钮组组件
-->
<template>
  <!-- 按钮组容器，右对齐布局 -->
  <div class="flex items-center justify-center">
    <n-space size="small">
      <!-- 遍历可见按钮列表，渲染按钮 -->
      <n-button
        v-for="button in visibleButtons"
        :key="button.key"
        :type="button.type"
        :size="button.size || 'small'"
        :disabled="button.disabled"
        :loading="button.loading"
        @click="handleClick(button)"
      >
        <!-- 按钮图标，支持动态组件 -->
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

<!--
  操作按钮组组件脚本
-->
<script lang="ts" setup>
import { computed, type Component } from 'vue'
import { useUserInfoStore } from '@/stores/modules/user'

/**
 * 操作按钮配置接口
 * 通过emit事件触发，父组件根据key处理具体业务逻辑
 */
export interface ActionButton {
  key: string // 按钮唯一标识，用于事件分发
  text: string // 按钮显示文本
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'default' // 按钮类型
  size?: 'tiny' | 'small' | 'medium' | 'large' // 按钮尺寸
  icon?: Component // 按钮图标组件
  iconSize?: number // 图标尺寸，默认18px
  disabled?: boolean // 是否禁用
  loading?: boolean // 是否显示加载状态
  permission?: string // 权限标识，如果为空则始终显示
}

/**
 * 组件属性接口
 */
interface Props {
  buttons: ActionButton[] // 按钮配置数组
}

/**
 * 组件事件接口
 */
interface Emits {
  (e: 'action', key: string, button: ActionButton): void // 按钮点击事件，传递按钮key和完整按钮对象
}

// 定义组件属性和事件
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 获取用户权限信息，用于按钮权限控制
const userStore = useUserInfoStore()

/**
 * 根据用户权限过滤可见按钮
 * 没有设置权限标识的按钮始终显示
 */
const visibleButtons = computed(() => {
  const userPermissions = userStore.userInfo.permissions || []
  return props.buttons.filter((button) => {
    // 如果没有设置权限标识，则始终显示
    if (!button.permission) return true
    // 检查用户是否有该权限
    return userPermissions.includes(button.permission)
  })
})

/**
 * 处理按钮点击事件
 * 只有在按钮未禁用且未加载状态时才触发事件
 */
const handleClick = (button: ActionButton) => {
  if (!button.disabled && !button.loading) {
    emit('action', button.key, button)
  }
}
</script>

<style lang="scss" scoped></style>
