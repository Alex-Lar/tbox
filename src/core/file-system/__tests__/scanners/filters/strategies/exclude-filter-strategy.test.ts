import { describe, expect, it } from 'vitest';
import ExcludeFilterStrategy from './exclude-filter-strategy';

describe('ExcludeFilterStrategy', () => {
  const testCases = [
    {
      description: 'should include all when no patterns',
      excludePatterns: [] as string[],
      tests: [
        { path: 'src/index.ts', expected: true },
        { path: 'dist/main.js', expected: true },
        { path: 'node_modules/pkg/index.js', expected: true },
      ],
    },
    {
      description: 'should exclude directories and their contents',
      excludePatterns: ['dist', 'node_modules'],
      tests: [
        { path: 'dist', expected: false },
        { path: 'node_modules', expected: false },

        { path: 'dist/src/index.js', expected: false },
        { path: 'dist/build/main.js', expected: false },
        { path: 'node_modules/lodash/index.js', expected: false },
        { path: 'node_modules/react/package.json', expected: false },

        { path: 'src/dist', expected: false },
        { path: 'src/dist/utils.js', expected: false },
        { path: 'project/node_modules', expected: false },
        { path: 'project/node_modules/vue', expected: false },

        { path: 'src', expected: true },
        { path: 'src/app.js', expected: true },
        { path: 'public/index.html', expected: true },

        { path: 'distribution', expected: true },
        { path: 'dist-test', expected: true },
        { path: 'my_modules', expected: true },
      ],
    },
    {
      description: 'should handle wildcard patterns',
      excludePatterns: ['*.log', 'temp/*', '**/cache/**'],
      tests: [
        { path: 'error.log', expected: false },
        { path: 'logs/access.log', expected: false },
        { path: 'logs/error.log', expected: false },

        { path: 'temp/file.txt', expected: false },
        { path: 'temp/backup.zip', expected: false },

        { path: 'cache/data.bin', expected: false },
        { path: 'src/cache/utils.js', expected: false },
        { path: 'project/src/cache/old/data.bak', expected: false },

        { path: 'src/temp/util.ts', expected: true },
        { path: 'build.log', expected: false },
        { path: 'log.txt', expected: true },
        { path: 'temporary/file.txt', expected: true },
        { path: 'src/cached', expected: true },
      ],
    },
    {
      description: 'should handle multiple patterns',
      excludePatterns: ['*.tmp', 'backup', 'test-coverage'],
      tests: [
        { path: 'file.tmp', expected: false },
        { path: 'tmp/file.tmp', expected: false },
        { path: 'backup', expected: false },
        { path: 'backup/data.zip', expected: false },
        { path: 'test-coverage', expected: false },
        { path: 'test-coverage/lcov.info', expected: false },

        { path: 'src/backup.ts', expected: true },
        { path: 'tmp/file.txt', expected: true },
        { path: 'coverage', expected: true },
      ],
    },
    {
      description: 'should handle edge cases',
      excludePatterns: ['.env', '*.local'],
      tests: [
        { path: '.env', expected: false },
        { path: '.env.production', expected: true },
        { path: 'config.local', expected: false },
        { path: 'settings.local.js', expected: true },

        { path: 'env', expected: true },
        { path: '.environment', expected: true },
        { path: 'local-settings.js', expected: true },
      ],
    },
  ];

  for (const { description, excludePatterns, tests } of testCases) {
    it(description, () => {
      const filter = new ExcludeFilterStrategy(excludePatterns);
      for (const test of tests) {
        expect(
          filter.shouldInclude(test.path),
          `Path: ${test.path}, Patterns: ${excludePatterns}`
        ).toBe(test.expected);
      }
    });
  }

  it('should handle empty path correctly', () => {
    const filter = new ExcludeFilterStrategy(['']);
    expect(filter.shouldInclude('')).toBe(false);
    expect(filter.shouldInclude('src')).toBe(true);
  });
});
