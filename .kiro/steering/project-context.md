# Project Context: Avanasec

## Project Overview

Avanasec is a comprehensive security scanner CLI tool for detecting secrets, credentials, and security vulnerabilities in codebases. Built with production-ready development practices, it demonstrates 100+ security patterns, robust testing, and seamless Git integration.

## Core Purpose

Enhance security across the entire development lifecycle by providing:
1. **Comprehensive Security Coverage** - 100+ patterns covering OAuth, Web3, payments, infrastructure
2. **Robust File Handling** - Binary detection, encoding support, large file streaming
3. **High Performance** - <10 seconds for 10,000 files with smart ignore patterns
4. **Property-Based Testing** - 15 properties with 1,500+ test iterations for reliability
5. **Git Integration** - Pre-commit hooks with staged file scanning
6. **Developer Experience** - Clear error messages, actionable suggestions, markdown reports

## Technology Stack

- **Language**: TypeScript 5.5+ (strict mode)
- **Runtime**: Node.js 18+
- **Testing**: Vitest (unit), fast-check (property-based testing with 100+ iterations)
- **Build**: TypeScript compiler with ES2022 target
- **Package Manager**: npm
- **Git Integration**: Husky pre-commit hooks
- **Security Patterns**: 100+ patterns across all major services

## Project Structure

```
avanasec/
├── .kiro/                    # Kiro CLI configuration
│   ├── specs/                # Feature specifications
│   │   └── avanasec-core/    # Core robustness spec
│   ├── steering/             # Development guidelines
│   └── DEVLOG.md             # Development log
├── src/                      # Source code
│   ├── types/                # TypeScript types
│   ├── rules/                # Secret patterns
│   ├── scanners/             # File scanning logic
│   ├── commands/             # CLI commands
│   ├── index.ts              # Main engine
│   └── cli.ts                # CLI entry point
├── tests/                    # Test files
├── examples/                 # Usage examples
├── .github/workflows/        # CI/CD pipelines
├── README.md                 # Documentation
├── LICENSE                   # MIT License
└── package.json              # Package metadata
```

## Key Design Principles

1. **Kiro Integration First**: Deep integration with `.kiro/` directory structure and spec-driven development
2. **Security-First Development**: Comprehensive coverage of all major authentication and financial services
3. **Robustness Through Testing**: Property-based testing with 100+ iterations per property
4. **Performance Optimization**: Smart ignore patterns, streaming for large files, memory management
5. **Developer Experience**: Clear error messages, actionable suggestions, seamless Git integration
6. **Production Ready**: Proper error handling, logging, exit codes for CI/CD integration

## Development Workflow

### With Kiro CLI

1. Load context: `@prime`
2. Plan features: `@plan-feature "feature name"`
3. Execute tasks: `@execute task X from avanasec-core spec`
4. Review code: `@code-review`
5. Update DEVLOG: Document progress and decisions

### Manual Development

1. Make changes in `src/`
2. Build: `npm run build`
3. Test: `npm test`
4. Run: `node dist/cli.js scan`

## Current Status: Production Ready ✅

### Core Features Complete
- ✅ **100+ Security Patterns**: OAuth, Web3, payments, infrastructure, email services
- ✅ **Robust File Handling**: Binary detection, encoding support, large file streaming
- ✅ **Property-Based Testing**: 15 properties with 1,500+ test iterations
- ✅ **Git Integration**: Pre-commit hooks with staged file scanning
- ✅ **Smart Ignore System**: Respects .gitignore, .avanasecignore, and CLI patterns
- ✅ **Multiple Output Formats**: JSON, Markdown, console with rich formatting
- ✅ **Error Recovery**: Graceful handling of all edge cases
- ✅ **Performance Optimized**: <10 seconds for 10,000 files

### Security Coverage
- ✅ **Authentication**: OAuth, SAML, JWT, API keys for all major providers
- ✅ **Financial**: Payment processors, crypto exchanges, on/off ramps
- ✅ **Infrastructure**: Cloud providers, databases, email services
- ✅ **Web3/Blockchain**: All major networks, DeFi, NFT platforms
- ✅ **Communication**: Messaging, email, webhook integrations
- ✅ **Development**: Version control, CI/CD, deployment keys

## Quality Standards

Focus on delivering:
- **Application Quality**: Build something useful and polished
- **Development Process**: Deep integration with modern development workflows
- **Documentation**: Comprehensive README, SETUP guide, and DEVLOG
- **Innovation**: Unique features like comprehensive security patterns and property-based testing
- **Professional Presentation**: Clear demo and excellent code quality

## Important Files

- **Spec**: `.kiro/specs/avanasec-core/` (requirements.md, design.md, tasks.md)
- **DEVLOG**: `DEVLOG.md` (development timeline and decisions)
- **README**: `README.md` (project overview and setup)
- **SETUP**: `SETUP.md` (quick setup guide for developers)
- **Patterns**: `src/rules/secret-patterns.ts` (100+ security patterns)
- **Tests**: `tests/` (property-based and unit tests)

## Testing Strategy

### Unit Tests
- Test each scanner independently
- Test pattern matching
- Test file handling
- Test error cases

### Property-Based Tests
- Scan determinism (same input → same output)
- Score consistency
- Pattern validation
- File handling edge cases

### Integration Tests
- Full CLI workflows
- CI/CD integration
- Real-world examples

## Publishing Checklist

Before publishing to npm:
- [ ] All tests passing
- [ ] 80%+ code coverage
- [ ] Documentation complete
- [ ] Examples added
- [ ] CI/CD configured
- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] README reviewed
- [ ] LICENSE included

## Resources

- [Kiro CLI Documentation](https://kiro.dev/docs)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [fast-check Documentation](https://github.com/dubzzz/fast-check)

## Coding Standards

See `coding-standards.md` for detailed guidelines on:
- TypeScript conventions
- File naming
- Code organization
- Testing practices
- Git commit messages
- Documentation standards

## Contact

- **Repository**: https://github.com/yourusername/avanasec
- **Issues**: https://github.com/yourusername/avanasec/issues
- **npm**: https://www.npmjs.com/package/avanasec


