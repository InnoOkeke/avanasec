/**
 * Property Tests: Dependency Installation
 * Feature: dependency-fix, Property 2: Dependency Installation
 * Validates: Requirements 1.1, 3.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { execSync } from 'child_process';
import { existsSync, readFileSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Feature: dependency-fix, Property 2: Dependency Installation', () => {
  it('should have all runtime dependencies declared in package.json', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'chardet',
          'cli-progress', 
          'iconv-lite',
          'minimatch',
          'husky'
        ),
        (dependencyName) => {
          const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
          
          // Should be in dependencies (not devDependencies)
          expect(packageJson.dependencies).toBeDefined();
          expect(packageJson.dependencies[dependencyName]).toBeDefined();
          
          // Should have valid version range
          const version = packageJson.dependencies[dependencyName];
          expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+/);
          
          // Should not be in devDependencies
          if (packageJson.devDependencies) {
            expect(packageJson.devDependencies[dependencyName]).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should install all dependencies when package is installed', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('npm pack'),
        (packCommand) => {
          // Create temporary directory for testing
          const tempDir = mkdtempSync(join(tmpdir(), 'avana-test-'));
          
          try {
            // Create tarball
            const packOutput = execSync(packCommand, { 
              encoding: 'utf8',
              timeout: 30000 
            });
            
            const tarballMatch = packOutput.match(/avana-cli-[\d.]+\.tgz/);
            expect(tarballMatch).toBeTruthy();
            
            const tarballName = tarballMatch![0];
            expect(existsSync(tarballName)).toBe(true);
            
            // Install in temp directory
            execSync(`npm install ${join(process.cwd(), tarballName)}`, {
              cwd: tempDir,
              timeout: 60000,
              stdio: 'pipe'
            });
            
            // Check that all dependencies are installed
            const nodeModulesPath = join(tempDir, 'node_modules');
            expect(existsSync(nodeModulesPath)).toBe(true);
            
            const requiredDeps = ['chardet', 'cli-progress', 'iconv-lite', 'minimatch'];
            requiredDeps.forEach(dep => {
              expect(existsSync(join(nodeModulesPath, dep))).toBe(true);
            });
            
            // Clean up tarball
            rmSync(tarballName, { force: true });
          } finally {
            // Clean up temp directory
            rmSync(tempDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should resolve all required modules after installation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'chardet',
          'cli-progress',
          'iconv-lite', 
          'minimatch'
        ),
        (moduleName) => {
          // Should be able to require the module
          expect(() => {
            const resolved = require.resolve(moduleName);
            expect(resolved).toBeDefined();
            expect(resolved.length).toBeGreaterThan(0);
          }).not.toThrow();
          
          // Module should exist in node_modules
          const nodeModulesPath = join(process.cwd(), 'node_modules', moduleName);
          expect(existsSync(nodeModulesPath)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not have dependency conflicts or warnings', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('npm install --dry-run'),
        (installCommand) => {
          const output = execSync(installCommand, {
            encoding: 'utf8',
            timeout: 30000,
            stdio: 'pipe'
          });
          
          // Should not contain dependency warnings
          expect(output).not.toContain('WARN');
          expect(output).not.toContain('deprecated');
          expect(output).not.toContain('peer dep missing');
          expect(output).not.toContain('ERESOLVE');
          
          // Should not contain version conflicts
          expect(output).not.toContain('conflicting');
          expect(output).not.toContain('incompatible');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistent dependency versions across installations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(1, 2, 3),
        (iteration) => {
          const tempDir = mkdtempSync(join(tmpdir(), `avana-deps-${iteration}-`));
          
          try {
            // Create fresh package.json with our dependencies
            const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
            const testPackage = {
              name: 'test-avana-deps',
              version: '1.0.0',
              dependencies: packageJson.dependencies
            };
            
            require('fs').writeFileSync(
              join(tempDir, 'package.json'),
              JSON.stringify(testPackage, null, 2)
            );
            
            // Install dependencies
            execSync('npm install', {
              cwd: tempDir,
              timeout: 60000,
              stdio: 'pipe'
            });
            
            // Check package-lock.json for consistent versions
            const lockPath = join(tempDir, 'package-lock.json');
            expect(existsSync(lockPath)).toBe(true);
            
            const lockFile = JSON.parse(readFileSync(lockPath, 'utf8'));
            expect(lockFile.dependencies).toBeDefined();
            
            // All our dependencies should be present
            const requiredDeps = ['chardet', 'cli-progress', 'iconv-lite', 'minimatch'];
            requiredDeps.forEach(dep => {
              expect(lockFile.dependencies[dep]).toBeDefined();
              expect(lockFile.dependencies[dep].version).toMatch(/^\d+\.\d+\.\d+/);
            });
          } finally {
            rmSync(tempDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle dependency loading errors gracefully', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'chardet',
          'cli-progress',
          'iconv-lite',
          'minimatch'
        ),
        (moduleName) => {
          // Test our dependency checker utility
          const { checkDependency } = require('../../dist/utils/dependency-checker');
          
          const result = checkDependency(moduleName);
          
          // Should successfully check the dependency
          expect(result.available).toBe(true);
          expect(result.error).toBeNull();
          expect(result.module).toBeDefined();
          
          // Should provide helpful info if dependency was missing
          if (!result.available) {
            expect(result.suggestion).toContain('npm install');
            expect(result.suggestion).toContain(moduleName);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate package integrity after installation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('npm pack'),
        (packCommand) => {
          const tempDir = mkdtempSync(join(tmpdir(), 'avana-integrity-'));
          
          try {
            // Create and install package
            const packOutput = execSync(packCommand, { 
              encoding: 'utf8',
              timeout: 30000 
            });
            
            const tarballMatch = packOutput.match(/avana-cli-[\d.]+\.tgz/);
            const tarballName = tarballMatch![0];
            
            execSync(`npm install ${join(process.cwd(), tarballName)}`, {
              cwd: tempDir,
              timeout: 60000,
              stdio: 'pipe'
            });
            
            // Validate installed package structure
            const packagePath = join(tempDir, 'node_modules', 'avana-cli');
            expect(existsSync(packagePath)).toBe(true);
            
            // Should have all required files
            const requiredFiles = [
              'package.json',
              'dist/cli.js',
              'dist/index.js',
              'README.md',
              'LICENSE'
            ];
            
            requiredFiles.forEach(file => {
              expect(existsSync(join(packagePath, file))).toBe(true);
            });
            
            // Binary should be executable
            const binaryPath = join(packagePath, 'dist/cli.js');
            const content = readFileSync(binaryPath, 'utf8');
            expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
            
            // Clean up
            rmSync(tarballName, { force: true });
          } finally {
            rmSync(tempDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have correct files field configuration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('package.json'),
        (packagePath) => {
          const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
          
          // Should have files field
          expect(packageJson.files).toBeDefined();
          expect(Array.isArray(packageJson.files)).toBe(true);
          
          // Should include essential files
          const files = packageJson.files;
          expect(files).toContain('dist/**/*');
          expect(files).toContain('README.md');
          expect(files).toContain('LICENSE');
          expect(files).toContain('CHANGELOG.md');
          
          // All specified files should exist
          const requiredPaths = ['dist', 'README.md', 'LICENSE', 'CHANGELOG.md'];
          requiredPaths.forEach(path => {
            expect(existsSync(path)).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});