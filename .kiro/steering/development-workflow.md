# Development Workflow: Avana

## Kiro CLI Integration

Avana is built using spec-driven development with Kiro CLI. This steering file defines the optimal workflow for development.

## Core Development Cycle

### Phase 1: Context & Planning
1. **Load Context**: Use `@prime` to understand current codebase state
2. **Plan Features**: Use `@plan-feature` for comprehensive feature planning
3. **Review Specs**: Check `.kiro/specs/avana-core/` for requirements and tasks

### Phase 2: Implementation
1. **Execute Tasks**: Use `@execute task X from avana-core spec`
2. **Run Tests**: Always run tests after implementation: `npm test`
3. **Check Diagnostics**: Use built-in diagnostics to catch issues early
4. **Update Progress**: Mark completed tasks in `tasks.md`

### Phase 3: Quality Assurance
1. **Code Review**: Use `@code-review` to maintain code quality
2. **Property Testing**: Ensure all property-based tests pass with 100+ iterations
3. **Integration Testing**: Test full CLI workflows
4. **Performance Validation**: Verify <10 second scans for large codebases

### Phase 4: Documentation
1. **Update DEVLOG**: Document progress, decisions, and challenges
2. **Update README**: Keep user documentation current
3. **Update Steering**: Refine development guidelines as needed

## Testing Strategy

### Property-Based Testing Requirements
- **Minimum 100 iterations** per property test
- **Tag format**: `Feature: avana-core, Property N: [property description]`
- **Validation format**: `**Validates: Requirements X.Y**`
- **15 total properties** covering all robustness aspects

### Unit Testing Requirements
- **80%+ code coverage** across all components
- **Descriptive test names** explaining the scenario
- **AAA pattern**: Arrange, Act, Assert
- **Mock external dependencies** for isolation

### Integration Testing Requirements
- **Full CLI workflows** from scan to output
- **Git hook integration** testing
- **Error scenario handling** validation
- **Performance benchmarking** verification

## Git Integration Workflow

### Pre-commit Hook Testing
1. **Install hooks**: `npm run install-hooks`
2. **Test staged scanning**: `git add . && git commit -m "test"`
3. **Verify blocking**: Ensure medium+ severity issues block commits
4. **Test bypass**: Verify `--no-verify` works for emergencies

### Commit Message Standards
```
<type>(<scope>): <subject>

<body>

Validates: Requirements X.Y
```

**Types**: feat, fix, docs, test, refactor, chore
**Scopes**: patterns, scanner, cli, tests, docs

## Performance Optimization Guidelines

### File Handling
- **Binary Detection**: Skip binary files early
- **Streaming**: Use streaming for files >10MB
- **Encoding**: Handle all encodings gracefully
- **Memory Management**: Monitor and limit memory usage

### Pattern Matching
- **Pre-compilation**: Compile regex patterns at startup
- **Smart Ignore**: Use effective ignore patterns
- **Parallel Processing**: Ready for worker thread implementation
- **Caching**: Infrastructure for result caching

## Error Handling Standards

### Error Categories
1. **FilePermissionError**: Graceful handling of access denied
2. **ConfigurationError**: Invalid CLI arguments or config
3. **OutOfMemoryError**: Memory limit exceeded
4. **ValidationError**: Pattern compilation failures
5. **SystemError**: Unexpected system errors

### Recovery Strategies
- **Continue on Error**: Never crash, always provide useful output
- **Clear Messages**: Actionable error messages with suggestions
- **Exit Codes**: Standard codes for CI/CD integration
- **Logging**: Comprehensive logging for debugging

## Security Pattern Development

### Adding New Patterns
1. **Research**: Identify new services and their token formats
2. **Pattern Design**: Create precise regex with low false positives
3. **Severity Assignment**: Critical, High, Medium, Low based on impact
4. **Test Cases**: Add positive and negative test cases
5. **Documentation**: Include clear descriptions and suggestions

### Pattern Categories
- **Authentication**: OAuth, SAML, JWT, API keys
- **Financial**: Payment processors, crypto, banking
- **Infrastructure**: Cloud providers, databases, email
- **Communication**: Messaging, webhooks, notifications
- **Development**: Version control, CI/CD, deployment

## Kiro CLI Best Practices

### Spec-Driven Development
- **Requirements First**: Always start with clear requirements
- **Design Documentation**: Comprehensive architecture documentation
- **Task Breakdown**: Discrete, actionable implementation tasks
- **Traceability**: Link tasks to requirements for validation

### Context Management
- **Steering Files**: Use steering for persistent project knowledge
- **File References**: Use `#[[file:path]]` for including external docs
- **Conditional Loading**: Use front-matter for context-specific steering
- **Manual Context**: Use `#` in chat for specific context inclusion

### Prompt Engineering
- **Custom Prompts**: Create project-specific prompts in `.kiro/prompts/`
- **Workflow Automation**: Use prompts for common development tasks
- **Quality Gates**: Prompts for code review and testing
- **Documentation**: Prompts for maintaining documentation

## Success Metrics

### Code Quality
- ✅ All tests passing (unit, property-based, integration)
- ✅ 80%+ code coverage
- ✅ No critical bugs or security issues
- ✅ Performance benchmarks met

### Kiro Integration
- ✅ Comprehensive spec documentation
- ✅ Custom steering files for project context
- ✅ Development prompts for workflow automation
- ✅ DEVLOG documenting Kiro usage

### Security Coverage
- ✅ 100+ security patterns implemented
- ✅ All major service categories covered
- ✅ Low false positive rate (<1%)
- ✅ Actionable remediation suggestions

## Troubleshooting

### Common Issues
- **Test Failures**: Check property test iterations (should be 100+)
- **Performance Issues**: Verify ignore patterns are effective
- **Memory Issues**: Check file streaming for large files
- **Pattern Issues**: Validate regex compilation and test cases

### Debug Commands
```bash
# Run with debug logging
npm run scan -- --debug

# Test specific patterns
npm test -- --grep "pattern-name"

# Check memory usage
npm run scan -- --verbose

# Test git hooks
npm run test-hooks
```

## Resources

- [Kiro CLI Documentation](https://kiro.dev/docs)
- [Spec-Driven Development Guide](https://kiro.dev/docs/specs)
- [Steering Files Guide](https://kiro.dev/docs/steering)
- [Property-Based Testing with fast-check](https://github.com/dubzzz/fast-check)