// coverage-functions.test.js
import { describe, expect, test } from '@jest/globals';
import { markdownTable } from 'markdown-table';
import { calculateCoverage, renderChangedFilesIndividual } from './index.js';

describe('calculateCoverage', () => {
  test('calculates coverage correctly for a file with coverage', () => {
    const file = {
      file: '/path/to/file.js',
      lines: {
        found: 100,
        hit: 80
      }
    };
    const minimumCoverage = 75;
    
    const result = calculateCoverage(file, minimumCoverage);
    
    expect(result).toEqual({
      file: '/path/to/file.js',
      coverage: 80,
      passed: true
    });
  });
  
  test('handles file with no lines', () => {
    const file = {
      file: '/path/to/emptyfile.js',
      lines: {
        found: 0,
        hit: 0
      }
    };
    const minimumCoverage = 75;
    
    const result = calculateCoverage(file, minimumCoverage);
    
    expect(result).toEqual({
      file: '/path/to/emptyfile.js',
      coverage: 0,
      passed: false
    });
  });
  
  test('marks file as failed when below threshold', () => {
    const file = {
      file: '/path/to/poorlycovered.js',
      lines: {
        found: 100,
        hit: 50
      }
    };
    const minimumCoverage = 75;
    
    const result = calculateCoverage(file, minimumCoverage);
    
    expect(result).toEqual({
      file: '/path/to/poorlycovered.js',
      coverage: 50,
      passed: false
    });
  });
  
  test('marks file as passed when exactly at threshold', () => {
    const file = {
      file: '/path/to/exactcoverage.js',
      lines: {
        found: 100,
        hit: 75
      }
    };
    const minimumCoverage = 75;
    
    const result = calculateCoverage(file, minimumCoverage);
    
    expect(result).toEqual({
      file: '/path/to/exactcoverage.js',
      coverage: 75,
      passed: true
    });
  });
});

describe('renderChangedFilesIndividual', () => {
  test('renders properly formatted table for changed files', () => {
    const changedFilesResults = [
      { file: '/path/to/file1.js', coverage: 80, passed: true },
      { file: '/path/to/file2.js', coverage: 50, passed: false }
    ];
    const minimumCoverage = 75;
    
    const result = renderChangedFilesIndividual(changedFilesResults, minimumCoverage);
    
    expect(result).toContain('#### Individual Changed Files (Minimum: 75%)');
    expect(result).toContain('file1.js');
    expect(result).toContain('file2.js');
    expect(result).toContain('80.0%');
    expect(result).toContain('50.0%');
    expect(result).toContain('✅');
    expect(result).toContain('❌');
  });
  
  test('returns empty string when no changed files', () => {
    const result = renderChangedFilesIndividual([], 75);
    expect(result).toBe('');
  });
  
  test('returns empty string when changedFilesResults is undefined', () => {
    const result = renderChangedFilesIndividual(undefined, 75);
    expect(result).toBe('');
  });
  
  test('renders table with correct structure', () => {
    const changedFilesResults = [
      { file: '/path/to/file1.js', coverage: 80, passed: true }
    ];
    const minimumCoverage = 75;
    
    const result = renderChangedFilesIndividual(changedFilesResults, minimumCoverage);
    
    const expectedTableContent = markdownTable([
      ['File', 'Coverage', 'Status'],
      ['file1.js', '80.0%', '✅']
    ]);
    
    expect(result).toContain(expectedTableContent);
  });
  
  test('handles multiple files with different statuses', () => {
    const changedFilesResults = [
      { file: '/path/to/file1.js', coverage: 90, passed: true },
      { file: '/path/to/file2.js', coverage: 60, passed: false },
      { file: '/path/to/file3.js', coverage: 75, passed: true }
    ];
    const minimumCoverage = 75;
    
    const result = renderChangedFilesIndividual(changedFilesResults, minimumCoverage);
    
    expect(result).toContain('file1.js');
    expect(result).toContain('file2.js');
    expect(result).toContain('file3.js');
    expect(result).toContain('90.0%');
    expect(result).toContain('60.0%');
    expect(result).toContain('75.0%');
    expect(result.match(/✅/g).length).toBe(2);
    expect(result.match(/❌/g).length).toBe(1);
  });
});
