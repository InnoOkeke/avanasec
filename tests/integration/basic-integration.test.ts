/**
 * Basic Integration Test
 * Simple test to verify the integrated Avana engine works
 */

import { describe, it, expect } from 'vitest';
import { Avana } from '../../src/index';

describe('Basic Integration', () => {
  it('should create Avana instance', () => {
    const avana = new Avana();
    expect(avana).toBeDefined();
    expect(avana.getPatternCount()).toBeGreaterThan(0);
  });

  it('should get memory stats', () => {
    const avana = new Avana();
    const stats = avana.getMemoryStats();
    expect(stats).toBeDefined();
    expect(stats.currentUsage).toBeGreaterThan(0);
  });
});