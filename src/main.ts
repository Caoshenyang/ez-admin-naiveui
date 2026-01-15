import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router, { setupRouter } from './router'
import directives from './directives'
import i18n from './locales'
import { useAppStore } from './stores/app'

// 导入全局样式
import '@/assets/styles/index.css'

const app = createApp(App)
const pinia = createPinia()

// 配置 Pinia 持久化插件
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// 初始化应用配置
const appStore = useAppStore()
appStore.initTheme()

// 设置路由
setupRouter(app)

// 注册自定义指令
app.use(directives)

// 注册 i18n
app.use(i18n)

// 挂载应用
app.mount('#app')
