/**
 * Avana - Core Types
 * Shared type definitions for security scanning
 */

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type IssueType = 
  | 'secret'
  | 'vulnerability'
  | 'insecure-pattern'
  | 'gitignore'
  | 'configuration';

export interface SecurityIssue {
  id: string;
  type: IssueType;
  severity: SeverityLevel;
  title: string;
  description: string;
  file: string;
  line?: number;
  column?: number;
  code?: string;
  suggestion?: string;
  cve?: string;
  references?: string[];
}

export interface ScanResult {
  success: boolean;
  timestamp: string;
  duration: number;
  filesScanned: number;
  issues: SecurityIssue[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface SecretPattern {
  id: string;
  name: string;
  pattern: RegExp;
  severity: SeverityLevel;
  description: string;
  suggestion: string;
}

export interface VulnerabilityInfo {
  package: string;
  version: string;
  cve: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  fixedIn?: string;
  references: string[];
}

export interface SecurityConfig {
  enabled: boolean;
  scanOnCommit: boolean;
  scanOnPush: boolean;
  blockOnCritical: boolean;
  rules: {
    secrets: {
      enabled: boolean;
      patterns: string[];
    };
    dependencies: {
      enabled: boolean;
      checkVulnerabilities: boolean;
      minSeverity: SeverityLevel;
    };
    codePatterns: {
      enabled: boolean;
      checks: string[];
    };
  };
  ignore: string[];
  notifications: {
    cli: boolean;
    web: boolean;
    email: boolean;
  };
}

export interface ScanOptions {
  path: string;
  config?: SecurityConfig;
  stagedOnly?: boolean;
  includeFiles?: string[];
  verbose?: boolean;
}

export interface FixSuggestion {
  issueId: string;
  type: 'auto' | 'manual';
  description: string;
  commands?: string[];
  fileChanges?: {
    file: string;
    oldContent: string;
    newContent: string;
  }[];
}
