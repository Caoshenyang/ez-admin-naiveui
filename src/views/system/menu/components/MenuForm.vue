<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NTreeSelect,
  NRadioGroup,
  NRadio
} from 'naive-ui'
import { useFormModal } from '@/composables/useForm'
import { getMenuTree } from '@/api'

const emit = defineEmits<{
  (e: 'submit', data: any, mode: 'add' | 'edit'): void
}>()

const {
  formRef,
  formData,
  loading,
  visible,
  title,
  mode,
  handleAdd,
  handleEdit,
  handleConfirm,
  handleCancel
} = useFormModal({
  parentId: null,
  name: '',
  path: '',
  component: '',
  redirect: '',
  icon: '',
  type: 'menu',
  sort: 0,
  visible: true,
  status: true,
  keepAlive: false,
  affix: false
})

// 表单验证规则
const rules = {
  name: {
    required: true,
    message: '请输入菜单名称',
    trigger: 'blur'
  },
  path: {
    required: true,
    message: '请输入路由路径',
    trigger: 'blur'
  }
}

// 菜单类型选项
const menuTypeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' }
]

// 图标选项（简化版）
const iconOptions = [
  { label: '仪表盘', value: 'DashboardOutline' },
  { label: '设置', value: 'SettingsOutline' },
  { label: '用户', value: 'PersonOutline' },
  { label: '角色', value: 'PeopleOutline' },
  { label: '菜单', value: 'MenuOutline' },
  { label: '列表', value: 'ListOutline' },
  { label: '文档', value: 'DocumentTextOutline' }
]

// 父级菜单树
const parentMenuTree = ref<any[]>([])

// 加载菜单树
async function loadMenuTree() {
  try {
    const res = await getMenuTree()
    parentMenuTree.value = transformToTreeData([
      {
        id: 0,
        name: '顶级菜单',
        children: res
      }
    ])
  } catch (error) {
    console.error('Load menu tree error:', error)
  }
}

// 转换为树形选择数据
function transformToTreeData(menus: any[]): any[] {
  return menus.map(menu => ({
    label: menu.meta?.title || menu.name,
    value: menu.id,
    children: menu.children ? transformToTreeData(menu.children) : undefined
  }))
}

// 监听对话框打开
watch(visible, val => {
  if (val) {
    loadMenuTree()
  }
})

// 是否显示路由路径
const showPath = computed(() => formData.type !== 'button')

// 是否显示组件路径
const showComponent = computed(() => formData.type === 'menu')

// 提交表单
async function handleSubmit() {
  await handleConfirm(async (data, mode) => {
    const submitData = {
      ...data,
      status: data.status ? 1 : 0,
      visible: data.visible ? 1 : 0,
      parentId: data.parentId || null
    }
    emit('submit', submitData, mode)
  })
}

// 暴露方法
defineExpose({
  handleAdd,
  handleEdit
})
</script>

<template>
  <n-modal v-model:show="visible" :title="title" preset="card" style="width: 700px">
    <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="100">
      <n-form-item label="上级菜单" path="parentId">
        <n-tree-select
          v-model:value="formData.parentId"
          :options="parentMenuTree"
          clearable
          placeholder="请选择上级菜单（不选则为顶级菜单）"
        />
      </n-form-item>

      <n-form-item label="菜单类型" path="type">
        <n-radio-group v-model:value="formData.type">
          <n-radio value="directory">目录</n-radio>
          <n-radio value="menu">菜单</n-radio>
          <n-radio value="button">按钮</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="菜单名称" path="name">
        <n-input v-model:value="formData.name" placeholder="请输入菜单名称" />
      </n-form-item>

      <n-form-item v-if="showPath" label="路由路径" path="path">
        <n-input v-model:value="formData.path" placeholder="请输入路由路径，如：/system/user" />
      </n-form-item>

      <n-form-item v-if="showComponent" label="组件路径" path="component">
        <n-input v-model:value="formData.component" placeholder="请输入组件路径，如：system/user/index" />
      </n-form-item>

      <n-form-item label="重定向" path="redirect">
        <n-input v-model:value="formData.redirect" placeholder="请输入重定向路径" />
      </n-form-item>

      <n-form-item label="菜单图标" path="icon">
        <n-select v-model:value="formData.icon" :options="iconOptions" placeholder="请选择图标" clearable />
      </n-form-item>

      <n-form-item label="排序" path="sort">
        <n-input-number v-model:value="formData.sort" :min="0" placeholder="请输入排序号" style="width: 100%" />
      </n-form-item>

      <n-form-item label="显示状态" path="visible">
        <n-switch v-model:value="formData.visible" />
        <template #feedback>隐藏后菜单将不会显示在界面中</template>
      </n-form-item>

      <n-form-item label="菜单状态" path="status">
        <n-switch v-model:value="formData.status" />
      </n-form-item>

      <n-form-item v-if="showComponent" label="是否缓存" path="keepAlive">
        <n-switch v-model:value="formData.keepAlive" />
        <template #feedback>开启后页面会被缓存</template>
      </n-form-item>

      <n-form-item v-if="showComponent" label="是否固定" path="affix">
        <n-switch v-model:value="formData.affix" />
        <template #feedback>固定后标签页不可关闭</template>
      </n-form-item>
    </n-form>

    <template #footer>
      <n-space justify="end">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" :loading="loading" @click="handleSubmit">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
