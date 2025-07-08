# Logger 使用说明

## 概述

Logger 是一个智能日志管理工具，专门为 XIUM Review 项目设计。它只在开发环境输出日志，生产环境完全静默，有效解决了生产环境日志泄露的问题。

## 核心特性

- ✅ **环境智能**：仅在开发环境输出，生产环境静默
- ✅ **多级别支持**：ERROR、WARN、INFO、DEBUG、TRACE 五个级别
- ✅ **格式化输出**：包含时间戳、调用者信息、颜色高亮
- ✅ **性能友好**：生产环境零开销
- ✅ **功能丰富**：支持分组、表格、计时、断言等

## 基本用法

### 1. 在 Vue 组件中使用

```javascript
// 替换原有的 console.log
export default {
  methods: {
    handleClick() {
      // ❌ 旧方式
      console.log('按钮被点击了')

      // ✅ 新方式
      this.$logger.log('按钮被点击了')
      this.$logger.info('用户交互：按钮点击')
      this.$logger.debug('点击事件详情：', { event: 'click', target: 'button' })
    },

    handleError(error) {
      // ❌ 旧方式
      console.error('请求失败：', error)

      // ✅ 新方式
      this.$logger.error('API 请求失败：', error)
    }
  }
}
```

### 2. 在普通 JS 文件中使用

```javascript
// 方式1：导入默认实例
import logger from '@/lib/logger'

// 方式2：导入特定方法
import { log, info, warn, error } from '@/lib/logger'

// 使用示例
function fetchData() {
  logger.info('开始获取数据')

  api.getData()
    .then(data => {
      logger.debug('数据获取成功：', data)
    })
    .catch(error => {
      logger.error('数据获取失败：', error)
    })
}
```

## 日志级别

### 级别优先级
ERROR (0) > WARN (1) > INFO (2) > DEBUG (3) > TRACE (4)

```javascript
// 不同级别的使用场景
this.$logger.error('严重错误，影响功能')     // 红色，显眼
this.$logger.warn('警告信息，需要注意')      // 橙色，提醒
this.$logger.info('重要信息，用户操作')      // 蓝色，信息
this.$logger.debug('调试信息，开发使用')     // 绿色，调试
this.$logger.trace('追踪信息，详细流程')     // 紫色，追踪
```

## 高级功能

### 1. 分组日志
```javascript
// 分组显示相关日志
this.$logger.group('用户登录流程')
this.$logger.info('验证用户名和密码')
this.$logger.debug('发送登录请求')
this.$logger.info('登录成功')
this.$logger.groupEnd()

// 折叠分组
this.$logger.group('详细调试信息', true) // 第二个参数为 true 表示折叠
this.$logger.debug('调试信息1')
this.$logger.debug('调试信息2')
this.$logger.groupEnd()
```

### 2. 表格日志
```javascript
// 显示表格数据
const users = [
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 }
]
this.$logger.table(users)

// 指定显示的列
this.$logger.table(users, ['name', 'age'])
```

### 3. 性能计时
```javascript
// 测量代码执行时间
this.$logger.time('数据处理')
// ... 执行耗时操作
this.$logger.timeEnd('数据处理') // 输出：[XIUM] 数据处理: 15.234ms
```

### 4. 断言日志
```javascript
// 断言检查
this.$logger.assert(user.id > 0, '用户ID必须大于0')
this.$logger.assert(Array.isArray(list), '列表必须是数组')
```

## 创建子 Logger

为不同模块创建专门的 logger：

```javascript
// 在 API 模块中
const apiLogger = this.$logger.createChild('API')
apiLogger.info('API 请求开始') // 输出：[XIUM:API] [INFO] API 请求开始

// 在上传模块中
const uploadLogger = this.$logger.createChild('UPLOAD')
uploadLogger.debug('文件上传进度：50%') // 输出：[XIUM:UPLOAD] [DEBUG] 文件上传进度：50%
```

## 配置选项

```javascript
// 创建自定义配置的 logger
import { Logger } from '@/lib/logger'

const customLogger = new Logger({
  prefix: 'MY-MODULE',       // 自定义前缀
  level: 'INFO',            // 设置日志级别
  enableColors: true,       // 启用颜色
  enableTimestamp: true,    // 启用时间戳
  enableCaller: false       // 禁用调用者信息
})
```

## 最佳实践

### 1. 替换现有 console.log
```javascript
// ❌ 避免使用
console.log('调试信息')
console.error('错误信息')
console.warn('警告信息')

// ✅ 推荐使用
this.$logger.debug('调试信息')
this.$logger.error('错误信息')
this.$logger.warn('警告信息')
```

### 2. 合理使用日志级别
```javascript
// 用户操作 - 使用 INFO
this.$logger.info('用户点击了保存按钮')

// 开发调试 - 使用 DEBUG
this.$logger.debug('表单数据：', formData)

// 错误处理 - 使用 ERROR
this.$logger.error('保存失败：', error)

// 性能问题 - 使用 WARN
this.$logger.warn('API 响应时间过长：', responseTime)
```

### 3. 提供上下文信息
```javascript
// ❌ 信息不够
this.$logger.error('保存失败')

// ✅ 提供详细上下文
this.$logger.error('保存用户资料失败：', {
  userId: this.userId,
  formData: this.formData,
  error: error.message
})
```

### 4. 在关键流程中使用
```javascript
export default {
  methods: {
    async saveProject() {
      this.$logger.info('开始保存项目')

      try {
        this.$logger.debug('项目数据：', this.projectData)

        const result = await api.saveProject(this.projectData)

        this.$logger.info('项目保存成功', { projectId: result.id })

      } catch (error) {
        this.$logger.error('项目保存失败：', error)
        throw error
      }
    }
  }
}
```

## 生产环境说明

在生产环境中，所有日志输出都会被自动屏蔽：

```javascript
// 开发环境：正常输出日志
// 生产环境：完全静默，不会执行任何 console 操作

this.$logger.info('这条日志只在开发环境显示')
```

## 性能影响

- **开发环境**：完整功能，略微的性能开销
- **生产环境**：零开销，方法调用直接返回，不执行任何操作

## 注意事项

1. **不要在日志中输出敏感信息**（密码、Token 等）
2. **合理控制日志数量**，避免过度使用
3. **使用合适的日志级别**，便于调试和维护
4. **在异步操作中使用**，帮助追踪执行流程

## 迁移指南

如果你的代码中有大量 `console.log`，可以使用以下方法批量替换：

### VS Code 正则替换
- 查找：`console\.log\(`
- 替换为：`this.$logger.log(`

### 文件级别替换
1. 导入 logger：`import logger from '@/lib/logger'`
2. 替换调用：`console.log` → `logger.log`

这样就可以快速将现有代码迁移到新的日志系统中。