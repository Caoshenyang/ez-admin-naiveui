import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios'
import type { ApiResponse } from '@/types/api'
import { getToken, clearTokens } from '@/utils/auth'

/**
 * Axios 请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示错误消息 */
  showError?: boolean
  /** 是否显示成功消息 */
  showSuccess?: boolean
  /** 是否重试 */
  retry?: boolean
  /** 重试次数 */
  retryCount?: number
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 30000,
  withCredentials: true, // 支持跨域 Cookie
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  config => {
    // Cookie 认证模式下，浏览器会自动发送 Cookie
    // 不需要手动添加 Authorization header

    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

/**
 * 是否正在刷新 token
 */
const isRefreshing = false

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  response => {
    const config = response.config as RequestConfig

    // 如果是下载文件等特殊请求，直接返回
    if (config.responseType === 'blob') {
      return response
    }

    const res = response.data as ApiResponse

    // 根据实际后端接口调整判断逻辑
    if (res.code === 200 || res.code === 0) {
      return res.data
    }

    // 处理业务错误
    const errorMsg = res.message || '请求失败'
    if (config.showError !== false) {
      window.$message?.error(errorMsg)
    }

    return Promise.reject(new Error(errorMsg))
  },
  async (error: AxiosError) => {
    const config = error.config as RequestConfig

    // 请求被取消，不显示错误
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
      return Promise.reject(error)
    }

    const { response } = error

    // 处理 HTTP 状态码错误
    if (response) {
      const { status } = response
      let errorMsg = '请求失败'

      switch (status) {
        case 400:
          errorMsg = '请求参数错误'
          break
        case 401:
          errorMsg = '登录已过期，请重新登录'
          // 清除 token 并跳转登录
          clearTokens()
          window.location.href = '/login'
          return Promise.reject(error)
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
        window.$message?.error(errorMsg)
      }

      return Promise.reject(error)
    }

    // 网络错误
    if (error.code === 'ECONNABORTED') {
      const errorMsg = '请求超时，请检查网络连接'
      if (config?.showError !== false) {
        window.$message?.error(errorMsg)
      }
      return Promise.reject(error)
    }

    // 其他错误
    const errorMsg = error.message || '网络错误，请检查网络连接'
    if (config?.showError !== false) {
      window.$message?.error(errorMsg)
    }

    return Promise.reject(error)
  }
)

/**
 * 封装请求方法
 */
export const request = {
  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return service.get(url, config)
  },

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },

  /**
   * 文件上传
   */
  upload<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
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
  download(url: string, config?: RequestConfig): Promise<Blob> {
    return service.get(url, {
      ...config,
      responseType: 'blob'
    })
  }
}

export default service
