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
      :expanded-keys="expandedRowKeys"
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
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCrud } from '@/hooks/useCrud'
import { useTreeCrud } from '@/hooks/useTreeCrud'
import { handleButtonActions } from '@/utils/actionHandler'
import EzTable from '@/components/common/EzTable.vue'
import { deptFormConfig, deptActionButtons, deptCrudConfig } from './'
import { ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5'
import type { DeptListVO, DeptCreateDTO, DeptUpdateDTO } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'

// ==================== 响应式变量 ====================

// ==================== CRUD Hook ====================

// 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格）
const crud = useCrud(deptCrudConfig)

// 解构响应式数据和方法
// 表格相关状态
const { loading, dataList: deptList, columns, checkedRowKeys, queryParams, getFieldOptions } = crud

// 表单相关状态
const { formVisible, formLoading, formMode, formData, handleCancel, handleFormDataUpdate } = crud

// 查询相关方法
const { resetPaginationAndLoad, loadDataList } = crud

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

// CRUD操作方法
const { handleAdd: crudHandleAdd, handleSubmit, handleBatchDelete } = crud

// ==================== 树形增强 Hook ====================

// 使用树形增强 Hook（处理展开/收起逻辑）
const treeCrud = useTreeCrud({
  treeData: deptList,
  childrenKey: 'children',
  idKey: 'deptId',
})

// 解构树形操作方法
const { expandedKeys: expandedRowKeys, isExpanded, toggleExpand } = treeCrud

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
  fields: deptFormConfig.fields.map((field) => {
    if (field.key === 'parentId') {
      // 为上级部门字段设置树形选项（从 useCrud 的 fieldOptionsMap 获取）
      return {
        ...field,
        treeOptions: getFieldOptions('parentId'),
      }
    }
    return field
  }),
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

// 刷新处理
const handleRefresh = () => {
  loadDataList()
}

// 高级筛选处理
const handleAdvancedFilter = () => {
  // TODO: 实现高级筛选功能
  console.log('高级筛选')
}

// 新增（重写以加载父节点树）
const handleAdd = () => {
  crudHandleAdd()
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
  expandedRowKeys.value = keys
}

// 批量删除（集成表格选中状态）
const handleBatchDeleteClick = async () => {
  const ids = checkedRowKeys.value.map((id) => String(id))
  await handleBatchDelete(ids, async () => {
    checkedRowKeys.value = []
    await loadDataList()
  })
}

// 按钮action处理器
const handleAction = handleButtonActions({
  add: handleAdd, // 新增按钮 -> 打开新增表单
  'toggle-expand': toggleExpand, // 展开/收起 -> 使用 useTreeCrud 的 toggleExpand
  'batch-delete': handleBatchDeleteClick, // 批量删除按钮 -> 执行批量删除
  refresh: async () => {
    await loadDataList() // 刷新数据列表
  }, // 刷新按钮 -> 刷新数据列表
})

// ==================== 生命周期 ====================

// 组件挂载时加载数据
onMounted(async () => {
  await loadDataList()
})
</script>
