import { createApp } from 'vue'

import './assets/index.css'

import App from './App.vue'

import pinia from './stores'
import router from './router'

// 路由守卫（必须在 router 之后引入）
import './router/permission'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
