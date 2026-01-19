/**
 * Avanasec - Web3/Blockchain Pattern Tests
 * Tests for Web3, blockchain, and cryptocurrency secret detection patterns
 */

import { describe, it, expect } from 'vitest';
import { SECRET_PATTERNS } from '../../src/rules/secret-patterns';

describe('Web3/Blockchain Secret Patterns', () => {
  const web3Patterns = SECRET_PATTERNS.filter(p => 
    p.id.includes('ethereum') || 
    p.id.includes('bitcoin') || 
    p.id.includes('mnemonic') ||
    p.id.includes('solana') ||
    p.id.includes('metamask') ||
    p.id.includes('infura') ||
    p.id.includes('alchemy') ||
    p.id.includes('moralis') ||
    p.id.includes('web3') ||
    p.id.includes('pinata') ||
    p.id.includes('coinbase') ||
    p.id.includes('binance') ||
    p.id.includes('next-public') ||
    p.id.includes('hardhat') ||
    p.id.includes('truffle') ||
    p.id.includes('keystore') ||
    p.id.includes('wallet') ||
    p.id.includes('tron') ||
    p.id.includes('near') ||
    p.id.includes('cosmos') ||
    p.id.includes('polkadot') ||
    p.id.includes('cardano') ||
    p.id.includes('avalanche') ||
    p.id.includes('algorand') ||
    p.id.includes('stellar') ||
    p.id.includes('ripple') ||
    p.id.includes('chainlink') ||
    p.id.includes('polygon') ||
    p.id.includes('bsc') ||
    p.id.includes('fantom') ||
    p.id.includes('arbitrum') ||
    p.id.includes('optimism') ||
    p.id.includes('quicknode') ||
    p.id.includes('ankr') ||
    p.id.includes('getblock') ||
    p.id.includes('nodereal') ||
    p.id.includes('pokt') ||
    p.id.includes('thegraph') ||
    p.id.includes('uniswap') ||
    p.id.includes('compound') ||
    p.id.includes('aave') ||
    p.id.includes('opensea') ||
    p.id.includes('rarible') ||
    p.id.includes('nftport') ||
    p.id.includes('etherscan') ||
    p.id.includes('bscscan') ||
    p.id.includes('polygonscan') ||
    p.id.includes('dune')
  );

  describe('Ethereum Private Key Detection', () => {
    const pattern = web3Patterns.find(p => p.id === 'ethereum-private-key');

    it('should detect valid Ethereum private keys', () => {
      const testCases = [
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        'const privateKey = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect invalid Ethereum private keys', () => {
      const testCases = [
        '0x123', // Too short
        '0xgg34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // Invalid characters
        'privateKey = "not-a-key"',
        '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' // Missing 0x prefix
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have critical severity', () => {
      expect(pattern!.severity).toBe('critical');
    });
  });

  describe('Bitcoin Private Key (WIF) Detection', () => {
    const pattern = web3Patterns.find(p => p.id === 'bitcoin-private-key-wif');

    it('should detect valid Bitcoin WIF private keys', () => {
      const testCases = [
        '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
        'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617',
        'L1aW4aubDFB7yfras2S1mN3bqg9nwySY8nkoLmJebSLD5BWv3ENZ'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect invalid Bitcoin WIF keys', () => {
      const testCases = [
        '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', // Bitcoin address, not private key
        '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyT', // Too short
        'not-a-bitcoin-key'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have critical severity', () => {
      expect(pattern!.severity).toBe('critical');
    });
  });

  describe('Mnemonic Seed Phrase Detection', () => {
    const pattern = web3Patterns.find(p => p.id === 'mnemonic-seed-phrase');

    it('should detect valid 12-word mnemonic phrases', () => {
      const testCases = [
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong',
        'const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should detect valid 24-word mnemonic phrases', () => {
      const testCases = [
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art',
        'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect invalid mnemonic phrases', () => {
      const testCases = [
        'abandon abandon abandon', // Too few words
        'not valid mnemonic words here at all',
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon' // 11 words, too few
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have critical severity', () => {
      expect(pattern!.severity).toBe('critical');
    });
  });

  describe('NEXT_PUBLIC Warning Detection', () => {
    const pattern = web3Patterns.find(p => p.id === 'next-public-warning');

    it('should detect NEXT_PUBLIC variables with sensitive names', () => {
      const testCases = [
        'NEXT_PUBLIC_API_SECRET = "secret123"',
        'NEXT_PUBLIC_PRIVATE_KEY = "0x123"',
        'NEXT_PUBLIC_SECRET_TOKEN = "token123"',
        'NEXT_PUBLIC_PASSWORD = "pass123"',
        'NEXT_PUBLIC_JWT_SECRET = "jwt123"'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect safe NEXT_PUBLIC variables', () => {
      const testCases = [
        'NEXT_PUBLIC_API_URL = "https://api.example.com"',
        'NEXT_PUBLIC_APP_NAME = "MyApp"',
        'NEXT_PUBLIC_VERSION = "1.0.0"',
        'API_SECRET = "secret123"' // Not NEXT_PUBLIC
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have high severity', () => {
      expect(pattern!.severity).toBe('high');
    });
  });

  describe('MetaMask Vault Detection', () => {
    const pattern = web3Patterns.find(p => p.id === 'metamask-vault');

    it('should detect MetaMask vault data', () => {
      const testCases = [
        '{"vault": "encrypted-vault-data-here"}',
        '"vault" : "U2FsdGVkX1+encrypted+vault+data"',
        'localStorage.setItem("vault", "encrypted-data");'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect non-vault data', () => {
      const testCases = [
        '{"data": "some-other-data"}',
        '"password": "encrypted-password"',
        'vault = "not-json-format"'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have critical severity', () => {
      expect(pattern!.severity).toBe('critical');
    });
  });

  describe('Hardhat Private Key Detection', () => {
    const pattern = web3Patterns.find(p => p.id === 'hardhat-private-key');

    it('should detect Hardhat private key configurations', () => {
      const testCases = [
        'PRIVATE_KEY = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"',
        'PRIVATE_KEY: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"',
        "PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'"
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect non-private key configurations', () => {
      const testCases = [
        'PUBLIC_KEY = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"',
        'PRIVATE_KEY = process.env.PRIVATE_KEY',
        'API_KEY = "some-api-key"'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have critical severity', () => {
      expect(pattern!.severity).toBe('critical');
    });
  });

  describe('Ethereum Keystore Detection', () => {
    const pattern = web3Patterns.find(p => p.id === 'ethereum-keystore');

    it('should detect Ethereum keystore files', () => {
      const testCases = [
        '{"crypto": {"cipher": "aes-128-ctr", "ciphertext": "encrypted"}}',
        '"crypto" : { "cipher" : "aes-128-ctr" }',
        'crypto : { cipher : "aes-128-ctr", kdf: "scrypt" }'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect non-keystore crypto references', () => {
      const testCases = [
        '{"crypto": {"algorithm": "sha256"}}',
        '"encryption": "aes-256-gcm"',
        'crypto.randomBytes(32)'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have critical severity', () => {
      expect(pattern!.severity).toBe('critical');
    });
  });

  describe('Additional Blockchain Networks', () => {
    it('should detect NEAR Protocol private keys', () => {
      const pattern = web3Patterns.find(p => p.id === 'near-private-key');
      const testCases = [
        'ed25519:3D4YudUahN1HMEHdiL5uyaJmnW1PntYethJGwtSE9myXyV2H1h4qs3VfEDgSusAN4dAd4MZM7A1GzqaMzzYhxSoR',
        'const nearKey = "ed25519:5KiANvhzRBerazeq4YBzaN6nVCcfEenfQARr5J9cKV2jbVgd3nMTLuFcZrfvAmBrghX1Z2k1Qv7V4V4V4V4V4V4V";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
      });
    });

    it('should detect Stellar private keys', () => {
      const pattern = web3Patterns.find(p => p.id === 'stellar-private-key');
      const testCases = [
        'SAZNPVUAZNPVUAZNPVUAZNPVUAZNPVUAZNPVUAZNPVUAZNPVUAZNPVUAZ',
        'const stellarSecret = "SBGWSG6BTNCKCOB3DIFBGCVMUPQFYPA2G4O34RMTB343OYPXU5DJDVMN";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
      });
    });

    it('should detect Avalanche private keys', () => {
      const pattern = web3Patterns.find(p => p.id === 'avalanche-private-key');
      const testCases = [
        'PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN',
        'const avaxKey = "PrivateKey-2w4XiXxPfQK4TypYqnohRL8DRNTz9cGiGmwQ1zmgEqD9c9KWLq";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
      });
    });
  });

  describe('Blockchain Service API Keys', () => {
    it('should detect QuickNode API keys', () => {
      const pattern = web3Patterns.find(p => p.id === 'quicknode-api-key');
      const testCases = [
        'quicknode_api_key = "abc123def456ghi789"',
        'QUICKNODE_TOKEN: "xyz789abc123def456"',
        'const quicknodeKey = "qn_abc123def456";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
      });
    });

    it('should detect Etherscan API keys', () => {
      const pattern = web3Patterns.find(p => p.id === 'etherscan-api-key');
      const testCases = [
        'etherscan_api_key = "YourApiKeyToken"',
        'ETHERSCAN_API_KEY: "ABC123DEF456GHI789JKL012MNO345PQR6"',
        'const etherscanKey = "XYZ789ABC123DEF456GHI789JKL012MNO3";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
      });
    });
  });

  describe('DeFi and NFT Platform Keys', () => {
    it('should detect OpenSea API keys', () => {
      const pattern = web3Patterns.find(p => p.id === 'opensea-api-key');
      const testCases = [
        'opensea_api_key = "abc123def456"',
        'OPENSEA_TOKEN: "xyz789abc123"',
        'const openseaKey = "os_abc123def456";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
      });
    });

    it('should detect Uniswap API keys', () => {
      const pattern = web3Patterns.find(p => p.id === 'uniswap-api-key');
      const testCases = [
        'uniswap_api_key = "uni_abc123def456"',
        'UNISWAP_TOKEN: "xyz789abc123"',
        'const uniswapKey = "uniswap_xyz789";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
      });
    });
  });
    const pattern = web3Patterns.find(p => p.id === 'web3-provider-url');

    it('should detect Infura URLs with API keys', () => {
      const testCases = [
        'https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef',
        'https://goerli.infura.io/v3/abcdef1234567890abcdef1234567890',
        'const provider = "https://polygon-mainnet.infura.io/v3/1234567890abcdef1234567890abcdef";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect URLs without API keys', () => {
      const testCases = [
        'https://mainnet.infura.io/v3/',
        'https://ethereum.org',
        'https://example.com/api/v3/1234567890abcdef1234567890abcdef'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have high severity', () => {
      expect(pattern!.severity).toBe('high');
    });
  });

  describe('Web3 Provider URL Detection', () => {
    const pattern = web3Patterns.find(p => p.id === 'web3-provider-url');

    it('should detect Infura URLs with API keys', () => {
      const testCases = [
        'https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef',
        'https://goerli.infura.io/v3/abcdef1234567890abcdef1234567890',
        'const provider = "https://polygon-mainnet.infura.io/v3/1234567890abcdef1234567890abcdef";'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeTruthy();
        expect(matches!.length).toBeGreaterThan(0);
      });
    });

    it('should not detect URLs without API keys', () => {
      const testCases = [
        'https://mainnet.infura.io/v3/',
        'https://ethereum.org',
        'https://example.com/api/v3/1234567890abcdef1234567890abcdef'
      ];

      testCases.forEach(testCase => {
        const matches = testCase.match(pattern!.pattern);
        expect(matches).toBeFalsy();
      });
    });

    it('should have high severity', () => {
      expect(pattern!.severity).toBe('high');
    });
  });

  describe('Comprehensive Pattern Coverage', () => {
    it('should have comprehensive Web3/blockchain pattern coverage', () => {
      const expectedPatterns = [
        'ethereum-private-key',
        'bitcoin-private-key-wif',
        'mnemonic-seed-phrase',
        'solana-private-key',
        'metamask-vault',
        'infura-api-key',
        'alchemy-api-key',
        'moralis-api-key',
        'web3-storage-token',
        'pinata-api-key',
        'coinbase-api-key',
        'binance-api-key',
        'next-public-warning',
        'hardhat-private-key',
        'truffle-mnemonic',
        'web3-provider-url',
        'ethereum-keystore',
        'wallet-connect-project-id',
        // Additional blockchain networks
        'tron-private-key',
        'near-private-key',
        'cosmos-private-key',
        'polkadot-private-key',
        'cardano-private-key',
        'avalanche-private-key',
        'algorand-private-key',
        'stellar-private-key',
        'ripple-private-key',
        'polygon-private-key',
        // Blockchain services
        'quicknode-api-key',
        'etherscan-api-key',
        'opensea-api-key',
        'uniswap-api-key'
      ];

      expectedPatterns.forEach(patternId => {
        const pattern = web3Patterns.find(p => p.id === patternId);
        expect(pattern).toBeDefined();
        expect(pattern!.name).toBeTruthy();
        expect(pattern!.description).toBeTruthy();
        expect(pattern!.suggestion).toBeTruthy();
        expect(['critical', 'high', 'medium', 'low']).toContain(pattern!.severity);
      });
    });

    it('should have at least 50 Web3/blockchain patterns', () => {
      expect(web3Patterns.length).toBeGreaterThanOrEqual(50);
    });

    it('should have appropriate severity levels for Web3 patterns', () => {
      const criticalPatterns = web3Patterns.filter(p => p.severity === 'critical');
      const highPatterns = web3Patterns.filter(p => p.severity === 'high');
      
      // Private keys and seed phrases should be critical
      expect(criticalPatterns.length).toBeGreaterThanOrEqual(6);
      
      // API keys and public warnings should be high
      expect(highPatterns.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Real-world Test Cases', () => {
    it('should detect secrets in common Web3 configuration files', () => {
      const hardhatConfig = `
        module.exports = {
          networks: {
            mainnet: {
              url: "https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef",
              accounts: ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"]
            }
          }
        };
      `;

      const truffleConfig = `
        module.exports = {
          networks: {
            development: {
              mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
            }
          }
        };
      `;

      const nextjsEnv = `
        NEXT_PUBLIC_API_SECRET=secret123
        NEXT_PUBLIC_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
      `;

      // Test Hardhat config
      let foundSecrets = 0;
      web3Patterns.forEach(pattern => {
        if (hardhatConfig.match(pattern.pattern)) {
          foundSecrets++;
        }
      });
      expect(foundSecrets).toBeGreaterThan(0);

      // Test Truffle config
      foundSecrets = 0;
      web3Patterns.forEach(pattern => {
        if (truffleConfig.match(pattern.pattern)) {
          foundSecrets++;
        }
      });
      expect(foundSecrets).toBeGreaterThan(0);

      // Test Next.js env
      foundSecrets = 0;
      web3Patterns.forEach(pattern => {
        if (nextjsEnv.match(pattern.pattern)) {
          foundSecrets++;
        }
      });
      expect(foundSecrets).toBeGreaterThan(0);
    });

    it('should not produce false positives on legitimate code', () => {
      const legitimateCode = `
        const publicKey = "0x1234567890abcdef1234567890abcdef12345678"; // Too short for private key
        const apiUrl = "https://api.example.com/v1/data";
        const NEXT_PUBLIC_APP_NAME = "MyDApp";
        const words = ["hello", "world", "test"]; // Not a mnemonic
        const config = { network: "mainnet" };
        const shortHex = "abc123"; // Too short for any key
      `;

      let falsePositives = 0;
      web3Patterns.forEach(pattern => {
        if (legitimateCode.match(pattern.pattern)) {
          falsePositives++;
        }
      });
      
      // Should have minimal false positives (allowing for some generic patterns)
      expect(falsePositives).toBeLessThan(5);
    });
  });
});

/**
 * **Validates: Requirements 13.1, 13.2, 13.3, 13.4**
 * 
 * This test suite validates the Web3/blockchain secret detection patterns:
 * - Ethereum private keys (64-character hex strings with 0x prefix)
 * - Bitcoin private keys in WIF format
 * - BIP39 mnemonic seed phrases (12-24 words)
 * - Solana private keys
 * - MetaMask vault data
 * - Web3 service API keys (Infura, Alchemy, Moralis, etc.)
 * - NEXT_PUBLIC environment variable warnings
 * - Hardhat and Truffle configuration secrets
 * - Ethereum keystore files
 * - Web3 provider URLs with embedded API keys
 * 
 * The tests ensure comprehensive coverage of Web3/blockchain security patterns
 * while minimizing false positives on legitimate code.
 */