import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.se.walcraft',
  appName: 'walcraft',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
    // TODO: Live Reload
    //  URL 需要自行配置，并使用 "pnpm dev --host" 开启5173端口的Vitest服务器
    // url: 'http://<YOUR_IPV4_ADDRESS>:5173'
    // url: 'http://192.168.3.23:5173'
  }
}

export default config
