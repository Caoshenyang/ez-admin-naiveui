<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NDataTable, NButton, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

interface Dept {
  deptId: number
  deptName: string
  parentId?: number
  deptSort?: number
  status?: number
  description?: string
  createTime?: string
  children?: Dept[]
}

const loading = ref(false)
const dataSource = ref<Dept[]>([])

const columns: DataTableColumns<Dept> = [
  { title: '部门ID', key: 'deptId', width: 100 },
  { title: '部门名称', key: 'deptName', width: 200 },
  { title: '排序', key: 'deptSort', width: 100 },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(NTag, { type: row.status === 1 ? 'success' : 'default' }, {
        default: () => (row.status === 1 ? '正常' : '停用')
      })
    }
  },
  { title: '描述', key: 'description', ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createTime', width: 180 }
]

function loadData() {
  loading.value = true
  // TODO: 调用 API 加载数据
  setTimeout(() => {
    dataSource.value = []
    loading.value = false
  }, 500)
}

loadData()
</script>

<template>
  <div class="dept-management">
    <n-card title="部门管理">
      <n-space vertical :size="16">
        <n-space>
          <n-button type="primary">新增</n-button>
          <n-button>展开/折叠</n-button>
        </n-space>

        <n-data-table
          :columns="columns"
          :data="dataSource"
          :loading="loading"
          :row-key="(row: Dept) => row.deptId"
        />
      </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.dept-management {
  padding: 16px;
}
</style>
