/**
 * vnlog - TypeScript类型定义
 */

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export interface LoggerOptions {
  /** 是否启用颜色显示，默认为true */
  enableColors?: boolean;
  /** 是否启用时间戳，默认为true */
  enableTimestamp?: boolean;
  /** 是否启用调用者信息，默认为true */
  enableCaller?: boolean;
  /** 日志前缀，默认为'XIUM' */
  prefix?: string;
  /** 日志级别，默认为'DEBUG' */
  level?: LogLevel;
}

export interface LogLevelConfig {
  /** 日志级别数值，用于比较 */
  value: number;
  /** 日志颜色 */
  color: string;
  /** 控制台输出方法 */
  method: 'error' | 'warn' | 'info' | 'log';
}

export interface LoggerInterface {
  /** 输出错误日志 */
  error(...args: any[]): void;
  /** 输出警告日志 */
  warn(...args: any[]): void;
  /** 输出信息日志 */
  info(...args: any[]): void;
  /** 输出调试日志 */
  debug(...args: any[]): void;
  /** 输出追踪日志 */
  trace(...args: any[]): void;
  /** 输出日志（等同于debug） */
  log(...args: any[]): void;
  /** 开始分组日志 */
  group(label: string, collapsed?: boolean): void;
  /** 结束分组日志 */
  groupEnd(): void;
  /** 输出表格数据 */
  table(data: any, columns?: string[]): void;
  /** 开始性能计时 */
  time(label: string): void;
  /** 结束性能计时 */
  timeEnd(label: string): void;
  /** 断言检查 */
  assert(condition: any, ...args: any[]): void;
  /** 设置日志级别 */
  setLevel(level: LogLevel): void;
  /** 创建子Logger */
  createChild(prefix: string, options?: Partial<LoggerOptions>): LoggerInterface;
}

export interface FormatMessageResult {
  /** 格式化的前缀 */
  prefix: string;
  /** 日志颜色 */
  color: string;
  /** 控制台方法 */
  method: 'error' | 'warn' | 'info' | 'log';
  /** 日志参数 */
  args: any[];
}

export type LoggerConstructor = new (options?: LoggerOptions) => LoggerInterface;
