import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
// 引入 pinia
import store from './stores'
import './assets/css/index.css'
// 引入路由守卫
import './router/permission'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
