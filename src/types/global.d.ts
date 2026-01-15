/// <reference types="vite/client" />

declare global {
  /**
   * 环境变量类型
   */
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_BASE_API: string
    readonly VITE_APP_PORT: string
  }

  /**
   * 窗口全局变量
   */
  interface Window {
    $message?: {
      success(content: string): void
      error(content: string): void
      warning(content: string): void
      info(content: string): void
    }
  }
}

export {}
