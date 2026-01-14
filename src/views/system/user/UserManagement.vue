<template>
  <n-card title="用户管理">
    <template #header-extra>
      <!-- 操作按钮组 -->
      <EzButtonGroup :buttons="userActionButtons" @action="handleAction" />
    </template>
    <n-split direction="horizontal" style="height: calc(100vh - 118px)" max="300px" min="100px" default-size="200px">
      <template #1>
        <div class="pr-4">
          <div class="mb-2">
            <n-input
              v-model:value="deptSearchValue"
              placeholder="搜索部门"
              clearable
              @input="handleDeptSearch"
              @clear="handleDeptSearchClear"
            >
              <template #prefix>
                <n-icon size="16">
                  <SearchOutline />
                </n-icon>
              </template>
            </n-input>
          </div>

          <n-tree
            :data="deptTreeData"
            :pattern="deptSearchValue"
            :render-option="renderTreeOption"
            :node-props="nodeProps"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            :show-irrelevant-nodes="false"
            block-line
            selectable
            filterable
            @update:expanded-keys="handleExpandedKeysChange"
            @update:selected-keys="handleSelectedKeysChange"
          />
        </div>
      </template>
      <template #2>
        <div class="pl-6">
          <!-- 用户列表表格 -->
          <EzTable :config="tableConfig" :checked-keys="checkedRowKeys" @check-change="handleCheck" />
        </div>
      </template>
    </n-split>
  </n-card>

  <!-- 用户表单 -->
  <EzForm
    v-model="formVisible"
    :config="formConfig"
    :loading="formLoading"
    :form-data="formData"
    @update:form-data="handleFormDataUpdate"
    @submit="handleFormSubmit"
    @cancel="handleCancel"
  />

  <!-- 用户详情模态框 -->
  <EzDetailModal
    v-model:show="detailVisible"
    :data="detailData"
    :config="(userCrudConfig as any).detailConfig"
    :loading="detailLoading"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useCrud, createDefaultQueryParams } from '@/hooks/useCrud'
import { handleButtonActions } from '@/utils/actionHandler'
import { SearchOutline } from '@vicons/ionicons5'
import { deptApi } from '@/api/dept'
import EzTable from '@/components/common/EzTable.vue'
import EzDetailModal from '@/components/common/EzDetailModal.vue'
import { userFormConfig, userActionButtons, userCrudConfig } from './'
import type { UserListVO, UserQuery, UserCreateDTO, UserUpdateDTO, DeptListVO } from '@/types'
import type { EzTableConfig } from '@/hooks/types/table'
import type { TreeOption } from 'naive-ui'

// === 查询参数管理 ===
const queryParams = ref<UserQuery>(
  createDefaultQueryParams<UserQuery>({
    keywords: '',
  }),
)

// === 部门树相关状态 ===
const deptTreeData = ref<TreeOption[]>([])
const deptSearchValue = ref('')
const expandedKeys = ref<(string | number)[]>([])
const selectedKeys = ref<(string | number)[]>([])
const deptList = ref<DeptListVO[]>([])
const defaultExpandedKeys = ref<(string | number)[]>([])

// === 使用CRUD Hook（约定：自动处理所有CRUD逻辑，包含表格） ===
const crud = useCrud(userCrudConfig)

// === 解构响应式数据和方法（按功能分组） ===

// 表格相关状态
const { loading, dataList: userList, columns, checkedRowKeys, pagination } = crud

// 表单相关状态
const { formVisible, formLoading, formMode, formData, handleCancel, handleFormDataUpdate } = crud

// 详情相关状态
const { detailVisible, detailLoading, detailData } = crud

// 查询相关方法
const { resetPaginationAndLoad, loadDataList } = crud

// CRUD操作方法
const { handleAdd, handleSubmit, handleBatchDelete } = crud

// 表格配置
const tableConfig = computed(() => ({
  columns: columns.value as import('naive-ui').DataTableColumns<UserListVO>,
  data: userList.value as UserListVO[],
  loading: loading.value,
  rowKey: (row: UserListVO) => row.userId,
  pagination: pagination!,
}) as EzTableConfig<UserListVO>)

// === 计算属性 ===
const formConfig = computed(() => ({
  ...userFormConfig,
  title: formMode.value === 'create' ? '新增用户' : '编辑用户',
  fields: userFormConfig.fields.map((field) => {
    if (formMode.value === 'create') {
      return field
    } else {
      switch (field.key) {
        case 'username':
          return { ...field, disabled: true }
        default:
          return field
      }
    }
  }),
}))

// === 数据加载（集成表格分页和查询参数） ===

// === 表单提交（成功后刷新列表） ===
const handleFormSubmit = async (data: Partial<UserCreateDTO | UserUpdateDTO>) => {
  await handleSubmit(data)
  await loadDataList() // 刷新列表
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
    await loadDataList()
  })
}

// === 刷新功能 ===
const handleRefresh = () => {
  loadDataList()
}

// === 按钮action处理器 ===
const handleAction = handleButtonActions({
  add: handleAdd, // 新增按钮 -> 打开新增表单
  'batch-delete': handleBatchDeleteClick, // 批量删除按钮 -> 执行批量删除
  refresh: handleRefresh, // 刷新按钮 -> 刷新数据列表
})

// === 部门树相关方法 ===

// 转换部门数据为树形结构
const convertDeptToTreeOption = (dept: DeptListVO): TreeOption => ({
  key: dept.deptId,
  label: dept.deptName,
  children: dept.children?.map(convertDeptToTreeOption),
})

// 加载部门树数据
const loadDeptTree = async () => {
  try {
    const data = await deptApi.tree()
    deptList.value = data
    deptTreeData.value = data.map(convertDeptToTreeOption)

    // 默认展开第一级节点
    const defaultKeys = data.map((dept) => dept.deptId)
    expandedKeys.value = defaultKeys
    defaultExpandedKeys.value = defaultKeys
  } catch (error) {
    console.error('加载部门树失败:', error)
    deptTreeData.value = []
  }
}

// 部门搜索处理
const handleDeptSearch = () => {
  if (deptSearchValue.value.trim()) {
    // 有搜索关键词时，展开所有节点以显示搜索结果
    const allKeys: (string | number)[] = []
    const collectAllKeys = (nodes: TreeOption[]) => {
      nodes.forEach((node) => {
        if (node.key != null) {
          allKeys.push(node.key as string | number)
        }
        if (node.children) {
          collectAllKeys(node.children)
        }
      })
    }
    collectAllKeys(deptTreeData.value)
    expandedKeys.value = allKeys
  } else {
    // 没有搜索关键词时，恢复默认展开状态
    expandedKeys.value = [...defaultExpandedKeys.value]
  }
}

// 部门搜索清除
const handleDeptSearchClear = () => {
  deptSearchValue.value = ''
  // 恢复默认展开状态
  expandedKeys.value = [...defaultExpandedKeys.value]
}

// 树节点展开处理
const handleExpandedKeysChange = (keys: (string | number)[]) => {
  expandedKeys.value = keys
}

// 树节点选择处理
const handleSelectedKeysChange = (keys: (string | number)[]) => {
  selectedKeys.value = keys

  // 更新查询参数中的部门ID
  if (keys.length > 0 && keys[0] != null) {
    queryParams.value.search.deptId = String(keys[0])
  } else {
    queryParams.value.search.deptId = undefined
  }

  // 重新加载用户列表
  resetPaginationAndLoad()
}

// 树节点渲染
const renderTreeOption = ({ option }: { option: TreeOption }) => {
  return option.label
}

// 树节点属性
const nodeProps = ({ option }: { option: TreeOption }) => ({
  onClick() {
    const key = option.key as string | number
    selectedKeys.value = [key]
    handleSelectedKeysChange([key])
  },
})

// === 组件挂载时加载数据 ===
onMounted(async () => {
  await loadDeptTree()
  loadDataList()
})
</script>
