import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FileSystemScanner from '@core/file-system/services/fs-scanner';
import FastGlob from 'fast-glob';
import { mockGlobEntryStream } from '__tests__/helpers';
import container from '@infrastructure/container/di-container';
import { fourGlobEntryObjects } from '__tests__/fixtures/glob-entries';

vi.mock('fast-glob');

describe('FileSystemScanner', () => {
  let scanner: FileSystemScanner;

  beforeEach(() => {
    vi.clearAllMocks();
    scanner = container.resolve<FileSystemScanner>('FileSystemScanner');
  });

  it('returns array of FileSystemEntry objects', async () => {
    const mockStream = mockGlobEntryStream(fourGlobEntryObjects);
    vi.mocked(FastGlob.stream).mockReturnValueOnce(mockStream);

    const result = await scanner.scan('*');

    expect(result).toHaveLength(4);
    expect(result.map(e => e.name)).toEqual(['file1.txt', 'file2.txt', 'subfile.txt', 'subdir']);
  });
});
