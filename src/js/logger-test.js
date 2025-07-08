/**
 * Logger 功能测试
 * 在开发环境中运行此文件来测试 logger 的各种功能
 *
 * 使用方法：
 * 1. 在 Vue 组件的 mounted 钩子中导入并调用：
 *    import { runLoggerTests } from '@/lib/logger-test'
 *    runLoggerTests()
 *
 * 2. 或在浏览器控制台中运行：
 *    import('./lib/logger-test').then(m => m.runLoggerTests())
 */

import logger from './logger'

export function runLoggerTests() {
  console.log('=== 开始 Logger 功能测试 ===')

  // 测试基本日志级别
  testBasicLogging()

  // 测试分组功能
  testGrouping()

  // 测试表格功能
  testTable()

  // 测试性能计时
  testTiming()

  // 测试断言
  testAssertions()

  // 测试子 logger
  testChildLoggers()

  console.log('=== Logger 功能测试完成 ===')
}

function testBasicLogging() {
  logger.group('基本日志测试')

  logger.error('这是一条错误日志')
  logger.warn('这是一条警告日志')
  logger.info('这是一条信息日志')
  logger.debug('这是一条调试日志')
  logger.trace('这是一条追踪日志')

  // 测试带数据的日志
  logger.info('用户登录', {
    userId: 123,
    username: 'testuser',
    timestamp: new Date().toISOString()
  })

  logger.groupEnd()
}

function testGrouping() {
  logger.group('分组日志测试')

  logger.info('这是外层分组的日志')

  logger.group('嵌套分组', true) // 折叠状态
  logger.debug('这是嵌套分组的调试信息')
  logger.info('这是嵌套分组的信息')
  logger.groupEnd()

  logger.info('回到外层分组')
  logger.groupEnd()
}

function testTable() {
  logger.group('表格日志测试')

  const users = [
    { id: 1, name: '张三', age: 25, role: 'admin', active: true },
    { id: 2, name: '李四', age: 30, role: 'user', active: false },
    { id: 3, name: '王五', age: 28, role: 'user', active: true }
  ]

  logger.info('完整用户表格：')
  logger.table(users)

  logger.info('只显示姓名和角色：')
  logger.table(users, ['name', 'role'])

  logger.groupEnd()
}

function testTiming() {
  logger.group('性能计时测试')

  logger.time('数组处理')

  // 模拟耗时操作
  const arr = Array.from({ length: 100000 }, (_, i) => i)
  const result = arr
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .slice(0, 1000)

  logger.timeEnd('数组处理')

  logger.info('处理结果', {
    originalLength: arr.length,
    resultLength: result.length,
    firstFew: result.slice(0, 5)
  })

  logger.groupEnd()
}

function testAssertions() {
  logger.group('断言测试')

  const user = { id: 1, name: '张三', age: 25 }

  logger.assert(user.id > 0, '用户ID应该大于0') // 通过
  logger.assert(user.name.length > 0, '用户名不应为空') // 通过
  logger.assert(user.age >= 18, '用户应该成年') // 通过
  logger.assert(user.email, '用户应该有邮箱') // 失败

  logger.groupEnd()
}

function testChildLoggers() {
  logger.group('子 Logger 测试')

  const apiLogger = logger.createChild('API')
  const dbLogger = logger.createChild('DATABASE')
  const cacheLogger = logger.createChild('CACHE')

  apiLogger.info('发送 HTTP 请求')
  apiLogger.debug('请求参数', { method: 'GET', url: '/api/users' })

  dbLogger.info('执行数据库查询')
  dbLogger.debug('SQL 语句', { sql: 'SELECT * FROM users WHERE active = 1' })

  cacheLogger.info('缓存命中')
  cacheLogger.debug('缓存键', { key: 'users:active', ttl: 300 })

  logger.groupEnd()
}

// 测试环境检测
export function testEnvironmentDetection() {
  logger.group('环境检测测试')

  logger.info('当前环境：', process.env.NODE_ENV)
  logger.info('是否为开发环境：', process.env.NODE_ENV === 'development')

  if (process.env.NODE_ENV === 'production') {
    logger.warn('这条日志在生产环境中不会显示')
  } else {
    logger.info('这条日志只在开发环境中显示')
  }

  logger.groupEnd()
}

// Vue 组件测试助手
export function createVueTestComponent() {
  return {
    name: 'LoggerTestComponent',
    mounted() {
      this.$logger.info('测试组件已挂载')
      this.runComponentTests()
    },
    methods: {
      runComponentTests() {
        this.$logger.group('Vue 组件测试')

        this.$logger.info('测试 Vue 实例中的 logger')
        this.$logger.debug('组件名称：', this.$options.name)
        this.$logger.debug('路由信息：', this.$route?.path)

        // 测试错误处理
        try {
          throw new Error('模拟组件错误')
        } catch (error) {
          this.$logger.error('组件错误：', error)
        }

        this.$logger.groupEnd()
      }
    }
  }
}

// 默认导出测试函数
export default {
  runLoggerTests,
  testEnvironmentDetection,
  createVueTestComponent
}
