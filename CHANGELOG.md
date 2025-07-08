# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Plugin system for custom formatters
- Configuration file support
- Performance metrics dashboard
- Log shipping to external services

## [1.0.0] - 2025-01-14

### Added
- Initial release of vnlog
- Environment-aware logging (development only output)
- Multiple log levels: ERROR, WARN, INFO, DEBUG, TRACE
- Rich formatting with timestamps, caller info, and colors
- TypeScript support with full type definitions
- Dual module support (CommonJS and ES Module)
- Node.js v10+ compatibility
- Child logger functionality
- Advanced features:
  - Grouped logging with `group()` and `groupEnd()`
  - Table output with `table()`
  - Performance timing with `time()` and `timeEnd()`
  - Assertion logging with `assert()`
- Comprehensive test suite with unit and integration tests
- Complete documentation and usage examples
- Migration support from console.log and other loggers

### Features
- **Smart Environment Detection**: Automatically detects development vs production
- **Zero Production Overhead**: Completely silent in production environments
- **Rich API**: Full-featured logging with advanced capabilities
- **Type Safety**: Complete TypeScript definitions and IntelliSense support
- **Module Flexibility**: Works with both CommonJS and ES Module projects
- **Backward Compatibility**: Supports Node.js versions from v10 onwards

### Developer Experience
- Intuitive API similar to console methods
- Detailed error messages and stack traces
- Color-coded output for better readability
- Timestamp and caller information for debugging
- Modular architecture with child loggers

### Performance
- Optimized for development workflow
- No runtime overhead in production
- Efficient memory usage
- Fast startup time

## [0.9.0] - 2025-01-14 (Pre-release)

### Added
- Core Logger class implementation
- Basic logging functionality
- Environment detection logic
- TypeScript type definitions

### Changed
- Migrated from JavaScript to TypeScript
- Improved error handling
- Enhanced performance

### Fixed
- Memory leaks in development mode
- Timestamp formatting issues
- Module resolution problems

## [0.1.0] - 2025-01-14 (Alpha)

### Added
- Initial project setup
- Basic logging prototype
- Development environment configuration

---

## Version History Summary

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2025-01-14 | Initial stable release with full feature set |
| 0.9.0 | 2025-01-14 | Pre-release with core functionality |
| 0.1.0 | 2025-01-14 | Alpha version with basic prototype |

## Migration Notes

### From 0.x to 1.0.0
- No breaking changes for basic usage
- Enhanced TypeScript support
- New advanced features available
- Improved performance and reliability

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/vnlog/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/vnlog/discussions)

---

**vnlog** - Smart logging for modern JavaScript applications.
