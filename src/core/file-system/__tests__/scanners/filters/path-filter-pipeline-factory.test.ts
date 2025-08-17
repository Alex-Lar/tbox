import 'reflect-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PathFilterPipelineFactory from '../../../scanners/filters/path-filter-pipeline-factory';
import ExcludeFilterStrategy from '../../../scanners/filters/strategies/exclude-filter-strategy';
import PathFilterPipeline from '../../../scanners/filters/path-filter-pipeline';
import { isStringArray } from '@shared/guards';
import { lstat } from '@shared/utils/file-system';

// Mocks
vi.mock('./strategies/exclude-filter-strategy');
vi.mock('@shared/guards', { spy: true });
vi.mock('@shared/utils/file-system', () => {
  return {
    lstat: vi.fn(),
  };
});

// Tests
describe('PathFilterPipelineFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create()', () => {
    describe('ExcludeFilterStrategy instance', () => {
      it('does not create filter instance when exclude is empty', () => {
        const factory = new PathFilterPipelineFactory();

        const pipeline = factory.create({ exclude: [] });

        expect(pipeline).toBeInstanceOf(PathFilterPipeline);
        expect(ExcludeFilterStrategy).not.toHaveBeenCalled();
        expect(isStringArray).toHaveBeenCalledWith([]);
      });

      it('creates filter instance when exclude contains strings', () => {
        const factory = new PathFilterPipelineFactory();

        const pipeline = factory.create({ exclude: ['test'] });

        expect(pipeline).toBeInstanceOf(PathFilterPipeline);
        expect(ExcludeFilterStrategy).toHaveBeenCalledExactlyOnceWith(['test']);
        expect(isStringArray).toHaveBeenCalledWith(['test']);
      });

      it('creates filter instance when options are empty or undefined', () => {
        const factory = new PathFilterPipelineFactory();

        const pipeline = factory.create();

        expect(pipeline).toBeInstanceOf(PathFilterPipeline);
        expect(ExcludeFilterStrategy).not.toHaveBeenCalled();
        expect(isStringArray).toHaveBeenCalledWith([]);
      });
    });
  });
});
