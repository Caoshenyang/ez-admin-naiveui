import { ref, computed, type Ref } from 'vue'
import { MoonOutline, SunnyOutline } from '@vicons/ionicons5'
import { createLightTheme, createDarkTheme } from '@/settings/naiveui-theme'
import { lightTheme as naiveLightTheme, darkTheme as naiveDarkTheme, type GlobalTheme, type GlobalThemeOverrides } from 'naive-ui'
import { localStorage } from '@/utils/storage'

const THEME_STORAGE_KEY = 'app-theme-mode'

// 单例模式：全局共享的主题状态
const savedTheme = localStorage.get<'light' | 'dark'>(THEME_STORAGE_KEY) || 'light'
const mode = ref<'light' | 'dark'>(savedTheme)

// 初始化时同步 HTML 的 dark 类（确保 getColor() 能提取到正确的颜色值）
if (typeof document !== 'undefined') {
	const html = document.documentElement
	if (savedTheme === 'dark') {
		html.classList.add('dark')
	} else {
		html.classList.remove('dark')
	}
}

// NaiveUI 内置基础主题（控制基础模式）
const theme = ref<GlobalTheme>(mode.value === 'dark' ? naiveDarkTheme : naiveLightTheme)

// 自定义主题配置（运行时从 CSS 变量提取）
// 使用函数调用确保在 DOM 加载后获取最新颜色值
const themeOverrides = ref<GlobalThemeOverrides>(createTheme(mode.value))

/**
 * 创建主题配置（运行时提取 CSS 变量）
 */
function createTheme(themeMode: 'light' | 'dark'): GlobalThemeOverrides {
	return themeMode === 'dark' ? createDarkTheme() : createLightTheme()
}

export interface UseThemeReturn {
	theme: Ref<GlobalTheme> // NaiveUI 内置基础主题
	themeOverrides: Ref<GlobalThemeOverrides> // 自定义主题配置（运行时提取）
	themeIcon: Ref<typeof MoonOutline | typeof SunnyOutline> // 当前主题图标组件
	isDark: Ref<boolean> // 是否为暗色主题
	toggleTheme: () => void // 切换主题
	setTheme: (mode: 'light' | 'dark') => void // 设置主题
}

export function useTheme(): UseThemeReturn {
	// 当前主题图标（Light → Moon, Dark → Sunny）
	const themeIcon = computed(() => (mode.value === 'dark' ? SunnyOutline : MoonOutline))

	// 是否为暗色主题
	const isDark = computed(() => mode.value === 'dark')

	// 切换主题
	function toggleTheme() {
		const newMode: 'light' | 'dark' = mode.value === 'light' ? 'dark' : 'light'
		setTheme(newMode)
	}

	// 设置主题
	function setTheme(newMode: 'light' | 'dark') {
		mode.value = newMode
		theme.value = newMode === 'dark' ? naiveDarkTheme : naiveLightTheme
		themeOverrides.value = createTheme(newMode) // 运行时提取颜色值
		localStorage.set(THEME_STORAGE_KEY, newMode)

		// 同步切换 CSS 变量的 dark 类（用于 getColor() 提取正确的颜色值）
		const html = document.documentElement
		if (newMode === 'dark') {
			html.classList.add('dark')
		} else {
			html.classList.remove('dark')
		}
	}

	return {
		theme,
		themeOverrides,
		themeIcon,
		isDark,
		toggleTheme,
		setTheme
	}
}

