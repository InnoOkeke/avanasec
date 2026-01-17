/**
 * Unit Tests: IgnorePatternManager
 * Tests for ignore pattern loading, matching, and management
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { IgnorePatternManager } from '../../src/utils/ignore-pattern-manager';
import {
  createTempDir,
  cleanupTempDir,
  createTempFile,
} from '../helpers/test-utils';

describe('IgnorePatternManager', () => {
  let ignoreManager: IgnorePatternManager;
  let tempDir: string;

  beforeEach(() => {
    ignoreManager = new IgnorePatternManager(false);
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Default Patterns', () => {
    it('should include default ignore patterns', () => {
      const patterns = ignoreManager.getPatterns();
      
      // Check for common default patterns
      expect(patterns).toContain('node_modules/**');
      expect(patterns).toContain('dist/**');
      expect(patterns).toContain('.git/**');
      expect(patterns).toContain('*.png');
      expect(patterns).toContain('*.jpg');
    });

    it('should ignore node_modules by default', () => {
      expect(ignoreManager.shouldIgnore('node_modules/package/file.js')).toBe(true);
      expect(ignoreManager.shouldIgnore('src/node_modules/file.js')).toBe(false);
    });

    it('should ignore dist directory by default', () => {
      expect(ignoreManager.shouldIgnore('dist/bundle.js')).toBe(true);
      expect(ignoreManager.shouldIgnore('dist/assets/style.css')).toBe(true);
    });

    it('should ignore .git directory by default', () => {
      expect(ignoreManager.shouldIgnore('.git/config')).toBe(true);
      expect(ignoreManager.shouldIgnore('.git/objects/abc123')).toBe(true);
    });

    it('should ignore common binary files by default', () => {
      expect(ignoreManager.shouldIgnore('image.png')).toBe(true);
      expect(ignoreManager.shouldIgnore('photo.jpg')).toBe(true);
      expect(ignoreManager.shouldIgnore('document.pdf')).toBe(true);
      expect(ignoreManager.shouldIgnore('archive.zip')).toBe(true);
    });

    it('should ignore lock files by default', () => {
      expect(ignoreManager.shouldIgnore('package-lock.json')).toBe(true);
      expect(ignoreManager.shouldIgnore('yarn.lock')).toBe(true);
      expect(ignoreManager.shouldIgnore('Cargo.lock')).toBe(true);
    });
  });

  describe('.avanaignore File Loading', () => {
    it('should load patterns from .avanaignore file', () => {
      const avanaIgnorePath = path.join(tempDir, '.avanaignore');
      fs.writeFileSync(avanaIgnorePath, 'custom-dir/**\n*.custom\ntest-file.txt');
      
      ignoreManager.loadPatterns(tempDir);
      
      expect(ignoreManager.shouldIgnore('custom-dir/file.js')).toBe(true);
      expect(ignoreManager.shouldIgnore('file.custom')).toBe(true);
      expect(ignoreManager.shouldIgnore('test-file.txt')).toBe(true);
    });

    it('should ignore empty lines in .avanaignore', () => {
      const avanaIgnorePath = path.join(tempDir, '.avanaignore');
      fs.writeFileSync(avanaIgnorePath, 'pattern1\n\n\npattern2\n\n');
      
      ignoreManager.loadPatterns(tempDir);
      const patterns = ignoreManager.getPatterns();
      
      // Should only have default patterns + 2 custom patterns
      const customPatterns = patterns.filter(p => p === 'pattern1' || p === 'pattern2');
      expect(customPatterns).toHaveLength(2);
    });

    it('should ignore comment lines in .avanaignore', () => {
      const avanaIgnorePath = path.join(tempDir, '.avanaignore');
      fs.writeFileSync(avanaIgnorePath, '# This is a comment\npattern1\n# Another comment\npattern2');
      
      ignoreManager.loadPatterns(tempDir);
      const patterns = ignoreManager.getPatterns();
      
      // Should not include comments
      expect(patterns.some(p => p.startsWith('#'))).toBe(false);
      expect(patterns).toContain('pattern1');
      expect(patterns).toContain('pattern2');
    });

    it('should handle missing .avanaignore file gracefully', () => {
      expect(() => ignoreManager.loadPatterns(tempDir)).not.toThrow();
      
      // Should still have default patterns
      const patterns = ignoreManager.getPatterns();
      expect(patterns.length).toBeGreaterThan(0);
    });

    it('should trim whitespace from patterns', () => {
      const avanaIgnorePath = path.join(tempDir, '.avanaignore');
      fs.writeFileSync(avanaIgnorePath, '  pattern1  \n\t pattern2 \t\n');
      
      ignoreManager.loadPatterns(tempDir);
      
      expect(ignoreManager.shouldIgnore('pattern1')).toBe(true);
      expect(ignoreManager.shouldIgnore('pattern2')).toBe(true);
    });
  });

  describe('Glob Pattern Matching', () => {
    it('should match exact filenames', () => {
      ignoreManager.addPattern('exact-file.txt');
      
      expect(ignoreManager.shouldIgnore('exact-file.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('other-file.txt')).toBe(false);
    });

    it('should match wildcard * patterns', () => {
      ignoreManager.addPattern('*.log');
      
      expect(ignoreManager.shouldIgnore('error.log')).toBe(true);
      expect(ignoreManager.shouldIgnore('debug.log')).toBe(true);
      expect(ignoreManager.shouldIgnore('app.txt')).toBe(false);
    });

    it('should match ** directory patterns', () => {
      ignoreManager.addPattern('temp/**');
      
      expect(ignoreManager.shouldIgnore('temp/file.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('temp/sub/file.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('temp/sub/deep/file.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('other/file.txt')).toBe(false);
    });

    it('should match ? single character patterns', () => {
      ignoreManager.addPattern('file?.txt');
      
      expect(ignoreManager.shouldIgnore('file1.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('fileA.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('file12.txt')).toBe(false);
    });

    it('should match patterns with multiple wildcards', () => {
      ignoreManager.addPattern('test-*.spec.*');
      
      expect(ignoreManager.shouldIgnore('test-auth.spec.ts')).toBe(true);
      expect(ignoreManager.shouldIgnore('test-user.spec.js')).toBe(true);
      expect(ignoreManager.shouldIgnore('test-auth.ts')).toBe(false);
    });

    it('should match patterns in subdirectories', () => {
      ignoreManager.addPattern('**/*.test.js');
      
      expect(ignoreManager.shouldIgnore('file.test.js')).toBe(true);
      expect(ignoreManager.shouldIgnore('src/file.test.js')).toBe(true);
      expect(ignoreManager.shouldIgnore('src/utils/file.test.js')).toBe(true);
      expect(ignoreManager.shouldIgnore('src/file.js')).toBe(false);
    });
  });

  describe('CLI Pattern Addition', () => {
    it('should add single pattern from CLI', () => {
      ignoreManager.addPattern('cli-pattern.txt');
      
      expect(ignoreManager.shouldIgnore('cli-pattern.txt')).toBe(true);
    });

    it('should add multiple patterns from CLI', () => {
      ignoreManager.addPatterns(['pattern1.txt', 'pattern2.js', '*.log']);
      
      expect(ignoreManager.shouldIgnore('pattern1.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('pattern2.js')).toBe(true);
      expect(ignoreManager.shouldIgnore('error.log')).toBe(true);
    });

    it('should ignore empty patterns from CLI', () => {
      const initialCount = ignoreManager.getPatterns().length;
      
      ignoreManager.addPattern('');
      ignoreManager.addPattern('   ');
      
      expect(ignoreManager.getPatterns().length).toBe(initialCount);
    });

    it('should trim whitespace from CLI patterns', () => {
      ignoreManager.addPattern('  pattern.txt  ');
      
      expect(ignoreManager.shouldIgnore('pattern.txt')).toBe(true);
    });
  });

  describe('Pattern Merging', () => {
    it('should merge default, file, and CLI patterns', () => {
      // Create .avanaignore file
      const avanaIgnorePath = path.join(tempDir, '.avanaignore');
      fs.writeFileSync(avanaIgnorePath, 'file-pattern/**');
      
      // Load file patterns
      ignoreManager.loadPatterns(tempDir);
      
      // Add CLI pattern
      ignoreManager.addPattern('cli-pattern/**');
      
      // All patterns should work
      expect(ignoreManager.shouldIgnore('node_modules/file.js')).toBe(true); // Default
      expect(ignoreManager.shouldIgnore('file-pattern/file.js')).toBe(true); // File
      expect(ignoreManager.shouldIgnore('cli-pattern/file.js')).toBe(true); // CLI
    });

    it('should allow CLI patterns to override behavior', () => {
      ignoreManager.addPattern('important-file.txt');
      
      expect(ignoreManager.shouldIgnore('important-file.txt')).toBe(true);
    });
  });

  describe('Path Separator Handling', () => {
    it('should normalize forward slashes', () => {
      ignoreManager.addPattern('dir/**');
      
      expect(ignoreManager.shouldIgnore('dir/file.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('dir/sub/file.txt')).toBe(true);
    });

    it('should normalize backslashes', () => {
      ignoreManager.addPattern('dir/**');
      
      expect(ignoreManager.shouldIgnore('dir\\file.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('dir\\sub\\file.txt')).toBe(true);
    });

    it('should handle mixed separators', () => {
      ignoreManager.addPattern('dir/**');
      
      expect(ignoreManager.shouldIgnore('dir/sub\\file.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('dir\\sub/file.txt')).toBe(true);
    });
  });

  describe('Ignored Count Tracking', () => {
    it('should track number of ignored files', () => {
      ignoreManager.addPattern('*.txt');
      
      ignoreManager.shouldIgnore('file1.txt');
      ignoreManager.shouldIgnore('file2.txt');
      ignoreManager.shouldIgnore('file3.js'); // Not ignored
      
      expect(ignoreManager.getIgnoredCount()).toBe(2);
    });

    it('should reset ignored count', () => {
      ignoreManager.addPattern('*.txt');
      
      ignoreManager.shouldIgnore('file1.txt');
      ignoreManager.shouldIgnore('file2.txt');
      
      expect(ignoreManager.getIgnoredCount()).toBe(2);
      
      ignoreManager.resetIgnoredCount();
      
      expect(ignoreManager.getIgnoredCount()).toBe(0);
    });

    it('should continue counting after reset', () => {
      ignoreManager.addPattern('*.txt');
      
      ignoreManager.shouldIgnore('file1.txt');
      ignoreManager.resetIgnoredCount();
      ignoreManager.shouldIgnore('file2.txt');
      
      expect(ignoreManager.getIgnoredCount()).toBe(1);
    });
  });

  describe('Pattern Management', () => {
    it('should return all active patterns', () => {
      ignoreManager.addPattern('custom-pattern');
      
      const patterns = ignoreManager.getPatterns();
      
      expect(patterns).toContain('node_modules/**'); // Default
      expect(patterns).toContain('custom-pattern'); // Custom
      expect(Array.isArray(patterns)).toBe(true);
    });

    it('should return configuration breakdown', () => {
      const avanaIgnorePath = path.join(tempDir, '.avanaignore');
      fs.writeFileSync(avanaIgnorePath, 'file-pattern');
      
      ignoreManager.loadPatterns(tempDir);
      ignoreManager.addPattern('cli-pattern');
      
      const config = ignoreManager.getConfig();
      
      expect(config.defaultPatterns).toContain('node_modules/**');
      expect(config.avanaIgnorePatterns).toContain('file-pattern');
      expect(config.avanaIgnorePatterns).toContain('cli-pattern');
    });

    it('should clear custom patterns', () => {
      ignoreManager.addPattern('custom-pattern');
      
      expect(ignoreManager.shouldIgnore('custom-pattern')).toBe(true);
      
      ignoreManager.clearCustomPatterns();
      
      expect(ignoreManager.shouldIgnore('custom-pattern')).toBe(false);
      expect(ignoreManager.shouldIgnore('node_modules/file.js')).toBe(true); // Defaults remain
    });
  });

  describe('Edge Cases', () => {
    it('should handle dot files', () => {
      ignoreManager.addPattern('.env');
      
      expect(ignoreManager.shouldIgnore('.env')).toBe(true);
      expect(ignoreManager.shouldIgnore('.env.local')).toBe(false);
    });

    it('should handle patterns with dots', () => {
      ignoreManager.addPattern('*.test.ts');
      
      expect(ignoreManager.shouldIgnore('file.test.ts')).toBe(true);
      expect(ignoreManager.shouldIgnore('file.spec.ts')).toBe(false);
    });

    it('should handle very long paths', () => {
      ignoreManager.addPattern('deep/**');
      
      const longPath = 'deep/' + 'sub/'.repeat(50) + 'file.txt';
      expect(ignoreManager.shouldIgnore(longPath)).toBe(true);
    });

    it('should handle patterns with special characters in filenames', () => {
      ignoreManager.addPattern('file-name.txt');
      ignoreManager.addPattern('file_name.txt');
      ignoreManager.addPattern('file.name.txt');
      
      expect(ignoreManager.shouldIgnore('file-name.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('file_name.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('file.name.txt')).toBe(true);
    });

    it('should not match partial directory names', () => {
      ignoreManager.addPattern('test/**');
      
      expect(ignoreManager.shouldIgnore('test/file.txt')).toBe(true);
      expect(ignoreManager.shouldIgnore('testing/file.txt')).toBe(false);
      expect(ignoreManager.shouldIgnore('my-test/file.txt')).toBe(false);
    });
  });

  describe('Verbose Mode', () => {
    it('should create manager in verbose mode', () => {
      const verboseManager = new IgnorePatternManager(true);
      
      expect(() => verboseManager.shouldIgnore('test.txt')).not.toThrow();
    });

    it('should create manager in non-verbose mode', () => {
      const quietManager = new IgnorePatternManager(false);
      
      expect(() => quietManager.shouldIgnore('test.txt')).not.toThrow();
    });
  });
});
