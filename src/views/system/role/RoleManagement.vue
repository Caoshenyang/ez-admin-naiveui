<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import {
  NCard,
  NSpace,
  NButton,
  NInput,
  NPopconfirm,
  NTag,
  useDialog,
  useMessage
} from 'naive-ui'
import { CreateOutline as EditIcon, TrashOutline as DeleteIcon, CheckmarkCircleOutline as CheckIcon, KeyOutline as KeyIcon } from '@vicons/ionicons5'
import { getRoleList, addRole, updateRole, deleteRole } from '@/api'
import { useTable } from '@/composables/useTable'
import RoleForm from './components/RoleForm.vue'

const dialog = useDialog()
const message = useMessage()

// 表单引用
const roleFormRef = ref()

// 表格数据
const { loading, dataSource, total, currentPage, pageSize, handlePageChange, handlePageSizeChange, load } =
  useTable(getRoleList)

// 搜索参数
const searchParams = ref({
  name: '',
  code: ''
})

/**
 * 搜索
 */
function handleSearch() {
  load()
}

/**
 * 重置
 */
function handleReset() {
  searchParams.value = {
    name: '',
    code: ''
  }
  load()
}

/**
 * 新增
 */
function handleAdd() {
  roleFormRef.value?.handleAdd()
}

/**
 * 编辑
 */
function handleEdit(row: any) {
  roleFormRef.value?.handleEdit({
    ...row,
    status: row.status === 1
  })
}

/**
 * 删除
 */
function handleDelete(row: any) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除角色"${row.name}"吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteRole(row.id)
        message.success('删除成功')
        load()
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

/**
 * 提交表单
 */
async function handleSubmit(data: any, mode: 'add' | 'edit') {
  try {
    const submitData = {
      ...data,
      status: data.status ? 1 : 0
    }

    if (mode === 'add') {
      await addRole(submitData)
      message.success('新增成功')
    } else {
      await updateRole(data.id, submitData)
      message.success('编辑成功')
    }

    load()
  } catch (error) {
    message.error(mode === 'add' ? '新增失败' : '编辑失败')
  }
}

/**
 * 分配权限
 */
function handleAssignPermissions(row: any) {
  dialog.info({
    title: '功能开发中',
    content: '权限分配功能正在开发中...',
    positiveText: '确定'
  })
}

// 表格列
const columns = [
  { title: '角色名称', key: 'name', width: 150 },
  { title: '角色编码', key: 'code', width: 150 },
  { title: '描述', key: 'description', width: 200 },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row: any) {
      return h(
        NTag,
        { type: row.status === 1 ? 'success' : 'default' },
        { default: () => (row.status === 1 ? '启用' : '禁用') }
      )
    }
  },
  { title: '创建时间', key: 'createTime', width: 180 },
  {
    title: '操作',
    key: 'actions',
    width: 280,
    fixed: 'right' as const,
    render(row: any) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleEdit(row)
              },
              {
                default: () => '编辑',
                icon: () => h(EditIcon)
              }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'info',
                onClick: () => handleAssignPermissions(row)
              },
              {
                default: () => '权限',
                icon: () => h(KeyIcon)
              }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row)
              },
              {
                default: () => '确定删除该角色吗？',
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error'
                    },
                    {
                      default: () => '删除',
                      icon: () => h(DeleteIcon)
                    }
                  )
              }
            )
          ]
        }
      )
    }
  }
]

onMounted(() => {
  load()
})
</script>

<template>
  <div class="role-management">
    <n-card title="角色管理" :bordered="false">
      <!-- 搜索表单 -->
      <n-space :size="12" style="margin-bottom: 16px">
        <n-input
          v-model:value="searchParams.name"
          placeholder="请输入角色名称"
          clearable
          style="width: 200px"
        />
        <n-input
          v-model:value="searchParams.code"
          placeholder="请输入角色编码"
          clearable
          style="width: 200px"
        />
        <n-button type="primary" @click="handleSearch">搜索</n-button>
        <n-button @click="handleReset">重置</n-button>
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <n-icon><CheckIcon /></n-icon>
          </template>
          新增
        </n-button>
      </n-space>

      <!-- 表格 -->
      <n-data-table
        :columns="columns"
        :data="dataSource"
        :loading="loading"
        :row-key="row => row.id"
        :scroll-x="1200"
        :max-height="600"
        :single-line="false"
      />

      <!-- 分页 -->
      <div class="pagination">
        <n-pagination
          v-model:page="currentPage"
          :page-count="Math.ceil(total / pageSize)"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 50, 100]"
          show-size-picker
          :item-count="total"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </n-card>

    <!-- 表单对话框 -->
    <RoleForm ref="roleFormRef" @submit="handleSubmit" />
  </div>
</template>
