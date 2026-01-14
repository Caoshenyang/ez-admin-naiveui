<template>
  <!-- 字典数据列表 -->
  <div class="dict-data-list">
    <!-- 头部：标题和操作按钮 -->
    <div v-if="selectedType" class="list-header">
      <div class="header-title">
        <n-icon :component="ListOutline" />
        <span>字典数据 - {{ currentTypeName }}</span>
        <n-tag size="small" :bordered="false">{{ selectedType }}</n-tag>
      </div>
      <EzButtonGroup :buttons="actionButtons" @action="handleAction" />
    </div>

    <!-- 空状态提示 -->
    <n-empty
      v-if="!selectedType"
      description="请从左侧选择一个字典类型"
      size="large"
      style="margin-top: 100px;"
    >
      <template #icon>
        <n-icon :component="BookOutline" />
      </template>
    </n-empty>

    <!-- 字典数据表格 -->
    <EzTable
      v-else
      :config="tableConfig"
      :checked-keys="checkedRowKeys"
      @check-change="handleCheck"
    />

    <!-- 字典数据表单 -->
    <EzForm
      v-model="formVisible"
      :config="formConfig"
      :loading="formLoading"
      :form-data="formData"
      @update:form-data="handleFormDataUpdate"
      @submit="handleFormSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NIcon, NTag, NEmpty } from 'naive-ui'
import { ListOutline, BookOutline } from '@vicons/ionicons5'
import EzTable from '@/components/common/EzTable.vue'
import EzForm from '@/components/common/EzForm.vue'
import EzButtonGroup from '@/components/common/EzButtonGroup.vue'
import type { ActionButton } from '@/components/common/EzButtonGroup.vue'
import {
  dictDataFormConfig,
  dictDataTableConfig,
  dictDataCrudConfig
} from '../config'
import { useCrud } from '@/hooks/useCrud'
import { handleButtonActions } from '@/utils/actionHandler'
import type { DictDataCreateDTO, DictDataUpdateDTO, DictDataQuery, DictDataItem } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'
import type { PageResult } from '@/types'
import { dictTypeApi, dictDataApi } from '@/api/dict'
import { createDefaultQueryParams } from '@/hooks/useCrud'

// ==================== Props ====================
interface Props {
  selectedType?: string // 当前选中的字典类型
}
interface Emits {
  (e: 'data-updated'): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ==================== 响应式状态 ====================
const checkedRowKeys = ref<Array<string | number>>([])
const currentTypeName = ref('')
const localDataList = ref<DictDataItem[]>([])
const localTotal = ref(0)
const localLoading = ref(false)

// 创建自定义的查询参数
const localQueryParams = ref<DictDataQuery>(
  createDefaultQueryParams<DictDataQuery>({
    dictType: props.selectedType,
  })
)

// 创建自定义的 CRUD 配置，使用 customLoadData
const customCrudConfig = {
  ...dictDataCrudConfig,
  queryParams: localQueryParams.value,
  customLoadData: async (queryParams: DictDataQuery) => {
    // 确保 dictType 被设置
    const params = {
      ...queryParams,
      search: {
        ...queryParams.search,
        dictType: props.selectedType,
      },
    }
    localLoading.value = true
    try {
      const result = await dictDataApi.page(params)
      localDataList.value = result.records
      localTotal.value = Number(result.total)
      if (pagination) {
        pagination.itemCount = Number(result.total)
      }
    } finally {
      localLoading.value = false
    }
  },
}

// ==================== CRUD Hook ====================
const crud = useCrud(customCrudConfig)
const {
  loading,
  dataList: dataList,
  columns,
  formVisible,
  formLoading,
  formMode,
  formData,
  pagination,
  queryParams,
  handleCancel,
  handleFormDataUpdate,
  handleSubmit,
  handleAdd,
  handleDelete,
  handleBatchDelete,
  resetPaginationAndLoad,
  loadDataList,
} = crud

// ==================== 计算属性 ====================
// 表单配置
const formConfig = computed(() => ({
  ...dictDataFormConfig,
  title: formMode.value === 'create' ? '新增字典数据' : '编辑字典数据',
  // 字典类型字段设置为当前选中的类型，且禁用编辑
  fields: dictDataFormConfig.fields.map((field) => {
    if (field.key === 'dictType') {
      return {
        ...field,
        disabled: true,
        defaultValue: props.selectedType,
      }
    }
    return field
  }),
}))

// 表格配置
const tableConfig = computed<EzTableConfig<any>>(() => ({
  columns: columns.value,
  data: dataList.value,
  loading: loading.value,
  rowKey: (row: any) => row.id,
  pagination: pagination!,
}))

// 操作按钮配置
const actionButtons = computed(() => {
  const buttons: ActionButton[] = [
    { key: 'add', text: '新增', type: 'primary', disabled: !props.selectedType },
    { key: 'batch-delete', text: '批量删除', type: 'error', disabled: !props.selectedType || checkedRowKeys.value.length === 0 },
    { key: 'refresh', text: '刷新', type: 'default', disabled: !props.selectedType },
  ]
  return buttons
})

// ==================== 方法 ====================
// 表单提交
const handleFormSubmit = async (data: Partial<DictDataCreateDTO | DictDataUpdateDTO>) => {
  try {
    // 确保字典类型字段被设置
    const submitData = {
      ...data,
      dictType: props.selectedType,
    }
    await handleSubmit(submitData)
    emit('data-updated')
  } catch (error) {
    console.error('提交字典数据失败:', error)
  }
}

// 表格行选择处理
const handleCheck = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
}

// 批量删除
const handleBatchDeleteClick = async () => {
  const ids = checkedRowKeys.value.map((id) => String(id))
  await handleBatchDelete(ids, async () => {
    checkedRowKeys.value = []
    emit('data-updated')
  })
}

// 刷新功能
const handleRefresh = () => {
  loadDataList()
}

// 按钮action处理器
const handleAction = handleButtonActions({
  add: handleAdd,
  'batch-delete': handleBatchDeleteClick,
  refresh: handleRefresh,
})

// 获取字典类型名称
const loadTypeName = async () => {
  if (!props.selectedType) return

  try {
    const list = await dictTypeApi.list()
    const found = list.find(item => item.dictType === props.selectedType)
    currentTypeName.value = found?.dictName || ''
  } catch (error) {
    console.error('获取字典类型名称失败:', error)
  }
}

// ==================== 监听选中类型变化 ====================
watch(() => props.selectedType, async (newType) => {
  if (newType) {
    // 更新查询参数中的字典类型
    if (queryParams.value && queryParams.value.search) {
      queryParams.value.search.dictType = newType
    }
    // 重置分页并加载数据
    resetPaginationAndLoad()
    await loadTypeName()
  }
}, { immediate: true })

// ==================== 暴露方法 ====================
defineExpose({
  loadData: loadDataList,
})
</script>

<style lang="scss" scoped>
.dict-data-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 12px 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--n-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--n-text-color);
}
</style>
