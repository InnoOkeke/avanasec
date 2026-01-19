# Design Document: Dependency Fix

## Overview

The Avanasec CLI tool is experiencing a runtime error where the `chardet` module cannot be found despite being listed in package.json dependencies. This issue appears to be related to module resolution in the distributed package, potentially caused by incorrect import statements, missing dependency declarations, or build configuration issues.

This design document outlines the architecture and implementation strategy for fixing the dependency resolution issue and ensuring robust package distribution.

## Architecture

### Problem Analysis

The user is experiencing multiple critical issues with the published package:

1. **Command Not Found**: The `avanasec` command is not recognized after installation, indicating the binary is not properly configured
2. **Missing Dependencies**: Dependencies are not being installed alongside avanasec, suggesting package.json configuration issues
3. **Module Resolution**: The `Cannot find module 'chardet'` error occurs because dependencies aren't installed
4. **Package Distribution**: The published package appears to have fundamental configuration problems

**Root Causes Identified**:
- Binary configuration in package.json may be incorrect
- Dependencies may not be properly declared or bundled
- The package may not be installing correctly via npm
- Build output may not be properly structured for distribution

### Root Cause Investigation

```
Issue 1: Command not found
- Binary: "avanasec": "./dist/cli.js" in package.json
- Problem: Binary may not be executable or properly configured

Issue 2: Dependencies not installing
- Dependencies: Listed in package.json but not installing with package
- Problem: Package may not be properly configured for npm distribution

Issue 3: Module resolution error
- Error Location: file-type-detector.js:43:30
- Import Statement: const chardet = __importStar(require("chardet"));
- Problem: chardet not available because dependencies didn't install

Issue 4: Package distribution
- Published package may be missing critical configuration
- npm installation process may not be working correctly
```

## Components and Interfaces

### 1. Binary Configuration Fixer

**Purpose**: Ensure the CLI binary is properly configured and executable

**Current Configuration**:
```json
{
  "bin": {
    "avanasec": "./dist/cli.js"
  }
}
```

**Issues to Fix**:
- Verify the binary path is correct
- Ensure the CLI file has proper shebang (`#!/usr/bin/env node`)
- Check file permissions and executability
- Validate the binary works after installation

### 2. Package Distribution Fixer

**Purpose**: Fix package.json configuration for proper npm distribution

**Current Issues**:
- Dependencies not installing with the package
- Package may not be properly configured for global installation
- Files field may not include all necessary files

**Fixed Configuration**:
```json
{
  "name": "avanasec",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "avanasec": "./dist/cli.js"
  },
  "files": [
    "dist/**/*",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "dependencies": {
    "husky": "^9.0.0",
    "minimatch": "^10.1.1",
    "chardet": "^2.1.1",
    "cli-progress": "^3.12.0",
    "iconv-lite": "^0.7.2"
  }
}
```

### 3. Import Statement Fixer

**Purpose**: Fix the import statement to use the correct CommonJS pattern

**Current Implementation**:
```typescript
import * as chardet from 'chardet';
```

**Fixed Implementation**:
```typescript
const chardet = require('chardet');
```

**Rationale**: The `chardet` library is a CommonJS module and should be imported using `require()` syntax for better compatibility.

### 4. CLI Executable Validator

**Purpose**: Ensure the CLI binary is properly executable after installation

**Interface**:
```typescript
interface CLIValidator {
  validateBinary(): BinaryValidationResult;
  checkShebang(): boolean;
  testGlobalInstallation(): InstallationResult;
}

interface BinaryValidationResult {
  isExecutable: boolean;
  hasShebang: boolean;
  pathCorrect: boolean;
  errors: string[];
}
```

**Implementation Strategy**:
- Check that dist/cli.js has proper shebang
- Verify file permissions
- Test global installation process
- Validate command recognition

### 5. Dependency Validator

**Interface**:
```typescript
interface DependencyValidator {
  validateDependencies(): ValidationResult;
  checkModuleResolution(moduleName: string): boolean;
  generateDependencyReport(): DependencyReport;
}

interface ValidationResult {
  success: boolean;
  missingDependencies: string[];
  resolutionErrors: ModuleError[];
}

interface ModuleError {
  module: string;
  error: string;
  suggestion: string;
}
```

**Implementation Strategy**:
- Check that all dependencies in package.json can be resolved
- Validate import statements work in the built output
- Generate reports for CI/CD validation

**Purpose**: Validate that all dependencies are properly resolved during build

**Interface**:
```typescript
interface DependencyValidator {
  validateDependencies(): ValidationResult;
  checkModuleResolution(moduleName: string): boolean;
  generateDependencyReport(): DependencyReport;
}

interface ValidationResult {
  success: boolean;
  missingDependencies: string[];
  resolutionErrors: ModuleError[];
}

interface ModuleError {
  module: string;
  error: string;
  suggestion: string;
}
```

**Implementation Strategy**:
- Check that all dependencies in package.json can be resolved
- Validate import statements work in the built output
- Generate reports for CI/CD validation

### 6. Build Validator

**Purpose**: Ensure the build process produces a working package

**Interface**:
```typescript
interface BuildValidator {
  validateBuild(): BuildValidationResult;
  testModuleLoading(): ModuleLoadingResult;
  verifyPackageIntegrity(): PackageIntegrityResult;
}

interface BuildValidationResult {
  success: boolean;
  errors: BuildError[];
  warnings: BuildWarning[];
}
```

**Implementation Strategy**:
- Test the built package in a clean environment
- Verify all modules can be loaded
- Check that the CLI starts successfully

### 7. Error Handler Enhancement

**Purpose**: Provide better error messages for dependency issues

**Interface**:
```typescript
interface DependencyErrorHandler {
  handleMissingModule(moduleName: string): void;
  provideTroubleshootingSteps(error: Error): string[];
  generateInstallationInstructions(): string;
}
```

**Implementation Strategy**:
- Detect specific dependency errors
- Provide actionable error messages
- Include installation and troubleshooting instructions

## Data Models

### Enhanced Package Configuration

```typescript
interface PackageConfig {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  files: string[];
  main: string;
  types: string;
  bin: Record<string, string>;
}

interface BuildConfig {
  target: string;
  module: string;
  moduleResolution: string;
  esModuleInterop: boolean;
  allowSyntheticDefaultImports: boolean;
}
```

### Dependency Information

```typescript
interface DependencyInfo {
  name: string;
  version: string;
  type: 'production' | 'development';
  resolved: boolean;
  path?: string;
  error?: string;
}

interface ModuleResolutionInfo {
  module: string;
  resolvedPath: string;
  isNative: boolean;
  isInstalled: boolean;
  version?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Binary Accessibility
*For any* global installation of avanasec, the `avanasec` command should be recognized and executable from any directory.

**Validates: Requirements 3.3**

### Property 2: Dependency Installation
*For any* npm installation of avanasec, all dependencies listed in package.json should be installed and available in node_modules.

**Validates: Requirements 1.1, 3.2**

### Property 3: Module Loading Success
*For any* required dependency listed in package.json, when the CLI is executed, all modules should be resolvable and loadable without throwing "Cannot find module" errors.

**Validates: Requirements 1.2, 1.3, 3.3**

### Property 4: Package Integrity
*For any* built and published package, it should include all necessary files and dependencies such that installation in a clean environment results in a fully functional CLI.

**Validates: Requirements 2.2, 2.4, 3.1, 3.4**

### Property 5: Error Message Completeness
*For any* dependency-related error, the error message should include the missing module name, installation instructions, and links to documentation or support resources.

**Validates: Requirements 4.1, 4.2, 4.4**

## Error Handling

### Error Categories

1. **Module Resolution Errors**
   - Module not found
   - Incorrect import syntax
   - Version compatibility issues

2. **Build Errors**
   - TypeScript compilation failures
   - Missing type definitions
   - Import/export mismatches

3. **Package Distribution Errors**
   - Missing files in published package
   - Incorrect package.json configuration
   - Dependency version conflicts

4. **Runtime Errors**
   - Module loading failures
   - Initialization errors
   - Compatibility issues

### Error Handling Strategy

```typescript
// Enhanced error handling for dependency issues
try {
  const chardet = require('chardet');
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error(`
Error: Required dependency 'chardet' not found.

This usually means:
1. The package was not installed correctly
2. Dependencies are missing from node_modules

To fix this issue:
1. Run: npm install chardet
2. Or reinstall avanasec: npm uninstall -g avanasec && npm install -g avanasec
3. If the issue persists, please report it at: https://github.com/innookeke/avanasec/issues

For more help, visit: https://github.com/innookeke/avanasec#troubleshooting
    `);
    process.exit(3);
  }
  throw error;
}
```

## Testing Strategy

### Dual Testing Approach

The dependency fix will use both unit tests and property-based tests:

- **Unit tests**: Test specific import scenarios and error conditions
- **Property tests**: Verify universal properties across different environments

### Unit Testing

**Test Structure**:
```
tests/
├── unit/
│   ├── dependency-resolution.test.ts
│   ├── import-compatibility.test.ts
│   ├── build-validation.test.ts
│   └── error-handling.test.ts
```

**Test Scenarios**:
- Test chardet module loading
- Test import statement compatibility
- Test error message generation
- Test build output validation

### Property-Based Testing

**Framework**: fast-check

**Test Structure**:
```
tests/
├── property/
│   ├── module-resolution.property.test.ts
│   ├── build-completeness.property.test.ts
│   ├── package-integrity.property.test.ts
│   └── error-clarity.property.test.ts
```

**Configuration**:
- Minimum 100 iterations per property test
- Test in clean environments
- Use Docker containers for isolation

### Integration Testing

**Test Structure**:
```
tests/
├── integration/
│   ├── clean-install.test.ts
│   ├── cli-startup.test.ts
│   ├── dependency-loading.test.ts
│   └── package-distribution.test.ts
```

**Test Scenarios**:
- Install package in clean environment
- Test CLI startup with all dependencies
- Verify file type detection works
- Test package publishing workflow

## Implementation Plan

### Phase 1: Binary Configuration Fix
1. Add proper shebang to CLI file
2. Fix binary path in package.json
3. Test binary executability
4. Verify global installation works

### Phase 2: Package Configuration Fix
5. Update package.json files field
6. Verify dependencies are properly declared
7. Test package installation process
8. Validate package integrity

### Phase 3: Import Statement Fix
9. Change import statement from ES6 to CommonJS
10. Test the fix locally
11. Verify file type detection works
12. Update any other problematic imports

### Phase 4: Build and Distribution Validation
13. Add build validation scripts
14. Test built package in clean environment
15. Verify all modules load correctly
16. Test npm publishing workflow

### Phase 5: Error Handling Enhancement
17. Improve error messages for dependency issues
18. Add troubleshooting instructions
19. Test error scenarios
20. Add installation guidance

### Phase 6: Testing and Validation
21. Add comprehensive tests
22. Test in multiple environments
23. Validate fix with property-based tests
24. Test global installation process

## Dependencies

### No New Dependencies Required

The fix should not require any new dependencies. The issue is with how existing dependencies are imported and resolved.

### Potential Dependency Updates

```json
{
  "dependencies": {
    "chardet": "^2.1.1"  // Keep current version, fix import
  }
}
```

## Deployment Strategy

### Version Update

- **Version**: Increment patch version (2.11.2 → 2.11.3)
- **Type**: Bug fix release
- **Breaking Changes**: None

### Release Process

1. Fix import statement
2. Test locally
3. Run full test suite
4. Build and validate package
5. Test in clean environment
6. Publish to npm
7. Verify published package works
8. Update documentation if needed

## Conclusion

The dependency fix addresses a critical runtime error that prevents Avanasec CLI from functioning. The solution involves fixing the import statement to use CommonJS syntax, enhancing error handling, and improving the build validation process.

The fix is minimal and focused, changing only the import statement while adding robust validation to prevent similar issues in the future. The implementation will be thoroughly tested to ensure reliability across different environments.

