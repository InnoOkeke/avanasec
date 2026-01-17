/**
 * Property Test Generators
 * Smart generators for property-based testing with fast-check
 */

import * as fc from 'fast-check';
import type { SecurityIssue, SeverityLevel } from '../../src/types';

/**
 * Generate valid file paths
 */
export const filePathArb = fc.string({ minLength: 1, maxLength: 100 })
  .filter(s => !s.includes('\0') && !s.includes('\n'))
  .map(s => s.replace(/[<>:"|?*]/g, '_')); // Remove invalid path characters

/**
 * Generate file content (text)
 */
export const fileContentArb = fc.string({ minLength: 0, maxLength: 10000 });

/**
 * Generate small file content (for faster tests)
 */
export const smallFileContentArb = fc.string({ minLength: 0, maxLength: 1000 });

/**
 * Generate binary content
 */
export const binaryContentArb = fc.uint8Array({ minLength: 10, maxLength: 1000 });

/**
 * Generate severity levels
 */
export const severityArb: fc.Arbitrary<SeverityLevel> = fc.constantFrom(
  'critical',
  'high',
  'medium',
  'low',
  'info'
);

/**
 * Generate security issues
 */
export const securityIssueArb: fc.Arbitrary<SecurityIssue> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  type: fc.constantFrom('secret', 'vulnerability', 'insecure-pattern', 'gitignore', 'configuration'),
  severity: severityArb,
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  file: filePathArb,
  line: fc.integer({ min: 1, max: 10000 }),
  column: fc.option(fc.integer({ min: 0, max: 200 }), { nil: undefined }),
  code: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
  suggestion: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
  cve: fc.option(fc.string({ maxLength: 50 }), { nil: undefined }),
  references: fc.option(fc.array(fc.webUrl(), { maxLength: 5 }), { nil: undefined }),
});

/**
 * Generate array of security issues
 */
export const securityIssuesArb = fc.array(securityIssueArb, { minLength: 0, maxLength: 50 });

/**
 * Generate file encodings
 */
export const encodingArb = fc.constantFrom('utf-8', 'utf-16', 'latin-1', 'ascii');

/**
 * Generate file sizes (in bytes)
 */
export const fileSizeArb = fc.integer({ min: 0, max: 100 * 1024 * 1024 }); // 0 to 100MB

/**
 * Generate glob patterns
 */
export const globPatternArb = fc.oneof(
  fc.constant('*.js'),
  fc.constant('*.ts'),
  fc.constant('**/*.test.ts'),
  fc.constant('node_modules/**'),
  fc.constant('.git/**'),
  fc.string({ minLength: 1, maxLength: 50 }).map(s => `*${s}*`)
);

/**
 * Generate ignore patterns
 */
export const ignorePatternArb = fc.array(globPatternArb, { minLength: 0, maxLength: 20 });

/**
 * Generate valid secrets (for testing detection)
 */
export const secretArb = fc.oneof(
  // OpenAI API key
  fc.constant('sk-proj-').chain(prefix =>
    fc.string({ minLength: 64, maxLength: 64 }).map(suffix => prefix + suffix)
  ),
  // AWS Access Key
  fc.constant('AKIA').chain(prefix =>
    fc.string({ minLength: 16, maxLength: 16 }).map(suffix => prefix + suffix)
  ),
  // Generic API key
  fc.constant('api_key=').chain(prefix =>
    fc.string({ minLength: 32, maxLength: 32 }).map(suffix => prefix + suffix)
  ),
  // GitHub token
  fc.constant('ghp_').chain(prefix =>
    fc.string({ minLength: 36, maxLength: 36 }).map(suffix => prefix + suffix)
  )
);

/**
 * Generate file content with secrets
 */
export const fileWithSecretArb = fc.tuple(fileContentArb, secretArb).map(([content, secret]) => {
  // Insert secret at random position
  const pos = Math.floor(Math.random() * content.length);
  return content.slice(0, pos) + secret + content.slice(pos);
});

/**
 * Generate file content without secrets (clean)
 */
export const cleanFileContentArb = fc.string({ minLength: 0, maxLength: 1000 })
  .filter(s => !s.includes('sk-proj-'))
  .filter(s => !s.includes('AKIA'))
  .filter(s => !s.includes('api_key='))
  .filter(s => !s.includes('ghp_'));

/**
 * Generate line numbers
 */
export const lineNumberArb = fc.integer({ min: 1, max: 10000 });

/**
 * Generate column numbers
 */
export const columnNumberArb = fc.integer({ min: 0, max: 200 });

/**
 * Generate timestamps
 */
export const timestampArb = fc.date().map(d => d.toISOString());

/**
 * Generate durations (in milliseconds)
 */
export const durationArb = fc.integer({ min: 0, max: 60000 }); // 0 to 60 seconds

/**
 * Generate file counts
 */
export const fileCountArb = fc.integer({ min: 0, max: 10000 });

/**
 * Generate security scores
 */
export const securityScoreArb = fc.integer({ min: 0, max: 100 });

/**
 * Generate memory usage (in bytes)
 */
export const memoryUsageArb = fc.integer({ min: 0, max: 500 * 1024 * 1024 }); // 0 to 500MB

/**
 * Generate worker counts
 */
export const workerCountArb = fc.integer({ min: 1, max: 16 });

/**
 * Generate cache keys
 */
export const cacheKeyArb = fc.string({ minLength: 1, maxLength: 100 });

/**
 * Generate file hashes
 */
export const fileHashArb = fc.hexaString({ minLength: 32, maxLength: 64 });

/**
 * Generate exit codes
 */
export const exitCodeArb = fc.constantFrom(0, 1, 2, 3);

/**
 * Generate progress percentages
 */
export const progressPercentageArb = fc.integer({ min: 0, max: 100 });

/**
 * Generate ETA (estimated time remaining in seconds)
 */
export const etaArb = fc.integer({ min: 0, max: 3600 }); // 0 to 1 hour
