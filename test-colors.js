#!/usr/bin/env node

// 设置开发环境
process.env.NODE_ENV = 'development';

const { Logger } = require('./dist/cjs/logger.js');

console.log('Testing vnlog colors in Node.js environment...\n');

// 创建 logger 实例
const logger = new Logger({
  prefix: 'TEST',
  enableColors: true,
  enableTimestamp: true,
  enableCaller: false
});

// 测试各种日志级别的颜色
logger.error('This is an ERROR message - should be red');
logger.warn('This is a WARN message - should be yellow');
logger.info('This is an INFO message - should be blue');
logger.debug('This is a DEBUG message - should be green');
logger.trace('This is a TRACE message - should be purple');

console.log('\nTesting group colors...');
logger.group('Group Test');
logger.info('Inside group');
logger.warn('Inside group');
logger.error('Inside group');
logger.debug('Inside group');
logger.trace('Inside group');
logger.groupEnd();

logger.group('Group Test 2');
logger.info('Inside group 2');
logger.warn('Inside group 2');
logger.error('Inside group 2');
logger.debug('Inside group 2');
logger.trace('Inside group 2');
logger.groupEnd();

console.log('\nIf you see colors above, the fix is working correctly!');