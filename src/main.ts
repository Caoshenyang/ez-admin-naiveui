import { createApp } from 'vue'

import './assets/styles/index.css'

import App from './App.vue'

import pinia from './stores'
import router from './router'

// 路由守卫
import './router/permission'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
