import 'reflect-metadata';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dirent, Stats } from 'fs';
import { isAbsolute, join } from 'path';
import FileSystemEntry from '@core/file-system/entries/fs-entry';
import Logger from '@shared/utils/logger';
import { ensureAbsolutePath } from '@shared/utils/path';
import { lstat } from '@shared/utils/file-system';
import { FileSystemEntryType, FileSystemEntryFactory } from '@core/file-system/entries';

vi.mock('@shared/utils/logger');
vi.mock('@shared/utils/file-system', () => {
  return {
    lstat: vi.fn(),
  };
});
vi.mock(import('@shared/utils/path'), async originalModule => {
  const mod = await originalModule();

  return {
    ...mod,
    ensureAbsolutePath: vi.fn(),
  };
});

function mockDirent(name: string, isDir: boolean, isFile: boolean, parentPath: string): Dirent {
  return {
    name,
    isDirectory: () => isDir,
    isFile: () => isFile,
    parentPath,
  } as Dirent;
}

function mockStats(isDir: boolean, isFile: boolean): Stats {
  return {
    isDirectory: () => isDir,
    isFile: () => isFile,
  } as Stats;
}

describe('FileSystemEntryFactory', () => {
  const factory = new FileSystemEntryFactory();

  describe('create()', () => {
    const absoluteParentPath = '/test/path';

    beforeEach(() => {
      vi.clearAllMocks();

      vi.mocked(ensureAbsolutePath).mockImplementation(() => absoluteParentPath);
    });

    it('creates FILE type entry', () => {
      const name = 'document.txt';
      const type = FileSystemEntryType.FILE;
      const path = join(absoluteParentPath, name);

      const result = factory.create({
        path,
        type,
      });

      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.type).toBe(FileSystemEntryType.FILE);
      expect(result.path).toBe(path);
    });

    it('creates DIRECTORY type entry', () => {
      const name = 'docs';
      const type = FileSystemEntryType.DIRECTORY;
      const path = join(absoluteParentPath, name);

      const result = factory.create({ path, type });

      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.type).toBe(FileSystemEntryType.DIRECTORY);
      expect(result.path).toBe(path);
    });

    it('creates UNSUPPORTED type entry with warning', () => {
      const warnSpy = vi.spyOn(Logger, 'warn');
      const name = 'my.symlink';
      const type = FileSystemEntryType.UNSUPPORTED;
      const path = join(absoluteParentPath, name);

      const result = factory.create({ path, type });

      expect(warnSpy).toHaveBeenCalledWith(`Unsupported file type: 'my.symlink'`);

      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.type).toBe(FileSystemEntryType.UNSUPPORTED);
      expect(result.path).toBe(path);
    });
  });

  describe('createFromDirent()', () => {
    const absoluteParentPathPart = '/root';
    const relativeParentPathPart = './path';

    beforeEach(() => {
      vi.clearAllMocks();

      vi.mocked(ensureAbsolutePath).mockImplementation((path: string) => {
        if (!isAbsolute(path)) path = join(absoluteParentPathPart, path);
        return path;
      });
    });

    it('creates FILE type entry for file', () => {
      const dirent = mockDirent('document.txt', false, true, absoluteParentPathPart);
      const path = join(dirent.parentPath, dirent.name);

      const result = factory.createFromDirent(dirent);

      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.type).toBe(FileSystemEntryType.FILE);
      expect(result.path).toBe(path);
    });

    it('creates DIRECTORY type entry for directory', () => {
      const dirent = mockDirent('docs', true, false, absoluteParentPathPart);
      const path = join(dirent.parentPath, dirent.name);

      const result = factory.createFromDirent(dirent);

      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.type).toBe(FileSystemEntryType.DIRECTORY);
      expect(result.path).toBe(path);
    });

    it('creates UNSUPPORTED type for unknown fs objects with warning', () => {
      const warnSpy = vi.spyOn(Logger, 'warn');
      const dirent = mockDirent('my.symlink', false, false, absoluteParentPathPart);
      const path = join(dirent.parentPath, dirent.name);

      const result = factory.createFromDirent(dirent);

      expect(warnSpy).toHaveBeenCalledWith(`Unsupported file type: 'my.symlink'`);
      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.type).toBe(FileSystemEntryType.UNSUPPORTED);
      expect(result.path).toBe(path);
    });

    it('handles relative path correctly', () => {
      const dirent = mockDirent('file.txt', false, true, relativeParentPathPart);
      const absolutePath = join(absoluteParentPathPart, relativeParentPathPart, dirent.name);

      const entry = factory.createFromDirent(dirent);

      expect(entry.path).toBe(absolutePath);
    });
  });

  describe('createFromSource()', () => {
    const absoluteParentPathPart = '/root';
    const relativeParentPathPart = './path';

    beforeEach(() => {
      vi.clearAllMocks();

      vi.mocked(ensureAbsolutePath).mockImplementation((path: string) => {
        if (!isAbsolute(path)) path = join(absoluteParentPathPart, path);
        return path;
      });
    });

    it('creates FILE type entry for file', async () => {
      vi.mocked(lstat).mockResolvedValueOnce(mockStats(false, true));
      const name = 'file.txt';
      let path = join(absoluteParentPathPart, name);

      const result = await factory.createFromSource(path);

      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.path).toBe(path);
      expect(result.type).toBe(FileSystemEntryType.FILE);
    });

    it('creates DIRECTORY type entry for directory', async () => {
      vi.mocked(lstat).mockResolvedValueOnce(mockStats(true, false));
      const name = 'docs';
      let path = join(absoluteParentPathPart, name);

      const result = await factory.createFromSource(path);

      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.type).toBe(FileSystemEntryType.DIRECTORY);
      expect(result.path).toBe(path);
    });

    it('creates UNSUPPORTED type for unknown fs objects with warning', async () => {
      vi.mocked(lstat).mockResolvedValueOnce(mockStats(false, false));
      const name = 'my.symlink';
      const path = join(absoluteParentPathPart, name);
      const warnSpy = vi.spyOn(Logger, 'warn');

      const result = await factory.createFromSource(path);

      expect(warnSpy).toHaveBeenCalledWith(`Unsupported file type: '${name}'`);
      expect(result).toBeInstanceOf(FileSystemEntry);
      expect(result.type).toBe(FileSystemEntryType.UNSUPPORTED);
      expect(result.path).toBe(path);
    });

    it('handles relative path correctly', async () => {
      vi.mocked(lstat).mockResolvedValueOnce(mockStats(false, true));
      const name = 'file.txt';
      const relativePath = join(relativeParentPathPart, name);
      const absolutePath = join(absoluteParentPathPart, relativeParentPathPart, name);

      const entry = await factory.createFromSource(relativePath);

      expect(entry.path).toBe(absolutePath);
    });
  });
});
