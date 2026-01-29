/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string // 项目标题
  readonly VITE_APP_BASE_URL: string // API 配置
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
