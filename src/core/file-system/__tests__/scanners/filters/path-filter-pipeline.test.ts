import 'reflect-metadata';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import PathFilterPipeline from './path-filter-pipeline';
import { PathFilter } from './types';
import Logger from '@shared/utils/logger';

vi.mock('@shared/utils/logger');

function createMockFilter(result: boolean): PathFilter {
  return {
    shouldInclude: vi.fn(() => result),
  };
}

describe('PathFilterPipeline', () => {
  let pipeline: PathFilterPipeline;
  const testPath = '/test/path';

  beforeEach(() => {
    pipeline = new PathFilterPipeline();
  });

  describe('shouldInclude()', () => {
    it('returns true when there are no filters', () => {
      expect(pipeline.shouldInclude(testPath)).toBe(true);
    });

    it('returns true when all filters return true', () => {
      const filter1 = createMockFilter(true);
      const filter2 = createMockFilter(true);

      pipeline.add(filter1);
      pipeline.add(filter2);

      expect(pipeline.shouldInclude(testPath)).toBe(true);
      expect(filter1.shouldInclude).toHaveBeenCalledWith(testPath);
      expect(filter2.shouldInclude).toHaveBeenCalledWith(testPath);
    });

    it('returns false when at least one filter returns false', () => {
      const filter1 = createMockFilter(true);
      const filter2 = createMockFilter(false);

      pipeline.add(filter1);
      pipeline.add(filter2);

      expect(pipeline.shouldInclude(testPath)).toBe(false);
    });

    it('handles combinations correctly after removing filter', () => {
      const filter1 = createMockFilter(true);
      const filter2 = createMockFilter(false);

      pipeline.add(filter1);
      pipeline.add(filter2);
      pipeline.remove(filter2);

      expect(pipeline.shouldInclude(testPath)).toBe(true);
    });
  });

  describe('filter management', () => {
    it('adds filters via add()', () => {
      const filter = createMockFilter(true);
      pipeline.add(filter);

      expect(pipeline['filters']).toContain(filter);
    });

    it('removes filters via remove()', () => {
      const filter = createMockFilter(true);

      pipeline.add(filter);
      expect(pipeline['filters']).toContain(filter);

      pipeline.remove(filter);
      expect(pipeline['filters']).not.toContain(filter);
    });

    it('completely cleans filters via clear()', () => {
      pipeline.add(createMockFilter(true));
      pipeline.add(createMockFilter(false));
      expect(pipeline['filters']).toHaveLength(2);

      pipeline.clear();
      expect(pipeline['filters']).toHaveLength(0);
    });

    it('ignores deleting a non-existent filter', () => {
      const debugSpy = vi.spyOn(Logger, 'debug');
      const filter = createMockFilter(true);

      pipeline.remove(filter);

      expect(debugSpy).toHaveBeenCalled();
      expect(pipeline['filters']).toHaveLength(0);
    });
  });
});
