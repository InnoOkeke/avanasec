/**
 * Avana - Secret Patterns
 * Comprehensive database of 100+ patterns for detecting secrets in code
 */

import type { SecretPattern } from '../types';

/**
 * Comprehensive list of secret patterns to detect
 * Covers major cloud providers, payment processors, communication tools, Web3/blockchain networks,
 * DeFi protocols, NFT platforms, blockchain analytics services, and more
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
  {
    id: 'plaid-api-key',
    name: 'Plaid API Key',
    pattern: /plaid[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'critical',
    description: 'Plaid API key detected',
    suggestion: 'Move to environment variable: PLAID_CLIENT_ID',
  },
  {
    id: 'plaid-secret',
    name: 'Plaid Secret',
    pattern: /plaid[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'critical',
    description: 'Plaid secret key detected',
    suggestion: 'Move to environment variable: PLAID_SECRET',
  },
  {
    id: 'dwolla-key',
    name: 'Dwolla API Key',
    pattern: /dwolla[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Dwolla API key detected',
    suggestion: 'Move to environment variable: DWOLLA_KEY',
  },
  {
    id: 'wise-api-key',
    name: 'Wise (TransferWise) API Key',
    pattern: /wise[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'Wise (TransferWise) API key detected',
    suggestion: 'Move to environment variable: WISE_API_KEY',
  },
  {
    id: 'revolut-api-key',
    name: 'Revolut API Key',
    pattern: /revolut[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Revolut API key detected',
    suggestion: 'Move to environment variable: REVOLUT_API_KEY',
  },

  // ============================================
  // On/Off Ramp Providers
  // ============================================
  {
    id: 'moonpay-api-key',
    name: 'MoonPay API Key',
    pattern: /moonpay[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'MoonPay API key detected',
    suggestion: 'Move to environment variable: MOONPAY_API_KEY',
  },
  {
    id: 'simplex-api-key',
    name: 'Simplex API Key',
    pattern: /simplex[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'critical',
    description: 'Simplex API key detected',
    suggestion: 'Move to environment variable: SIMPLEX_API_KEY',
  },
  {
    id: 'ramp-network-key',
    name: 'Ramp Network API Key',
    pattern: /ramp[^a-zA-Z0-9]*network[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Ramp Network API key detected',
    suggestion: 'Move to environment variable: RAMP_API_KEY',
  },
  {
    id: 'transak-api-key',
    name: 'Transak API Key',
    pattern: /transak[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'Transak API key detected',
    suggestion: 'Move to environment variable: TRANSAK_API_KEY',
  },
  {
    id: 'wyre-api-key',
    name: 'Wyre API Key',
    pattern: /wyre[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Wyre API key detected',
    suggestion: 'Move to environment variable: WYRE_API_KEY',
  },
  {
    id: 'banxa-api-key',
    name: 'Banxa API Key',
    pattern: /banxa[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Banxa API key detected',
    suggestion: 'Move to environment variable: BANXA_API_KEY',
  },
  {
    id: 'mercuryo-api-key',
    name: 'Mercuryo API Key',
    pattern: /mercuryo[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'critical',
    description: 'Mercuryo API key detected',
    suggestion: 'Move to environment variable: MERCURYO_API_KEY',
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
  {
    id: 'postmark-api-key',
    name: 'Postmark API Key',
    pattern: /postmark[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'Postmark API key detected',
    suggestion: 'Move to environment variable: POSTMARK_API_KEY',
  },
  {
    id: 'aws-ses-key',
    name: 'AWS SES API Key',
    pattern: /ses[^a-zA-Z0-9]*[A-Z0-9]{20}/gi,
    severity: 'critical',
    description: 'AWS SES API key detected',
    suggestion: 'Move to environment variable: AWS_SES_ACCESS_KEY',
  },
  {
    id: 'resend-api-key',
    name: 'Resend API Key',
    pattern: /re_[a-zA-Z0-9]{24}/g,
    severity: 'critical',
    description: 'Resend API key detected',
    suggestion: 'Move to environment variable: RESEND_API_KEY',
  },
  {
    id: 'convertkit-api-key',
    name: 'ConvertKit API Key',
    pattern: /convertkit[^a-zA-Z0-9]*[a-zA-Z0-9]{32}/gi,
    severity: 'critical',
    description: 'ConvertKit API key detected',
    suggestion: 'Move to environment variable: CONVERTKIT_API_KEY',
  },
  {
    id: 'emailjs-key',
    name: 'EmailJS API Key',
    pattern: /emailjs[^a-zA-Z0-9]*[a-zA-Z0-9_-]{20,}/gi,
    severity: 'high',
    description: 'EmailJS API key detected',
    suggestion: 'Move to environment variable: EMAILJS_API_KEY',
  },
  {
    id: 'brevo-api-key',
    name: 'Brevo (Sendinblue) API Key',
    pattern: /brevo[^a-zA-Z0-9]*[a-zA-Z0-9_-]{64}/gi,
    severity: 'critical',
    description: 'Brevo (Sendinblue) API key detected',
    suggestion: 'Move to environment variable: BREVO_API_KEY',
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
  {
    id: 'supabase-key',
    name: 'Supabase API Key',
    pattern: /supabase[^a-zA-Z0-9]*[a-zA-Z0-9_-]{64}/gi,
    severity: 'critical',
    description: 'Supabase API key detected',
    suggestion: 'Move to environment variable: SUPABASE_ANON_KEY',
  },
  {
    id: 'supabase-service-key',
    name: 'Supabase Service Key',
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*.*supabase/gi,
    severity: 'critical',
    description: 'Supabase service role key detected',
    suggestion: 'Move to environment variable: SUPABASE_SERVICE_ROLE_KEY',
  },
  {
    id: 'planetscale-password',
    name: 'PlanetScale Password',
    pattern: /planetscale[^a-zA-Z0-9]*[a-zA-Z0-9_-]{20,}/gi,
    severity: 'critical',
    description: 'PlanetScale database password detected',
    suggestion: 'Move to environment variable: PLANETSCALE_PASSWORD',
  },
  {
    id: 'neon-api-key',
    name: 'Neon API Key',
    pattern: /neon[^a-zA-Z0-9]*[a-zA-Z0-9_-]{64}/gi,
    severity: 'critical',
    description: 'Neon database API key detected',
    suggestion: 'Move to environment variable: NEON_API_KEY',
  },
  {
    id: 'upstash-token',
    name: 'Upstash Redis Token',
    pattern: /upstash[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Upstash Redis token detected',
    suggestion: 'Move to environment variable: UPSTASH_REDIS_REST_TOKEN',
  },
  {
    id: 'railway-token',
    name: 'Railway API Token',
    pattern: /railway[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'Railway API token detected',
    suggestion: 'Move to environment variable: RAILWAY_TOKEN',
  },
  {
    id: 'cockroachdb-url',
    name: 'CockroachDB Connection String',
    pattern: /cockroachdb:\/\/[^:]+:[^@]+@[^\/]+/gi,
    severity: 'critical',
    description: 'CockroachDB connection string detected',
    suggestion: 'Move to environment variable: COCKROACH_DATABASE_URL',
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
  // Web3/Blockchain/Cryptocurrency
  // ============================================
  {
    id: 'evm-private-key',
    name: 'EVM-Compatible Private Key',
    pattern: /0x[a-fA-F0-9]{64}/g,
    severity: 'critical',
    description: 'EVM-compatible private key detected (Ethereum, Polygon, BSC, Arbitrum, Optimism, Fantom, etc.)',
    suggestion: 'Remove private key immediately and use secure key management',
  },
  {
    id: 'bitcoin-private-key-wif',
    name: 'Bitcoin Private Key (WIF)',
    pattern: /[5KL][1-9A-HJ-NP-Za-km-z]{50,51}/g,
    severity: 'critical',
    description: 'Bitcoin private key in WIF format detected',
    suggestion: 'Remove private key immediately and use secure wallet management',
  },
  {
    id: 'mnemonic-seed-phrase',
    name: 'Mnemonic Seed Phrase',
    pattern: /\b(?:abandon|ability|able|about|above|absent|absorb|abstract|absurd|abuse|access|accident|account|accuse|achieve|acid|acoustic|acquire|across|act|action|actor|actress|actual|adapt|add|addict|address|adjust|admit|adult|advance|advice|aerobic|affair|afford|afraid|again|age|agent|agree|ahead|aim|air|airport|aisle|alarm|album|alcohol|alert|alien|all|alley|allow|almost|alone|alpha|already|also|alter|always|amateur|amazing|among|amount|amused|analyst|anchor|ancient|anger|angle|angry|animal|ankle|announce|annual|another|answer|antenna|antique|anxiety|any|apart|apology|appear|apple|approve|april|arch|arctic|area|arena|argue|arm|armed|armor|army|around|arrange|arrest|arrive|arrow|art|artefact|artist|artwork|ask|aspect|assault|asset|assist|assume|asthma|athlete|atom|attack|attend|attitude|attract|auction|audit|august|aunt|author|auto|autumn|average|avocado|avoid|awake|aware|away|awesome|awful|awkward|axis|baby|bachelor|bacon|badge|bag|balance|balcony|ball|bamboo|banana|banner|bar|barely|bargain|barrel|base|basic|basket|battle|beach|bean|beauty|because|become|beef|before|begin|behave|behind|believe|below|belt|bench|benefit|best|betray|better|between|beyond|bicycle|bid|bike|bind|biology|bird|birth|bitter|black|blade|blame|blanket|blast|bleak|bless|blind|blood|blossom|blow|blue|blur|blush|board|boat|body|boil|bomb|bone|bonus|book|boost|border|boring|borrow|boss|bottom|bounce|box|boy|bracket|brain|brand|brass|brave|bread|breeze|brick|bridge|brief|bright|bring|brisk|broccoli|broken|bronze|broom|brother|brown|brush|bubble|buddy|budget|buffalo|build|bulb|bulk|bullet|bundle|bunker|burden|burger|burst|bus|business|busy|butter|buyer|buzz|cabbage|cabin|cable|cactus|cage|cake|call|calm|camera|camp|can|canal|cancel|candy|cannon|canoe|canvas|canyon|capable|capital|captain|car|carbon|card|care|career|careful|careless|cargo|carpet|carry|cart|case|cash|casino|castle|casual|cat|catalog|catch|category|cattle|caught|cause|caution|cave|ceiling|celery|cement|census|century|cereal|certain|chair|chalk|champion|change|chaos|chapter|charge|chase|chat|cheap|check|cheese|chef|cherry|chest|chicken|chief|child|chimney|choice|choose|chronic|chuckle|chunk|churn|cigar|cinnamon|circle|citizen|city|civil|claim|clamp|clarify|clash|classic|clean|clear|click|client|cliff|climb|clinic|clip|clock|clog|close|cloth|cloud|clown|club|clump|cluster|clutch|coach|coast|coconut|code|coffee|coil|coin|collect|color|column|combine|come|comfort|comic|common|company|concert|conduct|confirm|congress|connect|consider|control|convince|cook|cool|copper|copy|coral|core|corn|correct|cost|cotton|couch|country|couple|course|cousin|cover|coyote|crack|cradle|craft|cram|crane|crash|crater|crawl|crazy|cream|credit|creek|crew|cricket|crime|crisp|critic|crop|cross|crouch|crowd|crucial|cruel|cruise|crumble|crunch|crush|cry|crystal|cube|culture|cup|cupboard|curious|current|curtain|curve|cushion|custom|cute|cycle|dad|damage|damp|dance|danger|daring|dash|daughter|dawn|day|deal|debate|debris|decade|december|decide|decline|decorate|decrease|deer|defense|define|defy|degree|delay|deliver|demand|demise|denial|dentist|deny|depart|depend|deposit|depth|deputy|derive|describe|desert|design|desk|despair|destroy|detail|detect|device|devote|diagram|dial|diamond|diary|dice|diesel|diet|differ|digital|dignity|dilemma|dinner|dinosaur|direct|dirt|disagree|discover|disease|dish|dismiss|disorder|display|distance|divert|divide|divorce|dizzy|doctor|document|dog|doll|dolphin|domain|donate|donkey|donor|door|dose|double|dove|draft|dragon|drama|drape|draw|dream|dress|drift|drill|drink|drip|drive|drop|drum|dry|duck|dumb|dune|during|dust|dutch|duty|dwarf|dynamic|eager|eagle|early|earn|earth|easily|east|easy|echo|ecology|economy|edge|edit|educate|effort|egg|eight|either|elbow|elder|electric|elegant|element|elephant|elevator|elite|else|embark|embody|embrace|emerge|emotion|employ|empower|empty|enable|enact|end|endless|endorse|enemy|energy|enforce|engage|engine|enhance|enjoy|enlist|enough|enrich|enroll|ensure|enter|entire|entry|envelope|episode|equal|equip|era|erase|erode|erosion|error|erupt|escape|essay|essence|estate|eternal|ethics|evidence|evil|evoke|evolve|exact|example|excess|exchange|excite|exclude|excuse|execute|exercise|exhaust|exhibit|exile|exist|exit|exotic|expand|expect|expire|explain|expose|express|extend|extra|eye|eyebrow|fabric|face|faculty|fade|faint|faith|fall|false|fame|family|famous|fan|fancy|fantasy|farm|fashion|fat|fatal|father|fatigue|fault|favorite|feature|february|federal|fee|feed|feel|female|fence|festival|fetch|fever|few|fiber|fiction|field|figure|file|fill|film|filter|final|find|fine|finger|finish|fire|firm|first|fiscal|fish|fit|fitness|fix|flag|flame|flat|flavor|flee|flight|flip|float|flock|floor|flower|fluid|flush|fly|foam|focus|fog|foil|fold|follow|food|foot|force|forest|forget|fork|fortune|forum|forward|fossil|foster|found|fox|frame|frequent|fresh|friend|fringe|frog|front|frost|frown|frozen|fruit|fuel|fun|funny|furnace|fury|future|gadget|gain|galaxy|gallery|game|gap|garage|garbage|garden|garlic|garment|gas|gasp|gate|gather|gauge|gaze|general|genius|genre|gentle|genuine|gesture|ghost|giant|gift|giggle|ginger|giraffe|girl|give|glad|glance|glare|glass|glide|glimpse|globe|gloom|glory|glove|glow|glue|goat|goddess|gold|good|goose|gorilla|gospel|gossip|govern|gown|grab|grace|grain|grant|grape|grass|gravity|great|green|grid|grief|grit|grocery|group|grow|grunt|guard|guess|guide|guilt|guitar|gun|gym|habit|hair|half|hammer|hamster|hand|happy|harbor|hard|harsh|harvest|hat|have|hawk|hazard|head|healthy|hear|heart|heavy|hedgehog|height|held|hello|helmet|help|hen|hero|hidden|high|hill|hint|hip|hire|history|hobby|hockey|hold|hole|holiday|hollow|home|honey|hood|hope|horn|horror|horse|hospital|host|hotel|hour|hover|hub|huge|human|humble|humor|hundred|hungry|hunt|hurdle|hurry|hurt|husband|hybrid|ice|icon|idea|identify|idle|ignore|ill|illegal|illness|image|imitate|immense|immune|impact|impose|improve|impulse|inch|include|income|increase|index|indicate|indoor|industry|infant|inflict|inform|inhale|inherit|initial|inject|injury|inmate|inner|innocent|input|inquiry|insane|insect|inside|inspire|install|intact|interest|into|invest|invite|involve|iron|island|isolate|issue|item|ivory|jacket|jaguar|jar|jazz|jealous|jeans|jelly|jewel|job|join|joke|journey|joy|judge|juice|jump|jungle|junior|junk|just|kangaroo|keen|keep|ketchup|key|kick|kid|kidney|kind|kingdom|kiss|kit|kitchen|kite|kitten|kiwi|knee|knife|knock|know|lab|label|labor|ladder|lady|lake|lamp|language|laptop|large|later|latin|laugh|laundry|lava|law|lawn|lawsuit|layer|lazy|leader|leaf|learn|leave|lecture|left|leg|legal|legend|leisure|lemon|lend|length|lens|leopard|lesson|letter|level|liar|liberty|library|license|life|lift|light|like|limb|limit|link|lion|liquid|list|little|live|lizard|load|loan|lobster|local|lock|logic|lonely|long|loop|lottery|loud|lounge|love|loyal|lucky|luggage|lumber|lunar|lunch|luxury|lying|machine|mad|magic|magnet|maid|mail|main|major|make|mammal|man|manage|mandate|mango|mansion|manual|maple|marble|march|margin|marine|market|marriage|mask|mass|master|match|material|math|matrix|matter|maximum|maze|meadow|mean|measure|meat|mechanic|medal|media|melody|melt|member|memory|mention|menu|mercy|merge|merit|merry|mesh|message|metal|method|middle|midnight|milk|million|mimic|mind|minimum|minor|minute|miracle|mirror|misery|miss|mistake|mix|mixed|mixture|mobile|model|modify|mom|moment|monitor|monkey|monster|month|moon|moral|more|morning|mosquito|mother|motion|motor|mountain|mouse|move|movie|much|muffin|mule|multiply|muscle|museum|mushroom|music|must|mutual|myself|mystery|myth|naive|name|napkin|narrow|nasty|nation|nature|near|neck|need|needle|neglect|neighbor|neither|nephew|nerve|nest|net|network|neutral|never|news|next|nice|night|noble|noise|nominee|noodle|normal|north|nose|notable|note|nothing|notice|novel|now|nuclear|number|nurse|nut|oak|obey|object|oblige|obscure|observe|obtain|obvious|occur|ocean|october|odor|off|offer|office|often|oil|okay|old|olive|olympic|omit|once|one|onion|online|only|open|opera|opinion|oppose|option|orange|orbit|orchard|order|ordinary|organ|orient|original|orphan|ostrich|other|outdoor|outer|output|outside|oval|oven|over|own|owner|oxygen|oyster|ozone|pact|paddle|page|pair|palace|palm|panda|panel|panic|panther|paper|parade|parent|park|parrot|part|party|pass|patch|path|patient|patrol|pattern|pause|pave|payment|peace|peanut|pear|peasant|pelican|pen|penalty|pencil|people|pepper|perfect|permit|person|pet|phone|photo|phrase|physical|piano|picnic|picture|piece|pig|pigeon|pill|pilot|pink|pioneer|pipe|pistol|pitch|pizza|place|planet|plastic|plate|play|please|pledge|pluck|plug|plunge|poem|poet|point|polar|pole|police|pond|pony|pool|popular|portion|position|possible|post|potato|pottery|poverty|powder|power|practice|praise|predict|prefer|prepare|present|pretty|prevent|price|pride|primary|print|priority|prison|private|prize|problem|process|produce|profit|program|project|promote|proof|property|prosper|protect|proud|provide|public|pudding|pull|pulp|pulse|pumpkin|punch|pupil|puppy|purchase|purity|purpose|purse|push|put|puzzle|pyramid|quality|quantum|quarter|question|quick|quiet|quilt|quit|quiz|quote|rabbit|raccoon|race|rack|radar|radio|rail|rain|raise|rally|ramp|ranch|random|range|rapid|rare|rate|rather|raven|raw|razor|ready|real|reason|rebel|rebuild|recall|receive|recipe|record|recycle|reduce|reflect|reform|refuse|region|regret|regular|reject|relax|release|relief|rely|remain|remember|remind|remove|render|renew|rent|reopen|repair|repeat|replace|report|require|rescue|resemble|resist|resource|response|result|retire|retreat|return|reunion|reveal|review|reward|rhythm|rib|ribbon|rice|rich|ride|ridge|rifle|right|rigid|ring|riot|ripple|rise|risk|ritual|rival|river|road|roast|rob|robot|robust|rocket|romance|roof|rookie|room|rose|rotate|rough|round|route|royal|rubber|rude|rug|rule|run|runway|rural|sad|saddle|sadness|safe|sail|salad|salmon|salon|salt|salute|same|sample|sand|satisfy|satoshi|sauce|sausage|save|say|scale|scan|scare|scatter|scene|scheme|school|science|scissors|scorpion|scout|scrap|screen|script|scrub|sea|search|season|seat|second|secret|section|security|seed|seek|segment|select|sell|seminar|senior|sense|sentence|series|service|session|settle|setup|seven|shadow|shaft|shallow|share|shed|shell|sheriff|shield|shift|shine|ship|shirt|shock|shoe|shoot|shop|short|shoulder|shove|shrimp|shrug|shuffle|shy|sibling|sick|side|siege|sight|sign|silent|silk|silly|silver|similar|simple|since|sing|siren|sister|situate|six|size|skate|sketch|ski|skill|skin|skirt|skull|slab|slam|sleep|slender|slice|slide|slight|slim|slogan|slot|slow|slush|small|smart|smile|smoke|smooth|snack|snake|snap|sniff|snow|soap|soccer|social|sock|soda|soft|solar|sold|soldier|solid|solution|solve|someone|song|soon|sorry|sort|soul|sound|soup|source|south|space|spare|spatial|spawn|speak|special|speed|spell|spend|sphere|spice|spider|spike|spin|spirit|split|spoil|sponsor|spoon|sport|spot|spray|spread|spring|spy|square|squeeze|squirrel|stable|stadium|staff|stage|stairs|stamp|stand|start|state|stay|steak|steel|stem|step|stereo|stick|still|sting|stock|stomach|stone|stool|story|stove|strategy|street|strike|strong|struggle|student|stuff|stumble|style|subject|submit|subway|success|such|sudden|suffer|sugar|suggest|suit|summer|sun|sunny|sunset|super|supply|supreme|sure|surface|surge|surprise|surround|survey|suspect|sustain|swallow|swamp|swap|swear|sweet|swift|swim|swing|switch|sword|symbol|symptom|syrup|system|table|tackle|tag|tail|talent|talk|tank|tape|target|task|taste|tattoo|taxi|teach|team|tell|ten|tenant|tennis|tent|term|test|text|thank|that|theme|then|theory|there|they|thing|this|thought|three|thrive|throw|thumb|thunder|ticket|tide|tiger|tilt|timber|time|tiny|tip|tired|tissue|title|toast|tobacco|today|toddler|toe|together|toilet|token|tomato|tomorrow|tone|tongue|tonight|tool|tooth|top|topic|topple|torch|tornado|tortoise|toss|total|tourist|toward|tower|town|toy|track|trade|traffic|tragic|train|transfer|trap|trash|travel|tray|treat|tree|trend|trial|tribe|trick|trigger|trim|trip|trophy|trouble|truck|true|truly|trumpet|trust|truth|try|tube|tuition|tumble|tuna|tunnel|turkey|turn|turtle|twelve|twenty|twice|twin|twist|two|type|typical|ugly|umbrella|unable|unaware|uncle|uncover|under|undo|unfair|unfold|unhappy|uniform|unique|unit|universe|unknown|unlock|until|unusual|unveil|update|upgrade|uphold|upon|upper|upset|urban|urge|usage|use|used|useful|useless|usual|utility|vacant|vacuum|vague|valid|valley|valve|van|vanish|vapor|various|vast|vault|vehicle|velvet|vendor|venture|venue|verb|verify|version|very|vessel|veteran|viable|vibe|vicious|victory|video|view|village|vintage|violin|virtual|virus|visa|visit|visual|vital|vivid|vocal|voice|void|volcano|volume|vote|voyage|wage|wagon|wait|walk|wall|walnut|want|warfare|warm|warrior|wash|wasp|waste|water|wave|way|wealth|weapon|wear|weasel|weather|web|wedding|weekend|weird|welcome|west|wet|what|wheat|wheel|when|where|whip|whisper|wide|width|wife|wild|will|win|window|wine|wing|wink|winner|winter|wire|wisdom|wise|wish|witness|wolf|woman|wonder|wood|wool|word|work|world|worry|worth|wrap|wreck|wrestle|wrist|write|wrong|yard|year|yellow|you|young|youth|zebra|zero|zone|zoo)\b(?:\s+\b(?:abandon|ability|able|about|above|absent|absorb|abstract|absurd|abuse|access|accident|account|accuse|achieve|acid|acoustic|acquire|across|act|action|actor|actress|actual|adapt|add|addict|address|adjust|admit|adult|advance|advice|aerobic|affair|afford|afraid|again|age|agent|agree|ahead|aim|air|airport|aisle|alarm|album|alcohol|alert|alien|all|alley|allow|almost|alone|alpha|already|also|alter|always|amateur|amazing|among|amount|amused|analyst|anchor|ancient|anger|angle|angry|animal|ankle|announce|annual|another|answer|antenna|antique|anxiety|any|apart|apology|appear|apple|approve|april|arch|arctic|area|arena|argue|arm|armed|armor|army|around|arrange|arrest|arrive|arrow|art|artefact|artist|artwork|ask|aspect|assault|asset|assist|assume|asthma|athlete|atom|attack|attend|attitude|attract|auction|audit|august|aunt|author|auto|autumn|average|avocado|avoid|awake|aware|away|awesome|awful|awkward|axis|baby|bachelor|bacon|badge|bag|balance|balcony|ball|bamboo|banana|banner|bar|barely|bargain|barrel|base|basic|basket|battle|beach|bean|beauty|because|become|beef|before|begin|behave|behind|believe|below|belt|bench|benefit|best|betray|better|between|beyond|bicycle|bid|bike|bind|biology|bird|birth|bitter|black|blade|blame|blanket|blast|bleak|bless|blind|blood|blossom|blow|blue|blur|blush|board|boat|body|boil|bomb|bone|bonus|book|boost|border|boring|borrow|boss|bottom|bounce|box|boy|bracket|brain|brand|brass|brave|bread|breeze|brick|bridge|brief|bright|bring|brisk|broccoli|broken|bronze|broom|brother|brown|brush|bubble|buddy|budget|buffalo|build|bulb|bulk|bullet|bundle|bunker|burden|burger|burst|bus|business|busy|butter|buyer|buzz|cabbage|cabin|cable|cactus|cage|cake|call|calm|camera|camp|can|canal|cancel|candy|cannon|canoe|canvas|canyon|capable|capital|captain|car|carbon|card|care|career|careful|careless|cargo|carpet|carry|cart|case|cash|casino|castle|casual|cat|catalog|catch|category|cattle|caught|cause|caution|cave|ceiling|celery|cement|census|century|cereal|certain|chair|chalk|champion|change|chaos|chapter|charge|chase|chat|cheap|check|cheese|chef|cherry|chest|chicken|chief|child|chimney|choice|choose|chronic|chuckle|chunk|churn|cigar|cinnamon|circle|citizen|city|civil|claim|clamp|clarify|clash|classic|clean|clear|click|client|cliff|climb|clinic|clip|clock|clog|close|cloth|cloud|clown|club|clump|cluster|clutch|coach|coast|coconut|code|coffee|coil|coin|collect|color|column|combine|come|comfort|comic|common|company|concert|conduct|confirm|congress|connect|consider|control|convince|cook|cool|copper|copy|coral|core|corn|correct|cost|cotton|couch|country|couple|course|cousin|cover|coyote|crack|cradle|craft|cram|crane|crash|crater|crawl|crazy|cream|credit|creek|crew|cricket|crime|crisp|critic|crop|cross|crouch|crowd|crucial|cruel|cruise|crumble|crunch|crush|cry|crystal|cube|culture|cup|cupboard|curious|current|curtain|curve|cushion|custom|cute|cycle|dad|damage|damp|dance|danger|daring|dash|daughter|dawn|day|deal|debate|debris|decade|december|decide|decline|decorate|decrease|deer|defense|define|defy|degree|delay|deliver|demand|demise|denial|dentist|deny|depart|depend|deposit|depth|deputy|derive|describe|desert|design|desk|despair|destroy|detail|detect|device|devote|diagram|dial|diamond|diary|dice|diesel|diet|differ|digital|dignity|dilemma|dinner|dinosaur|direct|dirt|disagree|discover|disease|dish|dismiss|disorder|display|distance|divert|divide|divorce|dizzy|doctor|document|dog|doll|dolphin|domain|donate|donkey|donor|door|dose|double|dove|draft|dragon|drama|drape|draw|dream|dress|drift|drill|drink|drip|drive|drop|drum|dry|duck|dumb|dune|during|dust|dutch|duty|dwarf|dynamic|eager|eagle|early|earn|earth|easily|east|easy|echo|ecology|economy|edge|edit|educate|effort|egg|eight|either|elbow|elder|electric|elegant|element|elephant|elevator|elite|else|embark|embody|embrace|emerge|emotion|employ|empower|empty|enable|enact|end|endless|endorse|enemy|energy|enforce|engage|engine|enhance|enjoy|enlist|enough|enrich|enroll|ensure|enter|entire|entry|envelope|episode|equal|equip|era|erase|erode|erosion|error|erupt|escape|essay|essence|estate|eternal|ethics|evidence|evil|evoke|evolve|exact|example|excess|exchange|excite|exclude|excuse|execute|exercise|exhaust|exhibit|exile|exist|exit|exotic|expand|expect|expire|explain|expose|express|extend|extra|eye|eyebrow|fabric|face|faculty|fade|faint|faith|fall|false|fame|family|famous|fan|fancy|fantasy|farm|fashion|fat|fatal|father|fatigue|fault|favorite|feature|february|federal|fee|feed|feel|female|fence|festival|fetch|fever|few|fiber|fiction|field|figure|file|fill|film|filter|final|find|fine|finger|finish|fire|firm|first|fiscal|fish|fit|fitness|fix|flag|flame|flat|flavor|flee|flight|flip|float|flock|floor|flower|fluid|flush|fly|foam|focus|fog|foil|fold|follow|food|foot|force|forest|forget|fork|fortune|forum|forward|fossil|foster|found|fox|frame|frequent|fresh|friend|fringe|frog|front|frost|frown|frozen|fruit|fuel|fun|funny|furnace|fury|future|gadget|gain|galaxy|gallery|game|gap|garage|garbage|garden|garlic|garment|gas|gasp|gate|gather|gauge|gaze|general|genius|genre|gentle|genuine|gesture|ghost|giant|gift|giggle|ginger|giraffe|girl|give|glad|glance|glare|glass|glide|glimpse|globe|gloom|glory|glove|glow|glue|goat|goddess|gold|good|goose|gorilla|gospel|gossip|govern|gown|grab|grace|grain|grant|grape|grass|gravity|great|green|grid|grief|grit|grocery|group|grow|grunt|guard|guess|guide|guilt|guitar|gun|gym|habit|hair|half|hammer|hamster|hand|happy|harbor|hard|harsh|harvest|hat|have|hawk|hazard|head|healthy|hear|heart|heavy|hedgehog|height|held|hello|helmet|help|hen|hero|hidden|high|hill|hint|hip|hire|history|hobby|hockey|hold|hole|holiday|hollow|home|honey|hood|hope|horn|horror|horse|hospital|host|hotel|hour|hover|hub|huge|human|humble|humor|hundred|hungry|hunt|hurdle|hurry|hurt|husband|hybrid|ice|icon|idea|identify|idle|ignore|ill|illegal|illness|image|imitate|immense|immune|impact|impose|improve|impulse|inch|include|income|increase|index|indicate|indoor|industry|infant|inflict|inform|inhale|inherit|initial|inject|injury|inmate|inner|innocent|input|inquiry|insane|insect|inside|inspire|install|intact|interest|into|invest|invite|involve|iron|island|isolate|issue|item|ivory|jacket|jaguar|jar|jazz|jealous|jeans|jelly|jewel|job|join|joke|journey|joy|judge|juice|jump|jungle|junior|junk|just|kangaroo|keen|keep|ketchup|key|kick|kid|kidney|kind|kingdom|kiss|kit|kitchen|kite|kitten|kiwi|knee|knife|knock|know|lab|label|labor|ladder|lady|lake|lamp|language|laptop|large|later|latin|laugh|laundry|lava|law|lawn|lawsuit|layer|lazy|leader|leaf|learn|leave|lecture|left|leg|legal|legend|leisure|lemon|lend|length|lens|leopard|lesson|letter|level|liar|liberty|library|license|life|lift|light|like|limb|limit|link|lion|liquid|list|little|live|lizard|load|loan|lobster|local|lock|logic|lonely|long|loop|lottery|loud|lounge|love|loyal|lucky|luggage|lumber|lunar|lunch|luxury|lying|machine|mad|magic|magnet|maid|mail|main|major|make|mammal|man|manage|mandate|mango|mansion|manual|maple|marble|march|margin|marine|market|marriage|mask|mass|master|match|material|math|matrix|matter|maximum|maze|meadow|mean|measure|meat|mechanic|medal|media|melody|melt|member|memory|mention|menu|mercy|merge|merit|merry|mesh|message|metal|method|middle|midnight|milk|million|mimic|mind|minimum|minor|minute|miracle|mirror|misery|miss|mistake|mix|mixed|mixture|mobile|model|modify|mom|moment|monitor|monkey|monster|month|moon|moral|more|morning|mosquito|mother|motion|motor|mountain|mouse|move|movie|much|muffin|mule|multiply|muscle|museum|mushroom|music|must|mutual|myself|mystery|myth|naive|name|napkin|narrow|nasty|nation|nature|near|neck|need|needle|neglect|neighbor|neither|nephew|nerve|nest|net|network|neutral|never|news|next|nice|night|noble|noise|nominee|noodle|normal|north|nose|notable|note|nothing|notice|novel|now|nuclear|number|nurse|nut|oak|obey|object|oblige|obscure|observe|obtain|obvious|occur|ocean|october|odor|off|offer|office|often|oil|okay|old|olive|olympic|omit|once|one|onion|online|only|open|opera|opinion|oppose|option|orange|orbit|orchard|order|ordinary|organ|orient|original|orphan|ostrich|other|outdoor|outer|output|outside|oval|oven|over|own|owner|oxygen|oyster|ozone|pact|paddle|page|pair|palace|palm|panda|panel|panic|panther|paper|parade|parent|park|parrot|part|party|pass|patch|path|patient|patrol|pattern|pause|pave|payment|peace|peanut|pear|peasant|pelican|pen|penalty|pencil|people|pepper|perfect|permit|person|pet|phone|photo|phrase|physical|piano|picnic|picture|piece|pig|pigeon|pill|pilot|pink|pioneer|pipe|pistol|pitch|pizza|place|planet|plastic|plate|play|please|pledge|pluck|plug|plunge|poem|poet|point|polar|pole|police|pond|pony|pool|popular|portion|position|possible|post|potato|pottery|poverty|powder|power|practice|praise|predict|prefer|prepare|present|pretty|prevent|price|pride|primary|print|priority|prison|private|prize|problem|process|produce|profit|program|project|promote|proof|property|prosper|protect|proud|provide|public|pudding|pull|pulp|pulse|pumpkin|punch|pupil|puppy|purchase|purity|purpose|purse|push|put|puzzle|pyramid|quality|quantum|quarter|question|quick|quiet|quilt|quit|quiz|quote|rabbit|raccoon|race|rack|radar|radio|rail|rain|raise|rally|ramp|ranch|random|range|rapid|rare|rate|rather|raven|raw|razor|ready|real|reason|rebel|rebuild|recall|receive|recipe|record|recycle|reduce|reflect|reform|refuse|region|regret|regular|reject|relax|release|relief|rely|remain|remember|remind|remove|render|renew|rent|reopen|repair|repeat|replace|report|require|rescue|resemble|resist|resource|response|result|retire|retreat|return|reunion|reveal|review|reward|rhythm|rib|ribbon|rice|rich|ride|ridge|rifle|right|rigid|ring|riot|ripple|rise|risk|ritual|rival|river|road|roast|rob|robot|robust|rocket|romance|roof|rookie|room|rose|rotate|rough|round|route|royal|rubber|rude|rug|rule|run|runway|rural|sad|saddle|sadness|safe|sail|salad|salmon|salon|salt|salute|same|sample|sand|satisfy|satoshi|sauce|sausage|save|say|scale|scan|scare|scatter|scene|scheme|school|science|scissors|scorpion|scout|scrap|screen|script|scrub|sea|search|season|seat|second|secret|section|security|seed|seek|segment|select|sell|seminar|senior|sense|sentence|series|service|session|settle|setup|seven|shadow|shaft|shallow|share|shed|shell|sheriff|shield|shift|shine|ship|shirt|shock|shoe|shoot|shop|short|shoulder|shove|shrimp|shrug|shuffle|shy|sibling|sick|side|siege|sight|sign|silent|silk|silly|silver|similar|simple|since|sing|siren|sister|situate|six|size|skate|sketch|ski|skill|skin|skirt|skull|slab|slam|sleep|slender|slice|slide|slight|slim|slogan|slot|slow|slush|small|smart|smile|smoke|smooth|snack|snake|snap|sniff|snow|soap|soccer|social|sock|soda|soft|solar|sold|soldier|solid|solution|solve|someone|song|soon|sorry|sort|soul|sound|soup|source|south|space|spare|spatial|spawn|speak|special|speed|spell|spend|sphere|spice|spider|spike|spin|spirit|split|spoil|sponsor|spoon|sport|spot|spray|spread|spring|spy|square|squeeze|squirrel|stable|stadium|staff|stage|stairs|stamp|stand|start|state|stay|steak|steel|stem|step|stereo|stick|still|sting|stock|stomach|stone|stool|story|stove|strategy|street|strike|strong|struggle|student|stuff|stumble|style|subject|submit|subway|success|such|sudden|suffer|sugar|suggest|suit|summer|sun|sunny|sunset|super|supply|supreme|sure|surface|surge|surprise|surround|survey|suspect|sustain|swallow|swamp|swap|swear|sweet|swift|swim|swing|switch|sword|symbol|symptom|syrup|system|table|tackle|tag|tail|talent|talk|tank|tape|target|task|taste|tattoo|taxi|teach|team|tell|ten|tenant|tennis|tent|term|test|text|thank|that|theme|then|theory|there|they|thing|this|thought|three|thrive|throw|thumb|thunder|ticket|tide|tiger|tilt|timber|time|tiny|tip|tired|tissue|title|toast|tobacco|today|toddler|toe|together|toilet|token|tomato|tomorrow|tone|tongue|tonight|tool|tooth|top|topic|topple|torch|tornado|tortoise|toss|total|tourist|toward|tower|town|toy|track|trade|traffic|tragic|train|transfer|trap|trash|travel|tray|treat|tree|trend|trial|tribe|trick|trigger|trim|trip|trophy|trouble|truck|true|truly|trumpet|trust|truth|try|tube|tuition|tumble|tuna|tunnel|turkey|turn|turtle|twelve|twenty|twice|twin|twist|two|type|typical|ugly|umbrella|unable|unaware|uncle|uncover|under|undo|unfair|unfold|unhappy|uniform|unique|unit|universe|unknown|unlock|until|unusual|unveil|update|upgrade|uphold|upon|upper|upset|urban|urge|usage|use|used|useful|useless|usual|utility|vacant|vacuum|vague|valid|valley|valve|van|vanish|vapor|various|vast|vault|vehicle|velvet|vendor|venture|venue|verb|verify|version|very|vessel|veteran|viable|vibe|vicious|victory|video|view|village|vintage|violin|virtual|virus|visa|visit|visual|vital|vivid|vocal|voice|void|volcano|volume|vote|voyage|wage|wagon|wait|walk|wall|walnut|want|warfare|warm|warrior|wash|wasp|waste|water|wave|way|wealth|weapon|wear|weasel|weather|web|wedding|weekend|weird|welcome|west|wet|what|wheat|wheel|when|where|whip|whisper|wide|width|wife|wild|will|win|window|wine|wing|wink|winner|winter|wire|wisdom|wise|wish|witness|wolf|woman|wonder|wood|wool|word|work|world|worry|worth|wrap|wreck|wrestle|wrist|write|wrong|yard|year|yellow|you|young|youth|zebra|zero|zone|zoo)\b){11,23}/gi,
    severity: 'critical',
    description: 'BIP39 mnemonic seed phrase detected (12-24 words)',
    suggestion: 'Remove seed phrase immediately and use secure wallet management',
  },
  {
    id: 'solana-private-key',
    name: 'Solana Private Key',
    pattern: /[1-9A-HJ-NP-Za-km-z]{87,88}/g,
    severity: 'critical',
    description: 'Solana private key detected',
    suggestion: 'Remove private key immediately and use secure key management',
  },
  {
    id: 'metamask-vault',
    name: 'MetaMask Vault',
    pattern: /"vault"\s*:\s*"[^"]+"/g,
    severity: 'critical',
    description: 'MetaMask vault data detected',
    suggestion: 'Remove MetaMask vault data and add to .gitignore',
  },
  {
    id: 'infura-api-key',
    name: 'Infura API Key',
    pattern: /infura[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'high',
    description: 'Infura API key detected',
    suggestion: 'Move to environment variable: INFURA_API_KEY',
  },
  {
    id: 'alchemy-api-key',
    name: 'Alchemy API Key',
    pattern: /alchemy[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32}/gi,
    severity: 'high',
    description: 'Alchemy API key detected',
    suggestion: 'Move to environment variable: ALCHEMY_API_KEY',
  },
  {
    id: 'moralis-api-key',
    name: 'Moralis API Key',
    pattern: /moralis[^a-zA-Z0-9]*[a-zA-Z0-9]{64}/gi,
    severity: 'high',
    description: 'Moralis API key detected',
    suggestion: 'Move to environment variable: MORALIS_API_KEY',
  },
  {
    id: 'web3-storage-token',
    name: 'Web3.Storage Token',
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
    severity: 'high',
    description: 'Web3.Storage API token detected',
    suggestion: 'Move to environment variable: WEB3_STORAGE_TOKEN',
  },
  {
    id: 'pinata-api-key',
    name: 'Pinata API Key',
    pattern: /pinata[^a-zA-Z0-9]*[a-f0-9]{64}/gi,
    severity: 'high',
    description: 'Pinata API key detected',
    suggestion: 'Move to environment variable: PINATA_API_KEY',
  },
  {
    id: 'coinbase-api-key',
    name: 'Coinbase API Key',
    pattern: /coinbase[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'critical',
    description: 'Coinbase API key detected',
    suggestion: 'Move to environment variable: COINBASE_API_KEY',
  },
  {
    id: 'binance-api-key',
    name: 'Binance API Key',
    pattern: /binance[^a-zA-Z0-9]*[a-zA-Z0-9]{64}/gi,
    severity: 'critical',
    description: 'Binance API key detected',
    suggestion: 'Move to environment variable: BINANCE_API_KEY',
  },
  {
    id: 'next-public-warning',
    name: 'NEXT_PUBLIC Environment Variable Warning',
    pattern: /NEXT_PUBLIC_[A-Z_]*(?:SECRET|KEY|TOKEN|PASSWORD|PRIVATE)[A-Z_]*\s*=\s*['"]/gi,
    severity: 'high',
    description: 'NEXT_PUBLIC variable with sensitive name detected - this will be exposed to the browser',
    suggestion: 'Remove NEXT_PUBLIC prefix for sensitive data or use server-side environment variables',
  },
  {
    id: 'hardhat-private-key',
    name: 'Hardhat Private Key',
    pattern: /PRIVATE_KEY\s*[:=]\s*['"]0x[a-fA-F0-9]{64}['"]/gi,
    severity: 'critical',
    description: 'Hardhat private key configuration detected',
    suggestion: 'Move to environment variable and add to .gitignore',
  },
  {
    id: 'truffle-mnemonic',
    name: 'Truffle Mnemonic',
    pattern: /mnemonic\s*[:=]\s*['"][^'"]*['"]/gi,
    severity: 'critical',
    description: 'Truffle mnemonic configuration detected',
    suggestion: 'Move to environment variable and add to .gitignore',
  },
  {
    id: 'web3-provider-url',
    name: 'Web3 Provider URL with API Key',
    pattern: /https:\/\/[^\/]*\.infura\.io\/v3\/[a-f0-9]{32}/gi,
    severity: 'high',
    description: 'Web3 provider URL with API key detected',
    suggestion: 'Move API key to environment variable',
  },
  {
    id: 'ethereum-keystore',
    name: 'Ethereum Keystore File',
    pattern: /"crypto"\s*:\s*\{[^}]*"cipher"\s*:\s*"aes-128-ctr"/gi,
    severity: 'critical',
    description: 'Ethereum keystore file detected',
    suggestion: 'Remove keystore file and add to .gitignore',
  },
  {
    id: 'wallet-connect-project-id',
    name: 'WalletConnect Project ID',
    pattern: /walletconnect[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'medium',
    description: 'WalletConnect project ID detected',
    suggestion: 'Move to environment variable: WALLETCONNECT_PROJECT_ID',
  },

  // ============================================
  // Additional Blockchain Networks
  // ============================================
  {
    id: 'generic-blockchain-private-key',
    name: 'Generic Blockchain Private Key',
    pattern: /[a-fA-F0-9]{64}/g,
    severity: 'critical',
    description: 'Generic blockchain private key detected (64-character hex - Tron, Cosmos, Chainlink, etc.)',
    suggestion: 'Remove private key immediately and use secure key management',
  },
  {
    id: 'near-private-key',
    name: 'NEAR Private Key',
    pattern: /ed25519:[1-9A-HJ-NP-Za-km-z]{87,88}/g,
    severity: 'critical',
    description: 'NEAR Protocol private key detected',
    suggestion: 'Remove private key immediately and use secure key management',
  },
  {
    id: 'cardano-private-key',
    name: 'Cardano Private Key',
    pattern: /[a-fA-F0-9]{128}/g,
    severity: 'critical',
    description: 'Cardano extended private key detected',
    suggestion: 'Remove private key immediately and use secure key management',
  },
  {
    id: 'avalanche-private-key',
    name: 'Avalanche Private Key',
    pattern: /PrivateKey-[1-9A-HJ-NP-Za-km-z]{51}/g,
    severity: 'critical',
    description: 'Avalanche private key detected',
    suggestion: 'Remove private key immediately and use secure key management',
  },
  {
    id: 'algorand-private-key',
    name: 'Algorand Private Key',
    pattern: /[A-Z2-7]{88}/g,
    severity: 'critical',
    description: 'Algorand private key detected (base32 encoded)',
    suggestion: 'Remove private key immediately and use secure key management',
  },
  {
    id: 'stellar-private-key',
    name: 'Stellar Private Key',
    pattern: /S[A-Z2-7]{55}/g,
    severity: 'critical',
    description: 'Stellar private key detected',
    suggestion: 'Remove private key immediately and use secure key management',
  },
  {
    id: 'ripple-private-key',
    name: 'Ripple (XRP) Private Key',
    pattern: /[a-fA-F0-9]{66}/g,
    severity: 'critical',
    description: 'Ripple (XRP) private key detected',
    suggestion: 'Remove private key immediately and use secure key management',
  },

  // ============================================
  // Blockchain Service API Keys
  // ============================================
  {
    id: 'quicknode-api-key',
    name: 'QuickNode API Key',
    pattern: /quicknode[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'QuickNode API key detected',
    suggestion: 'Move to environment variable: QUICKNODE_API_KEY',
  },
  {
    id: 'ankr-api-key',
    name: 'Ankr API Key',
    pattern: /ankr[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Ankr API key detected',
    suggestion: 'Move to environment variable: ANKR_API_KEY',
  },
  {
    id: 'getblock-api-key',
    name: 'GetBlock API Key',
    pattern: /getblock[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'GetBlock API key detected',
    suggestion: 'Move to environment variable: GETBLOCK_API_KEY',
  },
  {
    id: 'nodereal-api-key',
    name: 'NodeReal API Key',
    pattern: /nodereal[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'NodeReal API key detected',
    suggestion: 'Move to environment variable: NODEREAL_API_KEY',
  },
  {
    id: 'pokt-api-key',
    name: 'Pocket Network API Key',
    pattern: /pokt[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Pocket Network API key detected',
    suggestion: 'Move to environment variable: POKT_API_KEY',
  },
  {
    id: 'thegraph-api-key',
    name: 'The Graph API Key',
    pattern: /thegraph[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'The Graph API key detected',
    suggestion: 'Move to environment variable: THEGRAPH_API_KEY',
  },

  // ============================================
  // DeFi Protocol Keys
  // ============================================
  {
    id: 'uniswap-api-key',
    name: 'Uniswap API Key',
    pattern: /uniswap[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Uniswap API key detected',
    suggestion: 'Move to environment variable: UNISWAP_API_KEY',
  },
  {
    id: 'compound-api-key',
    name: 'Compound API Key',
    pattern: /compound[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Compound API key detected',
    suggestion: 'Move to environment variable: COMPOUND_API_KEY',
  },
  {
    id: 'aave-api-key',
    name: 'Aave API Key',
    pattern: /aave[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Aave API key detected',
    suggestion: 'Move to environment variable: AAVE_API_KEY',
  },

  // ============================================
  // NFT Platform Keys
  // ============================================
  {
    id: 'opensea-api-key',
    name: 'OpenSea API Key',
    pattern: /opensea[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'OpenSea API key detected',
    suggestion: 'Move to environment variable: OPENSEA_API_KEY',
  },
  {
    id: 'rarible-api-key',
    name: 'Rarible API Key',
    pattern: /rarible[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Rarible API key detected',
    suggestion: 'Move to environment variable: RARIBLE_API_KEY',
  },
  {
    id: 'nftport-api-key',
    name: 'NFTPort API Key',
    pattern: /nftport[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'NFTPort API key detected',
    suggestion: 'Move to environment variable: NFTPORT_API_KEY',
  },

  // ============================================
  // Blockchain Analytics Keys
  // ============================================
  {
    id: 'etherscan-api-key',
    name: 'Etherscan API Key',
    pattern: /etherscan[^a-zA-Z0-9]*[A-Z0-9]{34}/gi,
    severity: 'high',
    description: 'Etherscan API key detected',
    suggestion: 'Move to environment variable: ETHERSCAN_API_KEY',
  },
  {
    id: 'bscscan-api-key',
    name: 'BscScan API Key',
    pattern: /bscscan[^a-zA-Z0-9]*[A-Z0-9]{34}/gi,
    severity: 'high',
    description: 'BscScan API key detected',
    suggestion: 'Move to environment variable: BSCSCAN_API_KEY',
  },
  {
    id: 'polygonscan-api-key',
    name: 'PolygonScan API Key',
    pattern: /polygonscan[^a-zA-Z0-9]*[A-Z0-9]{34}/gi,
    severity: 'high',
    description: 'PolygonScan API key detected',
    suggestion: 'Move to environment variable: POLYGONSCAN_API_KEY',
  },
  {
    id: 'dune-api-key',
    name: 'Dune Analytics API Key',
    pattern: /dune[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Dune Analytics API key detected',
    suggestion: 'Move to environment variable: DUNE_API_KEY',
  },

  // ============================================
  // Trading Platform API Keys
  // ============================================
  {
    id: 'binance-trading-key',
    name: 'Binance Trading API Key',
    pattern: /[a-zA-Z0-9]{64}/g,
    severity: 'critical',
    description: 'Binance trading API key detected',
    suggestion: 'Move to environment variable: BINANCE_API_KEY and restrict IP access',
  },
  {
    id: 'coinbase-pro-key',
    name: 'Coinbase Pro API Key',
    pattern: /[a-f0-9]{32}/g,
    severity: 'critical',
    description: 'Coinbase Pro API key detected',
    suggestion: 'Move to environment variable: COINBASE_PRO_API_KEY',
  },
  {
    id: 'kraken-api-key',
    name: 'Kraken API Key',
    pattern: /kraken[^a-zA-Z0-9]*[a-zA-Z0-9+/=]{56}/gi,
    severity: 'critical',
    description: 'Kraken API key detected',
    suggestion: 'Move to environment variable: KRAKEN_API_KEY',
  },
  {
    id: 'bitfinex-api-key',
    name: 'Bitfinex API Key',
    pattern: /bitfinex[^a-zA-Z0-9]*[a-zA-Z0-9]{43}/gi,
    severity: 'critical',
    description: 'Bitfinex API key detected',
    suggestion: 'Move to environment variable: BITFINEX_API_KEY',
  },
  {
    id: 'huobi-api-key',
    name: 'Huobi API Key',
    pattern: /huobi[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'Huobi API key detected',
    suggestion: 'Move to environment variable: HUOBI_API_KEY',
  },
  {
    id: 'okx-api-key',
    name: 'OKX API Key',
    pattern: /okx[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'OKX (OKEx) API key detected',
    suggestion: 'Move to environment variable: OKX_API_KEY',
  },
  {
    id: 'kucoin-api-key',
    name: 'KuCoin API Key',
    pattern: /kucoin[^a-zA-Z0-9]*[a-f0-9]{24}/gi,
    severity: 'critical',
    description: 'KuCoin API key detected',
    suggestion: 'Move to environment variable: KUCOIN_API_KEY',
  },
  {
    id: 'bybit-api-key',
    name: 'Bybit API Key',
    pattern: /bybit[^a-zA-Z0-9]*[a-zA-Z0-9]{20}/gi,
    severity: 'critical',
    description: 'Bybit API key detected',
    suggestion: 'Move to environment variable: BYBIT_API_KEY',
  },
  {
    id: 'ftx-api-key',
    name: 'FTX API Key',
    pattern: /ftx[^a-zA-Z0-9]*[a-zA-Z0-9_-]{43}/gi,
    severity: 'critical',
    description: 'FTX API key detected',
    suggestion: 'Move to environment variable: FTX_API_KEY',
  },
  {
    id: 'gate-io-api-key',
    name: 'Gate.io API Key',
    pattern: /gate[^a-zA-Z0-9]*[a-f0-9]{64}/gi,
    severity: 'critical',
    description: 'Gate.io API key detected',
    suggestion: 'Move to environment variable: GATE_IO_API_KEY',
  },

  // ============================================
  // DEX and DeFi Trading APIs
  // ============================================
  {
    id: '1inch-api-key',
    name: '1inch API Key',
    pattern: /1inch[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: '1inch DEX API key detected',
    suggestion: 'Move to environment variable: ONEINCH_API_KEY',
  },
  {
    id: 'paraswap-api-key',
    name: 'ParaSwap API Key',
    pattern: /paraswap[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'ParaSwap API key detected',
    suggestion: 'Move to environment variable: PARASWAP_API_KEY',
  },
  {
    id: 'matcha-api-key',
    name: 'Matcha API Key',
    pattern: /matcha[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Matcha (0x) API key detected',
    suggestion: 'Move to environment variable: MATCHA_API_KEY',
  },
  {
    id: 'coingecko-api-key',
    name: 'CoinGecko API Key',
    pattern: /coingecko[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'CoinGecko API key detected',
    suggestion: 'Move to environment variable: COINGECKO_API_KEY',
  },
  {
    id: 'coinmarketcap-api-key',
    name: 'CoinMarketCap API Key',
    pattern: /coinmarketcap[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'high',
    description: 'CoinMarketCap API key detected',
    suggestion: 'Move to environment variable: COINMARKETCAP_API_KEY',
  },

  // ============================================
  // IPFS and Decentralized Storage
  // ============================================
  {
    id: 'ipfs-api-key',
    name: 'IPFS API Key',
    pattern: /ipfs[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'IPFS API key detected',
    suggestion: 'Move to environment variable: IPFS_API_KEY',
  },
  {
    id: 'filecoin-api-key',
    name: 'Filecoin API Key',
    pattern: /filecoin[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Filecoin API key detected',
    suggestion: 'Move to environment variable: FILECOIN_API_KEY',
  },
  {
    id: 'arweave-key',
    name: 'Arweave Key',
    pattern: /arweave[^a-zA-Z0-9]*[a-zA-Z0-9_-]{43}/gi,
    severity: 'high',
    description: 'Arweave API key detected',
    suggestion: 'Move to environment variable: ARWEAVE_KEY',
  },
  {
    id: 'storj-api-key',
    name: 'Storj API Key',
    pattern: /storj[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Storj API key detected',
    suggestion: 'Move to environment variable: STORJ_API_KEY',
  },
  {
    id: 'sia-api-key',
    name: 'Sia API Key',
    pattern: /sia[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Sia API key detected',
    suggestion: 'Move to environment variable: SIA_API_KEY',
  },

  // ============================================
  // Telegram Integration Keys
  // ============================================
  {
    id: 'telegram-trading-bot-token',
    name: 'Telegram Trading Bot Token',
    pattern: /[0-9]{8,10}:[a-zA-Z0-9_-]{35}/g,
    severity: 'critical',
    description: 'Telegram trading bot token detected',
    suggestion: 'Revoke token via @BotFather and move to environment variable',
  },
  {
    id: 'telegram-webhook-secret',
    name: 'Telegram Webhook Secret',
    pattern: /telegram[^a-zA-Z0-9]*webhook[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Telegram webhook secret detected',
    suggestion: 'Move to environment variable: TELEGRAM_WEBHOOK_SECRET',
  },

  // ============================================
  // WhatsApp Business API
  // ============================================
  {
    id: 'whatsapp-business-token',
    name: 'WhatsApp Business API Token',
    pattern: /whatsapp[^a-zA-Z0-9]*[a-zA-Z0-9_-]{100,}/gi,
    severity: 'critical',
    description: 'WhatsApp Business API token detected',
    suggestion: 'Move to environment variable: WHATSAPP_TOKEN',
  },
  {
    id: 'whatsapp-webhook-secret',
    name: 'WhatsApp Webhook Secret',
    pattern: /whatsapp[^a-zA-Z0-9]*webhook[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'WhatsApp webhook secret detected',
    suggestion: 'Move to environment variable: WHATSAPP_WEBHOOK_SECRET',
  },

  // ============================================
  // Oracle and Price Feed APIs
  // ============================================
  {
    id: 'chainlink-oracle-key',
    name: 'Chainlink Oracle API Key',
    pattern: /chainlink[^a-zA-Z0-9]*oracle[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Chainlink Oracle API key detected',
    suggestion: 'Move to environment variable: CHAINLINK_ORACLE_KEY',
  },
  {
    id: 'band-protocol-key',
    name: 'Band Protocol API Key',
    pattern: /band[^a-zA-Z0-9]*protocol[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Band Protocol API key detected',
    suggestion: 'Move to environment variable: BAND_PROTOCOL_KEY',
  },
  {
    id: 'pyth-network-key',
    name: 'Pyth Network API Key',
    pattern: /pyth[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Pyth Network API key detected',
    suggestion: 'Move to environment variable: PYTH_NETWORK_KEY',
  },

  // ============================================
  // Cross-Chain Bridge APIs
  // ============================================
  {
    id: 'multichain-api-key',
    name: 'Multichain API Key',
    pattern: /multichain[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Multichain bridge API key detected',
    suggestion: 'Move to environment variable: MULTICHAIN_API_KEY',
  },
  {
    id: 'hop-protocol-key',
    name: 'Hop Protocol API Key',
    pattern: /hop[^a-zA-Z0-9]*protocol[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Hop Protocol API key detected',
    suggestion: 'Move to environment variable: HOP_PROTOCOL_KEY',
  },
  {
    id: 'synapse-bridge-key',
    name: 'Synapse Bridge API Key',
    pattern: /synapse[^a-zA-Z0-9]*bridge[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Synapse Bridge API key detected',
    suggestion: 'Move to environment variable: SYNAPSE_BRIDGE_KEY',
  },

  // ============================================
  // Wallet Infrastructure APIs
  // ============================================
  {
    id: 'magic-link-key',
    name: 'Magic Link API Key',
    pattern: /magic[^a-zA-Z0-9]*link[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Magic Link API key detected',
    suggestion: 'Move to environment variable: MAGIC_LINK_KEY',
  },
  {
    id: 'web3auth-key',
    name: 'Web3Auth API Key',
    pattern: /web3auth[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Web3Auth API key detected',
    suggestion: 'Move to environment variable: WEB3AUTH_KEY',
  },
  {
    id: 'fortmatic-key',
    name: 'Fortmatic API Key',
    pattern: /fortmatic[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Fortmatic API key detected',
    suggestion: 'Move to environment variable: FORTMATIC_KEY',
  },
  {
    id: 'portis-key',
    name: 'Portis API Key',
    pattern: /portis[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Portis API key detected',
    suggestion: 'Move to environment variable: PORTIS_KEY',
  },

  // ============================================
  // Blockchain Gaming APIs
  // ============================================
  {
    id: 'immutable-x-key',
    name: 'Immutable X API Key',
    pattern: /immutable[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Immutable X API key detected',
    suggestion: 'Move to environment variable: IMMUTABLE_X_KEY',
  },
  {
    id: 'enjin-api-key',
    name: 'Enjin API Key',
    pattern: /enjin[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Enjin API key detected',
    suggestion: 'Move to environment variable: ENJIN_API_KEY',
  },
  {
    id: 'flow-api-key',
    name: 'Flow Blockchain API Key',
    pattern: /flow[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'high',
    description: 'Flow blockchain API key detected',
    suggestion: 'Move to environment variable: FLOW_API_KEY',
  },

  // ============================================
  // MEV and Arbitrage Tools
  // ============================================
  {
    id: 'flashbots-key',
    name: 'Flashbots API Key',
    pattern: /flashbots[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Flashbots API key detected',
    suggestion: 'Move to environment variable: FLASHBOTS_KEY',
  },
  {
    id: 'eden-network-key',
    name: 'Eden Network API Key',
    pattern: /eden[^a-zA-Z0-9]*network[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Eden Network API key detected',
    suggestion: 'Move to environment variable: EDEN_NETWORK_KEY',
  },
  {
    id: 'bloXroute-key',
    name: 'bloXroute API Key',
    pattern: /bloxroute[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'bloXroute API key detected',
    suggestion: 'Move to environment variable: BLOXROUTE_KEY',
  },

  // ============================================
  // OAuth & Authentication Providers
  // ============================================
  {
    id: 'google-oauth-client-id',
    name: 'Google OAuth Client ID',
    pattern: /[0-9]+-[a-zA-Z0-9_]{32}\.apps\.googleusercontent\.com/g,
    severity: 'medium',
    description: 'Google OAuth Client ID detected',
    suggestion: 'Move to environment variable: GOOGLE_CLIENT_ID',
  },
  {
    id: 'google-oauth-client-secret',
    name: 'Google OAuth Client Secret',
    pattern: /GOCSPX-[a-zA-Z0-9_-]{28}/g,
    severity: 'critical',
    description: 'Google OAuth Client Secret detected',
    suggestion: 'Move to environment variable: GOOGLE_CLIENT_SECRET',
  },
  {
    id: 'apple-team-id',
    name: 'Apple Team ID',
    pattern: /(?:team[_-]?id|apple[_-]?team|TEAM_ID|APPLE_TEAM_ID)[\s=:'"]*([A-Z0-9]{10})\b/gi,
    severity: 'medium',
    description: 'Apple Team ID detected',
    suggestion: 'Move to environment variable: APPLE_TEAM_ID',
  },
  {
    id: 'apple-private-key',
    name: 'Apple Private Key',
    pattern: /-----BEGIN PRIVATE KEY-----[^-]+-----END PRIVATE KEY-----/gs,
    severity: 'critical',
    description: 'Apple private key detected',
    suggestion: 'Remove private key and add to .gitignore',
  },
  {
    id: 'facebook-app-id',
    name: 'Facebook App ID',
    pattern: /facebook[^a-zA-Z0-9]*app[^a-zA-Z0-9]*id[^a-zA-Z0-9]*[0-9]{15,16}/gi,
    severity: 'medium',
    description: 'Facebook App ID detected',
    suggestion: 'Move to environment variable: FACEBOOK_APP_ID',
  },
  {
    id: 'facebook-app-secret',
    name: 'Facebook App Secret',
    pattern: /facebook[^a-zA-Z0-9]*app[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'critical',
    description: 'Facebook App Secret detected',
    suggestion: 'Move to environment variable: FACEBOOK_APP_SECRET',
  },
  {
    id: 'twitter-api-key',
    name: 'Twitter API Key',
    pattern: /twitter[^a-zA-Z0-9]*api[^a-zA-Z0-9]*key[^a-zA-Z0-9]*[a-zA-Z0-9]{25}/gi,
    severity: 'critical',
    description: 'Twitter API Key detected',
    suggestion: 'Move to environment variable: TWITTER_API_KEY',
  },
  {
    id: 'twitter-api-secret',
    name: 'Twitter API Secret',
    pattern: /twitter[^a-zA-Z0-9]*api[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-zA-Z0-9]{50}/gi,
    severity: 'critical',
    description: 'Twitter API Secret detected',
    suggestion: 'Move to environment variable: TWITTER_API_SECRET',
  },
  {
    id: 'twitter-bearer-token',
    name: 'Twitter Bearer Token',
    pattern: /twitter[^a-zA-Z0-9]*bearer[^a-zA-Z0-9]*[a-zA-Z0-9%]{112}/gi,
    severity: 'critical',
    description: 'Twitter Bearer Token detected',
    suggestion: 'Move to environment variable: TWITTER_BEARER_TOKEN',
  },
  {
    id: 'linkedin-client-id',
    name: 'LinkedIn Client ID',
    pattern: /linkedin[^a-zA-Z0-9]*client[^a-zA-Z0-9]*id[^a-zA-Z0-9]*[a-zA-Z0-9]{14}/gi,
    severity: 'medium',
    description: 'LinkedIn Client ID detected',
    suggestion: 'Move to environment variable: LINKEDIN_CLIENT_ID',
  },
  {
    id: 'linkedin-client-secret',
    name: 'LinkedIn Client Secret',
    pattern: /linkedin[^a-zA-Z0-9]*client[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-zA-Z0-9]{16}/gi,
    severity: 'critical',
    description: 'LinkedIn Client Secret detected',
    suggestion: 'Move to environment variable: LINKEDIN_CLIENT_SECRET',
  },
  {
    id: 'microsoft-client-id',
    name: 'Microsoft Client ID',
    pattern: /microsoft[^a-zA-Z0-9]*client[^a-zA-Z0-9]*id[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'medium',
    description: 'Microsoft Client ID detected',
    suggestion: 'Move to environment variable: MICROSOFT_CLIENT_ID',
  },
  {
    id: 'microsoft-client-secret',
    name: 'Microsoft Client Secret',
    pattern: /microsoft[^a-zA-Z0-9]*client[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-zA-Z0-9_~.-]{34}/gi,
    severity: 'critical',
    description: 'Microsoft Client Secret detected',
    suggestion: 'Move to environment variable: MICROSOFT_CLIENT_SECRET',
  },

  // ============================================
  // Web3 Authentication & Wallet Services
  // ============================================
  {
    id: 'privy-app-id',
    name: 'Privy App ID',
    pattern: /privy[^a-zA-Z0-9]*app[^a-zA-Z0-9]*id[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'medium',
    description: 'Privy App ID detected',
    suggestion: 'Move to environment variable: PRIVY_APP_ID',
  },
  {
    id: 'privy-app-secret',
    name: 'Privy App Secret',
    pattern: /privy[^a-zA-Z0-9]*app[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-zA-Z0-9_-]{64,}/gi,
    severity: 'critical',
    description: 'Privy App Secret detected',
    suggestion: 'Move to environment variable: PRIVY_APP_SECRET',
  },
  {
    id: 'circle-api-key',
    name: 'Circle API Key',
    pattern: /circle[^a-zA-Z0-9]*api[^a-zA-Z0-9]*key[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'Circle API Key detected',
    suggestion: 'Move to environment variable: CIRCLE_API_KEY',
  },
  {
    id: 'circle-entity-secret',
    name: 'Circle Entity Secret',
    pattern: /circle[^a-zA-Z0-9]*entity[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-f0-9]{64}/gi,
    severity: 'critical',
    description: 'Circle Entity Secret detected',
    suggestion: 'Move to environment variable: CIRCLE_ENTITY_SECRET',
  },
  {
    id: 'auth0-domain',
    name: 'Auth0 Domain',
    pattern: /[a-zA-Z0-9_-]+\.auth0\.com/g,
    severity: 'medium',
    description: 'Auth0 domain detected',
    suggestion: 'Move to environment variable: AUTH0_DOMAIN',
  },
  {
    id: 'auth0-client-id',
    name: 'Auth0 Client ID',
    pattern: /auth0[^a-zA-Z0-9]*client[^a-zA-Z0-9]*id[^a-zA-Z0-9]*[a-zA-Z0-9]{32}/gi,
    severity: 'medium',
    description: 'Auth0 Client ID detected',
    suggestion: 'Move to environment variable: AUTH0_CLIENT_ID',
  },
  {
    id: 'auth0-client-secret',
    name: 'Auth0 Client Secret',
    pattern: /auth0[^a-zA-Z0-9]*client[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-zA-Z0-9_-]{64}/gi,
    severity: 'critical',
    description: 'Auth0 Client Secret detected',
    suggestion: 'Move to environment variable: AUTH0_CLIENT_SECRET',
  },
  {
    id: 'firebase-api-key',
    name: 'Firebase API Key',
    pattern: /firebase[^a-zA-Z0-9]*api[^a-zA-Z0-9]*key[^a-zA-Z0-9]*AIza[0-9A-Za-z\-_]{35}/gi,
    severity: 'high',
    description: 'Firebase API Key detected',
    suggestion: 'Move to environment variable: FIREBASE_API_KEY',
  },
  {
    id: 'firebase-private-key',
    name: 'Firebase Private Key',
    pattern: /firebase[^a-zA-Z0-9]*private[^a-zA-Z0-9]*key[^a-zA-Z0-9]*-----BEGIN PRIVATE KEY-----/gi,
    severity: 'critical',
    description: 'Firebase Private Key detected',
    suggestion: 'Remove private key and add to .gitignore',
  },
  {
    id: 'supabase-anon-key',
    name: 'Supabase Anonymous Key',
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*.*supabase/gi,
    severity: 'medium',
    description: 'Supabase Anonymous Key detected',
    suggestion: 'Move to environment variable: SUPABASE_ANON_KEY',
  },
  {
    id: 'clerk-publishable-key',
    name: 'Clerk Publishable Key',
    pattern: /pk_test_[a-zA-Z0-9_-]{26}|pk_live_[a-zA-Z0-9_-]{26}/g,
    severity: 'medium',
    description: 'Clerk Publishable Key detected',
    suggestion: 'Move to environment variable: CLERK_PUBLISHABLE_KEY',
  },
  {
    id: 'clerk-secret-key',
    name: 'Clerk Secret Key',
    pattern: /sk_test_[a-zA-Z0-9_-]{26}|sk_live_[a-zA-Z0-9_-]{26}/g,
    severity: 'critical',
    description: 'Clerk Secret Key detected',
    suggestion: 'Move to environment variable: CLERK_SECRET_KEY',
  },

  // ============================================
  // Additional On/Off Ramp & Financial Services
  // ============================================
  {
    id: 'ramp-api-key',
    name: 'Ramp API Key',
    pattern: /ramp[^a-zA-Z0-9]*api[^a-zA-Z0-9]*key[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Ramp API Key detected',
    suggestion: 'Move to environment variable: RAMP_API_KEY',
  },
  {
    id: 'onramper-api-key',
    name: 'Onramper API Key',
    pattern: /onramper[^a-zA-Z0-9]*api[^a-zA-Z0-9]*key[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Onramper API Key detected',
    suggestion: 'Move to environment variable: ONRAMPER_API_KEY',
  },
  {
    id: 'changelly-api-key',
    name: 'Changelly API Key',
    pattern: /changelly[^a-zA-Z0-9]*api[^a-zA-Z0-9]*key[^a-zA-Z0-9]*[a-f0-9]{32}/gi,
    severity: 'critical',
    description: 'Changelly API Key detected',
    suggestion: 'Move to environment variable: CHANGELLY_API_KEY',
  },
  {
    id: 'changelly-secret',
    name: 'Changelly Secret',
    pattern: /changelly[^a-zA-Z0-9]*secret[^a-zA-Z0-9]*[a-f0-9]{64}/gi,
    severity: 'critical',
    description: 'Changelly Secret detected',
    suggestion: 'Move to environment variable: CHANGELLY_SECRET',
  },
  {
    id: 'coingate-api-key',
    name: 'CoinGate API Key',
    pattern: /coingate[^a-zA-Z0-9]*api[^a-zA-Z0-9]*key[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'CoinGate API Key detected',
    suggestion: 'Move to environment variable: COINGATE_API_KEY',
  },
  {
    id: 'bitpay-token',
    name: 'BitPay Token',
    pattern: /bitpay[^a-zA-Z0-9]*token[^a-zA-Z0-9]*[a-zA-Z0-9]{52}/gi,
    severity: 'critical',
    description: 'BitPay Token detected',
    suggestion: 'Move to environment variable: BITPAY_TOKEN',
  },
  {
    id: 'coinbase-commerce-key',
    name: 'Coinbase Commerce API Key',
    pattern: /coinbase[^a-zA-Z0-9]*commerce[^a-zA-Z0-9]*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    severity: 'critical',
    description: 'Coinbase Commerce API Key detected',
    suggestion: 'Move to environment variable: COINBASE_COMMERCE_API_KEY',
  },
  {
    id: 'coinbase-wallet-key',
    name: 'Coinbase Wallet API Key',
    pattern: /coinbase[^a-zA-Z0-9]*wallet[^a-zA-Z0-9]*[a-zA-Z0-9_-]{32,}/gi,
    severity: 'critical',
    description: 'Coinbase Wallet API Key detected',
    suggestion: 'Move to environment variable: COINBASE_WALLET_API_KEY',
  },

  // ============================================
  // Security Tokens and JWT Secrets
  // ============================================
  {
    id: 'jwt-secret',
    name: 'JWT Secret Key',
    pattern: /jwt[_-]?secret\s*[:=]\s*['"]([a-zA-Z0-9_\-+/=]{32,})['"]/gi,
    severity: 'critical',
    description: 'JWT secret key detected',
    suggestion: 'Move to environment variable: JWT_SECRET',
  },
  {
    id: 'session-secret',
    name: 'Session Secret',
    pattern: /session[_-]?secret\s*[:=]\s*['"]([a-zA-Z0-9_\-+/=]{32,})['"]/gi,
    severity: 'critical',
    description: 'Session secret key detected',
    suggestion: 'Move to environment variable: SESSION_SECRET',
  },
  {
    id: 'cookie-secret',
    name: 'Cookie Secret',
    pattern: /cookie[_-]?secret\s*[:=]\s*['"]([a-zA-Z0-9_\-+/=]{8,})['"]/gi,
    severity: 'critical',
    description: 'Cookie secret key detected',
    suggestion: 'Move to environment variable: COOKIE_SECRET',
  },
  {
    id: 'csrf-token',
    name: 'CSRF Token',
    pattern: /csrf[_-]?token\s*[:=]\s*['"]([a-zA-Z0-9_\-+/=]{32,})['"]/gi,
    severity: 'high',
    description: 'CSRF token detected',
    suggestion: 'Generate CSRF tokens dynamically, do not hardcode',
  },
  {
    id: 'api-signature-key',
    name: 'API Signature Key',
    pattern: /signature[_-]?key\s*[:=]\s*['"]([a-zA-Z0-9_\-+/=]{32,})['"]/gi,
    severity: 'critical',
    description: 'API signature key detected',
    suggestion: 'Move to environment variable: API_SIGNATURE_KEY',
  },
  {
    id: 'webhook-secret',
    name: 'Webhook Secret',
    pattern: /webhook[_-]?secret\s*[:=]\s*['"]([a-zA-Z0-9_\-+/=]{8,})['"]/gi,
    severity: 'high',
    description: 'Webhook secret detected',
    suggestion: 'Move to environment variable: WEBHOOK_SECRET',
  },

  // ============================================
  // Secret File Patterns (Files that should be in .gitignore)
  // ============================================
  {
    id: 'env-file-content',
    name: '.env File Content',
    pattern: /^[A-Z_][A-Z0-9_]*\s*=\s*.+$/gm,
    severity: 'medium',
    description: 'Environment variable assignment detected (possible .env file content)',
    suggestion: 'Ensure .env files are in .gitignore and not committed',
  },
  {
    id: 'config-json-secrets',
    name: 'Config File Secrets',
    pattern: /"(apiKey|secretKey|password|token|secret|key)"\s*:\s*"[^"]{8,}"/gi,
    severity: 'high',
    description: 'Secret in JSON configuration detected',
    suggestion: 'Move secrets to environment variables and add config files to .gitignore',
  },
  {
    id: 'yaml-secrets',
    name: 'YAML Configuration Secrets',
    pattern: /(apiKey|secretKey|password|token|secret|key):\s*['"]*[a-zA-Z0-9_\-+/=]{8,}['"]*$/gmi,
    severity: 'high',
    description: 'Secret in YAML configuration detected',
    suggestion: 'Move secrets to environment variables and add config files to .gitignore',
  },
  {
    id: 'docker-env-secrets',
    name: 'Docker Environment Secrets',
    pattern: /ENV\s+[A-Z_][A-Z0-9_]*\s*=\s*[a-zA-Z0-9_\-+/=]{8,}/gi,
    severity: 'high',
    description: 'Secret in Dockerfile ENV instruction detected',
    suggestion: 'Use Docker secrets or build-time arguments instead',
  },
  {
    id: 'kubernetes-secret',
    name: 'Kubernetes Secret',
    pattern: /data:\s*\n\s*[a-zA-Z0-9_\-]+:\s*[a-zA-Z0-9+/=]+/g,
    severity: 'critical',
    description: 'Kubernetes secret data detected',
    suggestion: 'Use Kubernetes secret management instead of hardcoded values',
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
