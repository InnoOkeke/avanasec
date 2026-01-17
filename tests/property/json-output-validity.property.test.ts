/**
 * Property Tests: JSON Output Validity
 * Feature: avana-core, Property 9: JSON Output Validity
 * Validates: Requirements 6.1, 6.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  JSONOutputFormatter, 
  Severity, 
  SecurityIssue, 
  ScanResult,
  IssueSummary,
  ScanMetadata,
  ScanOptions,
  EnvironmentInfo,
  DebugInfo
} from '../../src/utils/json-output-formatter';

/**
 * Generator for valid severity levels
 */
const severityArb = fc.constantFrom(
  Severity.LOW,
  Severity.MEDIUM,
  Severity.HIGH,
  Severity.CRITICAL
);

/**
 * Generator for valid file paths (no special JSON characters)
 */
const filePathArb = fc.stringMatching(/^[a-zA-Z0-9_\-\/\.]+$/);

/**
 * Generator for safe strings (no control characters that break JSON)
 */
const safeStringArb = fc.string({ minLength: 1, maxLength: 100 })
  .filter(s => !s.includes('\u0000') && !s.includes('\u0001'));

/**
 * Generator for security issues
 */
const securityIssueArb: fc.Arbitrary<SecurityIssue> = fc.record({
  id: fc.uuid(),
  type: fc.constantFrom('api-key', 'password', 'token', 'secret'),
  severity: severityArb,
  message: safeStringArb,
  filePath: filePathArb,
  lineNumber: fc.integer({ min: 1, max: 10000 }),
  columnNumber: fc.option(fc.integer({ min: 1, max: 200 })),
  match: safeStringArb,
  context: fc.option(safeStringArb),
  confidence: fc.float({ min: Math.fround(0), max: Math.fround(1) }),
  ruleId: fc.stringMatching(/^[a-z\-]+$/),
  ruleName: safeStringArb
});

/**
 * Generator for issue summary
 */
const issueSummaryArb: fc.Arbitrary<IssueSummary> = fc.record({
  total: fc.integer({ min: 0, max: 1000 }),
  critical: fc.integer({ min: 0, max: 100 }),
  high: fc.integer({ min: 0, max: 100 }),
  medium: fc.integer({ min: 0, max: 100 }),
  low: fc.integer({ min: 0, max: 100 }),
  byType: fc.dictionary(safeStringArb, fc.integer({ min: 0, max: 100 })),
  byFile: fc.dictionary(filePathArb, fc.integer({ min: 0, max: 100 }))
});

/**
 * Generator for scan options
 */
const scanOptionsArb: fc.Arbitrary<ScanOptions> = fc.record({
  verbose: fc.boolean(),
  debug: fc.boolean(),
  quiet: fc.boolean(),
  patterns: fc.array(safeStringArb, { maxLength: 10 }),
  ignorePatterns: fc.array(safeStringArb, { maxLength: 10 }),
  maxFileSize: fc.integer({ min: 1024, max: 1024 * 1024 * 100 }),
  parallel: fc.boolean(),
  workerCount: fc.option(fc.integer({ min: 1, max: 16 }))
});

/**
 * Generator for environment info
 */
const environmentInfoArb: fc.Arbitrary<EnvironmentInfo> = fc.record({
  nodeVersion: fc.stringMatching(/^v\d+\.\d+\.\d+$/),
  platform: fc.constantFrom('win32', 'darwin', 'linux'),
  arch: fc.constantFrom('x64', 'arm64'),
  cwd: filePathArb,
  user: fc.option(safeStringArb),
  ci: fc.option(fc.boolean()),
  ciProvider: fc.option(fc.constantFrom('github', 'gitlab', 'jenkins'))
});

/**
 * Generator for scan metadata
 */
const scanMetadataArb: fc.Arbitrary<ScanMetadata> = fc.record({
  avanaVersion: fc.stringMatching(/^\d+\.\d+\.\d+$/),
  scanId: fc.uuid(),
  startTime: fc.date().map(d => d.toISOString()),
  endTime: fc.date().map(d => d.toISOString()),
  duration: fc.integer({ min: 1, max: 300000 }),
  filesScanned: fc.integer({ min: 0, max: 10000 }),
  filesSkipped: fc.integer({ min: 0, max: 1000 }),
  filesIgnored: fc.integer({ min: 0, max: 1000 }),
  totalFiles: fc.integer({ min: 0, max: 10000 }),
  scanOptions: scanOptionsArb,
  environment: environmentInfoArb
});

/**
 * Generator for debug info
 */
const debugInfoArb: fc.Arbitrary<DebugInfo> = fc.record({
  memoryUsage: fc.record({
    rss: fc.integer({ min: 1024, max: 1024 * 1024 * 1024 }),
    heapUsed: fc.integer({ min: 1024, max: 1024 * 1024 * 512 }),
    heapTotal: fc.integer({ min: 1024, max: 1024 * 1024 * 512 }),
    external: fc.integer({ min: 0, max: 1024 * 1024 * 100 })
  }),
  performanceMetrics: fc.record({
    avgFileProcessingTime: fc.float({ min: Math.fround(0.1), max: Math.fround(1000) }),
    slowestFile: fc.record({
      path: filePathArb,
      duration: fc.float({ min: Math.fround(1), max: Math.fround(5000) })
    }),
    fastestFile: fc.record({
      path: filePathArb,
      duration: fc.float({ min: Math.fround(0.1), max: Math.fround(10) })
    }),
    patternMatchingTime: fc.float({ min: Math.fround(0.1), max: Math.fround(1000) }),
    fileReadingTime: fc.float({ min: Math.fround(0.1), max: Math.fround(1000) })
  }),
  cacheStats: fc.option(fc.record({
    hitRate: fc.float({ min: Math.fround(0), max: Math.fround(1) }),
    totalRequests: fc.integer({ min: 0, max: 10000 }),
    cacheHits: fc.integer({ min: 0, max: 10000 }),
    cacheMisses: fc.integer({ min: 0, max: 10000 })
  })),
  errorStats: fc.record({
    totalErrors: fc.integer({ min: 0, max: 100 }),
    errorsByType: fc.dictionary(safeStringArb, fc.integer({ min: 0, max: 50 }))
  })
});

/**
 * Generator for scan results
 */
const scanResultArb: fc.Arbitrary<ScanResult> = fc.record({
  success: fc.boolean(),
  issues: fc.array(securityIssueArb, { maxLength: 50 }),
  summary: issueSummaryArb,
  securityScore: fc.integer({ min: 0, max: 100 }),
  metadata: scanMetadataArb,
  debug: fc.option(debugInfoArb)
});

describe('Feature: avana-core, Property 9: JSON Output Validity', () => {
  const formatter = new JSONOutputFormatter('1.0.0');

  it('should always produce valid JSON for any scan result', () => {
    fc.assert(
      fc.property(
        scanResultArb,
        (scanResult) => {
          const jsonOutput = formatter.format(scanResult);
          
          // Should be valid JSON
          expect(() => JSON.parse(jsonOutput)).not.toThrow();
          
          // Parsed JSON should be an object
          const parsed = JSON.parse(jsonOutput);
          expect(typeof parsed).toBe('object');
          expect(parsed).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always include required fields in JSON output', () => {
    fc.assert(
      fc.property(
        scanResultArb,
        (scanResult) => {
          const jsonOutput = formatter.format(scanResult);
          const parsed = JSON.parse(jsonOutput);
          
          // Required fields should always be present
          expect(parsed).toHaveProperty('success');
          expect(parsed).toHaveProperty('timestamp');
          expect(parsed).toHaveProperty('duration');
          expect(parsed).toHaveProperty('filesScanned');
          expect(parsed).toHaveProperty('securityScore');
          expect(parsed).toHaveProperty('issues');
          expect(parsed).toHaveProperty('summary');
          
          // Issues should be an array
          expect(Array.isArray(parsed.issues)).toBe(true);
          
          // Summary should have required fields
          expect(parsed.summary).toHaveProperty('total');
          expect(parsed.summary).toHaveProperty('critical');
          expect(parsed.summary).toHaveProperty('high');
          expect(parsed.summary).toHaveProperty('medium');
          expect(parsed.summary).toHaveProperty('low');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce valid JSON with pretty printing enabled', () => {
    fc.assert(
      fc.property(
        scanResultArb,
        (scanResult) => {
          const jsonOutput = formatter.format(scanResult, { pretty: true });
          
          // Should be valid JSON
          expect(() => JSON.parse(jsonOutput)).not.toThrow();
          
          // Should contain newlines and indentation (pretty printed)
          expect(jsonOutput).toContain('\n');
          expect(jsonOutput).toContain('  ');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain data integrity through JSON serialization', () => {
    fc.assert(
      fc.property(
        scanResultArb,
        (scanResult) => {
          const jsonOutput = formatter.format(scanResult, { 
            includeMetadata: true,
            includeDebugInfo: true 
          });
          const parsed = JSON.parse(jsonOutput);
          
          // Basic data integrity checks
          expect(parsed.success).toBe(scanResult.success);
          expect(parsed.securityScore).toBe(scanResult.securityScore);
          expect(parsed.filesScanned).toBe(scanResult.metadata.filesScanned);
          expect(parsed.issues).toHaveLength(scanResult.issues.length);
          
          // Summary totals should match
          expect(parsed.summary.total).toBe(scanResult.summary.total);
          expect(parsed.summary.critical).toBe(scanResult.summary.critical);
          expect(parsed.summary.high).toBe(scanResult.summary.high);
          expect(parsed.summary.medium).toBe(scanResult.summary.medium);
          expect(parsed.summary.low).toBe(scanResult.summary.low);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty issues arrays correctly', () => {
    fc.assert(
      fc.property(
        scanResultArb.map(result => ({ ...result, issues: [] })),
        (scanResult) => {
          const jsonOutput = formatter.format(scanResult);
          const parsed = JSON.parse(jsonOutput);
          
          expect(Array.isArray(parsed.issues)).toBe(true);
          expect(parsed.issues).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate its own output structure', () => {
    fc.assert(
      fc.property(
        scanResultArb,
        (scanResult) => {
          const jsonOutput = formatter.format(scanResult);
          const validation = formatter.validate(jsonOutput);
          
          expect(validation.isValid).toBe(true);
          expect(validation.errors).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle all severity levels correctly', () => {
    fc.assert(
      fc.property(
        fc.array(securityIssueArb, { minLength: 1, maxLength: 20 }),
        (issues) => {
          const scanResult: ScanResult = {
            success: true,
            issues,
            summary: {
              total: issues.length,
              critical: issues.filter(i => i.severity === Severity.CRITICAL).length,
              high: issues.filter(i => i.severity === Severity.HIGH).length,
              medium: issues.filter(i => i.severity === Severity.MEDIUM).length,
              low: issues.filter(i => i.severity === Severity.LOW).length,
              byType: {},
              byFile: {}
            },
            securityScore: 85,
            metadata: {
              avanaVersion: '1.0.0',
              scanId: 'test-scan',
              startTime: new Date().toISOString(),
              endTime: new Date().toISOString(),
              duration: 1000,
              filesScanned: 10,
              filesSkipped: 0,
              filesIgnored: 0,
              totalFiles: 10,
              scanOptions: {
                verbose: false,
                debug: false,
                quiet: false,
                patterns: [],
                ignorePatterns: [],
                maxFileSize: 1024 * 1024,
                parallel: false
              },
              environment: {
                nodeVersion: 'v18.0.0',
                platform: 'linux',
                arch: 'x64',
                cwd: '/test'
              }
            }
          };
          
          const jsonOutput = formatter.format(scanResult);
          const parsed = JSON.parse(jsonOutput);
          
          // All issues should have valid severity
          parsed.issues.forEach((issue: any) => {
            expect(Object.values(Severity)).toContain(issue.severity);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle optional fields consistently', () => {
    fc.assert(
      fc.property(
        scanResultArb,
        fc.boolean(),
        fc.boolean(),
        (scanResult, includeMetadata, includeDebugInfo) => {
          const jsonOutput = formatter.format(scanResult, {
            includeMetadata,
            includeDebugInfo
          });
          const parsed = JSON.parse(jsonOutput);
          
          if (includeMetadata) {
            expect(parsed).toHaveProperty('metadata');
          }
          
          if (includeDebugInfo && scanResult.debug) {
            expect(parsed).toHaveProperty('debug');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should never produce malformed JSON even with edge case data', () => {
    fc.assert(
      fc.property(
        // Edge case: very large numbers, empty strings, special characters
        fc.record({
          success: fc.boolean(),
          issues: fc.array(fc.record({
            id: fc.string(),
            type: fc.string(),
            severity: severityArb,
            message: fc.string(),
            filePath: fc.string(),
            lineNumber: fc.integer({ min: 1, max: Number.MAX_SAFE_INTEGER }),
            match: fc.string(),
            confidence: fc.float({ min: Math.fround(0), max: Math.fround(1) }),
            ruleId: fc.string(),
            ruleName: fc.string()
          }), { maxLength: 5 }),
          summary: fc.record({
            total: fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
            critical: fc.integer({ min: 0, max: 1000 }),
            high: fc.integer({ min: 0, max: 1000 }),
            medium: fc.integer({ min: 0, max: 1000 }),
            low: fc.integer({ min: 0, max: 1000 }),
            byType: fc.dictionary(fc.string(), fc.integer({ min: 0, max: 100 })),
            byFile: fc.dictionary(fc.string(), fc.integer({ min: 0, max: 100 }))
          }),
          securityScore: fc.integer({ min: 0, max: 100 }),
          metadata: scanMetadataArb
        }),
        (edgeCaseResult) => {
          const jsonOutput = formatter.format(edgeCaseResult as ScanResult);
          
          // Should still be valid JSON
          expect(() => JSON.parse(jsonOutput)).not.toThrow();
          
          const parsed = JSON.parse(jsonOutput);
          expect(typeof parsed).toBe('object');
        }
      ),
      { numRuns: 100 }
    );
  });
});