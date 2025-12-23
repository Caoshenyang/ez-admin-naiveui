<script setup lang="ts">
import { AliwangwangFilled } from '@vicons/antd'
</script>

<template>
   <n-space>
    <n-button>Default</n-button>
    <n-button type="tertiary">
      Tertiary
    </n-button>
    <n-button type="primary">
      Primary
    </n-button>
    <n-button type="info">
      Info
    </n-button>
    <n-button type="success">
      Success
    </n-button>
    <n-button type="warning">
      Warning
    </n-button>
    <n-button type="error">
      Error
    </n-button>
  </n-space>

  <n-icon size="40">
    <AliwangwangFilled />
  </n-icon>
</template>

<style scoped></style>
