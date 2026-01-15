<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface IconImageConfig {
  type: 'image'
  src: string
  width?: number
  height?: number
}

type MenuIcon = string | IconImageConfig

interface Props {
  icon: MenuIcon
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 18,
})

const isImage = (icon: MenuIcon): icon is IconImageConfig => {
  return typeof icon === 'object' && icon.type === 'image'
}
</script>

<template>
  <div class="inline-flex h-full w-full items-center justify-center">
    <!-- Iconify 图标 -->
    <Icon
      v-if="typeof icon === 'string'"
      :icon="icon"
      :width="size"
      :height="size"
    />
    <!-- 自定义图片图标 -->
    <img
      v-else-if="isImage(icon)"
      :src="icon.src"
      :width="icon.width || size"
      :height="icon.height || size"
      alt="icon"
      class="object-contain"
    />
  </div>
</template>
