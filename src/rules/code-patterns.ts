/**
 * Avana - Insecure Code Patterns
 * Patterns for detecting security vulnerabilities in code
 */

import type { SecretPattern } from '../types';

/**
 * Insecure code patterns that could lead to security vulnerabilities
 */
export const CODE_PATTERNS: SecretPattern[] = [
  // ============================================
  // Code Execution Vulnerabilities
  // ============================================
  {
    id: 'eval-usage',
    name: 'Eval Usage',
    pattern: /\beval\s*\(/g,
    severity: 'high',
    description: 'eval() can execute arbitrary code and is a security risk',
    suggestion: 'Use safer alternatives like JSON.parse() or Function constructor with validation',
  },
  {
    id: 'function-constructor',
    name: 'Function Constructor with String',
    pattern: /new\s+Function\s*\(\s*['"`][^'"`]*['"`]\s*\)/g,
    severity: 'high',
    description: 'Function constructor with string can execute arbitrary code',
    suggestion: 'Avoid dynamic code execution or use safer alternatives',
  },

  // ============================================
  // SQL Injection Vulnerabilities
  // ============================================
  {
    id: 'sql-concatenation',
    name: 'SQL String Concatenation',
    pattern: /(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE).*\+.*FROM|VALUES/gi,
    severity: 'critical',
    description: 'SQL string concatenation can lead to SQL injection',
    suggestion: 'Use parameterized queries or prepared statements',
  },
  {
    id: 'sql-template-literal',
    name: 'SQL Template Literal',
    pattern: /`(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE).*\$\{.*\}.*`/gi,
    severity: 'critical',
    description: 'SQL template literals with variables can lead to SQL injection',
    suggestion: 'Use parameterized queries instead of template literals',
  },

  // ============================================
  // Command Injection Vulnerabilities
  // ============================================
  {
    id: 'child-process-exec',
    name: 'Child Process Exec with User Input',
    pattern: /exec\s*\(\s*[^)]*\$\{|exec\s*\(\s*[^)]*\+/g,
    severity: 'critical',
    description: 'exec() with user input can lead to command injection',
    suggestion: 'Use execFile() with array arguments or validate input strictly',
  },
  {
    id: 'shell-true',
    name: 'Shell True in Spawn',
    pattern: /spawn\s*\([^)]*shell\s*:\s*true/gi,
    severity: 'high',
    description: 'Using shell:true in spawn can lead to command injection',
    suggestion: 'Avoid shell:true or validate all inputs strictly',
  },

  // ============================================
  // Cryptography Issues
  // ============================================
  {
    id: 'weak-crypto-md5',
    name: 'Weak Cryptography (MD5)',
    pattern: /crypto\.createHash\s*\(\s*['"]md5['"]\s*\)/g,
    severity: 'high',
    description: 'MD5 is cryptographically broken and should not be used',
    suggestion: 'Use SHA-256 or stronger: crypto.createHash("sha256")',
  },
  {
    id: 'weak-crypto-sha1',
    name: 'Weak Cryptography (SHA1)',
    pattern: /crypto\.createHash\s*\(\s*['"]sha1['"]\s*\)/g,
    severity: 'high',
    description: 'SHA1 is deprecated and vulnerable to collision attacks',
    suggestion: 'Use SHA-256 or stronger: crypto.createHash("sha256")',
  },
  {
    id: 'insecure-random',
    name: 'Insecure Random Number Generation',
    pattern: /Math\.random\s*\(\s*\)/g,
    severity: 'medium',
    description: 'Math.random() is not cryptographically secure',
    suggestion: 'Use crypto.randomBytes() for security-sensitive operations',
  },

  // ============================================
  // Path Traversal Vulnerabilities
  // ============================================
  {
    id: 'path-traversal',
    name: 'Path Traversal',
    pattern: /\.\.[\/\\]/g,
    severity: 'high',
    description: 'Path traversal pattern detected - could allow unauthorized file access',
    suggestion: 'Validate and sanitize file paths, use path.resolve() and check if result is within allowed directory',
  },
  {
    id: 'unsafe-file-read',
    name: 'Unsafe File Read',
    pattern: /fs\.(readFile|readFileSync)\s*\([^)]*\$\{|fs\.(readFile|readFileSync)\s*\([^)]*\+/g,
    severity: 'high',
    description: 'Reading files with user-controlled paths can lead to path traversal',
    suggestion: 'Validate file paths and ensure they are within allowed directories',
  },

  // ============================================
  // Deserialization Vulnerabilities
  // ============================================
  {
    id: 'unsafe-yaml-load',
    name: 'Unsafe YAML Load',
    pattern: /yaml\.load\s*\(/g,
    severity: 'critical',
    description: 'yaml.load() can execute arbitrary code',
    suggestion: 'Use yaml.safeLoad() instead',
  },
  {
    id: 'unsafe-pickle',
    name: 'Unsafe Pickle (Python)',
    pattern: /pickle\.loads?\s*\(/g,
    severity: 'critical',
    description: 'pickle.load() can execute arbitrary code',
    suggestion: 'Use JSON or validate pickle data source',
  },

  // ============================================
  // XSS and Injection Vulnerabilities
  // ============================================
  {
    id: 'innerhtml-assignment',
    name: 'innerHTML Assignment',
    pattern: /\.innerHTML\s*=\s*[^;]*\$\{|\.innerHTML\s*=\s*[^;]*\+/g,
    severity: 'high',
    description: 'Setting innerHTML with user input can lead to XSS',
    suggestion: 'Use textContent or sanitize HTML with DOMPurify',
  },
  {
    id: 'dangerously-set-html',
    name: 'Dangerously Set HTML (React)',
    pattern: /dangerouslySetInnerHTML/g,
    severity: 'medium',
    description: 'dangerouslySetInnerHTML can lead to XSS if not sanitized',
    suggestion: 'Sanitize HTML content with DOMPurify before using',
  },

  // ============================================
  // Configuration Issues
  // ============================================
  {
    id: 'hardcoded-localhost',
    name: 'Hardcoded Localhost URL',
    pattern: /['"]https?:\/\/localhost:\d+/g,
    severity: 'low',
    description: 'Hardcoded localhost URLs may cause issues in production',
    suggestion: 'Use environment variables for API endpoints',
  },
  {
    id: 'cors-wildcard',
    name: 'CORS Wildcard',
    pattern: /Access-Control-Allow-Origin['"]?\s*:\s*['"]?\*/g,
    severity: 'medium',
    description: 'CORS wildcard (*) allows any origin to access resources',
    suggestion: 'Specify allowed origins explicitly',
  },

  // ============================================
  // Authentication/Authorization Issues
  // ============================================
  {
    id: 'weak-jwt-secret',
    name: 'Weak JWT Secret',
    pattern: /jwt\.sign\s*\([^)]*['"]secret['"]/gi,
    severity: 'critical',
    description: 'Weak JWT secret detected',
    suggestion: 'Use a strong, randomly generated secret from environment variables',
  },
  {
    id: 'missing-auth-check',
    name: 'Missing Authentication Check',
    pattern: /app\.(get|post|put|delete|patch)\s*\([^)]*\)\s*,\s*(?!.*auth|.*authenticate|.*isAuthenticated)/gi,
    severity: 'medium',
    description: 'Route handler without authentication middleware',
    suggestion: 'Add authentication middleware to protect routes',
  },
];

/**
 * Get all code patterns
 */
export function getAllCodePatterns(): SecretPattern[] {
  return CODE_PATTERNS;
}

/**
 * Get code patterns by severity
 */
export function getCodePatternsBySeverity(severity: 'critical' | 'high' | 'medium' | 'low'): SecretPattern[] {
  return CODE_PATTERNS.filter(p => p.severity === severity);
}

/**
 * Get code pattern by ID
 */
export function getCodePatternById(id: string): SecretPattern | undefined {
  return CODE_PATTERNS.find(p => p.id === id);
}

/**
 * Get pattern count
 */
export function getCodePatternCount(): number {
  return CODE_PATTERNS.length;
}
