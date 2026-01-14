<template>
  <!-- 主要内容容器 -->
  <n-card title="部门管理">
    <template #header-extra>
       <!-- 操作按钮组 -->
      <EzButtonGroup :buttons="dynamicActionButtons" @action="handleAction" />
    </template>

    <!-- 部门列表表格 -->
    <EzTable
      :config="tableConfig"
      :checked-keys="checkedRowKeys"
      :expanded-keys="expandedKeys"
      :search-value="queryParams.keywords"
      search-placeholder="部门名称"
      @check-change="handleCheck"
      @expand-change="handleExpandChange"
      @search="handleSearch"
      @search-input="handleSearchInput"
      @refresh="handleRefresh"
      @advanced-filter="handleAdvancedFilter"
    />
  </n-card>

  <!-- 部门表单 -->
  <EzForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    :options-map="fieldOptionsMap"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCrud } from '@/hooks/useCrud'
import EzTable from '@/components/common/EzTable.vue'
import { deptFormConfig, deptActionButtons, deptCrudConfig } from './'
import { ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5'
import type { DeptListVO, DeptCreateDTO, DeptUpdateDTO } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'

// ==================== CRUD Hook ====================

// 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格和树形功能）
const crud = useCrud(deptCrudConfig)

// 解构响应式数据和方法
const {
  loading,
  dataList: deptList,
  columns,
  checkedRowKeys,
  queryParams,
  fieldOptionsMap, // 字段级联选项数据（用于表单动态选项）
  expandedKeys, // 树形展开的节点 keys
  isExpanded, // 树形是否已展开
} = crud

// 表单相关状态
const { formVisible, formLoading, formMode, formData, handleCancel, handleFormDataUpdate, handleSubmit } = crud

// 查询相关方法
const { resetPaginationAndLoad, loadDataList, handlePageAction } = crud

// ==================== 计算属性 ====================

// 表格配置（树形结构模式）
const tableConfig = computed<EzTableConfig<DeptListVO>>(() => ({
  columns: columns.value, // 直接使用useCrud生成的columns（包含操作列）
  data: deptList.value,
  loading: loading.value,
  rowKey: (row: DeptListVO) => row.deptId, // 行主键
  remote: false, // 不使用远程分页（默认值：true，树形模式需要禁用远程分页）
  treeStructure: true, // 启用树形结构（默认值：false）
  defaultExpandAll: false, // 不默认展开所有行，由用户手动控制
}))

// 表单配置（使用字段级联加载的数据）
const formConfig = computed(() => ({
  ...deptFormConfig,
  title: formMode.value === 'create' ? '新增部门' : '编辑部门',
}))

// 动态按钮配置（根据展开状态显示不同的图标和文字）
const dynamicActionButtons = computed(() => {
  return deptActionButtons.map((button) => {
    if (button.key === 'toggle-expand') {
      return {
        ...button,
        text: isExpanded.value ? '收起' : '展开',
        icon: isExpanded.value ? ChevronUpOutline : ChevronDownOutline,
      }
    }
    return button
  })
})

// ==================== 事件处理方法 ====================

// 搜索处理
const handleSearch = (value?: string) => {
  if (value !== undefined) {
    queryParams.value.keywords = value
  }
  resetPaginationAndLoad()
}

// 搜索输入处理
const handleSearchInput = (value: string) => {
  queryParams.value.keywords = value
}

// 刷新处理
const handleRefresh = () => {
  loadDataList()
}

// 高级筛选处理
const handleAdvancedFilter = () => {
  // TODO: 实现高级筛选功能
  console.log('高级筛选')
}

// 表单提交（成功后刷新列表）
const handleFormSubmit = async (data: Partial<DeptCreateDTO | DeptUpdateDTO>) => {
  await handleSubmit(data)
  await loadDataList() // 刷新列表
}

// 表格行选择处理
const handleCheck = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
}

// 表格行展开处理
const handleExpandChange = (keys: (string | number)[]) => {
  expandedKeys.value = keys
}

// 统一的按钮处理函数（配置驱动）
const handleAction = (key: string) => {
  // 所有按钮都使用配置驱动的处理逻辑
  handlePageAction(key)
}

// ==================== 生命周期 ====================

// 组件挂载时加载数据
onMounted(async () => {
  await loadDataList()
})
</script>
