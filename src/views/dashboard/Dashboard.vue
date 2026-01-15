<script setup lang="ts">
import { NCard, NGrid, NGridItem, NStatistic } from 'naive-ui'
import { PeopleOutline, DocumentTextOutline, SettingsOutline } from '@vicons/ionicons5'
</script>

<template>
  <div class="dashboard">
    <n-grid :cols="3" :x-gap="16" :y-gap="16">
      <n-grid-item>
        <n-card :bordered="false">
          <n-statistic label="用户总数" :value="1234">
            <template #prefix>
              <n-icon><PeopleOutline /></n-icon>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card :bordered="false">
          <n-statistic label="文章总数" :value="5678">
            <template #prefix>
              <n-icon><DocumentTextOutline /></n-icon>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card :bordered="false">
          <n-statistic label="系统设置" :value="9">
            <template #prefix>
              <n-icon><SettingsOutline /></n-icon>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-card title="欢迎使用 Easy Admin" style="margin-top: 16px" :bordered="false">
      <p>这是一个基于 Vue 3 + Naive UI 的后台管理系统脚手架</p>
    </n-card>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}
</style>
