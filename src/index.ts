/**
 * vnlog - Smart logger with environment detection and rich formatting
 *
 * @example
 * ```typescript
 * import logger from 'vnlog';
 * // 或者
 * import { Logger } from 'vnlog';
 *
 * logger.info('Hello world');
 * logger.error('Something went wrong');
 * ```
 */

export { Logger } from './logger';
export type {
  LogLevel,
  LoggerOptions,
  LoggerInterface,
  LogLevelConfig,
  FormatMessageResult,
  LoggerConstructor
} from './types';

// 导入类型用于内部使用
import { LogLevel, LoggerOptions } from './types';

// 创建默认Logger实例
import { Logger } from './logger';

const logger = new Logger();

// 导出默认实例
export default logger;

// 导出便捷方法，可以直接使用
export const error = (...args: any[]) => logger.error(...args);
export const warn = (...args: any[]) => logger.warn(...args);
export const info = (...args: any[]) => logger.info(...args);
export const debug = (...args: any[]) => logger.debug(...args);
export const trace = (...args: any[]) => logger.trace(...args);
export const log = (...args: any[]) => logger.log(...args);
export const group = (label: string, collapsed?: boolean) => logger.group(label, collapsed);
export const groupEnd = () => logger.groupEnd();
export const table = (data: any, columns?: string[]) => logger.table(data, columns);
export const time = (label: string) => logger.time(label);
export const timeEnd = (label: string) => logger.timeEnd(label);
export const assert = (condition: any, ...args: any[]) => logger.assert(condition, ...args);
export const setLevel = (level: LogLevel) => logger.setLevel(level);
export const createChild = (prefix: string, options?: Partial<LoggerOptions>) => logger.createChild(prefix, options);
