/**
 * Unit Tests: Chardet Error Handler
 * Tests chardet-specific error handling and troubleshooting
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleChardetError, getChardetTroubleshooting, detectEncodingWithFallback } from '../../src/utils/chardet-error-handler';

describe('Chardet Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleChardetError', () => {
    it('should handle MODULE_NOT_FOUND errors', () => {
      const error = new Error('Cannot find module \'chardet\'');
      error.code = 'MODULE_NOT_FOUND' as any;
      
      const result = handleChardetError(error);
      
      expect(result.type).toBe('MODULE_NOT_FOUND');
      expect(result.message).toContain('chardet module is not installed');
      expect(result.suggestion).toContain('npm install chardet');
      expect(result.troubleshooting).toBeDefined();
      expect(result.troubleshooting.length).toBeGreaterThan(0);
    });

    it('should handle compilation errors', () => {
      const error = new Error('Module compilation failed');
      
      const result = handleChardetError(error);
      
      expect(result.type).toBe('COMPILATION_ERROR');
      expect(result.message).toContain('compilation');
      expect(result.suggestion).toContain('reinstall');
      expect(result.troubleshooting).toContain('npm rebuild');
    });

    it('should handle permission errors', () => {
      const error = new Error('EACCES: permission denied');
      error.code = 'EACCES' as any;
      
      const result = handleChardetError(error);
      
      expect(result.type).toBe('PERMISSION_ERROR');
      expect(result.message).toContain('permission');
      expect(result.suggestion).toContain('sudo');
      expect(result.troubleshooting).toContain('permissions');
    });

    it('should handle version compatibility errors', () => {
      const error = new Error('Unsupported Node.js version');
      
      const result = handleChardetError(error);
      
      expect(result.type).toBe('VERSION_COMPATIBILITY');
      expect(result.message).toContain('compatibility');
      expect(result.suggestion).toContain('Node.js');
      expect(result.troubleshooting).toContain('version');
    });

    it('should handle generic errors', () => {
      const error = new Error('Unknown error occurred');
      
      const result = handleChardetError(error);
      
      expect(result.type).toBe('UNKNOWN_ERROR');
      expect(result.message).toContain('Unknown error');
      expect(result.suggestion).toContain('reinstall');
      expect(result.troubleshooting).toBeDefined();
    });

    it('should include original error message', () => {
      const originalMessage = 'Specific error details here';
      const error = new Error(originalMessage);
      
      const result = handleChardetError(error);
      
      expect(result.originalError).toBe(originalMessage);
    });
  });

  describe('getChardetTroubleshooting', () => {
    it('should provide comprehensive troubleshooting steps', () => {
      const steps = getChardetTroubleshooting();
      
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThan(0);
      
      // Should include common troubleshooting steps
      const stepsText = steps.join(' ');
      expect(stepsText).toContain('npm install chardet');
      expect(stepsText).toContain('node_modules');
      expect(stepsText).toContain('package.json');
    });

    it('should include platform-specific guidance', () => {
      const steps = getChardetTroubleshooting();
      const stepsText = steps.join(' ');
      
      // Should mention potential platform issues
      expect(stepsText).toContain('rebuild') || expect(stepsText).toContain('compile');
    });

    it('should provide fallback options', () => {
      const steps = getChardetTroubleshooting();
      const stepsText = steps.join(' ');
      
      expect(stepsText).toContain('fallback') || expect(stepsText).toContain('alternative');
    });
  });

  describe('detectEncodingWithFallback', () => {
    it('should detect encoding for valid UTF-8 content', () => {
      const buffer = Buffer.from('Hello, world! 🌍', 'utf8');
      
      const result = detectEncodingWithFallback(buffer);
      
      expect(result.encoding).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.source).toBe('chardet');
    });

    it('should use fallback when chardet fails', () => {
      // Mock chardet to fail
      vi.doMock('chardet', () => {
        throw new Error('Chardet not available');
      });

      const buffer = Buffer.from('Simple ASCII text', 'ascii');
      
      const result = detectEncodingWithFallback(buffer);
      
      expect(result.encoding).toBeDefined();
      expect(result.source).toBe('fallback');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should handle binary content gracefully', () => {
      const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xFF, 0xFE]);
      
      const result = detectEncodingWithFallback(buffer);
      
      expect(result.encoding).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty buffers', () => {
      const buffer = Buffer.alloc(0);
      
      const result = detectEncodingWithFallback(buffer);
      
      expect(result.encoding).toBeDefined();
      expect(result.source).toBe('fallback');
    });

    it('should handle very large buffers efficiently', () => {
      const buffer = Buffer.alloc(1024 * 1024, 'A'); // 1MB of 'A'
      
      const startTime = Date.now();
      const result = detectEncodingWithFallback(buffer);
      const endTime = Date.now();
      
      expect(result.encoding).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should provide confidence scores', () => {
      const buffer = Buffer.from('This is clearly UTF-8 text with émojis 🎉', 'utf8');
      
      const result = detectEncodingWithFallback(buffer);
      
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('should handle different encoding types', () => {
      const testCases = [
        { text: 'ASCII text', encoding: 'ascii' as BufferEncoding },
        { text: 'UTF-8 with émojis 🌟', encoding: 'utf8' as BufferEncoding },
        { text: 'Latin-1 text with ñ and ü', encoding: 'latin1' as BufferEncoding },
      ];

      testCases.forEach(({ text, encoding }) => {
        const buffer = Buffer.from(text, encoding);
        const result = detectEncodingWithFallback(buffer);
        
        expect(result.encoding).toBeDefined();
        expect(typeof result.encoding).toBe('string');
      });
    });
  });

  describe('error recovery scenarios', () => {
    it('should provide actionable recovery steps for missing chardet', () => {
      const error = new Error('Cannot find module \'chardet\'');
      error.code = 'MODULE_NOT_FOUND' as any;
      
      const result = handleChardetError(error);
      
      expect(result.suggestion).toContain('npm install chardet');
      expect(result.troubleshooting).toContain('npm install chardet');
      expect(result.troubleshooting).toContain('dependencies');
    });

    it('should suggest alternative approaches when chardet is unavailable', () => {
      const error = new Error('Chardet compilation failed');
      
      const result = handleChardetError(error);
      
      expect(result.troubleshooting.some(step => 
        step.includes('fallback') || step.includes('alternative')
      )).toBe(true);
    });

    it('should provide platform-specific troubleshooting', () => {
      const error = new Error('Native module compilation failed');
      
      const result = handleChardetError(error);
      
      expect(result.troubleshooting.some(step => 
        step.includes('rebuild') || step.includes('compile') || step.includes('native')
      )).toBe(true);
    });
  });

  describe('integration with FileTypeDetector', () => {
    it('should work with FileTypeDetector fallback mechanism', () => {
      // This tests the integration point where FileTypeDetector uses our error handler
      const buffer = Buffer.from('Test content for encoding detection', 'utf8');
      
      // Should not throw even if chardet has issues
      expect(() => {
        const result = detectEncodingWithFallback(buffer);
        expect(result).toBeDefined();
      }).not.toThrow();
    });

    it('should provide consistent results across multiple calls', () => {
      const buffer = Buffer.from('Consistent test content', 'utf8');
      
      const result1 = detectEncodingWithFallback(buffer);
      const result2 = detectEncodingWithFallback(buffer);
      
      expect(result1.encoding).toBe(result2.encoding);
      expect(result1.source).toBe(result2.source);
    });
  });
});