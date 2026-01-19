/**
 * Simple Web3 Pattern Test
 */

import { describe, it, expect } from 'vitest';
import { SECRET_PATTERNS } from '../../src/rules/secret-patterns';

describe('Web3 Patterns Basic Test', () => {
  it('should have Web3 patterns', () => {
    const web3Patterns = SECRET_PATTERNS.filter(p => 
      p.id.includes('evm') || 
      p.id.includes('bitcoin') || 
      p.id.includes('web3') ||
      p.id.includes('binance') ||
      p.id.includes('coinbase') ||
      p.id.includes('blockchain')
    );
    
    expect(web3Patterns.length).toBeGreaterThanOrEqual(10);
  });

  it('should detect EVM private key', () => {
    const pattern = SECRET_PATTERNS.find(p => p.id === 'evm-private-key');
    expect(pattern).toBeDefined();
    
    const testKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const matches = testKey.match(pattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect Bitcoin private key', () => {
    const pattern = SECRET_PATTERNS.find(p => p.id === 'bitcoin-private-key-wif');
    expect(pattern).toBeDefined();
    
    const testKey = '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ';
    const matches = testKey.match(pattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect mnemonic seed phrase', () => {
    const pattern = SECRET_PATTERNS.find(p => p.id === 'mnemonic-seed-phrase');
    expect(pattern).toBeDefined();
    
    const testPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const matches = testPhrase.match(pattern!.pattern);
    expect(matches).toBeTruthy();
  });
});