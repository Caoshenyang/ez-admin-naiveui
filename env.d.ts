/// <reference types="vite/client" />

// 扩展环境变量
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string // 项目名称
  readonly VITE_APP_PORT: number // 端口号
  readonly VITE_APP_BASE_API: string // 后端接口地址
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
