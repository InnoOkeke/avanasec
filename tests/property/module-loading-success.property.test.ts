/**
 * Property Tests: Module Loading Success
 * Feature: dependency-fix, Property 3: Module Loading Success
 * Validates: Requirements 1.2, 1.3, 3.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { execSync } from 'child_process';

describe('Feature: dependency-fix, Property 3: Module Loading Success', () => {
  it('should load all core modules without errors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'FileTypeDetector',
          'SecretScanner', 
          'ProgressReporter',
          'IgnorePatternManager',
          'JsonOutputFormatter',
          'MarkdownOutputFormatter'
        ),
        (moduleName) => {
          expect(() => {
            // Test loading through main index
            const avana = require('../../dist/index');
            expect(avana).toBeDefined();
            
            // Test specific module loading
            let moduleClass;
            switch (moduleName) {
              case 'FileTypeDetector':
                moduleClass = require('../../dist/utils/file-type-detector').FileTypeDetector;
                break;
              case 'SecretScanner':
                moduleClass = require('../../dist/scanners/secret-scanner').SecretScanner;
                break;
              case 'ProgressReporter':
                moduleClass = require('../../dist/utils/progress-reporter').ProgressReporter;
                break;
              case 'IgnorePatternManager':
                moduleClass = require('../../dist/utils/ignore-pattern-manager').IgnorePatternManager;
                break;
              case 'JsonOutputFormatter':
                moduleClass = require('../../dist/utils/json-output-formatter').JsonOutputFormatter;
                break;
              case 'MarkdownOutputFormatter':
                moduleClass = require('../../dist/utils/markdown-output-formatter').MarkdownOutputFormatter;
                break;
            }
            
            expect(moduleClass).toBeDefined();
            expect(typeof moduleClass).toBe('function');
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should load external dependencies correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'chardet',
          'cli-progress',
          'iconv-lite',
          'minimatch'
        ),
        (dependencyName) => {
          expect(() => {
            let module;
            
            // Test different import methods based on module
            switch (dependencyName) {
              case 'chardet':
                // Test CommonJS require (our fixed import)
                module = require(dependencyName);
                expect(module.detect).toBeDefined();
                expect(typeof module.detect).toBe('function');
                break;
                
              case 'cli-progress':
                module = require(dependencyName);
                expect(module.SingleBar).toBeDefined();
                expect(module.MultiBar).toBeDefined();
                break;
                
              case 'iconv-lite':
                module = require(dependencyName);
                expect(module.decode).toBeDefined();
                expect(module.encode).toBeDefined();
                break;
                
              case 'minimatch':
                module = require(dependencyName);
                expect(typeof module).toBe('function');
                break;
            }
            
            expect(module).toBeDefined();
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle chardet import correctly after fix', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('utf8', 'ascii', 'binary'),
        (testEncoding) => {
          expect(() => {
            // Test our fixed chardet import in FileTypeDetector
            const { FileTypeDetector } = require('../../dist/utils/file-type-detector');
            const detector = new FileTypeDetector();
            
            // Should be able to create instance without errors
            expect(detector).toBeDefined();
            
            // Test encoding detection with sample data
            const testData = Buffer.from('Hello, world!', testEncoding);
            const result = detector.detectEncoding(testData);
            
            // Should return a valid encoding result
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should instantiate all utility classes successfully', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { class: 'FileTypeDetector', module: 'utils/file-type-detector' },
          { class: 'ProgressReporter', module: 'utils/progress-reporter' },
          { class: 'IgnorePatternManager', module: 'utils/ignore-pattern-manager' },
          { class: 'JsonOutputFormatter', module: 'utils/json-output-formatter' },
          { class: 'MarkdownOutputFormatter', module: 'utils/markdown-output-formatter' }
        ),
        ({ class: className, module: modulePath }) => {
          expect(() => {
            const ModuleClass = require(`../../dist/${modulePath}`)[className];
            expect(ModuleClass).toBeDefined();
            
            // Test instantiation with minimal parameters
            let instance;
            switch (className) {
              case 'FileTypeDetector':
                instance = new ModuleClass();
                break;
              case 'ProgressReporter':
                instance = new ModuleClass(false); // quiet mode
                break;
              case 'IgnorePatternManager':
                instance = new ModuleClass([]);
                break;
              case 'JsonOutputFormatter':
                instance = new ModuleClass();
                break;
              case 'MarkdownOutputFormatter':
                instance = new ModuleClass();
                break;
            }
            
            expect(instance).toBeDefined();
            expect(instance.constructor.name).toBe(className);
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should execute CLI commands without module loading errors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          ['troubleshoot'],
          ['doctor'],
          ['scan', '--help'],
          ['--help']
        ),
        (args) => {
          const output = execSync(`node dist/cli.js ${args.join(' ')}`, {
            encoding: 'utf8',
            timeout: 15000,
            stdio: 'pipe'
          });
          
          // Should not contain any module loading errors
          expect(output).not.toContain('Cannot find module');
          expect(output).not.toContain('MODULE_NOT_FOUND');
          expect(output).not.toContain('Error: Cannot resolve');
          expect(output).not.toContain('require() of ES Module');
          
          // Should contain expected output
          if (args.includes('troubleshoot') || args.includes('doctor')) {
            expect(output).toContain('System Information');
            expect(output).toContain('Dependencies');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle dependency loading failures gracefully', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'nonexistent-module',
          'fake-dependency',
          'missing-package'
        ),
        (fakeDependency) => {
          expect(() => {
            // Test our dependency checker with fake dependency
            const { checkDependency } = require('../../dist/utils/dependency-checker');
            const result = checkDependency(fakeDependency);
            
            // Should handle missing dependency gracefully
            expect(result).toBeDefined();
            expect(result.available).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.suggestion).toContain('npm install');
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide helpful error messages for missing dependencies', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'chardet',
          'cli-progress',
          'iconv-lite',
          'minimatch'
        ),
        (dependencyName) => {
          // Test our chardet error handler specifically
          if (dependencyName === 'chardet') {
            const { handleChardetError } = require('../../dist/utils/chardet-error-handler');
            
            const errorInfo = handleChardetError(new Error('Cannot find module'));
            expect(errorInfo).toBeDefined();
            expect(errorInfo.message).toContain('chardet');
            expect(errorInfo.suggestion).toContain('npm install chardet');
            expect(errorInfo.troubleshooting).toBeDefined();
          }
          
          // Test general dependency checker
          const { safeRequire } = require('../../dist/utils/dependency-checker');
          const result = safeRequire(dependencyName);
          
          if (!result.success) {
            expect(result.error).toBeDefined();
            expect(result.suggestion).toContain('npm install');
            expect(result.suggestion).toContain(dependencyName);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistent module loading across multiple calls', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'chardet',
          'cli-progress',
          'iconv-lite'
        ),
        (moduleName) => {
          const modules: any[] = [];
          
          // Load same module multiple times
          for (let i = 0; i < 3; i++) {
            const module = require(moduleName);
            modules.push(module);
          }
          
          // All references should be the same (Node.js module caching)
          expect(modules[0]).toBe(modules[1]);
          expect(modules[1]).toBe(modules[2]);
          
          // Module should be functional
          switch (moduleName) {
            case 'chardet':
              expect(modules[0].detect).toBeDefined();
              break;
            case 'cli-progress':
              expect(modules[0].SingleBar).toBeDefined();
              break;
            case 'iconv-lite':
              expect(modules[0].decode).toBeDefined();
              break;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate all imports in built files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'dist/cli.js',
          'dist/index.js',
          'dist/utils/file-type-detector.js',
          'dist/scanners/secret-scanner.js'
        ),
        (filePath) => {
          expect(() => {
            // Require the built file to test all its imports
            const module = require(`../../${filePath}`);
            expect(module).toBeDefined();
            
            // Should not throw during module loading
            // This tests that all require() statements work
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });
});