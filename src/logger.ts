/**
 * vnlog - Smart logger with environment detection and rich formatting
 * 仅在开发环境输出日志，生产环境静默
 * 支持多种日志级别和格式化输出
 */

import { LogLevel, LoggerOptions, LogLevelConfig, LoggerInterface, FormatMessageResult } from './types';

export class Logger implements LoggerInterface {
  private isDev: boolean;
  private enableColors: boolean;
  private enableTimestamp: boolean;
  private enableCaller: boolean;
  private prefix: string;
  private levels: Record<LogLevel, LogLevelConfig>;
  private currentLevel: LogLevelConfig;

  constructor(options: LoggerOptions = {}) {
    this.isDev = process.env.NODE_ENV === 'development';
    this.enableColors = options.enableColors !== false;
    this.enableTimestamp = options.enableTimestamp !== false;
    this.enableCaller = options.enableCaller !== false;
    this.prefix = options.prefix || 'XIUM';

    // 日志级别配置
    this.levels = {
      ERROR: { value: 0, color: '#FF5722', method: 'error' },
      WARN: { value: 1, color: '#FF9800', method: 'warn' },
      INFO: { value: 2, color: '#2196F3', method: 'info' },
      DEBUG: { value: 3, color: '#4CAF50', method: 'log' },
      TRACE: { value: 4, color: '#9C27B0', method: 'log' }
    };

    this.currentLevel = this.levels[options.level || 'DEBUG'];
  }

  /**
   * 获取时间戳
   */
  private getTimestamp(): string {
    if (!this.enableTimestamp) return '';
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * 获取调用者信息
   */
  private getCaller(): string {
    if (!this.enableCaller) return '';
    try {
      const stack = new Error().stack;
      if (!stack) return '';

      const lines = stack.split('\n');
      // 跳过 Error、getCaller、formatMessage、实际调用方法，取第5行
      const callerLine = lines[4] || lines[3] || '';
      const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) ||
                   callerLine.match(/at\s+(.+?):(\d+):(\d+)/);

      if (match) {
        const [, func, file, line] = match;
        const fileName = file ? file.split('/').pop() : 'unknown';
        return `${func || 'anonymous'}@${fileName}:${line}`;
      }
    } catch (e) {
      // 获取调用者信息失败，静默处理
    }
    return '';
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, args: any[]): FormatMessageResult {
    const timestamp = this.getTimestamp();
    const caller = this.getCaller();
    const levelConfig = this.levels[level];

    let prefix = `[${this.prefix}]`;

    if (timestamp) {
      prefix += ` [${timestamp}]`;
    }

    prefix += ` [${level}]`;

    if (caller) {
      prefix += ` [${caller}]`;
    }

    return {
      prefix,
      color: levelConfig.color,
      method: levelConfig.method,
      args: Array.from(args)
    };
  }

  /**
   * 输出日志
   */
  private output(level: LogLevel, args: any[]): void {
    if (!this.isDev) return;

    const levelConfig = this.levels[level];
    if (!levelConfig || levelConfig.value > this.currentLevel.value) return;

    const { prefix, color, method, args: logArgs } = this.formatMessage(level, args);

    if (this.enableColors && typeof window !== 'undefined') {
      console[method](
        `%c${prefix}`,
        `color: ${color}; font-weight: bold;`,
        ...logArgs
      );
    } else {
      console[method](prefix, ...logArgs);
    }
  }

  /**
   * 错误日志
   */
  error(...args: any[]): void {
    this.output('ERROR', args);
  }

  /**
   * 警告日志
   */
  warn(...args: any[]): void {
    this.output('WARN', args);
  }

  /**
   * 信息日志
   */
  info(...args: any[]): void {
    this.output('INFO', args);
  }

  /**
   * 调试日志
   */
  debug(...args: any[]): void {
    this.output('DEBUG', args);
  }

  /**
   * 追踪日志
   */
  trace(...args: any[]): void {
    this.output('TRACE', args);
  }

  /**
   * 通用日志（等同于debug）
   */
  log(...args: any[]): void {
    this.output('DEBUG', args);
  }

  /**
   * 分组日志开始
   */
  group(label: string, collapsed = false): void {
    if (!this.isDev) return;

    const { prefix } = this.formatMessage('INFO', [label]);
    const method = collapsed ? 'groupCollapsed' : 'group';

    if (this.enableColors && typeof window !== 'undefined') {
      console[method](
        `%c${prefix}`,
        `color: ${this.levels.INFO.color}; font-weight: bold;`,
        label
      );
    } else {
      console[method](prefix, label);
    }
  }

  /**
   * 分组日志结束
   */
  groupEnd(): void {
    if (!this.isDev) return;
    console.groupEnd();
  }

  /**
   * 表格日志
   */
  table(data: any, columns?: string[]): void {
    if (!this.isDev) return;

    this.info('Table Data:');
    console.table(data, columns);
  }

  /**
   * 性能计时开始
   */
  time(label: string): void {
    if (!this.isDev) return;
    console.time(label);
  }

  /**
   * 性能计时结束
   */
  timeEnd(label: string): void {
    if (!this.isDev) return;
    console.timeEnd(label);
  }

  /**
   * 断言检查
   */
  assert(condition: any, ...args: any[]): void {
    if (!this.isDev) return;
    if (!condition) {
      this.error('Assertion failed:', ...args);
    }
  }

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    if (this.levels[level]) {
      this.currentLevel = this.levels[level];
    }
  }

  /**
   * 创建子Logger
   */
  createChild(prefix: string, options: Partial<LoggerOptions> = {}): LoggerInterface {
    const childOptions: LoggerOptions = {
      enableColors: this.enableColors,
      enableTimestamp: this.enableTimestamp,
      enableCaller: this.enableCaller,
      level: this.currentLevel.value === 0 ? 'ERROR' :
             this.currentLevel.value === 1 ? 'WARN' :
             this.currentLevel.value === 2 ? 'INFO' :
             this.currentLevel.value === 3 ? 'DEBUG' : 'TRACE',
      prefix: `${this.prefix}:${prefix}`,
      ...options
    };

    return new Logger(childOptions);
  }
}
