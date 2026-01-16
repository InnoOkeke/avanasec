# Project Context: Avana

## Project Overview

Avana is a production-ready CLI tool for detecting hardcoded secrets, API keys, and credentials in codebases. The goal is to create a robust, performant, and well-tested tool ready for npm publication.

## Core Purpose

Prevent security breaches by detecting secrets before they reach version control:
1. **Robust file handling** - Handle all file types, encodings, and edge cases
2. **High performance** - Fast scanning even for large codebases
3. **Comprehensive testing** - Unit, property-based, and integration tests
4. **Production-ready** - Proper error handling, logging, and CI/CD integration
5. **Easy to use** - Zero configuration with sensible defaults

## Technology Stack

- **Language**: TypeScript 5.5+ (strict mode)
- **Runtime**: Node.js 18+
- **Testing**: Vitest (unit), fast-check (property-based)
- **Build**: TypeScript compiler
- **Package Manager**: npm
- **CI/CD**: GitHub Actions

## Project Structure

```
avana/
├── .kiro/                    # Kiro CLI configuration
│   ├── specs/                # Feature specifications
│   │   └── avana-core/       # Core robustness spec
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

1. **Robustness First**: Handle all edge cases gracefully
2. **Performance Matters**: Fast scanning is essential for adoption
3. **Zero Configuration**: Works out of the box with sensible defaults
4. **Extensibility**: Easy to add new patterns and features
5. **Developer Experience**: Clear errors, helpful messages, good documentation

## Development Workflow

### With Kiro CLI

1. Load context: `@prime`
2. Plan features: `@plan-feature "feature name"`
3. Execute tasks: `@execute task X from avana-core spec`
4. Review code: `@code-review`
5. Update DEVLOG: Document progress and decisions

### Manual Development

1. Make changes in `src/`
2. Build: `npm run build`
3. Test: `npm test`
4. Run: `node dist/cli.js scan`

## Current Status

### Completed ✅
- Project structure and configuration
- Core scanning engine (80+ patterns)
- Basic CLI interface
- Requirements specification (12 requirements, 60+ criteria)
- Initial documentation

### In Progress 🔄
- Design document (architecture, properties)
- Implementation tasks
- Robustness improvements

### Planned 📋
- Comprehensive testing suite
- CI/CD pipeline
- npm publication
- Advanced features (caching, parallel scanning)

## Important Files

- **Spec**: `.kiro/specs/avana-core/` (requirements.md, design.md, tasks.md)
- **DEVLOG**: `.kiro/DEVLOG.md` (development timeline)
- **README**: `README.md` (user documentation)
- **Source**: `src/` (implementation)

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

- **Repository**: https://github.com/yourusername/avana
- **Issues**: https://github.com/yourusername/avana/issues
- **npm**: https://www.npmjs.com/package/avana
