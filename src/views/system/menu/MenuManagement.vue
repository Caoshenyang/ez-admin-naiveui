<script setup lang="ts">
import { h, ref, onMounted, reactive } from 'vue'
import {
  NCard,
  NSpace,
  NButton,
  NTag,
  NIcon,
  NSwitch,
  useDialog,
  useMessage
} from 'naive-ui'
import { CreateOutline as EditIcon, TrashOutline as DeleteIcon, CheckmarkCircleOutline as CheckIcon, AddOutline as AddIcon } from '@vicons/ionicons5'
import { getMenuTree, addMenu, updateMenu, deleteMenu } from '@/api'

const dialog = useDialog()
const message = useMessage()

// 表单引用
const menuFormRef = ref()

// 表格数据
const loading = ref(false)
const dataSource = ref<any[]>([])

// 加载菜单树
async function loadMenuTree() {
  loading.value = true
  try {
    const res = await getMenuTree()
    dataSource.value = res
  } catch (error) {
    console.error('Load menu tree error:', error)
    dataSource.value = []
  } finally {
    loading.value = false
  }
}

/**
 * 刷新
 */
function handleRefresh() {
  loadMenuTree()
}

/**
 * 新增
 */
function handleAdd(row?: any) {
  const parentId = row ? row.id : null
  menuFormRef.value?.handleAdd({
    parentId
  })
}

/**
 * 编辑
 */
function handleEdit(row: any) {
  menuFormRef.value?.handleEdit({
    ...row,
    visible: row.visible === 1,
    status: row.status === 1,
    keepAlive: row.keepAlive === 1,
    affix: row.affix === 1
  })
}

/**
 * 删除
 */
function handleDelete(row: any) {
  // 检查是否有子菜单
  if (row.children && row.children.length > 0) {
    dialog.warning({
      title: '无法删除',
      content: '该菜单下还有子菜单，请先删除子菜单',
      positiveText: '确定'
    })
    return
  }

  dialog.warning({
    title: '确认删除',
    content: `确定要删除菜单"${row.meta?.title || row.name}"吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteMenu(row.id)
        message.success('删除成功')
        loadMenuTree()
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
    if (mode === 'add') {
      await addMenu(data)
      message.success('新增成功')
    } else {
      await updateMenu(data.id, data)
      message.success('编辑成功')
    }

    loadMenuTree()
  } catch (error) {
    message.error(mode === 'add' ? '新增失败' : '编辑失败')
  }
}

/**
 * 渲染图标
 */
function renderIcon(icon: string) {
  if (!icon) return null
  // 这里简化处理，实际应该动态导入图标组件
  return h(NIcon, null, { default: () => h('span', icon.charAt(0)) })
}

/**
 * 获取菜单类型标签
 */
function getMenuTypeTag(type: string) {
  const typeMap = {
    directory: { text: '目录', type: 'info' },
    menu: { text: '菜单', type: 'success' },
    button: { text: '按钮', type: 'warning' }
  }
  const config = typeMap[type as keyof typeof typeMap] || { text: type, type: 'default' }
  return h(NTag, { type: config.type as any, size: 'small' }, { default: () => config.text })
}

/**
 * 创建表格列
 */
const createColumns = () => [
  {
    type: 'selection'
  },
  {
    title: '菜单名称',
    key: 'name',
    width: 250,
    render(row: any) {
      return h(NSpace, { align: 'center' }, () => [
        renderIcon(row.meta?.icon),
        h('span', row.meta?.title || row.name)
      ])
    }
  },
  {
    title: '图标',
    key: 'icon',
    width: 80,
    render(row: any) {
      return renderIcon(row.meta?.icon)
    }
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
    render(row: any) {
      return getMenuTypeTag(row.type)
    }
  },
  {
    title: '路由路径',
    key: 'path',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '组件路径',
    key: 'component',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '排序',
    key: 'sort',
    width: 80,
    align: 'center'
  },
  {
    title: '显示',
    key: 'visible',
    width: 100,
    render(row: any) {
      return h(NSwitch, {
        value: row.visible === 1,
        disabled: true
      })
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row: any) {
      return h(
        NTag,
        { type: row.status === 1 ? 'success' : 'default', size: 'small' },
        { default: () => (row.status === 1 ? '启用' : '禁用') }
      )
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 250,
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
                type: 'primary',
                onClick: () => handleAdd(row)
              },
              {
                default: () => '新增',
                icon: () => h(AddIcon)
              }
            ),
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
                type: 'error',
                onClick: () => handleDelete(row)
              },
              {
                default: () => '删除',
                icon: () => h(DeleteIcon)
              }
            )
          ]
        }
      )
    }
  }
]

onMounted(() => {
  loadMenuTree()
})
</script>

<template>
  <div class="menu-management">
    <n-card title="菜单管理" :bordered="false">
      <!-- 工具栏 -->
      <n-space :size="12" style="margin-bottom: 16px">
        <n-button type="primary" @click="handleAdd()">
          <template #icon>
            <n-icon><CheckIcon /></n-icon>
          </template>
          新增顶级菜单
        </n-button>
        <n-button @click="handleRefresh">刷新</n-button>
      </n-space>

      <!-- 树形表格 -->
      <n-data-table
        :columns="createColumns()"
        :data="dataSource"
        :loading="loading"
        :row-key="row => row.id"
        :max-height="600"
        :single-line="false"
        :default-expand-all="true"
      />
    </n-card>

    <!-- 表单对话框 -->
    <MenuForm ref="menuFormRef" @submit="handleSubmit" />
  </div>
</template>
