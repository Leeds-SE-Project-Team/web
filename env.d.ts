/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly APP_AMAP_KEY: string
  readonly APP_AMAP_SECURITY_CODE: string
  readonly APP_SERVER_URL: string
  readonly APP_STATIC_URL: string
  readonly APP_IFLY_ID: string
  readonly APP_IFLY_KEY: string
  readonly APP_IFLY_SECRET: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }
