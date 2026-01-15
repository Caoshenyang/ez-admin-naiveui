<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import { NCard, NSpace, NButton, NInput, NPopconfirm, NTag, useDialog, useMessage } from 'naive-ui'
import { CreateOutline as EditIcon, TrashOutline as DeleteIcon, LockClosedOutline as LockIcon, CheckmarkCircleOutline as CheckIcon } from '@vicons/ionicons5'
import { getUserList, addUser, updateUser, deleteUser, resetUserPassword } from '@/api'
import { useTable } from '@/composables/useTable'
import UserForm from './components/UserForm.vue'

const dialog = useDialog()
const message = useMessage()

// 表单引用
const userFormRef = ref()

// 表格数据
const { loading, dataSource, total, currentPage, pageSize, handlePageChange, handlePageSizeChange, load } =
  useTable(getUserList)

// 搜索参数
const searchParams = ref({
  username: '',
  nickname: ''
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
    username: '',
    nickname: ''
  }
  load()
}

/**
 * 新增
 */
function handleAdd() {
  userFormRef.value?.handleAdd()
}

/**
 * 编辑
 */
function handleEdit(row: any) {
  userFormRef.value?.handleEdit({
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
    content: `确定要删除用户"${row.nickname}"吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteUser(row.id)
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
      await addUser(submitData)
      message.success('新增成功')
    } else {
      await updateUser(data.id, submitData)
      message.success('编辑成功')
    }

    load()
  } catch (error) {
    message.error(mode === 'add' ? '新增失败' : '编辑失败')
  }
}

/**
 * 重置密码
 */
function handleResetPassword(row: any) {
  dialog.create({
    title: '重置密码',
    content: () => {
      const password = ref('123456')
      return h('div', { style: { padding: '20px 0' } }, [
        h(NInput, {
          value: password.value,
          type: 'password',
          placeholder: '请输入新密码',
          onUpdateValue: val => {
            password.value = val
          }
        })
      ])
    },
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await resetUserPassword(row.id, '123456')
        message.success('重置成功，新密码为：123456')
      } catch (error) {
        message.error('重置失败')
      }
    }
  })
}

// 表格列
const columns = [
  { title: '用户名', key: 'username', width: 120 },
  { title: '昵称', key: 'nickname', width: 120 },
  { title: '邮箱', key: 'email', width: 180 },
  { title: '手机号', key: 'phone', width: 130 },
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
                type: 'warning',
                onClick: () => handleResetPassword(row)
              },
              {
                default: () => '重置密码',
                icon: () => h(LockIcon)
              }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row)
              },
              {
                default: () => '确定删除该用户吗？',
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
  <div class="user-management">
    <n-card title="用户管理" :bordered="false">
      <!-- 搜索表单 -->
      <n-space :size="12" style="margin-bottom: 16px">
        <n-input
          v-model:value="searchParams.username"
          placeholder="请输入用户名"
          clearable
          style="width: 200px"
        />
        <n-input
          v-model:value="searchParams.nickname"
          placeholder="请输入昵称"
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
        :scroll-x="1400"
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
    <UserForm ref="userFormRef" @submit="handleSubmit" />
  </div>
</template>
