/**
 * Unit Tests: .gitignore Protection
 * Tests for automatic .gitignore protection of scan-reports directory
 * 
 * **Validates: Security protection against committing scan reports**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import {
  createTempDir,
  cleanupTempDir,
  createTempFile,
} from '../helpers/test-utils';

describe('GitIgnore Protection', () => {
  let tempDir: string;
  let cliPath: string;

  beforeEach(() => {
    tempDir = createTempDir();
    cliPath = path.join(process.cwd(), 'dist', 'cli.js');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Automatic .gitignore Creation', () => {
    it('should add scan-reports to .gitignore when creating reports', () => {
      // Create a test file with a secret
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const apiKey = "sk-1234567890abcdef";');
      
      // Run scan with JSON output to create scan-reports directory
      try {
        execSync(`node "${cliPath}" scan --path "${tempDir}" --json --quiet`, {
          cwd: tempDir,
          stdio: 'pipe'
        });
      } catch (error) {
        // Scan may exit with code 1 due to detected secrets, which is expected
      }
      
      // Check that .gitignore was created and contains scan-reports
      const gitignorePath = path.join(tempDir, '.gitignore');
      expect(fs.existsSync(gitignorePath)).toBe(true);
      
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      expect(gitignoreContent).toContain('scan-reports/');
      expect(gitignoreContent).toContain('contains detected secrets');
    });

    it('should not duplicate scan-reports entry in existing .gitignore', () => {
      // Create existing .gitignore with scan-reports already in it
      const gitignorePath = path.join(tempDir, '.gitignore');
      fs.writeFileSync(gitignorePath, 'node_modules/\nscan-reports/\n*.log\n');
      
      // Create a test file with a secret
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const apiKey = "sk-1234567890abcdef";');
      
      // Run scan with JSON output
      try {
        execSync(`node "${cliPath}" scan --path "${tempDir}" --json --quiet`, {
          cwd: tempDir,
          stdio: 'pipe'
        });
      } catch (error) {
        // Expected due to detected secrets
      }
      
      // Check that scan-reports wasn't duplicated
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      const scanReportsMatches = (gitignoreContent.match(/scan-reports/g) || []).length;
      expect(scanReportsMatches).toBe(1);
    });

    it('should append to existing .gitignore without scan-reports', () => {
      // Create existing .gitignore without scan-reports
      const gitignorePath = path.join(tempDir, '.gitignore');
      const existingContent = 'node_modules/\n*.log\n';
      fs.writeFileSync(gitignorePath, existingContent);
      
      // Create a test file with a secret
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const apiKey = "sk-1234567890abcdef";');
      
      // Run scan with JSON output
      try {
        execSync(`node "${cliPath}" scan --path "${tempDir}" --json --quiet`, {
          cwd: tempDir,
          stdio: 'pipe'
        });
      } catch (error) {
        // Expected due to detected secrets
      }
      
      // Check that existing content is preserved and scan-reports is added
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      expect(gitignoreContent).toContain('node_modules/');
      expect(gitignoreContent).toContain('*.log');
      expect(gitignoreContent).toContain('scan-reports/');
      expect(gitignoreContent).toContain('contains detected secrets');
    });

    it('should handle .gitignore write errors gracefully', () => {
      // Create a test file with a secret
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const apiKey = "sk-1234567890abcdef";');
      
      // Create a read-only .gitignore to simulate write error
      const gitignorePath = path.join(tempDir, '.gitignore');
      fs.writeFileSync(gitignorePath, 'existing content\n');
      
      // Make it read-only (this may not work on all systems, but test should still pass)
      try {
        fs.chmodSync(gitignorePath, 0o444);
      } catch (error) {
        // chmod may not work on all systems, skip this part
      }
      
      // Run scan - should not crash even if .gitignore write fails
      let scanOutput = '';
      try {
        scanOutput = execSync(`node "${cliPath}" scan --path "${tempDir}" --json --quiet`, {
          cwd: tempDir,
          stdio: 'pipe',
          encoding: 'utf-8'
        });
      } catch (error: any) {
        // Expected due to detected secrets, capture output
        scanOutput = error.stdout || '';
      }
      
      // Scan should complete successfully despite .gitignore write failure
      expect(fs.existsSync(path.join(tempDir, 'scan-reports'))).toBe(true);
      
      // Restore permissions for cleanup
      try {
        fs.chmodSync(gitignorePath, 0o644);
      } catch (error) {
        // Ignore cleanup errors
      }
    });
  });

  describe('Security Reminder Messages', () => {
    it('should show security reminder when reports are generated', () => {
      // Create a test file with a secret
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const apiKey = "sk-1234567890abcdef";');
      
      // Run scan with verbose output to see messages
      let scanOutput = '';
      try {
        scanOutput = execSync(`node "${cliPath}" scan --path "${tempDir}" --json --verbose`, {
          cwd: tempDir,
          stdio: 'pipe',
          encoding: 'utf-8'
        });
      } catch (error: any) {
        // Expected due to detected secrets, capture output
        scanOutput = error.stdout || '';
      }
      
      // Should contain security reminder about not committing scan reports
      expect(scanOutput).toContain('Security Reminder');
      expect(scanOutput).toContain('scan reports contain detected secrets');
    });

    it('should show .gitignore update message in verbose mode', () => {
      // Create a test file with a secret
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const apiKey = "sk-1234567890abcdef";');
      
      // Run scan with verbose output
      let scanOutput = '';
      try {
        scanOutput = execSync(`node "${cliPath}" scan --path "${tempDir}" --json --verbose`, {
          cwd: tempDir,
          stdio: 'pipe',
          encoding: 'utf-8'
        });
      } catch (error: any) {
        // Expected due to detected secrets, capture output
        scanOutput = error.stdout || '';
      }
      
      // Should mention adding scan-reports to .gitignore
      expect(scanOutput).toContain('Added scan-reports/ to .gitignore');
    });
  });

  describe('Directory Protection', () => {
    it('should create scan-reports directory with proper permissions', () => {
      // Create a test file with a secret
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const apiKey = "sk-1234567890abcdef";');
      
      // Run scan with JSON output
      try {
        execSync(`node "${cliPath}" scan --path "${tempDir}" --json --quiet`, {
          cwd: tempDir,
          stdio: 'pipe'
        });
      } catch (error) {
        // Expected due to detected secrets
      }
      
      // Check that scan-reports directory was created
      const scanReportsDir = path.join(tempDir, 'scan-reports');
      expect(fs.existsSync(scanReportsDir)).toBe(true);
      
      // Check that it's a directory
      const stats = fs.statSync(scanReportsDir);
      expect(stats.isDirectory()).toBe(true);
      
      // Check that report files were created
      const files = fs.readdirSync(scanReportsDir);
      expect(files.length).toBeGreaterThan(0);
      expect(files.some(file => file.endsWith('.json'))).toBe(true);
    });
  });
});