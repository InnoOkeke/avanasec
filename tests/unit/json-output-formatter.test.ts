/**
 * Unit Tests: JSON Output Formatter
 * Tests for JSON formatting with proper structure, pretty printing, and metadata inclusion
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  JSONOutputFormatter, 
  Severity, 
  SecurityIssue, 
  ScanResult,
  IssueSummary,
  ScanMetadata,
  ScanOptions,
  EnvironmentInfo,
  DebugInfo,
  JSONOptions
} from '../../src/utils/json-output-formatter';

describe('JSONOutputFormatter', () => {
  let formatter: JSONOutputFormatter;
  let mockScanResult: ScanResult;

  beforeEach(() => {
    formatter = new JSONOutputFormatter('1.0.0');
    
    // Create mock scan result
    mockScanResult = createMockScanResult();
  });

  describe('Basic JSON Formatting', () => {
    it('should create formatter with version', () => {
      const customFormatter = new JSONOutputFormatter('2.0.0');
      expect(customFormatter).toBeInstanceOf(JSONOutputFormatter);
    });

    it('should format basic scan result as valid JSON', () => {
      const jsonOutput = formatter.format(mockScanResult);
      
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
      
      const parsed = JSON.parse(jsonOutput);
      expect(parsed).toHaveProperty('success');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('issues');
      expect(parsed).toHaveProperty('summary');
    });

    it('should include all required fields', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.success).toBe(true);
      expect(parsed.timestamp).toBe('2024-01-01T12:00:01.500Z'); // Uses endTime, not startTime
      expect(parsed.duration).toBe(1500);
      expect(parsed.filesScanned).toBe(10);
      expect(parsed.securityScore).toBe(85);
      expect(Array.isArray(parsed.issues)).toBe(true);
      expect(parsed.summary).toBeDefined();
    });

    it('should format issues correctly', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues).toHaveLength(2);
      
      const issue = parsed.issues[0];
      expect(issue.id).toBe('issue-1');
      expect(issue.type).toBe('api-key');
      expect(issue.severity).toBe('high');
      expect(issue.message).toBe('Potential API key detected');
      expect(issue.file).toBe('src/config.js');
      expect(issue.line).toBe(15);
      expect(issue.match).toBe('api_key_12345');
      expect(issue.confidence).toBe(0.9);
      expect(issue.rule.id).toBe('api-key-pattern');
      expect(issue.rule.name).toBe('API Key Pattern');
    });

    it('should format summary correctly', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.summary.total).toBe(2);
      expect(parsed.summary.critical).toBe(0);
      expect(parsed.summary.high).toBe(1);
      expect(parsed.summary.medium).toBe(1);
      expect(parsed.summary.low).toBe(0);
      expect(parsed.summary.byType).toEqual({ 'api-key': 1, 'password': 1 });
      expect(parsed.summary.byFile).toEqual({ 'src/config.js': 2 });
    });
  });

  describe('Pretty Printing', () => {
    it('should format JSON with pretty printing when enabled', () => {
      const jsonOutput = formatter.format(mockScanResult, { pretty: true });
      
      expect(jsonOutput).toContain('\n');
      expect(jsonOutput).toContain('  ');
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
    });

    it('should format JSON without pretty printing by default', () => {
      const jsonOutput = formatter.format(mockScanResult);
      
      expect(jsonOutput).not.toContain('\n');
      expect(jsonOutput).not.toContain('  ');
    });

    it('should format JSON without pretty printing when explicitly disabled', () => {
      const jsonOutput = formatter.format(mockScanResult, { pretty: false });
      
      expect(jsonOutput).not.toContain('\n');
      expect(jsonOutput).not.toContain('  ');
    });
  });

  describe('Metadata Inclusion', () => {
    it('should include metadata by default', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.metadata).toBeDefined();
      expect(parsed.metadata.avanaVersion).toBe('1.0.0');
      expect(parsed.metadata.scanId).toBe('scan-123');
      expect(parsed.metadata.filesScanned).toBe(10);
    });

    it('should include metadata when explicitly enabled', () => {
      const jsonOutput = formatter.format(mockScanResult, { includeMetadata: true });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.metadata).toBeDefined();
    });

    it('should exclude metadata when disabled', () => {
      const jsonOutput = formatter.format(mockScanResult, { includeMetadata: false });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.metadata).toBeUndefined();
    });

    it('should include environment information in metadata', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.metadata.environment).toBeDefined();
      expect(parsed.metadata.environment.nodeVersion).toBe('v18.0.0');
      expect(parsed.metadata.environment.platform).toBe('linux');
      expect(parsed.metadata.environment.arch).toBe('x64');
    });

    it('should include scan options in metadata', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.metadata.scanOptions).toBeDefined();
      expect(parsed.metadata.scanOptions.verbose).toBe(true);
      expect(parsed.metadata.scanOptions.debug).toBe(false);
    });
  });

  describe('Debug Information', () => {
    it('should exclude debug info by default', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.debug).toBeUndefined();
    });

    it('should include debug info when enabled and available', () => {
      const jsonOutput = formatter.format(mockScanResult, { includeDebugInfo: true });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.debug).toBeDefined();
      expect(parsed.debug.memoryUsage).toBeDefined();
      expect(parsed.debug.performanceMetrics).toBeDefined();
    });

    it('should exclude debug info when enabled but not available', () => {
      const resultWithoutDebug = { ...mockScanResult, debug: undefined };
      const jsonOutput = formatter.format(resultWithoutDebug, { includeDebugInfo: true });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.debug).toBeUndefined();
    });

    it('should include memory usage in debug info', () => {
      const jsonOutput = formatter.format(mockScanResult, { includeDebugInfo: true });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.debug.memoryUsage.rss).toBe(104857600);
      expect(parsed.debug.memoryUsage.heapUsed).toBe(52428800);
    });

    it('should include performance metrics in debug info', () => {
      const jsonOutput = formatter.format(mockScanResult, { includeDebugInfo: true });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.debug.performanceMetrics.avgFileProcessingTime).toBe(15.5);
      expect(parsed.debug.performanceMetrics.slowestFile.path).toBe('large-file.js');
      expect(parsed.debug.performanceMetrics.slowestFile.duration).toBe(150);
    });
  });

  describe('Context Inclusion', () => {
    it('should include context by default', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues[0].context).toBe('const api_key_12345 = "secret";');
    });

    it('should include context when explicitly enabled', () => {
      const jsonOutput = formatter.format(mockScanResult, { includeContext: true });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues[0].context).toBe('const api_key_12345 = "secret";');
    });

    it('should exclude context when disabled', () => {
      const jsonOutput = formatter.format(mockScanResult, { includeContext: false });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues[0].context).toBeUndefined();
    });
  });

  describe('Issue Sorting', () => {
    it('should sort issues by severity by default', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      // High severity should come before medium
      expect(parsed.issues[0].severity).toBe('high');
      expect(parsed.issues[1].severity).toBe('medium');
    });

    it('should sort issues by severity when explicitly enabled', () => {
      const jsonOutput = formatter.format(mockScanResult, { 
        sortIssues: true, 
        sortBy: 'severity' 
      });
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues[0].severity).toBe('high');
      expect(parsed.issues[1].severity).toBe('medium');
    });

    it('should sort issues by file when specified', () => {
      const resultWithMultipleFiles = createMockScanResultWithMultipleFiles();
      const jsonOutput = formatter.format(resultWithMultipleFiles, { 
        sortIssues: true, 
        sortBy: 'file' 
      });
      const parsed = JSON.parse(jsonOutput);
      
      // Files should be sorted alphabetically
      expect(parsed.issues[0].file).toBe('src/auth.js');
      expect(parsed.issues[1].file).toBe('src/config.js');
    });

    it('should sort issues by line number when specified', () => {
      const resultWithMultipleLines = createMockScanResultWithMultipleLines();
      const jsonOutput = formatter.format(resultWithMultipleLines, { 
        sortIssues: true, 
        sortBy: 'line' 
      });
      const parsed = JSON.parse(jsonOutput);
      
      // Lines should be sorted numerically
      expect(parsed.issues[0].line).toBe(10);
      expect(parsed.issues[1].line).toBe(25);
    });

    it('should sort issues by type when specified', () => {
      const jsonOutput = formatter.format(mockScanResult, { 
        sortIssues: true, 
        sortBy: 'type' 
      });
      const parsed = JSON.parse(jsonOutput);
      
      // Types should be sorted alphabetically
      expect(parsed.issues[0].type).toBe('api-key');
      expect(parsed.issues[1].type).toBe('password');
    });

    it('should not sort issues when sorting is disabled', () => {
      const jsonOutput = formatter.format(mockScanResult, { sortIssues: false });
      const parsed = JSON.parse(jsonOutput);
      
      // Should maintain original order (medium severity first in mock data)
      expect(parsed.issues[0].id).toBe('issue-1');
      expect(parsed.issues[1].id).toBe('issue-2');
    });
  });

  describe('Optional Fields', () => {
    it('should include column number when available', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues[0].column).toBe(7);
    });

    it('should exclude column number when not available', () => {
      const resultWithoutColumn = createMockScanResultWithoutColumn();
      const jsonOutput = formatter.format(resultWithoutColumn);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues[0].column).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle formatting errors gracefully', () => {
      // Create a result with circular reference
      const circularResult = createCircularScanResult();
      
      const jsonOutput = formatter.format(circularResult);
      
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
      
      const parsed = JSON.parse(jsonOutput);
      expect(parsed.success).toBe(false);
      expect(parsed.error).toBeDefined();
      expect(parsed.error.message).toBe('Failed to format JSON output');
    });

    it('should provide fallback JSON on formatting failure', () => {
      const circularResult = createCircularScanResult();
      const jsonOutput = formatter.format(circularResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.success).toBe(false);
      expect(parsed.timestamp).toBeDefined();
      expect(parsed.duration).toBe(circularResult.metadata?.duration || 0);
      expect(parsed.filesScanned).toBe(circularResult.metadata?.filesScanned || 0);
      expect(parsed.securityScore).toBe(0);
      expect(parsed.issues).toEqual([]);
      expect(parsed.summary.total).toBe(0);
    });
  });

  describe('JSON Validation', () => {
    it('should validate valid JSON output', () => {
      const jsonOutput = formatter.format(mockScanResult);
      const validation = formatter.validate(jsonOutput);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid JSON', () => {
      const invalidJson = '{ invalid json }';
      const validation = formatter.validate(invalidJson);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('Invalid JSON');
    });

    it('should detect missing required fields', () => {
      const incompleteJson = JSON.stringify({ success: true });
      const validation = formatter.validate(incompleteJson);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Missing required field: timestamp');
      expect(validation.errors).toContain('Missing required field: issues');
    });

    it('should detect invalid severity values', () => {
      const invalidSeverityJson = JSON.stringify({
        success: true,
        timestamp: '2024-01-01T12:00:00.000Z',
        duration: 1000,
        filesScanned: 10,
        securityScore: 85,
        issues: [{
          id: 'test',
          type: 'test',
          severity: 'invalid-severity',
          message: 'test',
          file: 'test.js',
          line: 1,
          match: 'test',
          rule: { id: 'test', name: 'test' }
        }],
        summary: { total: 1, critical: 0, high: 0, medium: 0, low: 0 }
      });
      
      const validation = formatter.validate(invalidSeverityJson);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.includes('Invalid severity'))).toBe(true);
    });

    it('should detect non-array issues field', () => {
      const invalidIssuesJson = JSON.stringify({
        success: true,
        timestamp: '2024-01-01T12:00:00.000Z',
        duration: 1000,
        filesScanned: 10,
        securityScore: 85,
        issues: 'not-an-array',
        summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
      });
      
      const validation = formatter.validate(invalidIssuesJson);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Issues field must be an array');
    });
  });

  describe('Utility Methods', () => {
    it('should create minimal result for testing', () => {
      const minimalResult = JSONOutputFormatter.createMinimalResult();
      
      expect(minimalResult.success).toBe(true);
      expect(minimalResult.issues).toEqual([]);
      expect(minimalResult.summary.total).toBe(0);
      expect(minimalResult.securityScore).toBe(85);
    });

    it('should provide JSON schema', () => {
      const schema = formatter.getSchema();
      
      expect(schema).toHaveProperty('type', 'object');
      expect(schema).toHaveProperty('required');
      expect(schema).toHaveProperty('properties');
      
      const required = (schema as any).required;
      expect(required).toContain('success');
      expect(required).toContain('timestamp');
      expect(required).toContain('issues');
      expect(required).toContain('summary');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty issues array', () => {
      const emptyResult = { ...mockScanResult, issues: [] };
      const jsonOutput = formatter.format(emptyResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues).toEqual([]);
      expect(Array.isArray(parsed.issues)).toBe(true);
    });

    it('should handle very large numbers', () => {
      const largeNumberResult = {
        ...mockScanResult,
        metadata: {
          ...mockScanResult.metadata,
          filesScanned: Number.MAX_SAFE_INTEGER
        }
      };
      
      const jsonOutput = formatter.format(largeNumberResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.filesScanned).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle special characters in strings', () => {
      const specialCharResult = {
        ...mockScanResult,
        issues: [{
          ...mockScanResult.issues[0],
          message: 'Message with "quotes" and \n newlines \t tabs',
          match: 'Match with 🚀 emoji'
        }]
      };
      
      const jsonOutput = formatter.format(specialCharResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues[0].message).toContain('quotes');
      expect(parsed.issues[0].match).toContain('🚀');
    });

    it('should handle null and undefined values', () => {
      const nullValueResult = {
        ...mockScanResult,
        issues: [{
          ...mockScanResult.issues[0],
          columnNumber: undefined,
          context: undefined // JSON.stringify converts null to null, but undefined is omitted
        }]
      };
      
      const jsonOutput = formatter.format(nullValueResult);
      const parsed = JSON.parse(jsonOutput);
      
      expect(parsed.issues[0].column).toBeUndefined();
      expect(parsed.issues[0].context).toBeUndefined();
    });
  });
});

// Helper functions for creating test data

function createMockScanResult(): ScanResult {
  const issues: SecurityIssue[] = [
    {
      id: 'issue-1',
      type: 'api-key',
      severity: Severity.HIGH,
      message: 'Potential API key detected',
      filePath: 'src/config.js',
      lineNumber: 15,
      columnNumber: 7,
      match: 'api_key_12345',
      context: 'const api_key_12345 = "secret";',
      confidence: 0.9,
      ruleId: 'api-key-pattern',
      ruleName: 'API Key Pattern'
    },
    {
      id: 'issue-2',
      type: 'password',
      severity: Severity.MEDIUM,
      message: 'Potential password detected',
      filePath: 'src/config.js',
      lineNumber: 20,
      columnNumber: 10,
      match: 'password123',
      context: 'const password = "password123";',
      confidence: 0.7,
      ruleId: 'password-pattern',
      ruleName: 'Password Pattern'
    }
  ];

  const summary: IssueSummary = {
    total: 2,
    critical: 0,
    high: 1,
    medium: 1,
    low: 0,
    byType: { 'api-key': 1, 'password': 1 },
    byFile: { 'src/config.js': 2 }
  };

  const scanOptions: ScanOptions = {
    verbose: true,
    debug: false,
    quiet: false,
    patterns: ['api-key', 'password'],
    ignorePatterns: ['node_modules/**'],
    maxFileSize: 1024 * 1024,
    parallel: true,
    workerCount: 4
  };

  const environment: EnvironmentInfo = {
    nodeVersion: 'v18.0.0',
    platform: 'linux',
    arch: 'x64',
    cwd: '/project',
    user: 'developer',
    ci: false
  };

  const metadata: ScanMetadata = {
    avanaVersion: '1.0.0',
    scanId: 'scan-123',
    startTime: '2024-01-01T12:00:00.000Z',
    endTime: '2024-01-01T12:00:01.500Z',
    duration: 1500,
    filesScanned: 10,
    filesSkipped: 2,
    filesIgnored: 5,
    totalFiles: 17,
    scanOptions,
    environment
  };

  const debug: DebugInfo = {
    memoryUsage: {
      rss: 104857600,
      heapUsed: 52428800,
      heapTotal: 67108864,
      external: 1048576
    },
    performanceMetrics: {
      avgFileProcessingTime: 15.5,
      slowestFile: {
        path: 'large-file.js',
        duration: 150
      },
      fastestFile: {
        path: 'small-file.js',
        duration: 2.5
      },
      patternMatchingTime: 45.2,
      fileReadingTime: 32.8
    },
    cacheStats: {
      hitRate: 0.75,
      totalRequests: 100,
      cacheHits: 75,
      cacheMisses: 25
    },
    errorStats: {
      totalErrors: 1,
      errorsByType: { 'permission-error': 1 }
    }
  };

  return {
    success: true,
    issues,
    summary,
    securityScore: 85,
    metadata,
    debug
  };
}

function createMockScanResultWithMultipleFiles(): ScanResult {
  const result = createMockScanResult();
  result.issues = [
    { ...result.issues[0], filePath: 'src/config.js' },
    { ...result.issues[1], filePath: 'src/auth.js' }
  ];
  return result;
}

function createMockScanResultWithMultipleLines(): ScanResult {
  const result = createMockScanResult();
  result.issues = [
    { ...result.issues[0], lineNumber: 25 },
    { ...result.issues[1], lineNumber: 10 }
  ];
  return result;
}

function createMockScanResultWithoutColumn(): ScanResult {
  const result = createMockScanResult();
  result.issues = [
    { ...result.issues[0], columnNumber: undefined }
  ];
  return result;
}

function createCircularScanResult(): any {
  const result = createMockScanResult();
  // Create circular reference that will cause JSON.stringify to fail
  const circularObj: any = { name: 'test' };
  circularObj.self = circularObj;
  result.metadata.environment = circularObj as any;
  return result;
}