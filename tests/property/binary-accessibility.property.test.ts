/**
 * Property Tests: Binary Accessibility
 * Feature: dependency-fix, Property 1: Binary Accessibility
 * Validates: Requirements 3.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

describe('Feature: dependency-fix, Property 1: Binary Accessibility', () => {
  it('should have executable binary with correct shebang after build', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('dist/cli.js'),
        (binaryPath) => {
          // Binary file should exist
          expect(existsSync(binaryPath)).toBe(true);
          
          // Binary should have correct shebang
          const content = readFileSync(binaryPath, 'utf8');
          expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
          
          // Binary should be executable via node
          expect(() => {
            const output = execSync(`node ${binaryPath} --help`, { 
              encoding: 'utf8',
              timeout: 10000 
            });
            expect(output).toContain('Usage:');
            expect(output).toContain('avana');
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have correct binary configuration in package.json', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('package.json'),
        (packagePath) => {
          expect(existsSync(packagePath)).toBe(true);
          
          const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
          
          // Should have bin field
          expect(packageJson.bin).toBeDefined();
          expect(packageJson.bin.avana).toBeDefined();
          
          // Binary path should point to correct file
          const binaryPath = packageJson.bin.avana;
          expect(binaryPath).toBe('./dist/cli.js');
          
          // Binary file should exist
          expect(existsSync('dist/cli.js')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should execute help command without module resolution errors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('--help'),
        (command) => {
          const output = execSync(`node dist/cli.js ${command}`, {
            encoding: 'utf8',
            timeout: 10000,
            stdio: 'pipe'
          });
          
          // Should not contain module resolution errors
          expect(output).not.toContain('Cannot find module');
          expect(output).not.toContain('MODULE_NOT_FOUND');
          expect(output).not.toContain('Error: Cannot resolve');
          
          // Should contain expected output
          expect(output).toContain('Usage:');
          expect(output).toContain('avana');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have all required files included in distribution', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'dist/cli.js',
          'dist/index.js',
          'dist/index.d.ts',
          'package.json',
          'README.md',
          'LICENSE'
        ),
        (requiredFile) => {
          expect(existsSync(requiredFile)).toBe(true);
          
          // Files should not be empty
          const stats = require('fs').statSync(requiredFile);
          expect(stats.size).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve shebang through build process', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('dist/cli.js'),
        (binaryPath) => {
          expect(existsSync(binaryPath)).toBe(true);
          
          const content = readFileSync(binaryPath, 'utf8');
          const lines = content.split('\n');
          
          // First line should be shebang
          expect(lines[0]).toBe('#!/usr/bin/env node');
          
          // Should not have multiple shebangs
          const shebangCount = lines.filter(line => line.startsWith('#!')).length;
          expect(shebangCount).toBe(1);
          
          // Content after shebang should be valid JavaScript
          const jsContent = lines.slice(1).join('\n');
          expect(jsContent.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});