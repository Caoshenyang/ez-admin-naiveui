import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// --- 1. 插件引入 (全功能覆盖) ---
import duration, { type DurationUnitType } from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isBetween from 'dayjs/plugin/isBetween'
import quarterOfYear from 'dayjs/plugin/quarterOfYear' // 补充：季度支持

// --- 2. 插件注册 ---
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(quarterOfYear)

dayjs.locale('zh-cn')

/**
 * 常用格式化模板枚举
 */
export const DatePattern = {
  DateTime: 'YYYY-MM-DD HH:mm:ss',
  Date: 'YYYY-MM-DD',
  Month: 'YYYY-MM',
  Time: 'HH:mm:ss',
  Chinese: 'YYYY年MM月DD日'
} as const

export const dateUtils = {
  /**
   * 1. 基础格式化
   * @param date 日期对象/字符串/时间戳
   * @param pattern 格式化模板
   */
  format(date: dayjs.ConfigType = new Date(), pattern: string = DatePattern.DateTime): string {
    if (!date) return '-'
    const d = dayjs(date)
    return d.isValid() ? d.format(pattern) : '-'
  },

  /**
   * 2. 相对时间（如：3分钟前）
   */
  fromNow(date: dayjs.ConfigType): string {
    if (!date) return '-'
    return dayjs(date).fromNow()
  },

  /**
   * 3. 获取标准范围 (今日/本周/本月/本季度/本年)
   * @param unit 维度
   */
  getRange(unit: dayjs.OpUnitType): [Date, Date] {
    return [dayjs().startOf(unit).toDate(), dayjs().endOf(unit).toDate()]
  },

  /**
   * 4. 获取过去 X 天到今天的范围
   * @param days 天数
   */
  getPastDaysRange(days: number): [Date, Date] {
    return [dayjs().subtract(days, 'day').startOf('day').toDate(), dayjs().toDate()]
  },

  /**
   * 5. 获取偏移范围 (用于同比/环比)
   * @example getOffsetRange(-1, 'month') 获取上个月
   */
  getOffsetRange(offset: number, unit: dayjs.ManipulateType): [Date, Date] {
    const target = dayjs().add(offset, unit)
    return [target.startOf(unit).toDate(), target.endOf(unit).toDate()]
  },

  /**
   * 6. 时长格式化 (精准/模糊)
   * @param value 数值
   * @param inputUnit 输入单位 ('ms'|'s'|'m'|'h'|'d' 等)
   * @param isPrecision 是否开启 HH:mm:ss 格式
   */
  formatDuration(value: number, inputUnit: DurationUnitType = 'ms', isPrecision = false): string {
    const dur = dayjs.duration(value, inputUnit)
    if (isPrecision) {
      // 这里的处理支持超过 24 小时，例如 26:30:15
      const hours = Math.floor(dur.asHours()).toString().padStart(2, '0')
      const mins = dur.minutes().toString().padStart(2, '0')
      const secs = dur.seconds().toString().padStart(2, '0')
      return `${hours}:${mins}:${secs}`
    }
    return dur.humanize()
  },

  /**
   * 7. 逻辑判断
   */
  isToday: (date: dayjs.ConfigType) => dayjs(date).isToday(),

  isSameDay: (d1: dayjs.ConfigType, d2: dayjs.ConfigType) => dayjs(d1).isSame(d2, 'day'),

  /** 是否在某个时间段内 (闭区间) */
  isBetween: (target: dayjs.ConfigType, start: dayjs.ConfigType, end: dayjs.ConfigType) => {
    return dayjs(target).isBetween(start, end, null, '[]')
  },

  /** 校验 A 是否早于或等于 B */
  isBeforeOrEqual: (a: dayjs.ConfigType, b: dayjs.ConfigType) => dayjs(a).isSameOrBefore(b),

  /** 校验 A 是否晚于或等于 B */
  isAfterOrEqual: (a: dayjs.ConfigType, b: dayjs.ConfigType) => dayjs(a).isSameOrAfter(b),

  /**
   * 8. 转换与原生支持
   */
  toDate: (date: dayjs.ConfigType) => dayjs(date).toDate(),

  dayjs // 暴露原始实例，支持所有链式调用
}

export default dateUtils
