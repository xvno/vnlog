/**
 * vnlog - Node.js CommonJS使用示例
 * 演示如何在Node.js项目中使用vnlog (CommonJS格式)
 */

// CommonJS导入方式
const logger = require('vnlog');
const { Logger } = require('vnlog');

console.log('=== vnlog Node.js CommonJS使用示例 ===\n');

// 1. Node.js环境检测
console.log('1. Node.js环境检测：');
logger.info('Node.js版本', process.version);
logger.info('运行环境', process.env.NODE_ENV || 'development');

// 2. 文件系统操作日志
console.log('\n2. 文件系统操作日志：');
const fs = require('fs');
const path = require('path');

const fsLogger = logger.createChild('FS');

try {
  fsLogger.info('读取文件', { file: 'package.json' });
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  fsLogger.info('文件读取成功', { name: packageJson.name, version: packageJson.version });
} catch (error) {
  fsLogger.error('文件读取失败', error.message);
}

// 3. HTTP服务器日志
console.log('\n3. HTTP服务器日志：');
const http = require('http');

const serverLogger = logger.createChild('SERVER');

const server = http.createServer((req, res) => {
  serverLogger.info('收到请求', {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Hello from vnlog!',
    timestamp: new Date().toISOString()
  }));

  serverLogger.info('响应发送', { statusCode: 200 });
});

// 启动服务器（仅作演示，不实际监听）
serverLogger.info('HTTP服务器已配置', { port: 3000 });

// 4. 数据库操作日志
console.log('\n4. 数据库操作日志：');
const dbLogger = logger.createChild('DB');

// 模拟数据库操作
class Database {
  constructor() {
    this.logger = dbLogger;
  }

  async connect() {
    this.logger.info('连接数据库');
    // 模拟连接延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    this.logger.info('数据库连接成功');
  }

  async query(sql, params = []) {
    this.logger.debug('执行查询', { sql, params });

    try {
      // 模拟查询
      await new Promise(resolve => setTimeout(resolve, 50));
      const mockResult = { rows: [], affected: 0 };

      this.logger.debug('查询完成', { rowCount: mockResult.rows.length });
      return mockResult;
    } catch (error) {
      this.logger.error('查询失败', { sql, error: error.message });
      throw error;
    }
  }
}

const db = new Database();
db.connect().then(() => {
  return db.query('SELECT * FROM users WHERE active = ?', [true]);
}).catch(error => {
  dbLogger.error('数据库操作失败', error);
});

// 5. 进程和系统信息
console.log('\n5. 进程和系统信息：');
const os = require('os');

const systemLogger = logger.createChild('SYSTEM');

systemLogger.info('系统信息', {
  platform: os.platform(),
  arch: os.arch(),
  nodeVersion: process.version,
  memory: {
    total: Math.round(os.totalmem() / 1024 / 1024) + 'MB',
    free: Math.round(os.freemem() / 1024 / 1024) + 'MB',
    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
  },
  uptime: Math.round(process.uptime()) + 's'
});

// 6. 环境变量日志
console.log('\n6. 环境变量日志：');
const envLogger = logger.createChild('ENV');

const importantEnvVars = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'DEBUG'];
const envInfo = {};

importantEnvVars.forEach(key => {
  const value = process.env[key];
  if (value) {
    envInfo[key] = key === 'DATABASE_URL' ? '***' : value; // 隐藏敏感信息
  }
});

envLogger.info('环境变量', envInfo);

// 7. 错误处理和进程事件
console.log('\n7. 错误处理和进程事件：');
const processLogger = logger.createChild('PROCESS');

process.on('uncaughtException', (error) => {
  processLogger.error('未捕获的异常', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
});

process.on('unhandledRejection', (reason, promise) => {
  processLogger.error('未处理的Promise拒绝', {
    reason: reason,
    promise: promise
  });
});

// 8. 定时任务日志
console.log('\n8. 定时任务日志：');
const scheduleLogger = logger.createChild('SCHEDULE');

function runScheduledTask() {
  scheduleLogger.info('定时任务开始');

  // 模拟任务执行
  setTimeout(() => {
    scheduleLogger.info('定时任务完成');
  }, 200);
}

// 模拟定时任务
scheduleLogger.info('设置定时任务', { interval: '5分钟' });
runScheduledTask();

// 9. 模块化日志
console.log('\n9. 模块化日志：');
class UserModule {
  constructor() {
    this.logger = logger.createChild('USER');
  }

  async createUser(userData) {
    this.logger.info('创建用户', userData);

    try {
      // 模拟用户创建
      await new Promise(resolve => setTimeout(resolve, 100));

      const user = {
        id: Math.floor(Math.random() * 1000),
        ...userData,
        createdAt: new Date()
      };

      this.logger.info('用户创建成功', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('用户创建失败', error);
      throw error;
    }
  }
}

const userModule = new UserModule();
userModule.createUser({
  name: '王五',
  email: 'wangwu@example.com'
});

// 10. 性能监控
console.log('\n10. 性能监控：');
const perfLogger = logger.createChild('PERF');

function monitorPerformance(name, fn) {
  const startTime = process.hrtime();
  const startMemory = process.memoryUsage().heapUsed;

  perfLogger.time(name);

  const result = fn();

  const [seconds, nanoseconds] = process.hrtime(startTime);
  const endMemory = process.memoryUsage().heapUsed;

  perfLogger.timeEnd(name);
  perfLogger.debug('性能指标', {
    operation: name,
    duration: `${seconds}s ${Math.round(nanoseconds / 1000000)}ms`,
    memoryDelta: `${Math.round((endMemory - startMemory) / 1024)}KB`
  });

  return result;
}

// 使用性能监控
monitorPerformance('数组处理', () => {
  return Array.from({ length: 50000 }, (_, i) => i)
    .filter(x => x % 2 === 0)
    .map(x => x * 2);
});

console.log('\n=== Node.js CommonJS使用示例完成 ===');
console.log('CommonJS格式完全兼容传统Node.js项目');
