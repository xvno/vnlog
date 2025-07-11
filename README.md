# vnlog

[![npm version](https://badge.fury.io/js/vnlog.svg)](https://badge.fury.io/js/vnlog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<!-- [![Node.js CI](https://github.com/vnox/vnlog/workflows/Node.js%20CI/badge.svg)](https://github.com/vnox/vnlog/actions) -->

Smart logger with environment detection and rich formatting. Only outputs in development, completely silent in production.

## ✨ Features

- **🔧 Environment Smart**: Only outputs in development, silent in production
- **📊 Multiple Log Levels**: ERROR, WARN, INFO, DEBUG, TRACE
- **🎨 Rich Formatting**: Timestamps, caller info, color highlighting
- **🚀 Performance Friendly**: Zero overhead in production
- **📦 Dual Module Support**: CommonJS and ES Module
- **🔷 TypeScript Support**: Full type definitions included
- **🌳 Child Loggers**: Create specialized loggers for different modules
- **🔧 Node.js v10+**: Compatible with Node.js 10 and above

## 📦 Installation

```bash
npm install vnlog
```

## 🚀 Quick Start

> ```js
> // We should set the environment to development first
> process.env.NODE_ENV = 'development'
> ```

### JavaScript (CommonJS)

```javascript
const logger = require('vnlog');

logger.info('Hello, World!');
logger.error('Something went wrong!');
logger.debug('Debug information', { data: 'value' });
```

### JavaScript (ES Module)

```javascript
import logger from 'vnlog';

logger.info('Hello, World!');
logger.error('Something went wrong!');
logger.debug('Debug information', { data: 'value' });
```

### TypeScript

```typescript
import logger, { Logger, LogLevel } from 'vnlog';

logger.info('Hello, World!');

// Create typed logger
const customLogger = new Logger({
  prefix: 'APP',
  level: 'INFO' as LogLevel,
  enableColors: true
});

customLogger.info('Typed logging!');
```

## 📚 API Reference

### Default Logger

```javascript
import logger from 'vnlog';

// Log levels (in order of priority)
logger.error('Error message');   // Always shown (if any logs are shown)
logger.warn('Warning message');  // Shown if level >= WARN
logger.info('Info message');     // Shown if level >= INFO
logger.debug('Debug message');   // Shown if level >= DEBUG
logger.trace('Trace message');   // Shown if level >= TRACE
logger.log('Same as debug');     // Alias for debug
```

### Logger Constructor

```javascript
import { Logger } from 'vnlog';

const logger = new Logger({
  prefix: 'APP',              // Custom prefix (default: 'XIUM')
  level: 'INFO',              // Log level (default: 'DEBUG')
  enableColors: true,         // Enable colors (default: true)
  enableTimestamp: true,      // Enable timestamps (default: true)
  enableCaller: true          // Enable caller info (default: true)
});
```

### Advanced Features

#### Grouped Logging

```javascript
logger.group('User Registration');
logger.info('Step 1: Validate input');
logger.info('Step 2: Check email existence');
logger.info('Step 3: Create user account');
logger.groupEnd();

// Collapsed group
logger.group('Debug Info', true);
logger.debug('Detailed debug information');
logger.groupEnd();
```

#### Table Logging

```javascript
const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' }
];

logger.table(users);
logger.table(users, ['name', 'role']); // Show specific columns
```

#### Performance Timing

```javascript
logger.time('Database Query');
// ... some operation
logger.timeEnd('Database Query'); // Outputs: Database Query: 15.234ms
```

#### Assertions

```javascript
logger.assert(user.id > 0, 'User ID must be positive');
logger.assert(Array.isArray(items), 'Items must be an array');
```

#### Child Loggers

```javascript
const apiLogger = logger.createChild('API');
const dbLogger = logger.createChild('DB');

apiLogger.info('HTTP request started');   // [XIUM:API] [INFO] HTTP request started
dbLogger.info('Database connected');      // [XIUM:DB] [INFO] Database connected
```

### Convenience Methods

```javascript
// Import individual methods
import { info, warn, error, debug } from 'vnlog';

info('Direct info logging');
warn('Direct warn logging');
error('Direct error logging');
debug('Direct debug logging');
```

## 🔧 Configuration

### Environment Detection

vnlog automatically detects the environment using `process.env.NODE_ENV`:

- **Development**: All logs are shown (default behavior)
- **Production**: All logs are suppressed
- **Test**: All logs are suppressed

### Environment Variable Configuration

#### Command Line (Temporary)

**Linux/macOS:**
```bash
# Development (logs will be shown)
NODE_ENV=development node your-app.js

# Production (logs will be suppressed)
NODE_ENV=production node your-app.js
```

**Windows Command Prompt:**
```cmd
set NODE_ENV=development && node your-app.js
set NODE_ENV=production && node your-app.js
```

**Windows PowerShell:**
```powershell
$env:NODE_ENV="development"; node your-app.js
$env:NODE_ENV="production"; node your-app.js
```

#### Package.json Scripts

```json
{
  "scripts": {
    "dev": "NODE_ENV=development node src/index.js",
    "start": "NODE_ENV=production node src/index.js",
    "debug": "NODE_ENV=development node --inspect src/index.js"
  }
}
```

#### Using .env Files

```bash
# Install dotenv
npm install dotenv
```

Create `.env` file in project root:
```env
NODE_ENV=development
```

Load in your application:
```javascript
// At the top of your main file
require('dotenv').config();
```

#### System Environment Variables (Permanent)

**Linux/macOS:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export NODE_ENV=development
```

**Windows:**
Set through System Properties → Advanced → Environment Variables

#### Verify Configuration

```js
console.log('Current environment:', process.env.NODE_ENV);
console.log('Is development:', process.env.NODE_ENV === 'development');
```

### Log Levels

| Level | Value | Description |
|-------|-------|-------------|
| ERROR | 0     | Critical errors only |
| WARN  | 1     | Warnings and errors |
| INFO  | 2     | General information |
| DEBUG | 3     | Debug information |
| TRACE | 4     | Detailed tracing |

### Formatting Options

```javascript
const logger = new Logger({
  // Customize prefix
  prefix: 'MY-APP',

  // Set log level
  level: 'INFO',

  // Disable colors
  enableColors: false,

  // Disable timestamps
  enableTimestamp: false,

  // Disable caller information
  enableCaller: false
});
```

## 💡 Usage Examples

### Basic Usage

```javascript
const logger = require('vnlog');

// Simple logging
logger.info('Application started');
logger.warn('This is a warning');
logger.error('An error occurred');

// With data
logger.info('User login', { userId: 123, email: 'user@example.com' });
logger.debug('Request details', { method: 'POST', url: '/api/users' });
```

### Express.js Integration

```javascript
const express = require('express');
const logger = require('vnlog');

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Express Error', {
    error: err.message,
    stack: err.stack,
    url: req.url
  });
  res.status(500).send('Internal Server Error');
});
```

### TypeScript Usage

```typescript
import logger, { Logger, LogLevel, LoggerOptions } from 'vnlog';

interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private logger: Logger;

  constructor() {
    this.logger = logger.createChild('UserService');
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    this.logger.info('Creating user', userData);

    try {
      // User creation logic
      const user: User = {
        id: Math.floor(Math.random() * 1000),
        ...userData
      };

      this.logger.info('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('User creation failed', error);
      throw error;
    }
  }
}
```

## 🎯 Best Practices

### 1. Use Appropriate Log Levels

```javascript
// User actions - INFO
logger.info('User clicked save button');

// Development debugging - DEBUG
logger.debug('Form data:', formData);

// Error handling - ERROR
logger.error('Save operation failed:', error);

// Performance issues - WARN
logger.warn('API response time exceeded threshold:', responseTime);
```

### 2. Provide Context

```javascript
// ❌ Not enough information
logger.error('Save failed');

// ✅ Provide detailed context
logger.error('User profile save failed', {
  userId: this.userId,
  formData: this.formData,
  error: error.message
});
```

### 3. Use Child Loggers for Modules

```javascript
// Create specialized loggers
const authLogger = logger.createChild('AUTH');
const apiLogger = logger.createChild('API');
const dbLogger = logger.createChild('DB');

// Use them appropriately
authLogger.info('User authentication successful');
apiLogger.debug('API request parameters', params);
dbLogger.error('Database connection failed', error);
```

### 4. Performance Monitoring

```javascript
logger.time('Database Query');
const users = await db.query('SELECT * FROM users');
logger.timeEnd('Database Query');

logger.info('Query completed', { resultCount: users.length });
```

## 🔄 Migration Guide

### From console.log

```javascript
// Before
console.log('User logged in');
console.error('Error occurred:', error);

// After
logger.info('User logged in');
logger.error('Error occurred:', error);
```

### From other loggers

```javascript
// Before (winston, etc.)
const winston = require('winston');
const logger = winston.createLogger({...});

// After
const logger = require('vnlog');
// or
const logger = new Logger({ prefix: 'APP' });
```

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for environment-aware logging
- Built with TypeScript for better developer experience
- Designed for both CommonJS and ES Module compatibility

---

**vnlog** - Smart logging for modern JavaScript applications.
