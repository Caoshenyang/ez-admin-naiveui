import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

/**
 * 创建 Pinia 实例
 */
const pinia = createPinia()

/**
 * 配置持久化
 */
pinia.use(
  createPersistedState({
    // 存储到 sessionStorage
    storage: localStorage,
    // 默认所有 store 都持久化
    auto: true,
  })
)

export default pinia
