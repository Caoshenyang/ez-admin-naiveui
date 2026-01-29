import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

/**
 * 创建 Pinia 实例
 */
const pinia = createPinia()

/**
 * 配置持久化
 */
pinia.use(createPersistedState())

export default pinia
