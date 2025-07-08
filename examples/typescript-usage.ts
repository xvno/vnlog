/**
 * vnlog - TypeScript使用示例
 * 演示如何在TypeScript项目中使用vnlog，包括类型支持
 */

// 导入vnlog类型和实例
import logger, { Logger, LogLevel, LoggerOptions } from 'vnlog';
import { info, warn, error, debug } from 'vnlog';

console.log('=== vnlog TypeScript使用示例 ===\n');

// 1. 基本类型化日志
console.log('1. 基本类型化日志：');
logger.info('TypeScript项目中的日志');
logger.warn('类型安全的警告日志');
logger.error('类型安全的错误日志');

// 2. 类型化的数据结构
console.log('\n2. 类型化的数据结构：');
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  active: boolean;
}

const user: User = {
  id: 123,
  name: '张三',
  email: 'zhangsan@example.com',
  role: 'admin',
  active: true
};

logger.info('用户数据', user);

// 3. 类型化的日志配置
console.log('\n3. 类型化的日志配置：');
const loggerOptions: LoggerOptions = {
  prefix: 'TS-APP',
  level: 'INFO' as LogLevel,
  enableColors: true,
  enableTimestamp: true,
  enableCaller: false
};

const typedLogger = new Logger(loggerOptions);
typedLogger.info('使用类型化配置的Logger');

// 4. 泛型支持
console.log('\n4. 泛型支持：');
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

const userResponse: ApiResponse<User> = {
  success: true,
  data: user,
  timestamp: new Date()
};

logger.info('API响应', userResponse);

// 5. 枚举和联合类型
console.log('\n5. 枚举和联合类型：');
enum LogOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

type LogContext = {
  operation: LogOperation;
  userId: number;
  resourceId?: string;
  metadata?: Record<string, any>;
};

const logContext: LogContext = {
  operation: LogOperation.CREATE,
  userId: user.id,
  resourceId: 'user_123',
  metadata: { source: 'web_app' }
};

logger.info('操作日志', logContext);

// 6. 类型化的错误处理
console.log('\n6. 类型化的错误处理：');
class ApiError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

try {
  throw new ApiError('USER_NOT_FOUND', 404, '用户不存在', { userId: 999 });
} catch (error) {
  if (error instanceof ApiError) {
    logger.error('API错误', {
      code: error.code,
      statusCode: error.statusCode,
      message: error.message,
      details: error.details
    });
  } else {
    logger.error('未知错误', error);
  }
}

// 7. 类型化的子Logger
console.log('\n7. 类型化的子Logger：');
interface ServiceLogger {
  prefix: string;
  logger: Logger;
}

class UserService {
  private logger: Logger;

  constructor() {
    this.logger = logger.createChild('UserService');
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    this.logger.info('创建用户', userData);

    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 100));

      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        ...userData
      };

      this.logger.info('用户创建成功', { userId: newUser.id });
      return newUser;
    } catch (error) {
      this.logger.error('用户创建失败', error);
      throw error;
    }
  }
}

// 8. 使用类型化的服务
console.log('\n8. 使用类型化的服务：');
const userService = new UserService();
userService.createUser({
  name: '李四',
  email: 'lisi@example.com',
  role: 'user',
  active: true
});

// 9. 类型化的配置管理
console.log('\n9. 类型化的配置管理：');
interface AppConfig {
  environment: 'development' | 'production' | 'test';
  logLevel: LogLevel;
  features: {
    enableDebugMode: boolean;
    enablePerformanceLog: boolean;
  };
}

const appConfig: AppConfig = {
  environment: 'development',
  logLevel: 'DEBUG',
  features: {
    enableDebugMode: true,
    enablePerformanceLog: true
  }
};

const appLogger = new Logger({
  prefix: 'APP',
  level: appConfig.logLevel,
  enableColors: appConfig.environment !== 'production'
});

appLogger.info('应用配置', appConfig);

// 10. 类型化的性能监控
console.log('\n10. 类型化的性能监控：');
interface PerformanceMetrics {
  operation: string;
  duration: number;
  memory: number;
  timestamp: Date;
}

class PerformanceMonitor {
  private logger: Logger;

  constructor() {
    this.logger = logger.createChild('PERF');
  }

  measureOperation<T>(operation: string, fn: () => T): T {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;

    this.logger.time(operation);

    try {
      const result = fn();

      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed;

      const metrics: PerformanceMetrics = {
        operation,
        duration: endTime - startTime,
        memory: endMemory - startMemory,
        timestamp: new Date()
      };

      this.logger.timeEnd(operation);
      this.logger.debug('性能指标', metrics);

      return result;
    } catch (error) {
      this.logger.error('操作失败', { operation, error });
      throw error;
    }
  }
}

const perfMonitor = new PerformanceMonitor();
perfMonitor.measureOperation('数据处理', () => {
  return Array.from({ length: 10000 }, (_, i) => i * 2);
});

// 11. 便捷方法的类型化使用
console.log('\n11. 便捷方法的类型化使用：');
info('使用导入的info方法');
warn('使用导入的warn方法');
error('使用导入的error方法');
debug('使用导入的debug方法');

console.log('\n=== TypeScript使用示例完成 ===');
console.log('TypeScript提供了完整的类型支持和IntelliSense');
