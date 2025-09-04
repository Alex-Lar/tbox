import { describe, beforeEach, expect, it, vi } from 'vitest';
import { fs, vol } from 'memfs';
import { ensureDir, existsSync, remove } from '@shared/utils/file-system';
import path from 'path';

vi.mock('node:fs');
vi.mock('node:fs/promises');

describe('FileSystem Module', () => {
  beforeEach(() => {
    vol.reset();
    vi.resetAllMocks();
  });

  describe('remove()', () => {
    it('removes a directory if it exists', async () => {
      const input = '/documents';
      fs.mkdirSync(input, { recursive: false });

      expect(fs.existsSync(input)).toBe(true);
      await expect(remove(input)).resolves.toBeUndefined();
      expect(fs.existsSync(input)).toBe(false);
    });

    it('removes a file if it exists', async () => {
      const input = '/file.txt';
      fs.writeFileSync(input, '...');

      expect(fs.existsSync(input)).toBe(true);
      await expect(remove(input)).resolves.toBeUndefined();
      expect(fs.existsSync(input)).toBe(false);
    });

    it('removes a directory recursively if it exists', async () => {
      const input = '/very/nested/path/to/dir';
      fs.mkdirSync(input, { recursive: true });

      expect(fs.existsSync(input)).toBe(true);
      await expect(remove(input)).resolves.toBeUndefined();
      expect(fs.existsSync(input)).toBe(false);
    });

    it('removes a file in nested directories recursively if it exists', async () => {
      const parentPath = '/very/nested/path/to';
      const filename = 'file.txt';
      const input = path.join(parentPath, filename);
      fs.mkdirSync(parentPath, { recursive: true });
      fs.writeFileSync(input, '...');

      expect(fs.existsSync(parentPath)).toBe(true);
      await expect(remove(parentPath)).resolves.toBeUndefined();
      expect(fs.existsSync(parentPath)).toBe(false);
    });

    it('does nothing if directory does not exist', async () => {
      const input = '/this/path/does/not/exists';

      expect(fs.existsSync(input)).toBe(false);
      await expect(remove(input)).resolves.toBeUndefined();
      expect(fs.existsSync(input)).toBe(false);
    });

    it('does nothing if the file does not exist', async () => {
      const input = '/file.txt';

      expect(fs.existsSync(input)).toBe(false);
      await expect(remove(input)).resolves.toBeUndefined();
      expect(fs.existsSync(input)).toBe(false);
    });
  });

  describe('ensureDir()', () => {
    beforeEach(() => {
      vol.fromJSON({
        '/home/documents/document.txt': 'Hello World',
      });
    });

    it('creates directory if it does not exist', async () => {
      const input = '/home/downloads';

      await ensureDir(input);

      const result = fs.existsSync(input);
      expect(result).toBe(true);
    });

    it('creates directory recursively if it does not exist', async () => {
      const input = '/home/code/project/some-project';

      await ensureDir(input);

      const result = fs.existsSync(input);
      expect(result).toBe(true);
    });

    it('does nothing if directory already exists', async () => {
      const input = '/home/documents';

      await expect(ensureDir(input)).resolves.toBeUndefined();

      expect(fs.existsSync(input)).toBe(true);
    });
  });

  describe('existsSync()', () => {
    beforeEach(() => {
      vol.fromJSON({
        '/home/document.txt': 'hello',
        '/another.txt': 'world',
      });
    });

    it('returns true if path exists', () => {
      const res1 = existsSync('/home/document.txt');
      const res2 = existsSync('/another.txt');

      expect(res1).toBe(true);
      expect(res2).toBe(true);
    });

    it('returns false if path does not exists', () => {
      const res1 = existsSync('/home/somefile.txt');
      const res2 = existsSync('/home/somedir');

      expect(res1).toBe(false);
      expect(res2).toBe(false);
    });
  });
});
