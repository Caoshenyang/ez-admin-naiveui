/**
 * Axios 请求封装
 * 统一的请求拦截、响应拦截和错误处理
 */
import { useUserStore } from '@/stores/modules/user'
import { message } from '@/hooks/useNaiveApi'
import router from '@/router'
import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'

/**
 * Axios 请求配置扩展
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示错误消息（默认 true） */
  showError?: boolean
  /** 是否显示成功消息（默认 false） */
  showSuccess?: boolean
  /** 成功消息内容 */
  successMsg?: string
  /** 是否重试（暂未实现） */
  retry?: boolean
  /** 重试次数（暂未实现） */
  retryCount?: number
}

/**
 * 创建 Axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  withCredentials: false, // Bearer Token 模式不需要跨域 Cookie
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    // 添加 Bearer Token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // 添加时间戳防止缓存（仅 GET 请求）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 开发环境打印请求信息
    if (import.meta.env.DEV) {
      console.log('🚀 Request:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        params: config.params,
        data: config.data
      })
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response) => {
    const config = response.config as RequestConfig

    // 开发环境打印响应信息
    if (import.meta.env.DEV) {
      console.log('✅ Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      })
    }

    // 处理文件下载等特殊响应类型
    if (config.responseType === 'blob') {
      return response
    }

    const res = response.data as ApiResponse

    // 判断业务是否成功（支持 code: 200 和 code: 0）
    const isSuccess = res.code === 200 || res.code === 0

    if (isSuccess) {
      // 显示成功消息（如果配置了）
      if (config.showSuccess && config.successMsg) {
        message.success(config.successMsg)
      }
      // 返回业务数据
      return res.data
    }

    // 处理业务错误
    const errorMsg = res.message || '请求失败'
    if (config.showError !== false) {
      message.error(errorMsg)
    }

    return Promise.reject(new Error(errorMsg))
  },
  async (error: AxiosError) => {
    const config = error.config as RequestConfig
    const { response } = error

    // 开发环境打印错误信息
    if (import.meta.env.DEV) {
      console.error('❌ Response Error:', {
        url: config?.url,
        status: response?.status,
        message: error.message,
        data: response?.data
      })
    }

    // 请求被取消，不显示错误
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
      return Promise.reject(error)
    }

    // 处理有响应的 HTTP 错误
    if (response) {
      const { status } = response
      let errorMsg = '请求失败'

      switch (status) {
        case 400:
          errorMsg = '请求参数错误'
          break
        case 401:
          errorMsg = '登录已过期，请重新登录'
          // 清除用户信息并跳转登录页
          const userStore = useUserStore()
          userStore.resetUserState()
          router.push('/login')
          break
        case 403:
          errorMsg = '没有权限访问'
          break
        case 404:
          errorMsg = '请求的资源不存在'
          break
        case 500:
          errorMsg = '服务器内部错误'
          break
        case 502:
          errorMsg = '网关错误'
          break
        case 503:
          errorMsg = '服务不可用'
          break
        case 504:
          errorMsg = '网关超时'
          break
        default:
          errorMsg = `请求失败 (${status})`
      }

      if (config?.showError !== false) {
        message.error(errorMsg)
      }

      return Promise.reject(error)
    }

    // 处理网络错误
    if (error.code === 'ECONNABORTED') {
      const errorMsg = '请求超时，请检查网络连接'
      if (config?.showError !== false) {
        message.error(errorMsg)
      }
      return Promise.reject(error)
    }

    // 其他错误
    const errorMsg = error.message || '网络错误，请检查网络连接'
    if (config?.showError !== false) {
      message.error(errorMsg)
    }

    return Promise.reject(error)
  }
)

/**
 * 封装的请求方法
 */
export const request = {
  /**
   * GET 请求
   */
  get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return service.get(url, config)
  },

  /**
   * POST 请求
   */
  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  /**
   * PUT 请求
   */
  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param data 请求体数据（可选，用于批量删除等场景）
   * @param config 额外配置
   */
  delete<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return service.delete(url, {
      ...config,
      data: data ?? config?.data
    })
  },

  /**
   * PATCH 请求
   */
  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },

  /**
   * 文件上传
   */
  upload<T = unknown>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
    return service.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 文件下载
   */
  download(url: string, filename?: string, config?: RequestConfig): Promise<Blob> {
    return service
      .get<Blob>(url, {
        ...config,
        responseType: 'blob'
      })
      .then((response) => {
        const blob = response.data

        // 如果提供了文件名，自动触发下载
        if (filename) {
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = filename
          link.click()
          window.URL.revokeObjectURL(downloadUrl)
        }

        return blob
      })
  }
}

export default service
