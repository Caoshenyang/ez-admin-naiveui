import type { Directive } from 'vue'
import { hasRole, hasPermission } from '@/utils/permission'

/**
 * 权限指令
 * 用法：v-auth="['admin']" 或 v-auth="{ type: 'role', value: ['admin'] }"
 */
export const auth: Directive = {
  mounted(el, binding) {
    const { value } = binding
    let checkFn: () => boolean

    // 支持多种写法
    if (typeof value === 'string') {
      // v-auth="'admin'"
      checkFn = () => hasRole([value])
    } else if (Array.isArray(value)) {
      // v-auth="['admin']" 或 v-auth="['user:add']"
      // 如果是角色权限（以 role: 开头），则使用角色检查
      if (value.length > 0 && value[0].startsWith('role:')) {
        const roles = value.map(v => v.replace('role:', ''))
        checkFn = () => hasRole(roles)
      } else {
        // 默认使用权限检查
        checkFn = () => hasPermission(value)
      }
    } else if (value && typeof value === 'object') {
      // v-auth="{ type: 'role', value: ['admin'] }"
      const { type, value: val } = value
      if (type === 'role') {
        checkFn = () => hasRole(val)
      } else {
        checkFn = () => hasPermission(val)
      }
    } else {
      return
    }

    if (!checkFn()) {
      // 移除元素
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 复制指令
 * 用法：v-copy="text"
 */
export const copy: Directive = {
  mounted(el, binding) {
    el.addEventListener('click', async () => {
      const text = binding.value
      if (!text) return

      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text)
          window.$message?.success('复制成功')
        } else {
          // 降级方案
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
          window.$message?.success('复制成功')
        }
      } catch (error) {
        window.$message?.error('复制失败')
      }
    })
  }
}

/**
 * 防抖指令
 * 用法：v-debounce="{ fn: handleSubmit, delay: 300 }"
 */
export const debounce: Directive = {
  mounted(el, binding) {
    let timer: ReturnType<typeof setTimeout> | null = null
    const { value } = binding

    if (value && typeof value === 'object' && value.fn) {
      const { fn, delay = 300 } = value

      el.addEventListener('click', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          fn()
        }, delay)
      })
    }
  }
}

/**
 * 节流指令
 * 用法：v-throttle="{ fn: handleSubmit, delay: 1000 }"
 */
export const throttle: Directive = {
  mounted(el, binding) {
    let timer: ReturnType<typeof setTimeout> | null = null
    const { value } = binding

    if (value && typeof value === 'object' && value.fn) {
      const { fn, delay = 1000 } = value

      el.addEventListener('click', () => {
        if (timer) return

        fn()
        timer = setTimeout(() => {
          timer = null
        }, delay)
      })
    }
  }
}

/**
 * 长按指令
 * 用法：v-longpress="{ fn: handleLongPress, delay: 500 }"
 */
export const longpress: Directive = {
  mounted(el, binding) {
    const { value } = binding

    if (value && typeof value === 'object' && value.fn) {
      const { fn, delay = 500 } = value

      let timer: ReturnType<typeof setTimeout> | null = null

      const start = () => {
        timer = setTimeout(() => {
          fn()
        }, delay)
      }

      const clear = () => {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      }

      el.addEventListener('mousedown', start)
      el.addEventListener('touchstart', start)
      el.addEventListener('mouseup', clear)
      el.addEventListener('mouseleave', clear)
      el.addEventListener('touchend', clear)
      el.addEventListener('touchcancel', clear)
    }
  }
}
