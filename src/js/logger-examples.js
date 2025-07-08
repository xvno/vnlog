/**
 * Logger 使用示例
 * 演示如何在不同场景中使用 logger
 */

import logger from './logger'

// 示例1：基本使用
export function basicUsage() {
  logger.info('这是一条基本的日志信息')
  logger.debug('调试信息：', { data: 'test' })
  logger.warn('这是一条警告信息')
  logger.error('这是一条错误信息')
}

// 示例2：API 请求日志
export function apiExample() {
  const apiLogger = logger.createChild('API')

  apiLogger.info('开始发送 API 请求')

  // 模拟 API 调用
  fetch('/api/users')
    .then(response => {
      apiLogger.debug('响应状态：', response.status)
      if (!response.ok) {
        apiLogger.warn('响应状态异常：', response.status)
      }
      return response.json()
    })
    .then(data => {
      apiLogger.info('API 请求成功', { count: data.length })
    })
    .catch(error => {
      apiLogger.error('API 请求失败：', error)
    })
}

// 示例3：性能监控
export function performanceExample() {
  logger.time('数据处理')

  // 模拟耗时操作
  const data = Array.from({ length: 10000 }, (_, i) => i)
  const result = data.map(x => x * 2).filter(x => x > 5000)

  logger.timeEnd('数据处理')
  logger.info('处理完成', { resultCount: result.length })
}

// 示例4：分组日志
export function groupExample() {
  logger.group('用户登录流程')
  logger.info('1. 验证用户输入')
  logger.debug('用户名：test@example.com')
  logger.info('2. 发送登录请求')
  logger.debug('请求地址：/api/login')
  logger.info('3. 登录成功')
  logger.groupEnd()

  // 折叠分组
  logger.group('详细调试信息', true)
  logger.debug('token：eyJhbGciOiJIUzI1NiIs...')
  logger.debug('权限：admin')
  logger.groupEnd()
}

// 示例5：表格数据
export function tableExample() {
  const users = [
    { id: 1, name: '张三', age: 25, role: 'admin' },
    { id: 2, name: '李四', age: 30, role: 'user' },
    { id: 3, name: '王五', age: 28, role: 'user' }
  ]

  logger.table(users)

  // 只显示特定列
  logger.table(users, ['name', 'role'])
}

// 示例6：断言检查
export function assertExample() {
  const user = { id: 1, name: '张三', age: 25 }

  logger.assert(user.id > 0, '用户ID必须大于0')
  logger.assert(user.name, '用户名不能为空')
  logger.assert(user.age >= 18, '用户年龄必须大于等于18岁')
  logger.assert(false, '这是一个失败的断言示例')
}

// 示例7：Vue 组件中的使用
export const vueComponentExample = {
  name: 'LoggerExample',
  data() {
    return {
      userList: []
    }
  },

  async mounted() {
    // 组件加载时记录日志
    this.$logger.info('LoggerExample 组件已挂载')

    try {
      await this.loadUsers()
    } catch (error) {
      this.$logger.error('组件初始化失败：', error)
    }
  },

  methods: {
    async loadUsers() {
      this.$logger.debug('开始加载用户列表')

      try {
        // 模拟 API 调用
        const response = await fetch('/api/users')
        const users = await response.json()

        this.$logger.info('用户列表加载成功', { count: users.length })
        this.userList = users

      } catch (error) {
        this.$logger.error('用户列表加载失败：', error)
        throw error
      }
    },

    handleUserClick(user) {
      this.$logger.info('用户点击事件', { userId: user.id, userName: user.name })

      // 使用分组记录详细操作
      this.$logger.group('用户详情操作')
      this.$logger.debug('用户数据：', user)
      this.$logger.info('跳转到用户详情页')
      this.$logger.groupEnd()
    },

    handleError(error) {
      this.$logger.error('操作失败：', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    }
  }
}

// 示例8：不同模块的 logger
export function moduleExample() {
  // 为不同模块创建专门的 logger
  const uploadLogger = logger.createChild('UPLOAD')
  const authLogger = logger.createChild('AUTH')
  const dataLogger = logger.createChild('DATA')

  // 上传模块
  uploadLogger.info('开始上传文件')
  uploadLogger.debug('文件信息：', { name: 'test.jpg', size: 1024 })
  uploadLogger.info('上传进度：50%')
  uploadLogger.info('文件上传成功')

  // 认证模块
  authLogger.info('用户登录')
  authLogger.debug('验证 token')
  authLogger.warn('token 即将过期')

  // 数据模块
  dataLogger.info('同步数据')
  dataLogger.debug('数据源：remote')
  dataLogger.info('数据同步完成')
}

// 示例9：错误处理和日志记录
export function errorHandlingExample() {
  try {
    // 模拟可能出错的操作
    const data = JSON.parse('invalid json')
    logger.info('JSON 解析成功', data)

  } catch (error) {
    logger.error('JSON 解析失败：', {
      error: error.message,
      input: 'invalid json',
      timestamp: new Date().toISOString()
    })
  }

  // 异步错误处理
  Promise.reject(new Error('异步操作失败'))
    .catch(error => {
      logger.error('异步操作错误：', error)
    })
}

// 示例10：条件日志
export function conditionalLogging() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isDebugMode = localStorage.getItem('debug') === 'true'

  // 基本条件日志（实际上 logger 已经自动处理了环境判断）
  logger.info('这条日志只在开发环境显示')

  // 自定义条件日志
  if (isDebugMode) {
    logger.debug('调试模式已启用')
  }
}

// 导出所有示例函数
export default {
  basicUsage,
  apiExample,
  performanceExample,
  groupExample,
  tableExample,
  assertExample,
  vueComponentExample,
  moduleExample,
  errorHandlingExample,
  conditionalLogging
}
