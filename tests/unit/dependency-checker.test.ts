/**
 * Unit Tests: Dependency Checker
 * Tests dependency validation and error handling functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkDependency, safeRequire, validateAllDependencies } from '../../src/utils/dependency-checker';

describe('Dependency Checker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkDependency', () => {
    it('should return available true for existing dependencies', () => {
      const result = checkDependency('fs');
      
      expect(result.available).toBe(true);
      expect(result.error).toBeNull();
      expect(result.module).toBeDefined();
    });

    it('should return available false for non-existent dependencies', () => {
      const result = checkDependency('nonexistent-module-12345');
      
      expect(result.available).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.module).toBeNull();
      expect(result.suggestion).toContain('npm install nonexistent-module-12345');
    });

    it('should provide helpful suggestions for missing dependencies', () => {
      const result = checkDependency('missing-package');
      
      expect(result.suggestion).toContain('npm install missing-package');
      expect(result.suggestion).toContain('package.json');
    });

    it('should handle chardet dependency specifically', () => {
      const result = checkDependency('chardet');
      
      if (result.available) {
        expect(result.module).toBeDefined();
        expect(result.module.detect).toBeDefined();
      } else {
        expect(result.suggestion).toContain('chardet');
        expect(result.suggestion).toContain('encoding detection');
      }
    });

    it('should handle cli-progress dependency specifically', () => {
      const result = checkDependency('cli-progress');
      
      if (result.available) {
        expect(result.module).toBeDefined();
        expect(result.module.SingleBar).toBeDefined();
      } else {
        expect(result.suggestion).toContain('cli-progress');
        expect(result.suggestion).toContain('progress bars');
      }
    });
  });

  describe('safeRequire', () => {
    it('should successfully require existing modules', () => {
      const result = safeRequire('path');
      
      expect(result.success).toBe(true);
      expect(result.module).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should handle missing modules gracefully', () => {
      const result = safeRequire('nonexistent-module-67890');
      
      expect(result.success).toBe(false);
      expect(result.module).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.suggestion).toContain('npm install');
    });

    it('should provide specific error messages for known dependencies', () => {
      const result = safeRequire('fake-chardet');
      
      expect(result.suggestion).toContain('npm install');
      expect(result.suggestion).toContain('fake-chardet');
    });

    it('should handle require errors other than MODULE_NOT_FOUND', () => {
      // Mock require to throw a different error
      const originalRequire = require;
      vi.doMock('test-module', () => {
        throw new Error('Syntax error in module');
      });

      const result = safeRequire('test-module');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Syntax error');
    });
  });

  describe('validateAllDependencies', () => {
    it('should validate all required dependencies', () => {
      const dependencies = ['fs', 'path', 'os'];
      const result = validateAllDependencies(dependencies);
      
      expect(result.allAvailable).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(result.available).toHaveLength(3);
    });

    it('should identify missing dependencies', () => {
      const dependencies = ['fs', 'nonexistent-module-abc', 'path'];
      const result = validateAllDependencies(dependencies);
      
      expect(result.allAvailable).toBe(false);
      expect(result.missing).toHaveLength(1);
      expect(result.missing[0]).toBe('nonexistent-module-abc');
      expect(result.available).toHaveLength(2);
    });

    it('should provide installation suggestions for missing dependencies', () => {
      const dependencies = ['missing-dep-1', 'missing-dep-2'];
      const result = validateAllDependencies(dependencies);
      
      expect(result.allAvailable).toBe(false);
      expect(result.missing).toHaveLength(2);
      expect(result.suggestions).toContain('npm install missing-dep-1 missing-dep-2');
    });

    it('should handle empty dependency list', () => {
      const result = validateAllDependencies([]);
      
      expect(result.allAvailable).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(result.available).toHaveLength(0);
    });

    it('should validate Avana core dependencies', () => {
      const avanaDeps = ['chardet', 'cli-progress', 'iconv-lite', 'minimatch'];
      const result = validateAllDependencies(avanaDeps);
      
      // Should have results for all dependencies
      expect(result.available.length + result.missing.length).toBe(avanaDeps.length);
      
      // If any are missing, should provide helpful suggestions
      if (!result.allAvailable) {
        expect(result.suggestions).toContain('npm install');
        result.missing.forEach(dep => {
          expect(result.suggestions).toContain(dep);
        });
      }
    });
  });

  describe('error message formatting', () => {
    it('should format dependency errors with helpful context', () => {
      const result = checkDependency('test-missing-dep');
      
      expect(result.suggestion).toMatch(/npm install test-missing-dep/);
      expect(result.suggestion).toContain('dependencies');
    });

    it('should include troubleshooting steps', () => {
      const result = checkDependency('another-missing-dep');
      
      expect(result.suggestion).toContain('npm install');
      expect(result.suggestion).toContain('package.json');
    });

    it('should provide different messages for different dependency types', () => {
      const chardetResult = checkDependency('fake-chardet');
      const progressResult = checkDependency('fake-cli-progress');
      
      // Both should have suggestions but potentially different context
      expect(chardetResult.suggestion).toContain('npm install');
      expect(progressResult.suggestion).toContain('npm install');
    });
  });

  describe('dependency validation edge cases', () => {
    it('should handle null or undefined dependency names', () => {
      expect(() => {
        checkDependency(null as any);
      }).not.toThrow();
      
      expect(() => {
        checkDependency(undefined as any);
      }).not.toThrow();
    });

    it('should handle empty string dependency names', () => {
      const result = checkDependency('');
      
      expect(result.available).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle dependency names with special characters', () => {
      const result = checkDependency('@scope/package-name');
      
      // Should handle scoped packages gracefully
      expect(result).toBeDefined();
      expect(typeof result.available).toBe('boolean');
    });

    it('should handle very long dependency names', () => {
      const longName = 'a'.repeat(1000);
      const result = checkDependency(longName);
      
      expect(result.available).toBe(false);
      expect(result.suggestion).toContain('npm install');
    });
  });
});