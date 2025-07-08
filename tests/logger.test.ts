/**
 * vnlog - Logger单元测试
 */

import { Logger } from '../src/logger';
import { LogLevel } from '../src/types';

// 模拟控制台方法
const originalConsole = { ...console };
let consoleSpy: {
  log: jest.SpyInstance;
  info: jest.SpyInstance;
  warn: jest.SpyInstance;
  error: jest.SpyInstance;
  group: jest.SpyInstance;
  groupEnd: jest.SpyInstance;
  table: jest.SpyInstance;
  time: jest.SpyInstance;
  timeEnd: jest.SpyInstance;
};

describe('Logger', () => {
  beforeEach(() => {
    // 设置开发环境
    process.env.NODE_ENV = 'development';

    // 模拟控制台方法
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      group: jest.spyOn(console, 'group').mockImplementation(),
      groupEnd: jest.spyOn(console, 'groupEnd').mockImplementation(),
      table: jest.spyOn(console, 'table').mockImplementation(),
      time: jest.spyOn(console, 'time').mockImplementation(),
      timeEnd: jest.spyOn(console, 'timeEnd').mockImplementation()
    };
  });

  afterEach(() => {
    // 恢复原始控制台方法
    Object.assign(console, originalConsole);
    jest.clearAllMocks();
  });

  describe('构造函数', () => {
    test('应该创建Logger实例', () => {
      const logger = new Logger();
      expect(logger).toBeInstanceOf(Logger);
    });

    test('应该使用默认配置', () => {
      const logger = new Logger();
      logger.info('test');
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[XIUM]'),
        'test'
      );
    });

    test('应该接受自定义配置', () => {
      const logger = new Logger({
        prefix: 'TEST',
        level: 'ERROR'
      });

      logger.info('test info');
      logger.error('test error');

      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[TEST]'),
        'test error'
      );
    });
  });

  describe('日志级别', () => {
    test('应该按照级别过滤日志', () => {
      const logger = new Logger({ level: 'WARN' });

      logger.trace('trace message');
      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      expect(consoleSpy.log).not.toHaveBeenCalled(); // trace, debug
      expect(consoleSpy.info).not.toHaveBeenCalled(); // info
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'error message'
      );
    });

    test('应该支持动态设置级别', () => {
      const logger = new Logger({ level: 'DEBUG' });

      logger.debug('before change');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'before change'
      );

      logger.setLevel('ERROR');
      consoleSpy.log.mockClear();

      logger.debug('after change');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('日志方法', () => {
    let logger: Logger;

    beforeEach(() => {
      logger = new Logger();
    });

    test('error方法应该调用console.error', () => {
      logger.error('error message');
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'error message'
      );
    });

    test('warn方法应该调用console.warn', () => {
      logger.warn('warn message');
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'warn message'
      );
    });

    test('info方法应该调用console.info', () => {
      logger.info('info message');
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'info message'
      );
    });

    test('debug方法应该调用console.log', () => {
      logger.debug('debug message');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'debug message'
      );
    });

    test('trace方法应该调用console.log', () => {
      logger.trace('trace message');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[TRACE]'),
        'trace message'
      );
    });

    test('log方法应该等同于debug', () => {
      logger.log('log message');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'log message'
      );
    });
  });

  describe('高级功能', () => {
    let logger: Logger;

    beforeEach(() => {
      logger = new Logger();
    });

    test('group方法应该调用console.group', () => {
      logger.group('test group');
      expect(consoleSpy.group).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'test group'
      );
    });

    test('groupEnd方法应该调用console.groupEnd', () => {
      logger.groupEnd();
      expect(consoleSpy.groupEnd).toHaveBeenCalled();
    });

    test('table方法应该调用console.table', () => {
      const data = [{ id: 1, name: 'test' }];
      logger.table(data);
      expect(consoleSpy.table).toHaveBeenCalledWith(data, undefined);
    });

    test('time方法应该调用console.time', () => {
      logger.time('test timer');
      expect(consoleSpy.time).toHaveBeenCalledWith('test timer');
    });

    test('timeEnd方法应该调用console.timeEnd', () => {
      logger.timeEnd('test timer');
      expect(consoleSpy.timeEnd).toHaveBeenCalledWith('test timer');
    });

    test('assert方法应该在条件失败时输出错误', () => {
      logger.assert(false, 'assertion failed');
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Assertion failed:',
        'assertion failed'
      );
    });

    test('assert方法应该在条件成功时不输出', () => {
      logger.assert(true, 'assertion passed');
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('子Logger', () => {
    test('应该创建子Logger', () => {
      const parent = new Logger({ prefix: 'PARENT' });
      const child = parent.createChild('CHILD');

      child.info('child message');
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[PARENT:CHILD]'),
        'child message'
      );
    });

    test('子Logger应该继承父Logger的配置', () => {
      const parent = new Logger({
        prefix: 'PARENT',
        level: 'WARN',
        enableTimestamp: false
      });
      const child = parent.createChild('CHILD');

      child.info('info message');
      child.warn('warn message');

      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[PARENT:CHILD]'),
        'warn message'
      );
    });
  });

  describe('环境检测', () => {
    test('应该在生产环境中静默', () => {
      process.env.NODE_ENV = 'production';
      const logger = new Logger();

      logger.error('error in production');
      logger.warn('warn in production');
      logger.info('info in production');

      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    test('应该在开发环境中正常输出', () => {
      process.env.NODE_ENV = 'development';
      const logger = new Logger();

      logger.info('info in development');
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'info in development'
      );
    });
  });

  describe('配置选项', () => {
    test('应该支持禁用时间戳', () => {
      const logger = new Logger({ enableTimestamp: false });
      logger.info('test');

      const callArgs = consoleSpy.info.mock.calls[0];
      expect(callArgs[0]).not.toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    test('应该支持禁用调用者信息', () => {
      const logger = new Logger({ enableCaller: false });
      logger.info('test');

      const callArgs = consoleSpy.info.mock.calls[0];
      expect(callArgs[0]).not.toMatch(/@/);
    });
  });
});
