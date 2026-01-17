/**
 * Markdown Output Formatter
 * Formats scan results as readable Markdown reports
 */

import type { ScanResult, SecurityIssue } from '../types';

/**
 * Options for Markdown formatting
 */
export interface MarkdownOptions {
  includeMetadata?: boolean;
  includeSummary?: boolean;
  includeDetails?: boolean;
  includeRecommendations?: boolean;
  groupBySeverity?: boolean;
  maxIssuesPerSeverity?: number;
}

/**
 * Markdown Output Formatter class
 * Formats security scan results as readable Markdown reports
 */
export class MarkdownOutputFormatter {
  private options: Required<MarkdownOptions>;

  constructor(options: MarkdownOptions = {}) {
    this.options = {
      includeMetadata: options.includeMetadata ?? true,
      includeSummary: options.includeSummary ?? true,
      includeDetails: options.includeDetails ?? true,
      includeRecommendations: options.includeRecommendations ?? true,
      groupBySeverity: options.groupBySeverity ?? true,
      maxIssuesPerSeverity: options.maxIssuesPerSeverity ?? 50,
    };
  }

  /**
   * Format scan results as Markdown
   */
  public format(result: ScanResult, securityScore?: number): string {
    const sections: string[] = [];

    // Header
    sections.push(this.formatHeader(result, securityScore));

    // Metadata
    if (this.options.includeMetadata) {
      sections.push(this.formatMetadata(result));
    }

    // Summary
    if (this.options.includeSummary) {
      sections.push(this.formatSummary(result));
    }

    // Issues
    if (this.options.includeDetails) {
      sections.push(this.formatIssues(result.issues));
    }

    // Recommendations
    if (this.options.includeRecommendations) {
      sections.push(this.formatRecommendations(result, securityScore));
    }

    return sections.join('\n\n');
  }

  /**
   * Format the report header
   */
  private formatHeader(result: ScanResult, securityScore?: number): string {
    const timestamp = new Date(result.timestamp).toLocaleString();
    const scoreText = securityScore !== undefined ? ` (Score: ${securityScore}/100)` : '';
    
    return `# 🔒 Avana Security Scan Report${scoreText}

**Generated:** ${timestamp}  
**Status:** ${result.issues.length === 0 ? '✅ No Issues Found' : '⚠️ Issues Detected'}`;
  }

  /**
   * Format metadata section
   */
  private formatMetadata(result: ScanResult): string {
    return `## 📊 Scan Metadata

| Metric | Value |
|--------|-------|
| **Duration** | ${result.duration}ms |
| **Files Scanned** | ${result.filesScanned} |
| **Total Issues** | ${result.issues.length} |
| **Timestamp** | ${result.timestamp} |`;
  }

  /**
   * Format summary section
   */
  private formatSummary(result: ScanResult): string {
    const { critical, high, medium, low, info } = result.summary;
    
    let summary = `## 📈 Issue Summary

| Severity | Count | Icon |
|----------|-------|------|
| **Critical** | ${critical} | 🔴 |
| **High** | ${high} | 🟠 |
| **Medium** | ${medium} | 🟡 |
| **Low** | ${low} | 🟢 |
| **Info** | ${info} | ℹ️ |`;

    // Add severity distribution chart (simple text-based)
    if (result.issues.length > 0) {
      summary += '\n\n### Severity Distribution\n\n```\n';
      const total = result.issues.length;
      const criticalBar = '█'.repeat(Math.round((critical / total) * 20));
      const highBar = '█'.repeat(Math.round((high / total) * 20));
      const mediumBar = '█'.repeat(Math.round((medium / total) * 20));
      const lowBar = '█'.repeat(Math.round((low / total) * 20));
      
      summary += `Critical: ${criticalBar} ${critical}\n`;
      summary += `High:     ${highBar} ${high}\n`;
      summary += `Medium:   ${mediumBar} ${medium}\n`;
      summary += `Low:      ${lowBar} ${low}\n`;
      summary += '```';
    }

    return summary;
  }

  /**
   * Format issues section
   */
  private formatIssues(issues: SecurityIssue[]): string {
    if (issues.length === 0) {
      return '## ✅ No Issues Found\n\nGreat job! No security issues were detected in your codebase.';
    }

    let issuesSection = '## 🚨 Detected Issues\n';

    if (this.options.groupBySeverity) {
      issuesSection += this.formatIssuesBySeverity(issues);
    } else {
      issuesSection += this.formatIssuesList(issues);
    }

    return issuesSection;
  }

  /**
   * Format issues grouped by severity
   */
  private formatIssuesBySeverity(issues: SecurityIssue[]): string {
    const severityOrder: Array<SecurityIssue['severity']> = ['critical', 'high', 'medium', 'low', 'info'];
    const severityIcons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢',
      info: 'ℹ️'
    };

    let output = '';

    for (const severity of severityOrder) {
      const severityIssues = issues.filter(issue => issue.severity === severity);
      
      if (severityIssues.length === 0) continue;

      const icon = severityIcons[severity];
      const title = severity.charAt(0).toUpperCase() + severity.slice(1);
      
      output += `\n### ${icon} ${title} Severity (${severityIssues.length} issues)\n\n`;

      const issuesToShow = severityIssues.slice(0, this.options.maxIssuesPerSeverity);
      
      for (let i = 0; i < issuesToShow.length; i++) {
        const issue = issuesToShow[i];
        output += this.formatSingleIssue(issue, i + 1);
      }

      if (severityIssues.length > this.options.maxIssuesPerSeverity) {
        const remaining = severityIssues.length - this.options.maxIssuesPerSeverity;
        output += `\n*... and ${remaining} more ${severity} severity issues*\n`;
      }
    }

    return output;
  }

  /**
   * Format issues as a simple list
   */
  private formatIssuesList(issues: SecurityIssue[]): string {
    let output = '\n';
    
    const issuesToShow = issues.slice(0, this.options.maxIssuesPerSeverity);
    
    for (let i = 0; i < issuesToShow.length; i++) {
      output += this.formatSingleIssue(issuesToShow[i], i + 1);
    }

    if (issues.length > this.options.maxIssuesPerSeverity) {
      const remaining = issues.length - this.options.maxIssuesPerSeverity;
      output += `\n*... and ${remaining} more issues*\n`;
    }

    return output;
  }

  /**
   * Format a single issue
   */
  private formatSingleIssue(issue: SecurityIssue, index: number): string {
    const severityIcon = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢',
      info: 'ℹ️'
    }[issue.severity];

    let output = `#### ${index}. ${severityIcon} ${issue.title}\n\n`;
    
    // Issue details table
    output += '| Detail | Value |\n';
    output += '|--------|-------|\n';
    output += `| **File** | \`${issue.file}\` |\n`;
    output += `| **Line** | ${issue.line} |\n`;
    output += `| **Severity** | ${severityIcon} ${issue.severity.toUpperCase()} |\n`;
    output += `| **Type** | ${issue.type} |\n`;
    
    if (issue.description) {
      output += `| **Description** | ${issue.description} |\n`;
    }

    // Code context if available
    if (issue.code) {
      output += '\n**Code Context:**\n\n```\n';
      output += issue.code;
      output += '\n```\n';
    }

    // Suggestion if available
    if (issue.suggestion) {
      output += `\n**💡 Recommendation:** ${issue.suggestion}\n`;
    }

    output += '\n---\n\n';

    return output;
  }

  /**
   * Format recommendations section
   */
  private formatRecommendations(result: ScanResult, securityScore?: number): string {
    let recommendations = '## 💡 Recommendations\n\n';

    const totalIssues = result.summary.critical + result.summary.high + result.summary.medium + result.summary.low + result.summary.info;

    if (totalIssues === 0) {
      recommendations += `### ✅ Excellent Security Posture

Your codebase shows no security issues! Here are some tips to maintain this level:

- **Regular Scans**: Run Avana regularly, especially before commits
- **Team Training**: Ensure all team members understand secure coding practices
- **Dependency Updates**: Keep dependencies updated to avoid known vulnerabilities
- **Code Reviews**: Include security considerations in your code review process`;
    } else {
      const { critical, high, medium, low } = result.summary;
      
      if (critical > 0) {
        recommendations += `### 🚨 **URGENT: Critical Issues Detected**

You have **${critical} critical** security issue(s) that require immediate attention:

- **Stop deployment** until these are resolved
- **Review all critical issues** listed above
- **Implement fixes** as suggested
- **Re-scan** to verify fixes

`;
      }

      if (high > 0) {
        recommendations += `### ⚠️ **High Priority Issues**

You have **${high} high** severity issue(s):

- **Address within 24-48 hours**
- **Review security implications** carefully
- **Test fixes thoroughly** before deployment

`;
      }

      if (medium > 0 || low > 0) {
        recommendations += `### 📋 **General Improvements**

You have **${medium} medium** and **${low} low** severity issues:

- **Plan fixes** in upcoming development cycles
- **Consider security impact** during code reviews
- **Document any accepted risks**

`;
      }

      // Score-based recommendations
      if (securityScore !== undefined) {
        if (securityScore < 50) {
          recommendations += `### 🔴 **Security Score: ${securityScore}/100 - Critical**

Your security score is critically low. Immediate action required:

1. **Address all critical and high issues** immediately
2. **Implement security training** for the development team
3. **Establish security review process** for all code changes
4. **Consider security audit** by external experts`;
        } else if (securityScore < 80) {
          recommendations += `### 🟡 **Security Score: ${securityScore}/100 - Needs Improvement**

Your security score indicates room for improvement:

1. **Prioritize high and medium issues**
2. **Establish regular security scanning**
3. **Improve secure coding practices**
4. **Consider automated security testing**`;
        } else {
          recommendations += `### 🟢 **Security Score: ${securityScore}/100 - Good**

Your security score is good! To maintain and improve:

1. **Address remaining issues** when possible
2. **Maintain regular scanning habits**
3. **Keep security practices up to date**
4. **Share knowledge** with your team`;
        }
      }
    }

    // General best practices
    recommendations += `

### 🛡️ **Security Best Practices**

- **Never commit secrets** to version control
- **Use environment variables** for sensitive configuration
- **Implement proper access controls** for production systems
- **Regular security training** for all developers
- **Automated security scanning** in CI/CD pipelines
- **Keep dependencies updated** and monitor for vulnerabilities

### 🔧 **Using Avana Effectively**

- **Pre-commit hooks**: Run \`avana install\` to catch issues before commits
- **CI/CD integration**: Add Avana to your build pipeline
- **Regular scans**: Schedule periodic security scans
- **Team adoption**: Ensure all team members use Avana consistently`;

    return recommendations;
  }

  /**
   * Generate a filename for the markdown report
   */
  public generateFilename(prefix: string = 'avana-security-report'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    return `${prefix}-${timestamp}.md`;
  }
}