/**
 * Unit tests for MarkdownOutputFormatter
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MarkdownOutputFormatter } from '../../src/utils/markdown-output-formatter';
import type { ScanResult, SecurityIssue } from '../../src/types';

describe('MarkdownOutputFormatter', () => {
  let formatter: MarkdownOutputFormatter;
  let mockResult: ScanResult;

  beforeEach(() => {
    formatter = new MarkdownOutputFormatter();
    
    mockResult = {
      success: true,
      timestamp: '2024-01-15T10:30:00.000Z',
      duration: 1500,
      filesScanned: 25,
      issues: [],
      summary: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
      },
    };
  });

  describe('Basic Formatting', () => {
    it('should format empty results correctly', () => {
      const markdown = formatter.format(mockResult, 100);
      
      expect(markdown).toContain('# 🔒 Avana Security Scan Report (Score: 100/100)');
      expect(markdown).toContain('**Status:** ✅ No Issues Found');
      expect(markdown).toContain('## 📊 Scan Metadata');
      expect(markdown).toContain('| **Duration** | 1500ms |');
      expect(markdown).toContain('| **Files Scanned** | 25 |');
      expect(markdown).toContain('## ✅ No Issues Found');
    });

    it('should format results without security score', () => {
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('# 🔒 Avana Security Scan Report');
      expect(markdown).not.toContain('Score:');
    });

    it('should format timestamp correctly', () => {
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('**Generated:**');
      expect(markdown).toContain('1/15/2024'); // Locale-specific format
    });
  });

  describe('Issue Formatting', () => {
    beforeEach(() => {
      const issues: SecurityIssue[] = [
        {
          id: 'test-1',
          title: 'API Key Detected',
          description: 'Hardcoded API key found',
          file: 'src/config.ts',
          line: 10,
          column: 15,
          severity: 'critical',
          type: 'secret',
          code: 'const config = {\n  api_key: "abc123"\n};',
          suggestion: 'Use environment variables'
        },
        {
          id: 'test-2',
          title: 'Password in Code',
          description: 'Hardcoded password detected',
          file: 'src/auth.ts',
          line: 5,
          column: 20,
          severity: 'high',
          type: 'secret',
          suggestion: 'Use secure credential storage'
        },
        {
          id: 'test-3',
          title: 'Debug Token',
          description: 'Debug token should not be in production',
          file: 'src/debug.ts',
          line: 1,
          column: 1,
          severity: 'medium',
          type: 'secret'
        }
      ];

      mockResult.issues = issues;
      mockResult.summary = {
        critical: 1,
        high: 1,
        medium: 1,
        low: 0,
        info: 0,
      };
    });

    it('should format issues grouped by severity', () => {
      const markdown = formatter.format(mockResult, 65);
      
      expect(markdown).toContain('## 🚨 Detected Issues');
      expect(markdown).toContain('### 🔴 Critical Severity (1 issues)');
      expect(markdown).toContain('### 🟠 High Severity (1 issues)');
      expect(markdown).toContain('### 🟡 Medium Severity (1 issues)');
      expect(markdown).toContain('#### 1. 🔴 API Key Detected');
      expect(markdown).toContain('| **File** | `src/config.ts` |');
      expect(markdown).toContain('| **Line** | 10 |');
      expect(markdown).toContain('**💡 Recommendation:** Use environment variables');
    });

    it('should include code context when available', () => {
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('**Code Context:**');
      expect(markdown).toContain('```\nconst config = {\n  api_key: "abc123"\n};\n```');
    });

    it('should handle issues without suggestions', () => {
      const markdown = formatter.format(mockResult);
      
      // Should contain the medium severity issue which has no suggestion
      expect(markdown).toContain('Debug Token');
      expect(markdown).not.toContain('**💡 Recommendation:** undefined');
    });

    it('should limit issues per severity when configured', () => {
      const formatter = new MarkdownOutputFormatter({ maxIssuesPerSeverity: 1 });
      
      // Add more critical issues
      const additionalIssues: SecurityIssue[] = [
        {
          id: 'test-4',
          title: 'Another Critical Issue',
          description: 'Another critical issue',
          file: 'src/test.ts',
          line: 1,
          column: 1,
          severity: 'critical',
          type: 'secret'
        }
      ];
      
      mockResult.issues.push(...additionalIssues);
      mockResult.summary.critical = 2;
      
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('*... and 1 more critical severity issues*');
    });
  });

  describe('Summary Section', () => {
    beforeEach(() => {
      mockResult.summary = {
        critical: 2,
        high: 3,
        medium: 5,
        low: 1,
        info: 0,
      };
      mockResult.issues = new Array(11).fill(null).map((_, i) => ({
        id: `test-${i}`,
        title: `Issue ${i}`,
        description: `Description ${i}`,
        file: `file${i}.ts`,
        line: i + 1,
        column: 1,
        severity: i < 2 ? 'critical' : i < 5 ? 'high' : i < 10 ? 'medium' : 'low',
        type: 'secret'
      })) as SecurityIssue[];
    });

    it('should display correct issue counts', () => {
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('| **Critical** | 2 | 🔴 |');
      expect(markdown).toContain('| **High** | 3 | 🟠 |');
      expect(markdown).toContain('| **Medium** | 5 | 🟡 |');
      expect(markdown).toContain('| **Low** | 1 | 🟢 |');
      expect(markdown).toContain('| **Info** | 0 | ℹ️ |');
    });

    it('should include severity distribution chart', () => {
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('### Severity Distribution');
      expect(markdown).toContain('```');
      expect(markdown).toContain('Critical:');
      expect(markdown).toContain('High:');
      expect(markdown).toContain('Medium:');
      expect(markdown).toContain('Low:');
    });
  });

  describe('Recommendations Section', () => {
    it('should provide excellent security recommendations for clean results', () => {
      const markdown = formatter.format(mockResult, 100);
      
      expect(markdown).toContain('## 💡 Recommendations');
      expect(markdown).toContain('### ✅ Excellent Security Posture');
      expect(markdown).toContain('Regular Scans');
      expect(markdown).toContain('Team Training');
    });

    it('should provide urgent recommendations for critical issues', () => {
      mockResult.summary.critical = 2;
      mockResult.issues = [{
        id: 'test-1',
        title: 'Critical Issue',
        description: 'Critical security issue',
        file: 'test.ts',
        line: 1,
        column: 1,
        severity: 'critical',
        type: 'secret'
      }] as SecurityIssue[];
      
      const markdown = formatter.format(mockResult, 30);
      
      expect(markdown).toContain('### 🚨 **URGENT: Critical Issues Detected**');
      expect(markdown).toContain('You have **2 critical** security issue(s)');
      expect(markdown).toContain('**Stop deployment**');
    });

    it('should provide score-based recommendations', () => {
      mockResult.summary.high = 1;
      
      const lowScoreMarkdown = formatter.format(mockResult, 45);
      expect(lowScoreMarkdown).toContain('### 🔴 **Security Score: 45/100 - Critical**');
      
      const mediumScoreMarkdown = formatter.format(mockResult, 75);
      expect(mediumScoreMarkdown).toContain('### 🟡 **Security Score: 75/100 - Needs Improvement**');
      
      const goodScoreMarkdown = formatter.format(mockResult, 85);
      expect(goodScoreMarkdown).toContain('### 🟢 **Security Score: 85/100 - Good**');
    });

    it('should include general best practices', () => {
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('### 🛡️ **Security Best Practices**');
      expect(markdown).toContain('**Never commit secrets**');
      expect(markdown).toContain('### 🔧 **Using Avana Effectively**');
      expect(markdown).toContain('**Pre-commit hooks**');
    });
  });

  describe('Configuration Options', () => {
    it('should respect includeMetadata option', () => {
      const formatter = new MarkdownOutputFormatter({ includeMetadata: false });
      const markdown = formatter.format(mockResult);
      
      expect(markdown).not.toContain('## 📊 Scan Metadata');
    });

    it('should respect includeSummary option', () => {
      const formatter = new MarkdownOutputFormatter({ includeSummary: false });
      const markdown = formatter.format(mockResult);
      
      expect(markdown).not.toContain('## 📈 Issue Summary');
    });

    it('should respect includeDetails option', () => {
      mockResult.issues = [{
        id: 'test-1',
        title: 'Test Issue',
        description: 'Test description',
        file: 'test.ts',
        line: 1,
        column: 1,
        severity: 'medium',
        type: 'secret',
        pattern: 'test',
        match: 'test'
      }] as SecurityIssue[];
      
      const formatter = new MarkdownOutputFormatter({ includeDetails: false });
      const markdown = formatter.format(mockResult);
      
      expect(markdown).not.toContain('## 🚨 Detected Issues');
      expect(markdown).not.toContain('Test Issue');
    });

    it('should respect includeRecommendations option', () => {
      const formatter = new MarkdownOutputFormatter({ includeRecommendations: false });
      const markdown = formatter.format(mockResult);
      
      expect(markdown).not.toContain('## 💡 Recommendations');
    });

    it('should respect groupBySeverity option', () => {
      mockResult.issues = [
        {
          id: 'test-1',
          title: 'Critical Issue',
          description: 'Critical',
          file: 'test.ts',
          line: 1,
          column: 1,
          severity: 'critical',
          type: 'secret'
        },
        {
          id: 'test-2',
          title: 'High Issue',
          description: 'High',
          file: 'test.ts',
          line: 2,
          column: 1,
          severity: 'high',
          type: 'secret'
        }
      ] as SecurityIssue[];
      
      const formatter = new MarkdownOutputFormatter({ groupBySeverity: false });
      const markdown = formatter.format(mockResult);
      
      expect(markdown).not.toContain('### 🔴 Critical Severity');
      expect(markdown).not.toContain('### 🟠 High Severity');
      expect(markdown).toContain('#### 1. 🔴 Critical Issue');
      expect(markdown).toContain('#### 2. 🟠 High Issue');
    });
  });

  describe('Filename Generation', () => {
    it('should generate filename with default prefix', () => {
      const filename = formatter.generateFilename();
      
      expect(filename).toMatch(/^avana-security-report-\d{4}-\d{2}-\d{2}\.md$/);
    });

    it('should generate filename with custom prefix', () => {
      const filename = formatter.generateFilename('custom-report');
      
      expect(filename).toMatch(/^custom-report-\d{4}-\d{2}-\d{2}\.md$/);
    });

    it('should use current date in filename', () => {
      const today = new Date().toISOString().split('T')[0];
      const filename = formatter.generateFilename();
      
      expect(filename).toContain(today);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty issues array', () => {
      mockResult.issues = [];
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('## ✅ No Issues Found');
      expect(markdown).toContain('Great job! No security issues were detected');
    });

    it('should handle missing optional fields', () => {
      mockResult.issues = [{
        id: 'test-1',
        title: 'Minimal Issue',
        file: 'test.ts',
        line: 1,
        column: 1,
        severity: 'medium',
        type: 'secret',
        description: ''
        // Missing description, suggestion, code
      }] as SecurityIssue[];
      
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('Minimal Issue');
      expect(markdown).not.toContain('| **Description** |');
      expect(markdown).not.toContain('**💡 Recommendation:**');
      expect(markdown).not.toContain('**Code Context:**');
    });

    it('should handle very long issue lists', () => {
      const manyIssues = new Array(100).fill(null).map((_, i) => ({
        id: `test-${i}`,
        title: `Issue ${i}`,
        description: `Description ${i}`,
        file: `file${i}.ts`,
        line: i + 1,
        column: 1,
        severity: 'medium',
        type: 'secret'
      })) as SecurityIssue[];
      
      mockResult.issues = manyIssues;
      mockResult.summary.medium = 100;
      
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('*... and 50 more medium severity issues*');
    });

    it('should handle zero duration', () => {
      mockResult.duration = 0;
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('| **Duration** | 0ms |');
    });

    it('should handle zero files scanned', () => {
      mockResult.filesScanned = 0;
      const markdown = formatter.format(mockResult);
      
      expect(markdown).toContain('| **Files Scanned** | 0 |');
    });
  });
});