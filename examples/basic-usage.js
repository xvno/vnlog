/**
 * vnlog - 基础使用示例
 * 演示如何在JavaScript项目中使用vnlog
 */

// 导入vnlog
const logger = require('vnlog');

console.log('=== vnlog 基础使用示例 ===\n');

// 1. 基本日志输出
console.log('1. 基本日志输出：');
logger.info('这是一条信息日志');
logger.warn('这是一条警告日志');
logger.error('这是一条错误日志');
logger.debug('这是一条调试日志');

// 2. 带数据的日志
console.log('\n2. 带数据的日志：');
const user = { id: 123, name: '张三', email: 'zhangsan@example.com' };
logger.info('用户登录', user);
logger.debug('请求详情', { method: 'POST', url: '/api/login', timestamp: new Date() });

// 3. 分组日志
console.log('\n3. 分组日志：');
logger.group('用户注册流程');
logger.info('1. 验证用户输入');
logger.info('2. 检查邮箱是否已存在');
logger.info('3. 创建用户账户');
logger.info('4. 发送欢迎邮件');
logger.groupEnd();

// 4. 表格数据
console.log('\n4. 表格数据：');
const users = [
  { id: 1, name: '张三', role: 'admin', active: true },
  { id: 2, name: '李四', role: 'user', active: false },
  { id: 3, name: '王五', role: 'user', active: true }
];
logger.table(users);

// 5. 性能计时
console.log('\n5. 性能计时：');
logger.time('数据处理');
// 模拟耗时操作
const data = Array.from({ length: 10000 }, (_, i) => i);
const processed = data.filter(x => x % 2 === 0).map(x => x * 2);
logger.timeEnd('数据处理');
logger.info('处理完成', { count: processed.length });

// 6. 断言检查
console.log('\n6. 断言检查：');
logger.assert(user.id > 0, '用户ID应该大于0');
logger.assert(user.name.length > 0, '用户名不应为空');
logger.assert(user.age >= 18, '用户应该是成年人'); // 这个会失败

// 7. 创建子Logger
console.log('\n7. 子Logger：');
const apiLogger = logger.createChild('API');
const dbLogger = logger.createChild('DATABASE');

apiLogger.info('发送HTTP请求');
apiLogger.debug('请求参数', { endpoint: '/api/users', method: 'GET' });

dbLogger.info('执行数据库查询');
dbLogger.debug('查询语句', { sql: 'SELECT * FROM users WHERE active = 1' });

// 8. 错误处理示例
console.log('\n8. 错误处理：');
try {
  // 模拟可能出错的操作
  const result = JSON.parse('invalid json');
  logger.info('JSON解析成功', result);
} catch (error) {
  logger.error('JSON解析失败', {
    error: error.message,
    input: 'invalid json',
    timestamp: new Date().toISOString()
  });
}

// 9. 条件日志
console.log('\n9. 条件日志：');
const isDebugMode = process.env.DEBUG === 'true';
if (isDebugMode) {
  logger.debug('调试模式已启用');
} else {
  logger.info('调试模式已禁用');
}

// 10. 异步操作日志
console.log('\n10. 异步操作日志：');
async function asyncOperation() {
  logger.info('开始异步操作');

  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    logger.info('异步操作完成');
  } catch (error) {
    logger.error('异步操作失败', error);
  }
}

asyncOperation();

console.log('\n=== 基础使用示例完成 ===');
console.log('注意：日志只在开发环境中显示，生产环境会自动静默');
