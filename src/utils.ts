/**
 * vnlog - 工具函数
 * 包含Logger相关的辅助函数
 */

import { LogLevel } from './types';

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * 检查是否为浏览器环境
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * 检查是否为Node.js环境
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions && !!process.versions.node;
}

/**
 * 获取日志级别的数值
 */
export function getLogLevelValue(level: LogLevel): number {
  const levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4
  };
  return levels[level];
}

/**
 * 比较两个日志级别
 */
export function compareLogLevels(level1: LogLevel, level2: LogLevel): number {
  return getLogLevelValue(level1) - getLogLevelValue(level2);
}

/**
 * 检查日志级别是否应该输出
 */
export function shouldLog(messageLevel: LogLevel, currentLevel: LogLevel): boolean {
  return getLogLevelValue(messageLevel) <= getLogLevelValue(currentLevel);
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * 安全地获取错误堆栈信息
 */
export function getStackTrace(): string[] {
  try {
    const error = new Error();
    const stack = error.stack;
    if (!stack) return [];
    return stack.split('\n');
  } catch (e) {
    return [];
  }
}

/**
 * 从堆栈信息中提取调用者信息
 */
export function extractCallerInfo(stackLines: string[], skipFrames: number = 4): string {
  try {
    const callerLine = stackLines[skipFrames] || stackLines[skipFrames - 1] || '';
    const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) ||
                 callerLine.match(/at\s+(.+?):(\d+):(\d+)/);

    if (match) {
      const [, func, file, line] = match;
      const fileName = file ? file.split('/').pop() : 'unknown';
      return `${func || 'anonymous'}@${fileName}:${line}`;
    }
  } catch (e) {
    // 静默处理错误
  }
  return '';
}

/**
 * 深拷贝对象（用于日志参数）
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * 颜色代码常量
 */
export const COLORS = {
  ERROR: '#FF5722',
  WARN: '#FF9800',
  INFO: '#2196F3',
  DEBUG: '#4CAF50',
  TRACE: '#9C27B0'
} as const;

/**
 * 默认配置常量
 */
export const DEFAULT_OPTIONS = {
  enableColors: true,
  enableTimestamp: true,
  enableCaller: true,
  prefix: 'XIUM',
  level: 'DEBUG' as LogLevel
} as const;
