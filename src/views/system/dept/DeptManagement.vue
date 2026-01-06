<template>
  <!-- 搜索表单 -->
  <EzSearch
    v-model="queryParams.keywords"
    placeholder="请输入部门名称进行搜索"
    @search="handleSearch"
    @reset="handleResetSearch"
  />

  <!-- 操作按钮组 -->
  <EzButtonGroup :buttons="deptActionButtons" @action="handleAction" />

  <!-- 部门列表表格 -->
  <EzTable :config="tableConfig" :checked-keys="checkedRowKeys" @check-change="handleCheck" />

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

  <!-- 部门详情模态框 -->
  <EzDetailModal
    v-model:show="detailVisible"
    :data="detailData"
    :config="deptCrudConfig.detailConfig"
    :loading="detailLoading"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCrud } from '@/hooks/useCrud'
import { handleButtonActions } from '@/utils/actionHandler'
// 移除了不再需要的导入
import EzTable from '@/components/common/EzTable.vue'
import EzDetailModal from '@/components/common/EzDetailModal.vue'
import { deptFormConfig, deptActionButtons, deptCrudConfig } from './'
import type { DeptListVO, DeptQuery, DeptCreateDTO, DeptUpdateDTO, DeptCrudConfig } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'
import type { TreeOption } from '@/components/common/EzForm.vue'

// === 查询参数管理 ===
const queryParams = ref<DeptQuery>({
  keywords: '',
})

// === 部门树数据管理 ===
const deptTreeOptions = ref<TreeOption[]>([])

// === 添加子节点处理函数 ===
const handleAddChild = (row: DeptListVO) => {
  formMode.value = 'create'
  // 清空表单数据
  Object.keys(formData).forEach((key) => {
    delete formData[key as keyof typeof formData]
  })
  // 设置默认值，并将当前行作为父节点
  const defaults = {
    status: 1, // 默认启用
    deptSort: 0, // 默认排序
    parentId: row.deptId, // 设置父节点为当前选中行
  }
  Object.assign(formData, defaults)
  formVisible.value = true
}

// === 自定义CRUD配置（添加动态的自定义按钮处理函数） ===
const customCrudConfig = computed<DeptCrudConfig>(() => ({
  ...deptCrudConfig,
  customActionHandlers: {
    addChild: handleAddChild,
  },
}))

// === 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格） ===
const crud = useCrud(customCrudConfig.value)

// === 解构响应式数据和方法（按功能分组） ===

// 表格相关状态
const { loading, dataList: deptList, columns, tableScrollWidth, checkedRowKeys } = crud

// 表单相关状态
const { formVisible, formLoading, formMode, formData, handleCancel, handleFormDataUpdate } = crud

// 详情相关状态
const { detailVisible, detailLoading, detailData } = crud

// 查询相关方法
const { handleSearch, setLoadData } = crud

// CRUD操作方法
const { handleAdd, handleSubmit, handleBatchDelete } = crud

// 表格配置 - 使用useCrud自动生成的操作列
const tableConfig = computed<EzTableConfig<DeptListVO>>(() => ({
  columns: columns.value, // 直接使用useCrud生成的columns（包含操作列）
  data: deptList.value,
  loading: loading.value,
  rowKey: (row: DeptListVO) => row.deptId,
  scrollX: tableScrollWidth.value,
  maxHeight: 'calc(100vh - 320px)',
  bordered: true,
  striped: true,
  remote: false, // 树形模式不使用远程分页
  treeStructure: true, // 启用树形结构
  childrenKey: 'children', // 子节点字段名
}))

// === 计算属性 ===
const formConfig = computed(() => ({
  ...deptFormConfig,
  title: formMode.value === 'create' ? '新增部门' : '编辑部门',
  fields: deptFormConfig.fields.map((field) => {
    if (field.key === 'parentId') {
      // 为上级部门字段设置树形选项
      return {
        ...field,
        treeOptions: deptTreeOptions.value,
      }
    }
    return field
  }),
}))

// === 数据加载 ===
const loadDeptList = async () => {
  // 树形模式：直接调用treeApi
  await crud.loadData(queryParams.value)
}

// === 部门树数据转换函数 ===
const convertDeptToTreeOption = (dept: DeptListVO): TreeOption => ({
  key: dept.deptId,
  label: dept.deptName,
  children: dept.children?.map(convertDeptToTreeOption),
})

// === 加载部门树数据 ===
const loadDeptTree = async () => {
  try {
    // 直接调用treeApi获取树形数据
    const treeData = await deptCrudConfig.treeApi!()
    deptTreeOptions.value = treeData.map(convertDeptToTreeOption)
  } catch (error) {
    console.error('加载部门树数据失败:', error)
  }
}

// === 设置加载数据函数（约定：通过配置驱动） ===
setLoadData(loadDeptList)

const handleResetSearch = () => {
  queryParams.value.keywords = ''
  loadDeptList() // 重新加载数据
}

// === 表单提交（成功后刷新列表和树） ===
const handleFormSubmit = async (data: Partial<DeptCreateDTO | DeptUpdateDTO>) => {
  await handleSubmit(data)
  await loadDeptList() // 刷新列表
  await loadDeptTree() // 刷新部门树
}

// === 表格行选择处理 ===
const handleCheck = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
}

// === 批量删除（集成表格选中状态） ===
const handleBatchDeleteClick = async () => {
  const ids = checkedRowKeys.value.map((id) => String(id))
  await handleBatchDelete(ids, async () => {
    checkedRowKeys.value = []
    await loadDeptList()
  })
}

// === 按钮action处理器 ===
const handleAction = handleButtonActions({
  add: handleAdd, // 新增按钮 -> 打开新增表单
  'batch-delete': handleBatchDeleteClick, // 批量删除按钮 -> 执行批量删除
  refresh: async () => {
    await loadDeptList() // 刷新数据列表
    await loadDeptTree() // 刷新部门树
  }, // 刷新按钮 -> 刷新数据列表和部门树
})

// === 组件挂载时加载数据 ===
onMounted(async () => {
  await loadDeptList()
  await loadDeptTree()
})
</script>
