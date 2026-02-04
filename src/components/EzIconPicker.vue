<!--
  EzIconPicker - Iconify 图标选择器
  支持搜索、预览、选择
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NModal, NScrollbar, NEmpty } from 'naive-ui'
import EzIcon from './EzIcon.vue'
import type { EzIconPickerProps, EzIconPickerEmits } from '@/types/icon'

const props = withDefaults(defineProps<EzIconPickerProps>(), {
  width: 800,
  pageSize: 80,
  clearable: true,
  showCategory: false,
  searchable: true,
  placeholder: '请选择图标'
})

const emit = defineEmits<EzIconPickerEmits>()

// 内部状态
const showPicker = ref(false)
const searchQuery = ref('')

// 常用图标列表（Material Design Icons 风格统一）
const popularIcons = [
  // 导航/布局类
  { name: 'mdi:home-outline', label: '首页' },
  { name: 'mdi:view-dashboard-outline', label: '仪表盘' },
  { name: 'mdi:view-grid-outline', label: '网格' },
  { name: 'mdi:view-list-outline', label: '列表' },
  { name: 'mdi:menu', label: '菜单' },
  { name: 'mdi:apps', label: '应用' },

  // 用户/权限类
  { name: 'mdi:account-outline', label: '用户' },
  { name: 'mdi:account-group-outline', label: '用户组' },
  { name: 'mdi:account-key-outline', label: '账户密钥' },
  { name: 'mdi:shield-account-outline', label: '账户权限' },
  { name: 'mdi:lock-outline', label: '锁定' },
  { name: 'mdi:lock-open-outline', label: '解锁' },
  { name: 'mdi:key-outline', label: '密钥' },
  { name: 'mdi:shield-outline', label: '权限' },

  // 操作类（CRUD）
  { name: 'mdi:plus-circle-outline', label: '新增' },
  { name: 'mdi:pencil-outline', label: '编辑' },
  { name: 'mdi:delete-outline', label: '删除' },
  { name: 'mdi:check-circle-outline', label: '确认' },
  { name: 'mdi:close-circle-outline', label: '取消' },
  { name: 'mdi:magnify', label: '搜索' },
  { name: 'mdi:refresh', label: '刷新' },
  { name: 'mdi:download-outline', label: '下载' },
  { name: 'mdi:upload-outline', label: '上传' },
  { name: 'mdi:content-copy', label: '复制' },
  { name: 'mdi:content-save-outline', label: '保存' },

  // 文件/文档类
  { name: 'mdi:file-outline', label: '文件' },
  { name: 'mdi:file-document-outline', label: '文档' },
  { name: 'mdi:folder-outline', label: '文件夹' },
  { name: 'mdi:folder-open-outline', label: '打开文件夹' },
  { name: 'mdi:attachment', label: '附件' },
  { name: 'mdi:file-image-outline', label: '图片' },
  { name: 'mdi:file-excel-outline', label: 'Excel' },
  { name: 'mdi:file-pdf-box-outline', label: 'PDF' },

  // 设置/配置类
  { name: 'mdi:cog-outline', label: '设置' },
  { name: 'mdi:tune', label: '配置' },
  { name: 'mdi:toolbox-outline', label: '工具' },
  { name: 'mdi:wrench-outline', label: '维护' },
  { name: 'mdi:console', label: '控制台' },

  // 数据/图表类
  { name: 'mdi:chart-line', label: '趋势图' },
  { name: 'mdi:chart-bar', label: '柱状图' },
  { name: 'mdi:chart-pie', label: '饼图' },
  { name: 'mdi:database-outline', label: '数据库' },
  { name: 'mdi:table-large', label: '数据表' },
  { name: 'mdi:analytics', label: '分析' },

  // 状态/提示类
  { name: 'mdi:alert-circle-outline', label: '错误' },
  { name: 'mdi:alert-outline', label: '警告' },
  { name: 'mdi:information-outline', label: '信息' },
  { name: 'mdi:help-circle-outline', label: '帮助' },
  { name: 'mdi:emoticon-happy-outline', label: '成功' },
  { name: 'mdi:loading', label: '加载中' },

  // 通讯/消息类
  { name: 'mdi:email-outline', label: '邮件' },
  { name: 'mdi:bell-outline', label: '通知' },
  { name: 'mdi:message-outline', label: '消息' },
  { name: 'mdi:chat-outline', label: '聊天' },

  // 导航/箭头类
  { name: 'mdi:arrow-left', label: '返回' },
  { name: 'mdi:arrow-right', label: '前进' },
  { name: 'mdi:arrow-up', label: '向上' },
  { name: 'mdi:arrow-down', label: '向下' },
  { name: 'mdi:chevron-left', label: '左箭头' },
  { name: 'mdi:chevron-right', label: '右箭头' },

  // 其他常用
  { name: 'mdi:star-outline', label: '收藏' },
  { name: 'mdi:heart-outline', label: '喜欢' },
  { name: 'mdi:eye-outline', label: '查看' },
  { name: 'mdi:eye-off-outline', label: '隐藏' },
  { name: 'mdi:share-variant-outline', label: '分享' },
  { name: 'mdi:printer', label: '打印' },
  { name: 'mdi:qrcode', label: '二维码' },
  { name: 'mdi:link', label: '链接' }
]

// 当前选中的图标
const currentIcon = computed(() => props.modelValue)

// 过滤后的图标列表
const filteredIcons = computed(() => {
  if (!searchQuery.value) {
    return popularIcons
  }

  const query = searchQuery.value.toLowerCase()
  return popularIcons.filter(
    (icon) => icon.name.toLowerCase().includes(query) || icon.label.toLowerCase().includes(query)
  )
})

// 处理图标选择
function handleSelectIcon(iconName: string) {
  emit('update:modelValue', iconName)
  emit('change', iconName)
  showPicker.value = false
}

// 处理清空
function handleClear() {
  emit('update:modelValue', undefined)
}
</script>

<template>
  <div class="ez-icon-picker">
    <!-- 触发器 -->
    <NInput
      :value="currentIcon"
      :placeholder="placeholder"
      :clearable="clearable"
      readonly
      @click="showPicker = true"
      @clear="handleClear"
    >
      <template #prefix>
        <EzIcon v-if="currentIcon" :icon="currentIcon" :size="18" />
        <EzIcon v-else icon="mdi:magnify-outline" :size="18" />
      </template>
    </NInput>

    <!-- 图标选择弹窗 -->
    <NModal v-model:show="showPicker" preset="card" title="选择图标" :style="{ width: '800px' }">
      <!-- 搜索框 -->
      <NInput v-if="searchable" v-model:value="searchQuery" placeholder="搜索图标..." clearable class="mb-4">
        <template #prefix>
          <EzIcon icon="mdi:magnify-outline" :size="18" />
        </template>
      </NInput>

      <!-- 图标网格 -->
      <NScrollbar style="max-height: 500px">
        <div v-if="filteredIcons.length > 0" class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon.name"
            class="icon-item"
            :class="{ 'is-selected': currentIcon === icon.name }"
            @click="handleSelectIcon(icon.name)"
          >
            <EzIcon :icon="icon.name" :size="24" />
            <div class="icon-label">{{ icon.label }}</div>
          </div>
        </div>
        <NEmpty v-else description="暂无匹配的图标" size="small" />
      </NScrollbar>
    </NModal>
  </div>
</template>

<style scoped>
.ez-icon-picker {
  display: inline-block;
  width: 100%;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-item:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.icon-item.is-selected {
  background-color: #eff6ff;
  border-color: #3b82f6;
}

.icon-label {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  word-break: break-all;
  line-height: 1.4;
}
</style>
