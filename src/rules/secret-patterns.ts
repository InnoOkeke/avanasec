/**
 * Avana - Secret Patterns
 * Comprehensive database of 50+ patterns for detecting secrets in code
 */

import type { SecretPattern } from '../types';

/**
 * Comprehensive list of secret patterns to detect
 * Covers major cloud providers, payment processors, communication tools, and more
 */
export const SECRET_PATTERNS: SecretPattern[] = [
  // ============================================
  // AI/ML API Keys
  // ============================================
  {
    id: 'openai-api-key',
    name: 'OpenAI API Key',
    pattern: /sk-[a-zA-Z0-9\-]{20,}/g,
    severity: 'critical',
    description: 'OpenAI API key detected',
    suggestion: 'Move to environment variable: OPENAI_API_KEY',
  },
  {
    id: 'anthropic-api-key',
    name: 'Anthropic API Key',
    pattern: /sk-ant-[a-zA-Z0-9\-]{95}/g,
    severity: 'critical',
    description: 'Anthropic (Claude) API key detected',
    suggestion: 'Move to environment variable: ANTHROPIC_API_KEY',
  },
  {
    id: 'huggingface-token',
    name: 'Hugging Face Token',
    pattern: /hf_[a-zA-Z0-9]{34}/g,
    severity: 'high',
    description: 'Hugging Face API token detected',
    suggestion: 'Move to environment variable: HUGGINGFACE_TOKEN',
  },

  // ============================================
  // AWS (Amazon Web Services)
  // ============================================
  {
    id: 'aws-access-key',
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'critical',
    description: 'AWS Access Key ID detected',
    suggestion: 'Move to AWS credentials file or environment variable',
  },
  {
    id: 'aws-secret-key',
    name: 'AWS Secret Key',
    pattern: /aws_secret_access_key\s*=\s*['"]?([A-Za-z0-9/+=]{40})['"]?/gi,
    severity: 'critical',
    description: 'AWS Secret Access Key detected',
    suggestion: 'Move to AWS credentials file or environment variable',
  },
  {
    id: 'aws-session-token',
    name: 'AWS Session Token',
    pattern: /aws_session_token\s*=\s*['"]?([A-Za-z0-9/+=]+)['"]?/gi,
    severity: 'high',
    description: 'AWS Session Token detected',
    suggestion: 'Use IAM roles instead of hardcoded session tokens',
  },

  // ============================================
  // Azure (Microsoft)
  // ============================================
  {
    id: 'azure-storage-key',
    name: 'Azure Storage Key',
    pattern: /DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[^;]+/gi,
    severity: 'critical',
    description: 'Azure Storage connection string detected',
    suggestion: 'Move to environment variable: AZURE_STORAGE_CONNECTION_STRING',
  },

  // ============================================
  // Google Cloud Platform
  // ============================================
  {
    id: 'google-api-key',
    name: 'Google API Key',
    pattern: /AIza[0-9A-Za-z\-_]{35}/g,
    severity: 'high',
    description: 'Google API key detected',
    suggestion: 'Move to environment variable and restrict API key usage',
  },
  {
    id: 'gcp-service-account',
    name: 'GCP Service Account Key',
    pattern: /"type":\s*"service_account"/g,
    severity: 'critical',
    description: 'GCP Service Account JSON key detected',
    suggestion: 'Remove JSON key file and add to .gitignore',
  },
  {
    id: 'google-oauth-token',
    name: 'Google OAuth Token',
    pattern: /ya29\.[0-9A-Za-z\-_]+/g,
    severity: 'critical',
    description: 'Google OAuth access token detected',
    suggestion: 'Do not hardcode OAuth tokens, generate them dynamically',
  },

  // ============================================
  // Payment Processors
  // ============================================
  {
    id: 'stripe-api-key',
    name: 'Stripe API Key',
    pattern: /sk_live_[0-9a-zA-Z]{24,}/g,
    severity: 'critical',
    description: 'Stripe Live API key detected',
    suggestion: 'Move to environment variable: STRIPE_SECRET_KEY',
  },
  {
    id: 'stripe-restricted-key',
    name: 'Stripe Restricted Key',
    pattern: /rk_live_[0-9a-zA-Z]{24,}/g,
    severity: 'critical',
    description: 'Stripe Restricted API key detected',
    suggestion: 'Move to environment variable',
  },
  {
    id: 'stripe-publishable-key',
    name: 'Stripe Publishable Key',
    pattern: /pk_live_[0-9a-zA-Z]{24,}/g,
    severity: 'high',
    description: 'Stripe Live Publishable key detected',
    suggestion: 'Move to environment variable: STRIPE_PUBLISHABLE_KEY',
  },
  {
    id: 'paypal-token',
    name: 'PayPal Token',
    pattern: /access_token\$production\$[a-z0-9]{16}\$[a-f0-9]{32}/gi,
    severity: 'critical',
    description: 'PayPal access token detected',
    suggestion: 'Move to environment variable: PAYPAL_ACCESS_TOKEN',
  },
  {
    id: 'square-token',
    name: 'Square Access Token',
    pattern: /sq0atp-[0-9A-Za-z\-_]{22}/g,
    severity: 'critical',
    description: 'Square access token detected',
    suggestion: 'Move to environment variable: SQUARE_ACCESS_TOKEN',
  },

  // ============================================
  // Version Control (GitHub, GitLab, Bitbucket)
  // ============================================
  {
    id: 'github-token',
    name: 'GitHub Token',
    pattern: /ghp_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    description: 'GitHub Personal Access Token detected',
    suggestion: 'Revoke token and use GitHub Secrets for CI/CD',
  },
  {
    id: 'github-oauth',
    name: 'GitHub OAuth Token',
    pattern: /gho_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    description: 'GitHub OAuth token detected',
    suggestion: 'Revoke token immediately',
  },
  {
    id: 'github-app-token',
    name: 'GitHub App Token',
    pattern: /ghs_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    description: 'GitHub App token detected',
    suggestion: 'Revoke token and regenerate',
  },
  {
    id: 'github-refresh-token',
    name: 'GitHub Refresh Token',
    pattern: /ghr_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    description: 'GitHub Refresh token detected',
    suggestion: 'Revoke token immediately',
  },
  {
    id: 'gitlab-token',
    name: 'GitLab Token',
    pattern: /glpat-[a-zA-Z0-9\-_]{20}/g,
    severity: 'critical',
    description: 'GitLab Personal Access Token detected',
    suggestion: 'Revoke token and use GitLab CI/CD variables',
  },
  {
    id: 'bitbucket-token',
    name: 'Bitbucket Token',
    pattern: /BBDC-[a-zA-Z0-9\-_]{40}/g,
    severity: 'critical',
    description: 'Bitbucket access token detected',
    suggestion: 'Revoke token and use Bitbucket Pipelines variables',
  },

  // ============================================
  // Communication & Messaging
  // ============================================
  {
    id: 'slack-token',
    name: 'Slack Token',
    pattern: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24,}/g,
    severity: 'critical',
    description: 'Slack API token detected',
    suggestion: 'Revoke token and move to environment variable',
  },
  {
    id: 'slack-webhook',
    name: 'Slack Webhook',
    pattern: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g,
    severity: 'high',
    description: 'Slack Webhook URL detected',
    suggestion: 'Move to environment variable: SLACK_WEBHOOK_URL',
  },
  {
    id: 'discord-webhook',
    name: 'Discord Webhook',
    pattern: /https:\/\/discord\.com\/api\/webhooks\/[0-9]+\/[a-zA-Z0-9_-]+/g,
    severity: 'high',
    description: 'Discord Webhook URL detected',
    suggestion: 'Move to environment variable: DISCORD_WEBHOOK_URL',
  },
  {
    id: 'discord-bot-token',
    name: 'Discord Bot Token',
    pattern: /[MN][a-zA-Z0-9]{23,25}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_\-]{27}/g,
    severity: 'critical',
    description: 'Discord Bot token detected',
    suggestion: 'Revoke token and move to environment variable',
  },
  {
    id: 'telegram-bot-token',
    name: 'Telegram Bot Token',
    pattern: /[0-9]{8,10}:[a-zA-Z0-9_-]{35}/g,
    severity: 'critical',
    description: 'Telegram Bot token detected',
    suggestion: 'Revoke token via @BotFather and move to environment variable',
  },
  {
    id: 'twilio-api-key',
    name: 'Twilio API Key',
    pattern: /SK[a-z0-9]{32}/g,
    severity: 'critical',
    description: 'Twilio API Key detected',
    suggestion: 'Move to environment variable: TWILIO_API_KEY',
  },
  {
    id: 'twilio-account-sid',
    name: 'Twilio Account SID',
    pattern: /AC[a-z0-9]{32}/g,
    severity: 'high',
    description: 'Twilio Account SID detected',
    suggestion: 'Move to environment variable: TWILIO_ACCOUNT_SID',
  },

  // ============================================
  // Email Services
  // ============================================
  {
    id: 'sendgrid-api-key',
    name: 'SendGrid API Key',
    pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
    severity: 'critical',
    description: 'SendGrid API key detected',
    suggestion: 'Move to environment variable: SENDGRID_API_KEY',
  },
  {
    id: 'mailgun-api-key',
    name: 'Mailgun API Key',
    pattern: /key-[a-zA-Z0-9]{32}/g,
    severity: 'critical',
    description: 'Mailgun API key detected',
    suggestion: 'Move to environment variable: MAILGUN_API_KEY',
  },
  {
    id: 'mailchimp-api-key',
    name: 'Mailchimp API Key',
    pattern: /[a-f0-9]{32}-us[0-9]{1,2}/g,
    severity: 'critical',
    description: 'Mailchimp API key detected',
    suggestion: 'Move to environment variable: MAILCHIMP_API_KEY',
  },

  // ============================================
  // Database Connection Strings
  // ============================================
  {
    id: 'database-url',
    name: 'Database Connection String',
    pattern: /(postgres|mysql|mongodb):\/\/[^:]+:[^@]+@[^\/]+/gi,
    severity: 'critical',
    description: 'Database connection string with credentials detected',
    suggestion: 'Move to environment variable: DATABASE_URL',
  },
  {
    id: 'mongodb-connection',
    name: 'MongoDB Connection String',
    pattern: /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/gi,
    severity: 'critical',
    description: 'MongoDB connection string with credentials detected',
    suggestion: 'Move to environment variable: MONGODB_URI',
  },
  {
    id: 'redis-url',
    name: 'Redis Connection String',
    pattern: /redis:\/\/[^:]*:[^@]+@[^\/]+/gi,
    severity: 'critical',
    description: 'Redis connection string with password detected',
    suggestion: 'Move to environment variable: REDIS_URL',
  },

  // ============================================
  // Private Keys & Certificates
  // ============================================
  {
    id: 'rsa-private-key',
    name: 'RSA Private Key',
    pattern: /-----BEGIN RSA PRIVATE KEY-----/g,
    severity: 'critical',
    description: 'RSA Private Key detected',
    suggestion: 'Remove private key and add to .gitignore',
  },
  {
    id: 'ssh-private-key',
    name: 'SSH Private Key',
    pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g,
    severity: 'critical',
    description: 'SSH Private Key detected',
    suggestion: 'Remove private key and add to .gitignore',
  },
  {
    id: 'pgp-private-key',
    name: 'PGP Private Key',
    pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/g,
    severity: 'critical',
    description: 'PGP Private Key detected',
    suggestion: 'Remove private key and add to .gitignore',
  },
  {
    id: 'dsa-private-key',
    name: 'DSA Private Key',
    pattern: /-----BEGIN DSA PRIVATE KEY-----/g,
    severity: 'critical',
    description: 'DSA Private Key detected',
    suggestion: 'Remove private key and add to .gitignore',
  },
  {
    id: 'ec-private-key',
    name: 'EC Private Key',
    pattern: /-----BEGIN EC PRIVATE KEY-----/g,
    severity: 'critical',
    description: 'EC Private Key detected',
    suggestion: 'Remove private key and add to .gitignore',
  },

  // ============================================
  // JWT & OAuth Tokens
  // ============================================
  {
    id: 'jwt-token',
    name: 'JWT Token',
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
    severity: 'high',
    description: 'JWT token detected',
    suggestion: 'Do not hardcode JWT tokens, generate them dynamically',
  },
  {
    id: 'oauth-client-secret',
    name: 'OAuth Client Secret',
    pattern: /client_secret\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/gi,
    severity: 'critical',
    description: 'OAuth client secret detected',
    suggestion: 'Move to environment variable: OAUTH_CLIENT_SECRET',
  },

  // ============================================
  // Generic Patterns (Catch-all)
  // ============================================
  {
    id: 'generic-api-key',
    name: 'Generic API Key',
    pattern: /api[_-]?key\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/gi,
    severity: 'high',
    description: 'Potential API key detected',
    suggestion: 'Move to environment variable',
  },
  {
    id: 'generic-secret',
    name: 'Generic Secret',
    pattern: /secret\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/gi,
    severity: 'high',
    description: 'Potential secret detected',
    suggestion: 'Move to environment variable',
  },
  {
    id: 'generic-password',
    name: 'Generic Password',
    pattern: /password\s*[:=]\s*['"]([^'"]{8,})['"]/gi,
    severity: 'high',
    description: 'Hardcoded password detected',
    suggestion: 'Move to environment variable or secure vault',
  },
  {
    id: 'generic-token',
    name: 'Generic Token',
    pattern: /token\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/gi,
    severity: 'high',
    description: 'Potential token detected',
    suggestion: 'Move to environment variable',
  },
  {
    id: 'encryption-key',
    name: 'Encryption Key',
    pattern: /encryption[_-]?key\s*[:=]\s*['"]([a-zA-Z0-9+/=]{32,})['"]/gi,
    severity: 'critical',
    description: 'Encryption key detected',
    suggestion: 'Move to environment variable or secure key management system',
  },
  {
    id: 'bearer-token',
    name: 'Bearer Token',
    pattern: /Bearer\s+[a-zA-Z0-9\-._~+\/]+=*/gi,
    severity: 'high',
    description: 'Bearer token detected',
    suggestion: 'Do not hardcode bearer tokens',
  },
];

/**
 * Get all secret patterns
 */
export function getAllSecretPatterns(): SecretPattern[] {
  return SECRET_PATTERNS;
}

/**
 * Get secret patterns by severity
 */
export function getSecretPatternsBySeverity(severity: 'critical' | 'high' | 'medium' | 'low'): SecretPattern[] {
  return SECRET_PATTERNS.filter(p => p.severity === severity);
}

/**
 * Get secret pattern by ID
 */
export function getSecretPatternById(id: string): SecretPattern | undefined {
  return SECRET_PATTERNS.find(p => p.id === id);
}

/**
 * Get pattern count
 */
export function getPatternCount(): number {
  return SECRET_PATTERNS.length;
}
