import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import { message } from '@/hooks/useMessagehook'
import { useUserInfoStore } from '../stores/modules/user'
import router from '../router'

// 扩展 axios 的请求配置类型，添加 noErrorToast 用于控制错误提示展示
type RequestConfig = AxiosRequestConfig & {
  noErrorToast?: boolean // 设置为 true 不弹出错误提示
}

/**
 * 请求工具类，统一处理请求和响应
 */
class Request {
  // 私有 axios 实例
  private instance: AxiosInstance

  constructor() {
    // 初始化 axios 实例并设置基础配置
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_API, // 环境变量配置后端 API 网关
      timeout: 180_000, // 请求超时时间 (毫秒)
      withCredentials: true, // 支持基于 Cookie/Session 的鉴权
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })

    this.setupInterceptors()
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config) => {
        // 如有 token 认证可在此处附加
        // 当前项目基于 Cookie/Session 认证, 不需手动加 token
        return config
      },
      (error) => Promise.reject(error),
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 约定后端返回结构 { code, data, message }
        const respData = response.data
        if (respData.code !== 200) {
          const config = response.config as RequestConfig
          // 若未设置 noErrorToast，则弹出后端返回的错误 message
          if (!config.noErrorToast) {
            message.error(respData.message || '请求失败')
          }
          // 返回 reject，供页面根据需要自定义处理
          return Promise.reject(respData)
        }
        // 只返回 data 字段（业务数据）
        return respData.data
      },
      async (error: AxiosError) => {
        // 处理 HTTP 错误或网络错误
        const config = error.config as RequestConfig | undefined
        const userInfoStore = useUserInfoStore()
        // 只有未禁用错误提示时才弹出提示
        if (!(config && config.noErrorToast)) {
          let msg = '请求错误'
          if (error.response) {
            // 有响应但状态码异常
            const status = error.response.status
            switch (status) {
              case 400:
                msg = '请求参数错误'
                break
              case 401:
                msg = '未授权，请登录'
                // 401 表示 Session 过期或无效，登出并跳转登录页
                await userInfoStore.logout()
                router.push('/login')
                break
              case 403:
                msg = '拒绝访问'
                break
              case 404:
                msg = '请求资源不存在'
                break
              case 500:
                msg = '服务器异常，请稍后再试'
                break
              default:
                const data = error.response.data as { message?: string } | undefined
                msg = data?.message || `服务器错误: ${status}`
                break
            }
          } else if (error.request) {
            // 没有收到响应（如超时、断网）
            msg = '请求超时或网络异常'
          } else {
            // 其他原因
            msg = error.message || '未知错误'
          }
          message.error(msg)
        }
        return Promise.reject(error)
      },
    )
  }

  /**
   * 通用请求方法，直接返回业务数据（后端 data 字段）
   * @param config 请求配置
   */
  public request<T = unknown>(config: RequestConfig): Promise<T> {
    return this.instance(config)
  }

  /**
   * GET 请求
   * @param url 请求地址
   * @param config 额外配置
   */
  public get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET', url })
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求体
   * @param config 额外配置
   */
  public post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求体
   * @param config 额外配置
   */
  public put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT', url, data })
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param data 请求体
   * @param config 额外配置
   */
  public delete<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE', url, data })
  }
}

// 单例全站统一 http 对象，按需导出
const http = new Request()

export default http
