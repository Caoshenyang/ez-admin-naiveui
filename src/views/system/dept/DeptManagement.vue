<template>
  <!-- 搜索表单 -->
  <EzSearch
    v-model="queryParams.keywords"
    placeholder="请输入部门名称进行搜索"
    @search="handleSearch"
    @reset="handleResetSearch"
  />

  <!-- 操作按钮组 -->
  <EzButtonGroup :buttons="dynamicActionButtons" @action="handleAction" />

  <!-- 部门列表表格 -->
  <EzTable
    :config="tableConfig"
    :checked-keys="checkedRowKeys"
    :expanded-keys="expandedRowKeys"
    @check-change="handleCheck"
    @expand-change="handleExpandChange"
  />

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
import { ref, computed, onMounted, watch } from 'vue'
import { useCrud } from '@/hooks/useCrud'
import { handleButtonActions } from '@/utils/actionHandler'
import EzTable from '@/components/common/EzTable.vue'
import { deptFormConfig, deptActionButtons, deptCrudConfig } from './'
import { deptApi } from '@/api/dept'
import { ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5'
import type { DeptListVO, DeptQuery, DeptCreateDTO, DeptUpdateDTO, DeptCrudConfig } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'
import type { TreeOption } from '@/components/common/EzForm.vue'

// ==================== 响应式变量 ====================

// 查询参数
const queryParams = ref<DeptQuery>({
  keywords: '',
})

// 展开的行keys
const expandedRowKeys = ref<(string | number)[]>([])

// 父节点树数据（用于表单上级部门选择）
const parentTreeOptions = ref<TreeOption[]>([])

// ==================== CRUD 配置 ====================

// 添加子节点处理函数
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

// 展开所有处理函数
const handleExpandAll = () => {
  // 获取所有有子节点的行ID
  const allExpandableKeys: (string | number)[] = []
  const collectExpandableKeys = (data: DeptListVO[]) => {
    data.forEach((item) => {
      if (item.children && item.children.length > 0) {
        allExpandableKeys.push(item.deptId)
        collectExpandableKeys(item.children)
      }
    })
  }
  collectExpandableKeys(deptList.value)
  expandedRowKeys.value = allExpandableKeys
}

// 收起所有处理函数
const handleCollapseAll = () => {
  expandedRowKeys.value = []
}

// 自定义CRUD配置（添加动态的自定义按钮处理函数）
const customCrudConfig = computed<DeptCrudConfig>(() => ({
  ...deptCrudConfig,
  customActionHandlers: {
    addChild: handleAddChild,
  },
}))

// ==================== CRUD Hook ====================

// 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格）
const crud = useCrud(customCrudConfig.value)

// 解构响应式数据和方法
// 表格相关状态
const { loading, dataList: deptList, columns, checkedRowKeys } = crud

// 表单相关状态
const { formVisible, formLoading, formMode, formData, handleCancel, handleFormDataUpdate } = crud

// 查询相关方法
const { resetPaginationAndLoad, loadDataList } = crud

// 搜索处理
const handleSearch = () => {
  resetPaginationAndLoad()
}

// CRUD操作方法
const { handleAdd: crudHandleAdd, handleSubmit, handleBatchDelete } = crud

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

// 表单配置
const formConfig = computed(() => ({
  ...deptFormConfig,
  title: formMode.value === 'create' ? '新增部门' : '编辑部门',
  fields: deptFormConfig.fields.map((field) => {
    if (field.key === 'parentId') {
      // 为上级部门字段设置树形选项
      return {
        ...field,
        treeOptions: parentTreeOptions.value,
      }
    }
    return field
  }),
}))

// 动态按钮配置（根据展开状态显示不同的图标和文字）
const dynamicActionButtons = computed(() => {
  const isExpanded = expandedRowKeys.value.length > 0

  return deptActionButtons.map((button) => {
    if (button.key === 'toggle-expand') {
      return {
        ...button,
        text: isExpanded ? '收起所有' : '展开所有',
        icon: isExpanded ? ChevronUpOutline : ChevronDownOutline,
      }
    }
    return button
  })
})

// ==================== 数据加载方法 ====================

// 部门树数据转换函数
const convertDeptToTreeOption = (dept: DeptListVO): TreeOption => ({
  key: dept.deptId,
  label: dept.deptName,
  children: dept.children?.map(convertDeptToTreeOption),
})

// 加载父节点树数据（用于表单上级部门选择）
const loadParentTree = async (excludeId?: number) => {
  try {
    const treeData = await deptApi.parentTree(excludeId)
    parentTreeOptions.value = treeData.map(convertDeptToTreeOption)
  } catch (error) {
    console.error('加载父节点树数据失败:', error)
    parentTreeOptions.value = []
  }
}

// ==================== 事件处理方法 ====================

// 重置搜索
const handleResetSearch = () => {
  queryParams.value.keywords = ''
  resetPaginationAndLoad() // 重置分页并重新加载数据
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
  'toggle-expand': () => {
    // 根据当前展开状态切换展开/收起
    if (expandedRowKeys.value.length > 0) {
      handleCollapseAll() // 有展开的节点，执行收起所有
    } else {
      handleExpandAll() // 没有展开的节点，执行展开所有
    }
  },
  'batch-delete': handleBatchDeleteClick, // 批量删除按钮 -> 执行批量删除
  refresh: async () => {
    await loadDataList() // 刷新数据列表
  }, // 刷新按钮 -> 刷新数据列表
})

// ==================== 监听器 ====================

// 监听表单打开，加载父节点树数据
watch(
  [formVisible, formMode],
  ([visible, mode]) => {
    if (visible) {
      // 表单打开时，根据模式决定排除的ID
      if (mode === 'update') {
        // 编辑模式：排除当前编辑的部门ID及其子节点
        const updateData = formData as Partial<DeptUpdateDTO>
        loadParentTree(updateData.deptId)
      } else {
        // 新增模式：不排除任何ID，允许选择所有部门作为父节点
        loadParentTree()
      }
    }
  },
  { immediate: false },
)

// ==================== 生命周期 ====================

// 组件挂载时加载数据
onMounted(async () => {
  await loadDataList()
})
</script>
