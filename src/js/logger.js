/**
 * 日志管理工具
 * 仅在开发环境输出日志，生产环境静默
 * 支持多种日志级别和格式化输出
 */

class Logger {
  constructor(options = {}) {
    this.isDev = process.env.NODE_ENV === 'development'
    this.enableColors = options.enableColors !== false
    this.enableTimestamp = options.enableTimestamp !== false
    this.enableCaller = options.enableCaller !== false
    this.prefix = options.prefix || 'XIUM'

    // 日志级别配置
    this.levels = {
      ERROR: { value: 0, color: '#FF5722', method: 'error' },
      WARN: { value: 1, color: '#FF9800', method: 'warn' },
      INFO: { value: 2, color: '#2196F3', method: 'info' },
      DEBUG: { value: 3, color: '#4CAF50', method: 'log' },
      TRACE: { value: 4, color: '#9C27B0', method: 'log' }
    }

    this.currentLevel = this.levels[options.level || 'DEBUG']
  }

  /**
   * 获取时间戳
   */
  getTimestamp() {
    if (!this.enableTimestamp) return ''
    const now = new Date()
    return now.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  /**
   * 获取调用者信息
   */
  getCaller() {
    if (!this.enableCaller) return ''
    try {
      const stack = new Error().stack
      const lines = stack.split('\n')
      // 跳过 Error、getCaller、formatMessage、实际调用方法，取第5行
      const callerLine = lines[4] || lines[3] || ''
      const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) ||
                   callerLine.match(/at\s+(.+?):(\d+):(\d+)/)

      if (match) {
        const [, func, file, line] = match
        const fileName = file ? file.split('/').pop() : 'unknown'
        return `${func || 'anonymous'}@${fileName}:${line}`
      }
    } catch (e) {
      // 获取调用者信息失败，静默处理
    }
    return ''
  }

  /**
   * 格式化日志消息
   */
  formatMessage(level, args) {
    const timestamp = this.getTimestamp()
    const caller = this.getCaller()
    const levelConfig = this.levels[level]

    let prefix = `[${this.prefix}]`

    if (timestamp) {
      prefix += ` [${timestamp}]`
    }

    prefix += ` [${level}]`

    if (caller) {
      prefix += ` [${caller}]`
    }

    return {
      prefix,
      color: levelConfig.color,
      method: levelConfig.method,
      args: Array.from(args)
    }
  }

  /**
   * 输出日志
   */
  output(level, args) {
    if (!this.isDev) return

    const levelConfig = this.levels[level]
    if (!levelConfig || levelConfig.value > this.currentLevel.value) return

    const { prefix, color, method, args: logArgs } = this.formatMessage(level, args)

    if (this.enableColors && typeof window !== 'undefined') {
      console[method](
        `%c${prefix}`,
        `color: ${color}; font-weight: bold;`,
        ...logArgs
      )
    } else {
      console[method](prefix, ...logArgs)
    }
  }

  /**
   * 错误日志
   */
  error(...args) {
    this.output('ERROR', args)
  }

  /**
   * 警告日志
   */
  warn(...args) {
    this.output('WARN', args)
  }

  /**
   * 信息日志
   */
  info(...args) {
    this.output('INFO', args)
  }

  /**
   * 调试日志
   */
  debug(...args) {
    this.output('DEBUG', args)
  }

  /**
   * 追踪日志
   */
  trace(...args) {
    this.output('TRACE', args)
  }

  /**
   * 通用日志（等同于debug）
   */
  log(...args) {
    this.output('DEBUG', args)
  }

  /**
   * 分组日志开始
   */
  group(label, collapsed = false) {
    if (!this.isDev) return

    const { prefix } = this.formatMessage('INFO', [label])
    const method = collapsed ? 'groupCollapsed' : 'group'

    if (this.enableColors) {
      console[method](
        `%c${prefix}`,
        `color: ${this.levels.INFO.color}; font-weight: bold;`,
        label
      )
    } else {
      console[method](prefix, label)
    }
  }

  /**
   * 分组日志结束
   */
  groupEnd() {
    if (!this.isDev) return
    console.groupEnd()
  }

  /**
   * 表格日志
   */
  table(data, columns) {
    if (!this.isDev) return

    this.info('Table Data:')
    console.table(data, columns)
  }

  /**
   * 性能计时开始
   */
  time(label) {
    if (!this.isDev) return
    console.time(`[${this.prefix}] ${label}`)
  }

  /**
   * 性能计时结束
   */
  timeEnd(label) {
    if (!this.isDev) return
    console.timeEnd(`[${this.prefix}] ${label}`)
  }

  /**
   * 断言日志
   */
  assert(condition, ...args) {
    if (!this.isDev) return
    if (!condition) {
      this.error('Assertion failed:', ...args)
    }
  }

  /**
   * 设置日志级别
   */
  setLevel(level) {
    if (this.levels[level]) {
      this.currentLevel = this.levels[level]
    }
  }

  /**
   * 创建子logger
   */
  createChild(prefix, options = {}) {
    return new Logger({
      ...options,
      prefix: `${this.prefix}:${prefix}`
    })
  }
}

// 创建默认logger实例
const logger = new Logger({
  enableColors: true,
  enableTimestamp: true,
  enableCaller: true,
  level: 'DEBUG'
})

// 导出logger实例和Logger类
export default logger
export { Logger }

// 兼容性导出，方便直接使用
export const { log, info, warn, error, debug, trace, group, groupEnd, table, time, timeEnd, assert } = logger
