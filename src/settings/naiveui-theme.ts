/**
 * NaiveUI 企业级主题配置
 *
 * 设计理念：
 * - 从完整的 CSS 变量系统中提取颜色值
 * - 支持 15+ 种组件的精细化样式控制
 * - 确保所有交互状态都有明确的视觉反馈
 * - 支持亮色/暗色两种主题模式
 *
 * 使用方式：
 * - 在 App.vue 中通过 n-config-provider 应用主题
 * - 主题切换由 stores/modules/theme.ts 控制
 */
import type { GlobalThemeOverrides } from 'naive-ui'
import { getColor } from '@/utils/color-vars'

export function createNaiveTheme(): GlobalThemeOverrides {
  return {
    // ========== 全局通用配置 ==========
    common: {
      primaryColor: getColor('--primary-500'),
      primaryColorHover: getColor('--primary-600'),
      primaryColorPressed: getColor('--primary-700'),
      primaryColorSuppl: getColor('--primary-400'),
      successColor: getColor('--success-500'),
      successColorHover: getColor('--success-600'),
      successColorPressed: getColor('--success-700'),
      warningColor: getColor('--warning-500'),
      warningColorHover: getColor('--warning-600'),
      warningColorPressed: getColor('--warning-700'),
      errorColor: getColor('--error-500'),
      errorColorHover: getColor('--error-600'),
      errorColorPressed: getColor('--error-700'),
      infoColor: getColor('--info-500'),
      infoColorHover: getColor('--info-600'),
      infoColorPressed: getColor('--info-700'),
      textColorBase: getColor('--text-primary'),
      textColor1: getColor('--text-primary'),
      textColor2: getColor('--text-secondary'),
      textColor3: getColor('--text-tertiary'),
      textColorDisabled: getColor('--text-disabled'),
      borderColor: getColor('--border-light'),
      dividerColor: getColor('--border-light'),
      borderRadius: getColor('--radius-md'),
      borderRadiusSmall: getColor('--radius-sm'),
      boxShadow1: getColor('--shadow-sm'),
      boxShadow2: getColor('--shadow-md'),
      boxShadow3: getColor('--shadow-lg')
    },

    // ========== Button ==========
    Button: {
      textColor: getColor('--text-primary'),
      textColorHover: getColor('--text-primary'),
      textColorPressed: getColor('--text-primary'),
      textColorFocus: getColor('--text-primary'),
      textColorDisabled: getColor('--text-disabled'),
      border: `1px solid ${getColor('--border-default')}`,
      borderHover: `1px solid ${getColor('--border-dark')}`,
      borderPressed: `1px solid ${getColor('--border-dark')}`,
      borderFocus: `1px solid ${getColor('--primary-500')}`,
      color: getColor('--white'),
      colorHover: getColor('--primary-50'),
      colorPressed: getColor('--primary-100'),
      colorFocus: getColor('--white'),
      colorDisabled: getColor('--border-light'),
      borderRadius: getColor('--radius-md'),
      fontWeight: '500',
      padding: '0 20px',
      height: '36px',
      colorPrimary: getColor('--primary-500'),
      colorPrimaryHover: getColor('--primary-600'),
      colorPrimaryPressed: getColor('--primary-700'),
      colorPrimaryFocus: getColor('--primary-500'),
      textColorPrimary: getColor('--white'),
      textColorPrimaryHover: getColor('--white'),
      textColorPrimaryPressed: getColor('--white'),
      borderPrimary: '1px solid transparent',
      borderPrimaryHover: '1px solid transparent',
      borderPrimaryPressed: '1px solid transparent',
      colorInfo: getColor('--info-500'),
      colorInfoHover: getColor('--info-600'),
      colorInfoPressed: getColor('--info-700'),
      textColorInfo: getColor('--white'),
      colorSuccess: getColor('--success-500'),
      colorSuccessHover: getColor('--success-600'),
      colorSuccessPressed: getColor('--success-700'),
      textColorSuccess: getColor('--white'),
      colorWarning: getColor('--warning-500'),
      colorWarningHover: getColor('--warning-600'),
      colorWarningPressed: getColor('--warning-700'),
      textColorWarning: getColor('--white'),
      colorError: getColor('--error-500'),
      colorErrorHover: getColor('--error-600'),
      colorErrorPressed: getColor('--error-700'),
      textColorError: getColor('--white')
    },

    // ========== Input ==========
    Input: {
      caretColor: getColor('--primary-500'),
      textColor: getColor('--text-primary'),
      textColorDisabled: getColor('--text-disabled'),
      placeholderColor: getColor('--text-tertiary'),
      border: `1px solid ${getColor('--border-default')}`,
      borderHover: `1px solid ${getColor('--border-dark')}`,
      borderFocus: `1px solid ${getColor('--primary-500')}`,
      borderColorDisabled: getColor('--border-light'),
      color: getColor('--white'),
      colorDisabled: getColor('--border-light'),
      colorFocus: getColor('--white'),
      borderRadius: getColor('--radius-md'),
      boxShadowFocus: `0 0 0 2px ${getColor('--primary-500')}/20`,
      lineHeight: '1.5',
      height: '36px',
      loadingColor: getColor('--primary-500')
    },

    // ========== Form ==========
    Form: {
      labelTextColor: getColor('--text-primary'),
      labelTextColorRequired: getColor('--error-500'),
      asteriskColor: getColor('--error-500'),
      blankHeight: '28px'
    },

    // ========== DataTable ==========
    DataTable: {
      thColor: getColor('--primary-50'),
      thColorModal: getColor('--primary-50'),
      thTextColor: getColor('--text-primary'),
      thFontWeight: '600',
      thPadding: '12px 16px',
      tdColor: getColor('--white'),
      tdColorModal: getColor('--white'),
      tdColorStriped: getColor('--page-bg'),
      tdTextColor: getColor('--text-secondary'),
      tdPadding: '12px 16px',
      borderColor: getColor('--border-light'),
      borderColorModal: getColor('--border-light'),
      borderRadius: getColor('--radius-md'),
      tdColorHover: getColor('--primary-50'),
      fontSizeSmall: '12px',
      fontSizeMedium: '14px',
      fontSizeLarge: '16px'
    },

    // ========== Card ==========
    Card: {
      color: getColor('--white'),
      colorModal: getColor('--white'),
      colorTarget: getColor('--white'),
      colorEmbedded: getColor('--page-bg'),
      colorEmbeddedModal: getColor('--page-bg'),
      borderColor: getColor('--border-light'),
      borderRadius: getColor('--radius-lg'),
      boxShadow: getColor('--shadow-sm'),
      padding: '20px'
    },

    // ========== Modal ==========
    Modal: {
      color: getColor('--white'),
      textColor: getColor('--text-primary'),
      borderRadius: getColor('--radius-lg'),
      boxShadow: getColor('--shadow-lg'),
      padding: '24px'
    },

    // ========== Menu ==========
    Menu: {
      itemTextColor: getColor('--text-secondary'),
      itemTextColorHover: getColor('--text-primary'),
      itemTextColorActive: getColor('--primary-500'),
      itemTextColorChildActive: getColor('--primary-500'),
      itemColor: 'transparent',
      itemColorHover: getColor('--primary-50'),
      itemColorActive: `${getColor('--primary-500')}/10`,
      itemColorActiveHover: `${getColor('--primary-500')}/15`,
      border: 'none',
      borderRadius: getColor('--radius-sm'),
      itemIconColor: getColor('--text-tertiary'),
      itemIconColorHover: getColor('--text-primary'),
      itemIconColorActive: getColor('--primary-500'),
      arrowColor: getColor('--text-tertiary'),
      arrowColorHover: getColor('--text-primary'),
      arrowColorActive: getColor('--primary-500')
    },

    // ========== Tabs ==========
    Tabs: {
      tabColor: 'transparent',
      tabColorHover: getColor('--primary-50'),
      tabColorActive: getColor('--primary-500'),
      tabTextColor: getColor('--text-secondary'),
      tabTextColorHover: getColor('--text-primary'),
      tabTextColorActive: getColor('--primary-500'),
      barColor: getColor('--primary-500'),
      panePadding: '16px'
    },

    // ========== Select ==========
    Select: {
      peers: {
        InternalSelection: {
          textColor: getColor('--text-primary'),
          placeholderColor: getColor('--text-tertiary'),
          border: `1px solid ${getColor('--border-default')}`,
          borderHover: `1px solid ${getColor('--border-dark')}`,
          borderFocus: `1px solid ${getColor('--primary-500')}`,
          borderActive: `1px solid ${getColor('--primary-500')}`,
          color: getColor('--white'),
          colorActive: getColor('--primary-50'),
          borderRadius: getColor('--radius-md'),
          boxShadowFocus: `0 0 0 2px ${getColor('--primary-500')}/20`
        }
      }
    },

    // ========== Checkbox ==========
    Checkbox: {
      checkMarkColor: getColor('--white'),
      borderColor: getColor('--border-default'),
      borderColorChecked: getColor('--primary-500'),
      borderColorHover: getColor('--border-dark'),
      borderColorHoverChecked: getColor('--primary-600'),
      color: getColor('--primary-500'),
      colorChecked: getColor('--primary-500'),
      colorHover: getColor('--primary-600'),
      colorCheckedHover: getColor('--primary-600'),
      borderRadius: getColor('--radius-sm')
    },

    // ========== Radio ==========
    Radio: {
      boxShadow: `0 0 0 1px ${getColor('--border-default')} inset`,
      boxShadowHover: `0 0 0 1px ${getColor('--border-dark')} inset`,
      boxShadowChecked: `0 0 0 1px ${getColor('--primary-500')} inset`,
      boxShadowCheckedHover: `0 0 0 1px ${getColor('--primary-600')} inset`,
      color: getColor('--primary-500'),
      colorHover: getColor('--primary-600'),
      colorChecked: getColor('--primary-500'),
      colorCheckedHover: getColor('--primary-600')
    },

    // ========== Switch ==========
    Switch: {
      railColor: getColor('--border-default'),
      railColorHover: getColor('--border-dark'),
      railColorActive: getColor('--primary-500'),
      railColorActiveHover: getColor('--primary-600'),
      buttonColor: getColor('--white'),
      buttonColorActive: getColor('--white'),
      boxShadowFocus: `0 0 0 2px ${getColor('--primary-500')}/20`
    },

    // ========== Tooltip ==========
    Tooltip: {
      color: getColor('--black'),
      textColor: getColor('--white'),
      borderRadius: getColor('--radius-sm'),
      padding: '6px 12px',
      fontSize: '12px'
    },

    // ========== Pagination ==========
    Pagination: {
      itemColor: getColor('--white'),
      itemColorHover: getColor('--primary-50'),
      itemColorActive: getColor('--primary-500'),
      itemColorDisabled: getColor('--border-light'),
      itemTextColor: getColor('--text-secondary'),
      itemTextColorHover: getColor('--text-primary'),
      itemTextColorActive: getColor('--white'),
      itemTextColorDisabled: getColor('--text-disabled'),
      itemBorder: `1px solid ${getColor('--border-light')}`,
      itemBorderHover: `1px solid ${getColor('--border-default')}`,
      itemBorderActive: `1px solid ${getColor('--primary-500')}`,
      borderRadius: getColor('--radius-sm'),
      buttonBorder: `1px solid ${getColor('--border-light')}`
    },

    // ========== Progress ==========
    Progress: {
      railColor: getColor('--primary-500'),
      fillColor: getColor('--primary-500'),
      textColor: getColor('--text-primary'),
      iconColor: getColor('--primary-500'),
      fontWeightCircle: '500',
      fontSizeCircle: '24px',
      borderRadius: getColor('--radius-sm'),
      height: '8px'
    },

    // ========== Breadcrumb ==========
    Breadcrumb: {
      itemTextColor: getColor('--text-secondary'),
      itemTextColorHover: getColor('--text-primary'),
      itemTextColorActive: getColor('--text-primary'),
      fontSize: '14px',
      separatorColor: getColor('--border-default')
    },

    // ========== Tag ==========
    Tag: {
      borderRadius: getColor('--radius-sm'),
      padding: '0 8px',
      fontSize: '12px',
      height: '24px'
    }
  }
}
