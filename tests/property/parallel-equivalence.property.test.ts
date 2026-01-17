/**
 * Property-Based Tests: Parallel Scan Equivalence
 * Feature: avana-core, Property 13: Parallel Scan Equivalence
 * 
 * **Validates: Requirements 2.2**
 * 
 * These tests verify that parallel scanning produces identical results
 * to sequential scanning, ensuring correctness across different worker counts.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ParallelScanner } from '../../src/utils/parallel-scanner';
import { SecretScanner } from '../../src/scanners/secret-scanner';
import { getAllSecretPatterns } from '../../src/rules/secret-patterns';

describe('Property 13: Parallel Scan Equivalence', () => {
  let tempDir: string;
  let parallelScanner: ParallelScanner;
  let sequentialScanner: SecretScanner;

  beforeEach(() => {
    // Create temporary directory for test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'avana-parallel-test-'));
    parallelScanner = new ParallelScanner();
    sequentialScanner = new SecretScanner();
  });

  afterEach(async () => {
    // Clean up
    await parallelScanner.terminate();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('Property 13.1: Parallel and sequential scans produce identical results', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            filename: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9._-]/.test(c)), { minLength: 1, maxLength: 20 }),
            content: fc.oneof(
              fc.constant('const API_KEY = "sk-1234567890abcdef";'),
              fc.constant('const token = "ghp_1234567890abcdefghijklmnopqrstuvwxyz12";'),
              fc.constant('const password = "secret123";'),
              fc.constant('// This is a safe comment'),
              fc.constant('function hello() { return "world"; }'),
              fc.constant('const config = { debug: true };')
            )
          }),
          { minLength: 1, maxLength: 10 }
        ),
        fc.integer({ min: 1, max: Math.min(4, os.cpus().length) }),
        async (testFiles, workerCount) => {
        // Create test files
        const filePaths: string[] = [];
        for (const testFile of testFiles) {
          const filePath = path.join(tempDir, `${testFile.filename}.js`);
          fs.writeFileSync(filePath, testFile.content);
          filePaths.push(filePath);
        }

        const patterns = getAllSecretPatterns();

        // Sequential scan
        const sequentialResults = filePaths.map(file => ({
          file,
          issues: sequentialScanner.scanFile(file, patterns)
        }));

        // Parallel scan
        const parallelResults = await parallelScanner.scanFiles(filePaths, patterns);

        // Sort both results by file path for comparison
        sequentialResults.sort((a, b) => a.file.localeCompare(b.file));
        parallelResults.sort((a, b) => a.file.localeCompare(b.file));

        // Results should be identical
        expect(parallelResults).toHaveLength(sequentialResults.length);

        for (let i = 0; i < sequentialResults.length; i++) {
          const sequential = sequentialResults[i];
          const parallel = parallelResults[i];

          expect(parallel.file).toBe(sequential.file);
          expect(parallel.issues).toHaveLength(sequential.issues.length);

          // Compare each issue
          for (let j = 0; j < sequential.issues.length; j++) {
            const seqIssue = sequential.issues[j];
            const parIssue = parallel.issues[j];

            expect(parIssue.type).toBe(seqIssue.type);
            expect(parIssue.severity).toBe(seqIssue.severity);
            expect(parIssue.title).toBe(seqIssue.title);
            expect(parIssue.file).toBe(seqIssue.file);
            expect(parIssue.line).toBe(seqIssue.line);
          }
        }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13.2: Parallel scan handles different worker counts consistently', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            filename: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9._-]/.test(c)), { minLength: 1, maxLength: 15 }),
            content: fc.oneof(
              fc.constant('const AWS_ACCESS_KEY = "AKIA1234567890ABCDEF";'),
              fc.constant('const STRIPE_KEY = "sk_test_1234567890abcdef";'),
              fc.constant('const GITHUB_TOKEN = "ghp_abcdefghijklmnopqrstuvwxyz123456";'),
              fc.constant('// Safe content without secrets'),
              fc.constant('const publicConfig = { version: "1.0.0" };')
            )
          }),
          { minLength: 2, maxLength: 8 }
        ),
        async (testFiles) => {
        // Create test files
        const filePaths: string[] = [];
        for (const testFile of testFiles) {
          const filePath = path.join(tempDir, `${testFile.filename}.ts`);
          fs.writeFileSync(filePath, testFile.content);
          filePaths.push(filePath);
        }

        const patterns = getAllSecretPatterns();

        // Test with different worker counts
        const workerCounts = [1, 2, Math.min(4, os.cpus().length)];
        const results: any[][] = [];

        for (const workerCount of workerCounts) {
          const scanner = new ParallelScanner({ workerCount });
          const result = await scanner.scanFiles(filePaths, patterns);
          results.push(result.sort((a, b) => a.file.localeCompare(b.file)));
          await scanner.terminate();
        }

        // All results should be identical regardless of worker count
        for (let i = 1; i < results.length; i++) {
          expect(results[i]).toHaveLength(results[0].length);
          
          for (let j = 0; j < results[0].length; j++) {
            expect(results[i][j].file).toBe(results[0][j].file);
            expect(results[i][j].issues).toHaveLength(results[0][j].issues.length);
          }
        }
      },
      { numRuns: 100 }
    );
  });

  it('Property 13.3: Parallel scan maintains issue order consistency', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            filename: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9._-]/.test(c)), { minLength: 1, maxLength: 12 }),
            content: fc.constantFrom(
              'const key1 = "sk-1234"; const key2 = "pk-5678";',
              'const token = "ghp_abcd"; // Multiple secrets here',
              'const safe = "public"; const secret = "AKIA1234567890";',
              '// No secrets in this file',
              'export const config = { api: "public" };'
            )
          }),
          { minLength: 1, maxLength: 6 }
        ),
        async (testFiles) => {
        // Create test files
        const filePaths: string[] = [];
        for (const testFile of testFiles) {
          const filePath = path.join(tempDir, `${testFile.filename}.js`);
          fs.writeFileSync(filePath, testFile.content);
          filePaths.push(filePath);
        }

        const patterns = getAllSecretPatterns();

        // Run parallel scan multiple times
        const runs = 3;
        const allResults: any[][] = [];

        for (let run = 0; run < runs; run++) {
          const scanner = new ParallelScanner();
          const result = await scanner.scanFiles(filePaths, patterns);
          allResults.push(result.sort((a, b) => a.file.localeCompare(b.file)));
          await scanner.terminate();
        }

        // All runs should produce identical results
        for (let run = 1; run < runs; run++) {
          expect(allResults[run]).toHaveLength(allResults[0].length);
          
          for (let i = 0; i < allResults[0].length; i++) {
            expect(allResults[run][i].file).toBe(allResults[0][i].file);
            expect(allResults[run][i].issues).toHaveLength(allResults[0][i].issues.length);
            
            // Issues within each file should be in the same order
            for (let j = 0; j < allResults[0][i].issues.length; j++) {
              expect(allResults[run][i].issues[j].line).toBe(allResults[0][i].issues[j].line);
              expect(allResults[run][i].issues[j].title).toBe(allResults[0][i].issues[j].title);
            }
          }
        }
      },
      { numRuns: 100 }
    );
  });

  it('Property 13.4: Parallel scan handles empty and error files correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            filename: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9._-]/.test(c)), { minLength: 1, maxLength: 10 }),
            content: fc.oneof(
              fc.constant(''), // Empty file
              fc.constant('   '), // Whitespace only
              fc.constant('const valid = "code";'),
              fc.constant('const API_KEY = "sk-test123";'),
              fc.constant('\n\n\n') // Multiple newlines
            )
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (testFiles) => {
        // Create test files
        const filePaths: string[] = [];
        for (const testFile of testFiles) {
          const filePath = path.join(tempDir, `${testFile.filename}.js`);
          fs.writeFileSync(filePath, testFile.content);
          filePaths.push(filePath);
        }

        const patterns = getAllSecretPatterns();

        // Sequential scan
        const sequentialResults = filePaths.map(file => {
          try {
            return {
              file,
              issues: sequentialScanner.scanFile(file, patterns),
              error: undefined
            };
          } catch (error) {
            return {
              file,
              issues: [],
              error: error instanceof Error ? error.message : String(error)
            };
          }
        });

        // Parallel scan
        const parallelResults = await parallelScanner.scanFiles(filePaths, patterns);

        // Both should handle empty/error files gracefully
        expect(parallelResults).toHaveLength(sequentialResults.length);

        for (let i = 0; i < sequentialResults.length; i++) {
          const sequential = sequentialResults[i];
          const parallel = parallelResults.find(r => r.file === sequential.file);
          
          expect(parallel).toBeDefined();
          expect(parallel!.issues).toHaveLength(sequential.issues.length);
        }
      },
      { numRuns: 100 }
    );
  });

  it('Property 13.5: Parallel scan progress tracking is accurate', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            filename: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9._-]/.test(c)), { minLength: 1, maxLength: 8 }),
            content: fc.constantFrom(
              'const secret = "sk-1234567890";',
              'const token = "ghp_abcdefghij";',
              '// Safe file content',
              'export default {};'
            )
          }),
          { minLength: 2, maxLength: 6 }
        ),
        async (testFiles) => {
        // Create test files
        const filePaths: string[] = [];
        for (const testFile of testFiles) {
          const filePath = path.join(tempDir, `${testFile.filename}.js`);
          fs.writeFileSync(filePath, testFile.content);
          filePaths.push(filePath);
        }

        const patterns = getAllSecretPatterns();

        // Start parallel scan and track progress
        const progressValues: number[] = [];
        
        const scanPromise = parallelScanner.scanFiles(filePaths, patterns);
        
        // Sample progress during scan
        const progressInterval = setInterval(() => {
          progressValues.push(parallelScanner.getProgress());
        }, 10);

        const results = await scanPromise;
        clearInterval(progressInterval);

        // Final progress should be 1.0
        expect(parallelScanner.getProgress()).toBe(1);

        // Progress should be non-decreasing
        for (let i = 1; i < progressValues.length; i++) {
          expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
        }

        // Should have processed all files
        expect(results).toHaveLength(filePaths.length);
      },
      { numRuns: 100 }
    );
  });

  it('Property 13.6: Parallel scan statistics are consistent', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            filename: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9._-]/.test(c)), { minLength: 1, maxLength: 10 }),
            content: fc.constantFrom(
              'const API_KEY = "sk-test123";',
              'const safe = "public";',
              '// Comment only',
              'export const config = {};'
            )
          }),
          { minLength: 1, maxLength: 8 }
        ),
        async (testFiles) => {
        // Create test files
        const filePaths: string[] = [];
        for (const testFile of testFiles) {
          const filePath = path.join(tempDir, `${testFile.filename}.js`);
          fs.writeFileSync(filePath, testFile.content);
          filePaths.push(filePath);
        }

        const patterns = getAllSecretPatterns();

        // Run parallel scan
        const results = await parallelScanner.scanFiles(filePaths, patterns);
        const stats = parallelScanner.getStats();

        // Statistics should be consistent
        expect(stats.totalFiles).toBe(filePaths.length);
        expect(stats.completedFiles).toBe(filePaths.length);
        expect(stats.results).toBe(results.length);
        expect(stats.activeWorkers).toBe(0); // Should be 0 after completion
        expect(stats.workerCount).toBeGreaterThan(0);
        expect(stats.errors).toBeGreaterThanOrEqual(0);
      },
      { numRuns: 100 }
    );
  });

  it('Property 13.7: Parallel scan worker termination is clean', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            filename: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9._-]/.test(c)), { minLength: 1, maxLength: 8 }),
            content: fc.constantFrom(
              'const secret = "AKIA1234567890ABCDEF";',
              'const public = "safe";',
              '// Just a comment'
            )
          }),
          { minLength: 1, maxLength: 4 }
        ),
        async (testFiles) => {
        // Create test files
        const filePaths: string[] = [];
        for (const testFile of testFiles) {
          const filePath = path.join(tempDir, `${testFile.filename}.js`);
          fs.writeFileSync(filePath, testFile.content);
          filePaths.push(filePath);
        }

        const patterns = getAllSecretPatterns();
        const scanner = new ParallelScanner();

        // Run scan
        const results = await scanner.scanFiles(filePaths, patterns);
        
        // Terminate should complete without errors
        await expect(scanner.terminate()).resolves.toBeUndefined();
        
        // Stats should show no active workers after termination
        const stats = scanner.getStats();
        expect(stats.activeWorkers).toBe(0);
        
        // Results should still be valid
        expect(results).toHaveLength(filePaths.length);
      },
      { numRuns: 100 }
    );
  });
});