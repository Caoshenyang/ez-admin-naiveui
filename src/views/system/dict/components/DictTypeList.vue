<template>
  <!-- 字典类型列表 -->
  <div class="dict-type-list">
    <!-- 头部：搜索和操作按钮 -->
    <div class="list-header">
      <EzSearch v-model="searchValue" placeholder="搜索字典名称/类型" @search="handleSearch" />
      <EzButtonGroup :buttons="actionButtons" @action="handleAction" />
    </div>

    <!-- 字典类型列表 -->
    <n-list
      hoverable clickable
      :show-divider="false"
      class="type-list"
      style="height: calc(100% - 100px); overflow-y: auto;"
    >
      <n-list-item
        v-for="item in typeList"
        :key="item.id"
        class="type-item"
        :class="{ 'type-item-selected': localSelectedType === item.dictType }"
        @click="handleSelectType(item)"
      >
        <template #prefix>
          <n-icon :component="BookOutline" :color="localSelectedType === item.dictType ? '#18a058' : '#ccc'" />
        </template>
        <div class="type-item-content">
          <div class="type-name">{{ item.dictName }}</div>
          <div class="type-info">
            <n-tag
              :type="item.status === 1 ? 'success' : 'default'"
              size="small"
              :bordered="false"
            >
              {{ item.status === 1 ? '启用' : '禁用' }}
            </n-tag>
            <span class="type-code">{{ item.dictType }}</span>
          </div>
        </div>
        <template #suffix>
          <n-space>
            <n-button
              text
              size="small"
              @click.stop="handleEdit(item)"
            >
              <template #icon>
                <n-icon><CreateOutline /></n-icon>
              </template>
            </n-button>
            <n-button
              text
              size="small"
              type="error"
              @click.stop="handleDelete(item)"
            >
              <template #icon>
                <n-icon><TrashOutline /></n-icon>
              </template>
            </n-button>
          </n-space>
        </template>
      </n-list-item>

      <!-- 空状态 -->
      <n-empty
        v-if="typeList.length === 0 && !loading"
        description="暂无字典类型"
        size="small"
      />
    </n-list>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <n-spin size="medium" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { NList, NListItem, NIcon, NTag, NSpace, NButton, NEmpty, NSpin } from 'naive-ui'
import { BookOutline, CreateOutline, TrashOutline } from '@vicons/ionicons5'
import EzSearch from '@/components/common/EzSearch.vue'
import EzButtonGroup from '@/components/common/EzButtonGroup.vue'
import type { ActionButton } from '@/components/common/EzButtonGroup.vue'
import { dictTypeApi } from '@/api/dict'
import type { DictTypeItem, DictTypeUpdateDTO } from '@/types'
import { dialog, message, logger } from '@/hooks/useMessage'

// ==================== Props ====================
interface Props {
  modelValue?: string // 当前选中的字典类型
}
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'type-selected', dictType: string): void
  (e: 'add'): void // 新增事件
  (e: 'edit', data: DictTypeUpdateDTO): void // 编辑事件
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ==================== 响应式状态 ====================
const typeList = ref<DictTypeItem[]>([])
const allTypeList = ref<DictTypeItem[]>([]) // 保存完整列表用于搜索
const loading = ref(false)
const searchValue = ref('')
const localSelectedType = ref(props.modelValue || '')

// ==================== 操作按钮配置 ====================
const actionButtons: ActionButton[] = [
  { key: 'add', text: '新增', type: 'primary' },
  { key: 'refresh', text: '刷新' },
]

// ==================== 数据加载 ====================
const loadData = async () => {
  try {
    loading.value = true
    const data = await dictTypeApi.list()
    allTypeList.value = data
    typeList.value = data
  } catch (error) {
    logger.error('加载字典类型列表失败:', error)
    message.error('加载字典类型列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== 搜索处理 ====================
const handleSearch = () => {
  if (!searchValue.value.trim()) {
    typeList.value = allTypeList.value
    return
  }

  const keyword = searchValue.value.toLowerCase().trim()
  typeList.value = allTypeList.value.filter(item =>
    item.dictName.toLowerCase().includes(keyword) ||
    item.dictType.toLowerCase().includes(keyword)
  )
}

// ==================== 类型选择处理 ====================
const handleSelectType = (item: DictTypeItem) => {
  localSelectedType.value = item.dictType
  emit('update:modelValue', item.dictType)
  emit('type-selected', item.dictType)
}

// ==================== 操作按钮处理 ====================
const handleAction = (key: string) => {
  switch (key) {
    case 'add':
      emit('add')
      break
    case 'refresh':
      handleRefresh()
      break
  }
}

const handleRefresh = () => {
  loadData()
}

// ==================== 编辑处理 ====================
const handleEdit = (item: DictTypeItem) => {
  const updateData: DictTypeUpdateDTO = {
    id: item.id,
    dictName: item.dictName,
    dictType: item.dictType,
    status: item.status || 1,
    remark: item.remark,
  }
  emit('edit', updateData)
}

// ==================== 删除处理 ====================
const handleDelete = async (item: DictTypeItem) => {
  try {
    await dialog.warning({
      title: '删除确认',
      content: `确定要删除字典类型 "${item.dictName}" 吗？此操作将同时删除该类型下的所有字典数据，且不可撤销。`,
      positiveText: '确定删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await dictTypeApi.remove(item.id)
          message.success('删除成功')
          // 删除后如果删除的是当前选中的类型，清空选中状态
          if (localSelectedType.value === item.dictType) {
            localSelectedType.value = ''
            emit('update:modelValue', '')
            emit('type-selected', '')
          }
          await loadData()
        } catch (error) {
          logger.error('删除字典类型失败:', error)
          message.error('删除字典类型失败')
        }
      },
    })
  } catch (error) {
    logger.error('删除操作异常:', error)
  }
}

// ==================== 监听 props 变化 ====================
watch(() => props.modelValue, (newValue) => {
  localSelectedType.value = newValue || ''
})

// ==================== 暴露方法 ====================
defineExpose({
  loadData,
})

// ==================== 生命周期 ====================
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.dict-type-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 12px;
  border-bottom: 1px solid var(--n-border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-list {
  flex: 1;
  padding: 8px 0;
}

.type-item {
  padding: 8px 12px;
  margin: 0 8px;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--n-color-modal);
  }

  &.type-item-selected {
    background-color: rgba(24, 160, 88, 0.1);
    border-left: 3px solid #18a058;
  }
}

.type-item-content {
  flex: 1;
}

.type-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--n-text-color);
  margin-bottom: 4px;
}

.type-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--n-text-color-3);
}

.type-code {
  font-family: 'Courier New', monospace;
  color: var(--n-text-color-3);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
