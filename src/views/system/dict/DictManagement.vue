<template>
  <!-- 字典管理主页面 -->
  <n-card title="字典管理" size="small">
    <!-- 左右分栏布局 -->
    <n-layout has-sider style="height: calc(100vh - 200px); min-height: 600px;">
      <!-- 左侧：字典类型列表 -->
      <n-layout-sider
        :width="350"
        bordered
        show-trigger="bar"
        collapse-mode="width"
        :collapsed-width="0"
        :default-collapsed="false"
      >
        <DictTypeList
          ref="dictTypeRef"
          v-model="selectedType"
          @type-selected="handleTypeSelected"
          @add="handleTypeAdd"
          @edit="handleTypeEdit"
        />
      </n-layout-sider>

      <!-- 右侧：字典数据列表 -->
      <n-layout-content style="padding-left: 16px;">
        <DictDataList
          ref="dictDataRef"
          :selected-type="selectedType"
          @data-updated="handleDataUpdated"
        />
      </n-layout-content>
    </n-layout>
  </n-card>

  <!-- 字典类型表单 -->
  <EzForm
    v-model="typeFormVisible"
    :config="typeFormConfig"
    :loading="typeFormLoading"
    :form-data="typeFormData"
    @update:form-data="handleTypeFormDataUpdate"
    @submit="handleTypeFormSubmit"
    @cancel="handleTypeCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NLayout, NLayoutSider, NLayoutContent } from 'naive-ui'
import EzForm from '@/components/common/EzForm.vue'
import DictTypeList from './components/DictTypeList.vue'
import DictDataList from './components/DictDataList.vue'
import {
  dictTypeFormConfig,
  dictTypeCrudConfig
} from './config'
import { useCrud } from '@/hooks/useCrud'
import type { DictTypeCreateDTO, DictTypeUpdateDTO } from '@/types'
import { message } from '@/hooks/useMessage'

// ==================== 响应式变量 ====================

// 选中的字典类型
const selectedType = ref<string>('')

// 组件引用
const dictTypeRef = ref()
const dictDataRef = ref()

// 字典类型表单状态
const typeFormVisible = ref(false)
const typeFormLoading = ref(false)

// ==================== CRUD Hook ====================

// 字典类型CRUD
const typeCrud = useCrud(dictTypeCrudConfig)
const {
  formMode: typeFormMode,
  formData: typeFormData,
  handleCancel: handleTypeCancel,
  handleFormDataUpdate: handleTypeFormDataUpdate,
  handleSubmit: handleTypeSubmit,
  handleAdd: typeCrudHandleAdd,
  handleEdit: typeCrudHandleEdit,
} = typeCrud

// ==================== 计算属性 ====================

// 字典类型表单配置
const typeFormConfig = computed(() => ({
  ...dictTypeFormConfig,
  title: typeFormMode.value === 'create' ? '新增字典类型' : '编辑字典类型',
}))

// ==================== 事件处理方法 ====================

// 字典类型选中处理
const handleTypeSelected = (dictType: string) => {
  // 类型选中时，刷新字典数据列表
  dictDataRef.value?.loadData()
}

// 字典类型新增
const handleTypeAdd = () => {
  typeCrudHandleAdd()
}

// 字典类型编辑
const handleTypeEdit = (data: DictTypeUpdateDTO) => {
  // 直接填充数据到表单
  Object.assign(typeFormData, data)
  typeFormMode.value = 'update'
  typeFormVisible.value = true
}

// 字典类型表单提交
const handleTypeFormSubmit = async (data: Partial<DictTypeCreateDTO | DictTypeUpdateDTO>) => {
  try {
    typeFormLoading.value = true
    await handleTypeSubmit(data)
    typeFormVisible.value = false
    message.success(typeFormMode.value === 'create' ? '新增成功' : '更新成功')
    // 刷新字典类型列表
    dictTypeRef.value?.loadData()
  } catch (error) {
    console.error('提交字典类型失败:', error)
  } finally {
    typeFormLoading.value = false
  }
}

// 字典数据更新处理
const handleDataUpdated = () => {
  // 字典数据更新后，刷新字典数据列表
  dictDataRef.value?.loadData()
}
</script>

<style lang="scss" scoped>
:deep(.n-layout-sider) {
  background-color: var(--n-color);
}

:deep(.n-layout-content) {
  background-color: var(--n-color);
}
</style>
