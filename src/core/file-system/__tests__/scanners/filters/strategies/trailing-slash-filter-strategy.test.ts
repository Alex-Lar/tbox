import { describe, expect, it, vi, beforeEach } from 'vitest';
import Logger from '@shared/utils/logger';
import { lstat } from '@shared/utils/file-system';
import { Stats } from 'node:fs';
import TrailingSlashFilterStrategy from '../../../../scanners/filters/strategies/trailing-slash-filter-strategy';

vi.mock('@shared/utils/file-system', () => {
  return {
    lstat: vi.fn(),
  };
});

describe('TrailingSlashFilterStrategy', () => {
  describe('prepareExcludePaths()', () => {
    beforeEach(() => {
      vi.resetAllMocks();

      vi.mocked(lstat).mockResolvedValue({
        isDirectory: () => true,
      } as Stats);
    });

    it('should handle an error when input is a single string', async () => {
      // Arrange
      const errorMessage = 'FS Error';
      vi.mocked(lstat).mockRejectedValueOnce(new Error(errorMessage));

      const warnSpy = vi.spyOn(Logger, 'warn');

      const input = './invalid/path/';
      const expected = new Set([input]);

      // Act
      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      // Assert
      expect(warnSpy).toHaveBeenLastCalledWith(
        `Excluding entry '${input}' due to error: ${errorMessage}`
      );
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });

    it('should handle mixed valid and invalid paths with one error', async () => {
      // Arrange
      const validPath1 = './valid/path1/';
      const validPath2 = './valid/path2/';
      const invalidPath = './invalid/path/';

      const input = [validPath1, invalidPath, validPath2];
      const expected = new Set(input);

      const errorMessage = 'FS Error';

      vi.mocked(lstat).mockImplementation((path) => {
        if (path === validPath1 || path === validPath2) {
          const mockStats: Partial<Stats> = {
            isDirectory: () => true,
          };

          return Promise.resolve(mockStats as Stats);
        }

        return Promise.reject(new Error(errorMessage));
      });

      const warnSpy = vi.spyOn(Logger, 'warn');

      // Act
      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      // Assert
      expect(warnSpy).toHaveBeenLastCalledWith(
        `Excluding entry '${invalidPath}' due to error: ${errorMessage}`
      );
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
      expect(vi.mocked(lstat)).toHaveBeenCalledTimes(input.length);
    });

    it('should handle mixed valid and invalid paths with two errors', async () => {
      // Arrange
      const validPath = './valid/path/';
      const invalidPath1 = './invalid/path1/';
      const invalidPath2 = './invalid/path2/';

      const input = [validPath, invalidPath1, invalidPath2];
      const expected = new Set(input);

      const errorMessage = 'FS Error';

      vi.mocked(lstat).mockImplementation((path) => {
        if (path === validPath) {
          const mockStats = {
            isDirectory: () => true,
          };

          return Promise.resolve(mockStats as Stats);
        }

        return Promise.reject(new Error(errorMessage));
      });

      const warnSpy = vi.spyOn(Logger, 'warn');

      // Act
      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      // Assert
      expect(warnSpy).toHaveBeenLastCalledWith(
        `Excluding entry '${invalidPath2}' due to error: ${errorMessage}`
      );
      expect(warnSpy).toHaveBeenCalledTimes(2);
      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
      expect(vi.mocked(lstat)).toHaveBeenCalledTimes(input.length);
    });

    it('returns empty Set when input path is empty string', async () => {
      const input = '';

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('returns empty Set when input path has no trailing slash', async () => {
      const input = './some/path';

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('returns Set containing input path when it has trailing slash', async () => {
      const input = './some/path/';
      const expected = new Set([input]);

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
      expect(result.size).toBe(1);
    });

    it('returns empty Set when input array is empty', async () => {
      const input: string[] = [];
      const expected = new Set();

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });

    it('returns empty Set when input contains single empty string', async () => {
      const input = [''];
      const expected = new Set();

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });

    it('returns empty Set when input contains multiple empty strings', async () => {
      const input = ['', '', ''];
      const expected = new Set();

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });

    it('returns empty Set for single path without trailing slash', async () => {
      const input = ['./path'];
      const expected = new Set();

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });

    it('returns empty Set for multiple paths without trailing slashes', async () => {
      const input = ['./path', './another-path', './nested/dirpath'];
      const expected = new Set();

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });

    it('returns Set with single path when input has trailing slash', async () => {
      const input = ['./path/'];
      const expected = new Set(['./path/']);

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });

    it('returns Set with correct paths when input contains mixed valid/invalid entries', async () => {
      const input = ['', './invalid', './valid/', 'another-valid/'];
      const expected = new Set(['./valid/', 'another-valid/']);

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });

    it('returns Set with all paths when all inputs have trailing slashes', async () => {
      const input = ['./nested/path/', './path/', './another-path/'];
      const expected = new Set(input);

      const result =
        await TrailingSlashFilterStrategy.prepareExcludePaths(input);

      expect(result).toBeInstanceOf(Set);
      expect(result).toEqual(expected);
    });
  });

  describe('shouldInclude()', () => {
    it('should return true for paths not exactly matching excluded patterns', () => {
      const inputs = [
        './dist',
        'dist/',
        'dist',
        './tests',
        'tests/',
        'tests',
        './nested/dist/',
        './nested/tests/',
      ];
      const excludePatterns = new Set(['./dist/', './tests/']);
      const filter = new TrailingSlashFilterStrategy(excludePatterns);

      for (let input of inputs) {
        const result = filter.shouldInclude(input);

        expect(result).toBe(true);
      }
    });

    it('should return false for paths exactly matching excluded patterns', () => {
      const inputs = [
        '/dist/',
        './dist/',
        'dist/',
        '/tests/',
        './tests/',
        'tests/',
        'nested/dist/',
        './nested/dist/',
        'nested/tests/',
        './nested/tests/',
      ];
      const excludePatterns = new Set(inputs);
      const filter = new TrailingSlashFilterStrategy(excludePatterns);

      for (let input of inputs) {
        const result = filter.shouldInclude(input);

        expect(result).toBe(false);
      }
    });
  });
});
