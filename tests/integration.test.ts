/**
 * vnlog - 集成测试
 * 测试模块导入导出和整体功能
 */

import logger, { Logger, error, warn, info, debug, trace, log } from '../src/index';
import { LogLevel, LoggerOptions } from '../src/types';

// 模拟控制台方法
const originalConsole = { ...console };
let consoleSpy: {
  log: jest.SpyInstance;
  info: jest.SpyInstance;
  warn: jest.SpyInstance;
  error: jest.SpyInstance;
};

describe('vnlog 集成测试', () => {
  beforeEach(() => {
    // 设置开发环境
    process.env.NODE_ENV = 'development';

    // 模拟控制台方法
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
  });

  afterEach(() => {
    // 恢复原始控制台方法
    Object.assign(console, originalConsole);
    jest.clearAllMocks();
  });

  describe('模块导出', () => {
    test('应该导出默认Logger实例', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    test('应该导出Logger类', () => {
      expect(Logger).toBeDefined();
      expect(typeof Logger).toBe('function');

      const instance = new Logger();
      expect(instance).toBeInstanceOf(Logger);
    });

    test('应该导出便捷方法', () => {
      expect(typeof error).toBe('function');
      expect(typeof warn).toBe('function');
      expect(typeof info).toBe('function');
      expect(typeof debug).toBe('function');
      expect(typeof trace).toBe('function');
      expect(typeof log).toBe('function');
    });
  });

  describe('默认实例功能', () => {
    test('默认实例应该正常工作', () => {
      logger.info('test message');
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[XIUM]'),
        'test message'
      );
    });

    test('便捷方法应该正常工作', () => {
      info('info message');
      warn('warn message');
      error('error message');

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'info message'
      );
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'error message'
      );
    });
  });

  describe('自定义Logger实例', () => {
    test('应该能创建自定义配置的Logger', () => {
      const customLogger = new Logger({
        prefix: 'CUSTOM',
        level: 'ERROR',
        enableTimestamp: false
      });

      customLogger.info('info message');
      customLogger.error('error message');

      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[CUSTOM]'),
        'error message'
      );
    });
  });

  describe('TypeScript类型支持', () => {
    test('应该支持TypeScript类型', () => {
      const options: LoggerOptions = {
        prefix: 'TYPE_TEST',
        level: 'INFO' as LogLevel,
        enableColors: true,
        enableTimestamp: true,
        enableCaller: false
      };

      const typedLogger = new Logger(options);
      expect(typedLogger).toBeInstanceOf(Logger);

      typedLogger.info('typed message');
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[TYPE_TEST]'),
        'typed message'
      );
    });
  });

  describe('多实例测试', () => {
    test('多个Logger实例应该独立工作', () => {
      const logger1 = new Logger({ prefix: 'LOGGER1', level: 'INFO' });
      const logger2 = new Logger({ prefix: 'LOGGER2', level: 'ERROR' });

      logger1.info('logger1 info');
      logger2.info('logger2 info');
      logger1.error('logger1 error');
      logger2.error('logger2 error');

      // logger1应该输出info和error
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[LOGGER1]'),
        'logger1 info'
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[LOGGER1]'),
        'logger1 error'
      );

      // logger2只应该输出error
      expect(consoleSpy.info).not.toHaveBeenCalledWith(
        expect.stringContaining('[LOGGER2]'),
        'logger2 info'
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[LOGGER2]'),
        'logger2 error'
      );
    });
  });

  describe('环境适配性测试', () => {
    test('应该在生产环境中完全静默', () => {
      process.env.NODE_ENV = 'production';

      const prodLogger = new Logger();
      prodLogger.error('production error');
      prodLogger.warn('production warn');
      prodLogger.info('production info');

      // 默认实例也应该静默
      logger.error('default production error');

      // 便捷方法也应该静默
      error('convenience production error');

      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    test('应该在开发环境中正常输出', () => {
      process.env.NODE_ENV = 'development';

      const devLogger = new Logger();
      devLogger.info('development info');

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'development info'
      );
    });
  });

  describe('复杂场景测试', () => {
    test('应该支持复杂的日志场景', () => {
      const mainLogger = new Logger({ prefix: 'MAIN' });
      const childLogger = mainLogger.createChild('CHILD');

      // 使用分组
      mainLogger.group('测试分组');
      mainLogger.info('主Logger信息');
      childLogger.info('子Logger信息');

      // 使用表格
      const testData = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' }
      ];
      mainLogger.table(testData);

      // 使用计时
      mainLogger.time('测试计时');
      mainLogger.timeEnd('测试计时');

      // 使用断言
      mainLogger.assert(true, '这个断言应该通过');
      mainLogger.assert(false, '这个断言应该失败');

      mainLogger.groupEnd();

      // 验证调用
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[MAIN]'),
        '主Logger信息'
      );
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[MAIN:CHILD]'),
        '子Logger信息'
      );
    });
  });
});
