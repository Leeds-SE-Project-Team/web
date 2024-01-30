/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly APP_AMAP_KEY: string
  readonly APP_AMAP_SECURITY_CODE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
