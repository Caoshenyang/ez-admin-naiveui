<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import {
  NCard,
  NSpace,
  NButton,
  NInput,
  NTabs,
  NTabPane,
  NDataTable,
  NTag,
  NPopconfirm,
  useDialog,
  useMessage
} from 'naive-ui'
import { CreateOutline as EditIcon, TrashOutline as DeleteIcon, CheckmarkCircleOutline as CheckIcon } from '@vicons/ionicons5'
import { getDictTypeList, addDictType, updateDictType, deleteDictType } from '@/api'

const dialog = useDialog()
const message = useMessage()

const activeTab = ref('type')

// 字典类型表格数据
const typeLoading = ref(false)
const typeDataSource = ref<any[]>([])
const typeTotal = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 搜索参数
const searchParams = ref({
  name: '',
  code: ''
})

// 加载字典类型列表
async function loadDictTypes() {
  typeLoading.value = true
  try {
    const res = await getDictTypeList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    })
    typeDataSource.value = res.list || []
    typeTotal.value = res.total || 0
  } catch (error) {
    console.error('Load dict types error:', error)
    typeDataSource.value = []
    typeTotal.value = 0
  } finally {
    typeLoading.value = false
  }
}

/**
 * 搜索
 */
function handleSearch() {
  currentPage.value = 1
  loadDictTypes()
}

/**
 * 重置
 */
function handleReset() {
  searchParams.value = {
    name: '',
    code: ''
  }
  currentPage.value = 1
  loadDictTypes()
}

/**
 * 新增字典类型
 */
function handleAddType() {
  dialog.create({
    title: '新增字典类型',
    content: () => {
      const formData = ref({
        name: '',
        code: '',
        description: '',
        sort: 0,
        status: true
      })

      return h('div', { style: { padding: '20px' } }, [
        h('input', {
          placeholder: '字典名称',
          value: formData.value.name,
          onInput: (e: any) => (formData.value.name = e.target.value)
        }),
        h('input', {
          placeholder: '字典编码',
          value: formData.value.code,
          onInput: (e: any) => (formData.value.code = e.target.value)
        })
      ])
    },
    positiveText: '确定',
    onPositiveClick: async () => {
      // 简化处理，实际应该使用完整的表单
      message.info('功能开发中')
    }
  })
}

/**
 * 编辑字典类型
 */
function handleEditType(row: any) {
  message.info('功能开发中')
}

/**
 * 删除字典类型
 */
function handleDeleteType(row: any) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除字典类型"${row.name}"吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteDictType(row.id)
        message.success('删除成功')
        loadDictTypes()
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

/**
 * 查看字典数据
 */
function handleViewData(row: any) {
  message.info(`查看字典"${row.name}"的数据`)
}

/**
 * 分页改变
 */
function handlePageChange(page: number) {
  currentPage.value = page
  loadDictTypes()
}

/**
 * 每页条数改变
 */
function handlePageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  loadDictTypes()
}

// 字典类型表格列
const typeColumns = [
  { title: '字典名称', key: 'name', width: 150 },
  { title: '字典编码', key: 'code', width: 150 },
  { title: '描述', key: 'description', width: 200 },
  { title: '排序', key: 'sort', width: 80 },
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
                type: 'info',
                onClick: () => handleViewData(row)
              },
              {
                default: () => '数据',
                icon: () => h('span', '📋')
              }
            ),
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleEditType(row)
              },
              {
                default: () => '编辑',
                icon: () => h(EditIcon)
              }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteType(row)
              },
              {
                default: () => '确定删除该字典类型吗？',
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
  loadDictTypes()
})
</script>

<template>
  <div class="dict-management">
    <n-card title="字典管理" :bordered="false">
      <n-tabs v-model:value="activeTab" type="line">
        <n-tab-pane name="type" tab="字典类型">
          <!-- 搜索表单 -->
          <n-space :size="12" style="margin-bottom: 16px">
            <n-input
              v-model:value="searchParams.name"
              placeholder="请输入字典名称"
              clearable
              style="width: 200px"
            />
            <n-input
              v-model:value="searchParams.code"
              placeholder="请输入字典编码"
              clearable
              style="width: 200px"
            />
            <n-button type="primary" @click="handleSearch">搜索</n-button>
            <n-button @click="handleReset">重置</n-button>
            <n-button type="primary" @click="handleAddType">
              <template #icon>
                <n-icon><CheckIcon /></n-icon>
              </template>
              新增
            </n-button>
          </n-space>

          <!-- 表格 -->
          <n-data-table
            :columns="typeColumns"
            :data="typeDataSource"
            :loading="typeLoading"
            :row-key="row => row.id"
            :scroll-x="1200"
            :max-height="600"
            :single-line="false"
          />

          <!-- 分页 -->
          <div class="pagination">
            <n-pagination
              v-model:page="currentPage"
              :page-count="Math.ceil(typeTotal / pageSize)"
              :page-size="pageSize"
              :page-sizes="[10, 20, 30, 50, 100]"
              show-size-picker
              :item-count="typeTotal"
              @update:page="handlePageChange"
              @update:page-size="handlePageSizeChange"
            />
          </div>
        </n-tab-pane>

        <n-tab-pane name="data" tab="字典数据">
          <n-empty description="请先选择字典类型查看数据" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<style scoped>
.dict-management {
  padding: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
