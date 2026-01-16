/**
 * Avana - Additional Secret Patterns
 * Extended patterns for less common but still important services
 */

import type { SecretPattern } from '../types';

/**
 * Additional secret patterns for specialized services
 * NOTE: Only includes high-confidence patterns with specific prefixes or context
 */
export const ADDITIONAL_SECRET_PATTERNS: SecretPattern[] = [
  // ============================================
  // Analytics & Monitoring
  // ============================================
  {
    id: 'new-relic-key',
    name: 'New Relic License Key',
    pattern: /NRAK-[A-Z0-9]{27}/g,
    severity: 'high',
    description: 'New Relic license key detected',
    suggestion: 'Move to environment variable: NEW_RELIC_LICENSE_KEY',
  },
  {
    id: 'sentry-dsn',
    name: 'Sentry DSN',
    pattern: /https:\/\/[a-f0-9]{32}@[a-z0-9]+\.ingest\.sentry\.io\/[0-9]+/g,
    severity: 'medium',
    description: 'Sentry DSN detected',
    suggestion: 'Move to environment variable: SENTRY_DSN',
  },

  // ============================================
  // CI/CD & DevOps
  // ============================================
  {
    id: 'docker-hub-token',
    name: 'Docker Hub Token',
    pattern: /dckr_pat_[a-zA-Z0-9_-]{36}/g,
    severity: 'critical',
    description: 'Docker Hub access token detected',
    suggestion: 'Revoke token and use Docker secrets',
  },
  {
    id: 'npm-token',
    name: 'NPM Token',
    pattern: /npm_[a-zA-Z0-9]{36}/g,
    severity: 'critical',
    description: 'NPM access token detected',
    suggestion: 'Revoke token and use .npmrc with environment variable',
  },

  // ============================================
  // Social Media & Marketing
  // ============================================
  {
    id: 'facebook-access-token',
    name: 'Facebook Access Token',
    pattern: /EAACEdEose0cBA[0-9A-Za-z]+/g,
    severity: 'high',
    description: 'Facebook access token detected',
    suggestion: 'Revoke token and move to environment variable',
  },
  {
    id: 'twitter-bearer-token',
    name: 'Twitter Bearer Token',
    pattern: /AAAAAAAAAAAAAAAAAAAAAA[a-zA-Z0-9%]+/g,
    severity: 'critical',
    description: 'Twitter Bearer token detected',
    suggestion: 'Revoke token and move to environment variable',
  },

  // ============================================
  // Storage & CDN
  // ============================================
  {
    id: 'digitalocean-token',
    name: 'DigitalOcean Token',
    pattern: /dop_v1_[a-f0-9]{64}/g,
    severity: 'critical',
    description: 'DigitalOcean access token detected',
    suggestion: 'Revoke token and move to environment variable',
  },
  {
    id: 'heroku-api-key',
    name: 'Heroku API Key',
    pattern: /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g,
    severity: 'critical',
    description: 'Heroku API key detected',
    suggestion: 'Revoke key and use Heroku config vars',
  },

  // ============================================
  // Search & Database Services
  // ============================================
  {
    id: 'elasticsearch-password',
    name: 'Elasticsearch Password',
    pattern: /elastic:[^@]+@/gi,
    severity: 'critical',
    description: 'Elasticsearch credentials detected',
    suggestion: 'Move to environment variable: ELASTICSEARCH_URL',
  },

  // ============================================
  // Authentication Services
  // ============================================
  {
    id: 'okta-api-token',
    name: 'Okta API Token',
    pattern: /00[a-zA-Z0-9_-]{40}/g,
    severity: 'critical',
    description: 'Okta API token detected',
    suggestion: 'Revoke token and move to environment variable',
  },
  {
    id: 'firebase-api-key',
    name: 'Firebase API Key',
    pattern: /AIza[0-9A-Za-z\-_]{35}/g,
    severity: 'high',
    description: 'Firebase API key detected',
    suggestion: 'Move to environment variable and restrict API key',
  },

  // ============================================
  // Cryptocurrency & Blockchain
  // ============================================
  {
    id: 'ethereum-private-key',
    name: 'Ethereum Private Key',
    pattern: /0x[a-fA-F0-9]{64}/g,
    severity: 'critical',
    description: 'Ethereum private key detected',
    suggestion: 'Remove immediately and use hardware wallet',
  },

  // ============================================
  // Miscellaneous Services
  // ============================================
  {
    id: 'shopify-token',
    name: 'Shopify Access Token',
    pattern: /shpat_[a-fA-F0-9]{32}/g,
    severity: 'critical',
    description: 'Shopify access token detected',
    suggestion: 'Revoke token and move to environment variable',
  },
  {
    id: 'shopify-shared-secret',
    name: 'Shopify Shared Secret',
    pattern: /shpss_[a-fA-F0-9]{32}/g,
    severity: 'critical',
    description: 'Shopify shared secret detected',
    suggestion: 'Move to environment variable: SHOPIFY_SHARED_SECRET',
  },
  {
    id: 'airtable-api-key',
    name: 'Airtable API Key',
    pattern: /key[a-zA-Z0-9]{14}/g,
    severity: 'high',
    description: 'Airtable API key detected',
    suggestion: 'Move to environment variable: AIRTABLE_API_KEY',
  },
  {
    id: 'notion-token',
    name: 'Notion Integration Token',
    pattern: /secret_[a-zA-Z0-9]{43}/g,
    severity: 'high',
    description: 'Notion integration token detected',
    suggestion: 'Move to environment variable: NOTION_TOKEN',
  },
];

export function getAdditionalSecretPatterns(): SecretPattern[] {
  return ADDITIONAL_SECRET_PATTERNS;
}
