import { ref, reactive } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'

/**
 * 表单 Hook
 */
export function useForm<T extends Record<string, any> = Record<string, any>>(defaultValue: T) {
  const formRef = ref<FormInst | null>(null)
  const formData = reactive<T>({ ...defaultValue })
  const loading = ref(false)

  /**
   * 重置表单
   */
  function resetForm() {
    Object.assign(formData, defaultValue)
    formRef.value?.restoreValidation()
  }

  /**
   * 设置表单值
   */
  function setValues(values: Partial<T>) {
    Object.assign(formData, values)
  }

  /**
   * 验证表单
   */
  async function validate() {
    return await formRef.value?.validate()
  }

  /**
   * 恢复验证
   */
  function restoreValidation() {
    formRef.value?.restoreValidation()
  }

  return {
    formRef,
    formData,
    loading,
    resetForm,
    setValues,
    validate,
    restoreValidation
  }
}

/**
 * 表单对话框 Hook
 */
export function useFormModal<T extends Record<string, any> = Record<string, any>>(defaultValue: T) {
  const { formRef, formData, loading, resetForm, setValues, validate } = useForm(defaultValue)
  const visible = ref(false)
  const title = ref('')
  const mode = ref<'add' | 'edit'>('add')

  /**
   * 新增
   */
  function handleAdd() {
    mode.value = 'add'
    title.value = '新增'
    resetForm()
    visible.value = true
  }

  /**
   * 编辑
   */
  function handleEdit(row: any) {
    mode.value = 'edit'
    title.value = '编辑'
    setValues(row)
    visible.value = true
  }

  /**
   * 确认
   */
  async function handleConfirm(callback: (data: T, mode: 'add' | 'edit') => Promise<void>) {
    try {
      await validate()
      loading.value = true
      await callback(formData as T, mode.value)
      visible.value = false
      resetForm()
    } catch (error) {
      console.error('Form confirm error:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 取消
   */
  function handleCancel() {
    visible.value = false
    resetForm()
  }

  return {
    formRef,
    formData,
    loading,
    visible,
    title,
    mode,
    handleAdd,
    handleEdit,
    handleConfirm,
    handleCancel,
    resetForm
  }
}
