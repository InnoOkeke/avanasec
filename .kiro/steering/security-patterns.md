# Security Patterns: Avana

## Pattern Development Guidelines

This steering file provides context for developing and maintaining Avana's comprehensive security pattern database.

## Pattern Categories

### 1. Authentication & OAuth (25+ patterns)
- **Google**: Client ID, Secret, OAuth tokens, Service Account keys
- **Apple**: App ID, Team ID, Private keys, Push certificates
- **Microsoft**: Azure AD, Office 365, Teams integration
- **Social Media**: Facebook, Twitter/X, LinkedIn, Discord
- **Modern Auth**: Auth0, Firebase, Clerk, Supabase Auth
- **Web3 Auth**: Privy, Circle SDK, WalletConnect, Magic Link

### 2. Payment & Financial (20+ patterns)
- **Traditional**: Stripe, PayPal, Square, Adyen
- **Modern Fintech**: Plaid, Wise, Revolut, Dwolla
- **On/Off Ramps**: MoonPay, Transak, Ramp, Changelly
- **Crypto Exchanges**: Binance, Coinbase Pro, Kraken, FTX
- **Financial Infrastructure**: Circle, BitPay, Coinbase Commerce

### 3. Web3 & Blockchain (30+ patterns)
- **Networks**: Ethereum, Bitcoin, Solana, Polygon, BSC
- **Private Keys**: All major formats (WIF, hex, mnemonic)
- **DeFi Protocols**: Uniswap, Aave, Compound, MakerDAO
- **NFT Platforms**: OpenSea, Rarible, Foundation, SuperRare
- **Analytics**: Etherscan, Dune, The Graph, Moralis
- **Infrastructure**: Infura, Alchemy, QuickNode, Ankr

### 4. Cloud & Infrastructure (15+ patterns)
- **AWS**: Access keys, Secret keys, Session tokens
- **Azure**: Storage keys, Service principals, Certificates
- **GCP**: Service account keys, API keys, OAuth tokens
- **Databases**: Supabase, PlanetScale, Neon, Upstash
- **Email Services**: SendGrid, Mailgun, Postmark, Resend

### 5. Communication & Messaging (10+ patterns)
- **Team Chat**: Slack, Discord, Microsoft Teams
- **Messaging**: Telegram, WhatsApp, Twilio SMS
- **Email**: All major providers and their API keys
- **Webhooks**: Slack, Discord, generic webhook URLs

## Pattern Design Principles

### 1. Precision Over Recall
- **Prefer false negatives** over false positives
- **Context-aware patterns** that consider where secrets typically appear
- **Format-specific matching** tailored to each service's token format
- **Validation logic** to reduce false positives

### 2. Severity Classification
```typescript
// Critical: Immediate security risk, full access
severity: 'critical'  // Private keys, production API keys

// High: Significant risk, limited access
severity: 'high'      // OAuth tokens, database credentials  

// Medium: Moderate risk, public identifiers
severity: 'medium'    // Client IDs, public keys

// Low: Minimal risk, informational
severity: 'low'       // Public endpoints, documentation
```

### 3. Actionable Suggestions
Every pattern must include:
- **Clear description** of what was detected
- **Specific remediation steps** (environment variables, secret management)
- **Security best practices** for the detected service
- **Links to documentation** when helpful

## Pattern Implementation

### Pattern Structure
```typescript
{
  id: 'service-token-type',
  name: 'Human Readable Name',
  pattern: /regex-pattern/g,
  severity: 'critical' | 'high' | 'medium' | 'low',
  description: 'Clear description of detected secret',
  suggestion: 'Specific remediation steps',
}
```

### Regex Best Practices
- **Escape special characters**: `\(`, `\)`, `\[`, `\]`, `\{`, `\}`, `\.`
- **Use word boundaries**: `\b` to avoid partial matches
- **Character classes**: `[a-zA-Z0-9]` instead of `.` when possible
- **Quantifiers**: Specific ranges `{20,40}` instead of `+` or `*`
- **Non-greedy matching**: Use `?` to prevent backtracking

### Testing Requirements
Each pattern must have:
- **Positive test cases**: Real examples that should match
- **Negative test cases**: Similar strings that should NOT match
- **Edge cases**: Boundary conditions and special characters
- **Performance tests**: No catastrophic backtracking

## Service-Specific Guidelines

### OAuth Providers
- **Client IDs**: Usually public, medium severity
- **Client Secrets**: Always critical severity
- **Access Tokens**: Critical, short-lived
- **Refresh Tokens**: Critical, long-lived
- **ID Tokens**: High severity, contains user info

### Payment Processors
- **Live Keys**: Always critical severity
- **Test Keys**: Medium severity (still sensitive)
- **Publishable Keys**: High severity (public but sensitive)
- **Webhook Secrets**: High severity (for verification)

### Blockchain Networks
- **Private Keys**: Always critical severity
- **Seed Phrases**: Critical, 12/24 word mnemonics
- **API Keys**: High severity for infrastructure
- **Contract Addresses**: Low severity (public)

### Cloud Providers
- **Access Keys**: Critical severity
- **Service Account Keys**: Critical severity
- **API Keys**: High severity
- **Connection Strings**: Critical if contains credentials

## Pattern Maintenance

### Adding New Services
1. **Research**: Study the service's authentication documentation
2. **Token Analysis**: Understand token formats and prefixes
3. **Pattern Development**: Create precise regex patterns
4. **Test Cases**: Develop comprehensive test suite
5. **Documentation**: Add clear descriptions and suggestions

### Updating Existing Patterns
1. **Monitor False Positives**: Track and reduce false positive reports
2. **Service Changes**: Update patterns when services change formats
3. **Performance**: Optimize patterns that cause slowdowns
4. **Coverage**: Ensure all token types for a service are covered

### Pattern Validation
```typescript
// All patterns must pass these validations:
- Compiles without errors
- No catastrophic backtracking
- Matches positive test cases
- Rejects negative test cases
- Performance under 100ms per 1MB of text
```

## Security Context

### File Types to Scan
- **Configuration**: `.env`, `config.json`, `settings.yaml`
- **Code**: All programming language files
- **Documentation**: `.md`, `.txt`, `.rst` (common for leaked secrets)
- **Infrastructure**: `docker-compose.yml`, `k8s/*.yaml`
- **CI/CD**: `.github/workflows/`, `.gitlab-ci.yml`

### Files to Ignore
- **Binary Files**: Images, executables, archives
- **Dependencies**: `node_modules/`, `vendor/`, `.git/`
- **Build Outputs**: `dist/`, `build/`, `target/`
- **Generated Files**: Auto-generated code and documentation

### Context Clues
Look for patterns in:
- **Environment Variables**: `API_KEY=`, `SECRET=`, `TOKEN=`
- **Configuration Sections**: `[auth]`, `[database]`, `[api]`
- **Comments**: `# TODO: replace with real key`
- **Variable Names**: `apiKey`, `secretToken`, `privateKey`

## Real-World Impact

### Threat Prevention
- **Credential Exposure**: Prevents API keys in public repositories
- **Financial Loss**: Catches payment processor keys before exposure
- **Data Breaches**: Detects database credentials and admin tokens
- **Supply Chain**: Prevents secrets in open source dependencies

### Developer Education
- **Security Awareness**: Teaches developers about common vulnerabilities
- **Best Practices**: Promotes environment variables and secret management
- **Proactive Prevention**: Catches issues before they reach production
- **Compliance**: Helps meet security audit requirements

## Performance Considerations

### Pattern Optimization
- **Compile Once**: Pre-compile all regex patterns at startup
- **Smart Ordering**: Check most common patterns first
- **Early Exit**: Skip remaining patterns after finding critical issues
- **Memory Efficient**: Stream large files instead of loading entirely

### Scanning Strategy
- **File Filtering**: Skip binary and irrelevant files early
- **Chunk Processing**: Process large files in chunks with overlap
- **Parallel Ready**: Design for future worker thread implementation
- **Caching**: Infrastructure for caching scan results

## Future Enhancements

### Machine Learning Integration
- **Pattern Discovery**: AI-powered detection of unknown secret formats
- **False Positive Reduction**: ML models to improve precision
- **Context Analysis**: Understanding code context for better detection
- **Anomaly Detection**: Identifying unusual patterns that might be secrets

### Advanced Features
- **Custom Patterns**: User-defined patterns via configuration
- **Severity Customization**: Organization-specific severity levels
- **Integration APIs**: REST API for CI/CD integration
- **Real-time Monitoring**: File system watching for continuous scanning

## Resources

- [OWASP Secret Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Regular Expression Security](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)