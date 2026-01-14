<template>
  <!-- 主要内容容器 -->
  <n-card title="菜单管理">
    <template #header-extra>
       <!-- 操作按钮组 -->
      <EzButtonGroup :buttons="dynamicActionButtons" @action="handleAction" />
    </template>

    <!-- 菜单列表表格 -->
    <EzTable
      :config="tableConfig"
      :checked-keys="checkedRowKeys"
      :expanded-keys="expandedRowKeys"
      :search-value="queryParams.keywords"
      search-placeholder="菜单名称"
      @check-change="handleCheck"
      @expand-change="handleExpandChange"
      @search="handleSearch"
      @search-input="handleSearchInput"
      @refresh="handleRefresh"
      @advanced-filter="handleAdvancedFilter"
    />
  </n-card>

  <!-- 菜单表单 -->
  <EzForm
    ref="formRef"
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
import { menuFormConfig, menuActionButtons, menuCrudConfig } from './'
import { menuApi } from '@/api/menu'
import { ChevronDownOutline, ChevronUpOutline } from '@vicons/ionicons5'
import type { MenuTreeVO, SaveMenuDTO, MenuCrudConfig } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'
import type { TreeOption } from '@/components/common/EzForm.vue'

// ==================== 响应式变量 ====================

// 表单组件引用
const formRef = ref()

// 展开的行keys
const expandedRowKeys = ref<(string | number)[]>([])

// 父节点树数据（用于表单上级菜单选择）
const parentTreeOptions = ref<TreeOption[]>([])

// ==================== CRUD 配置 ====================

// 添加子节点处理函数
const handleAddChild = (row: MenuTreeVO) => {
  formMode.value = 'create'
  // 清空表单数据
  Object.keys(formData).forEach((key) => {
    delete formData[key as keyof typeof formData]
  })
  // 设置默认值，并将当前行作为父节点
  const defaults = {
    menuType: 2, // 默认菜单
    status: 1, // 默认启用
    hidden: 0, // 默认显示
    menuSort: 0, // 默认排序
    parentId: row.parentId, // 设置父节点为当前选中行
  }
  Object.assign(formData, defaults)
  formVisible.value = true
}

// 展开所有处理函数
const handleExpandAll = () => {
  // 获取所有有子节点的行ID
  const allExpandableKeys: (string | number)[] = []
  const collectExpandableKeys = (data: MenuTreeVO[]) => {
    data.forEach((item) => {
      if (item.children && item.children.length > 0) {
        allExpandableKeys.push(item.menuId)
        collectExpandableKeys(item.children)
      }
    })
  }
  collectExpandableKeys(menuList.value)
  expandedRowKeys.value = allExpandableKeys
}

// 收起所有处理函数
const handleCollapseAll = () => {
  expandedRowKeys.value = []
}

// 自定义CRUD配置（添加动态的自定义按钮处理函数）
const customCrudConfig = computed<MenuCrudConfig>(() => ({
  ...menuCrudConfig,
  customActionHandlers: {
    addChild: handleAddChild,
  },
}))

// ==================== CRUD Hook ====================

// 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格）
const crud = useCrud(customCrudConfig.value)

// 解构响应式数据和方法
// 表格相关状态
const { loading, dataList: menuList, columns, checkedRowKeys, queryParams } = crud

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

// ==================== 计算属性 ====================

// 表格配置（树形结构模式）
const tableConfig = computed<EzTableConfig<MenuTreeVO>>(() => ({
  columns: columns.value, // 直接使用useCrud生成的columns（包含操作列）
  data: menuList.value,
  loading: loading.value,
  rowKey: (row: MenuTreeVO) => row.menuId, // 行主键
  remote: false, // 不使用远程分页（默认值：true，树形模式需要禁用远程分页）
  treeStructure: true, // 启用树形结构（默认值：false）
  defaultExpandAll: false, // 不默认展开所有行，由用户手动控制
}))

// 表单配置
const formConfig = computed(() => ({
  ...menuFormConfig,
  title: formMode.value === 'create' ? '新增菜单' : '编辑菜单',
  fields: menuFormConfig.fields.map((field) => {
    if (field.key === 'parentId') {
      // 为上级菜单字段设置树形选项
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

  return menuActionButtons.map((button) => {
    if (button.key === 'toggle-expand') {
      return {
        ...button,
        text: isExpanded ? '收起' : '展开',
        icon: isExpanded ? ChevronUpOutline : ChevronDownOutline,
      }
    }
    return button
  })
})

// ==================== 数据加载方法 ====================

// 菜单树数据转换函数
const convertMenuToTreeOption = (menu: MenuTreeVO): TreeOption => ({
  key: menu.menuId,
  label: menu.menuName,
  children: menu.children?.map(convertMenuToTreeOption),
})

// 加载父节点树数据（用于表单上级菜单选择）
const loadParentTree = async (excludeId?: string) => {
  try {
    const treeData = await menuApi.parentTree(excludeId)
    parentTreeOptions.value = treeData.map(convertMenuToTreeOption)
  } catch (error) {
    console.error('加载父节点树数据失败:', error)
    parentTreeOptions.value = []
  }
}

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
const handleFormSubmit = async (data: Partial<SaveMenuDTO>) => {
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
        // 编辑模式：排除当前编辑的菜单ID及其子节点
        const updateData = formData as Partial<SaveMenuDTO>
        loadParentTree(updateData.menuId)
      } else {
        // 新增模式：不排除任何ID，允许选择所有菜单作为父节点
        loadParentTree()
      }
    }
  },
  { immediate: false },
)

// 监听表单数据变化，修复编辑时的验证问题
watch(
  () => formData.menuType,
  (newValue) => {
    if (newValue !== undefined && newValue !== null && formVisible.value) {
      // 当menuType有值时，延迟重置表单验证状态，确保数据已完全设置
      setTimeout(() => {
        formRef.value?.restoreValidation()
      }, 50)
    }
  },
)

// ==================== 生命周期 ====================

// 组件挂载时加载数据
onMounted(async () => {
  await loadDataList()
})
</script>
