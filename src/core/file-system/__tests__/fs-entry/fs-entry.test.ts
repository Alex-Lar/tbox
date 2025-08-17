import { describe, it, expect, test } from 'vitest';
import { join } from 'node:path';

import { FileSystemEntry, FileSystemEntryType } from '@core/file-system/entries';

describe('FileSystemEntry', () => {
  it('correctly initializes instance properties', () => {
    const path = '/tmp/test.txt';
    const entry = new FileSystemEntry(path, FileSystemEntryType.FILE);

    expect(entry.path).toBe(path);
    expect(entry.type).toBe(FileSystemEntryType.FILE);
  });

  describe('error handling', () => {
    test.each(['./relative', 'no-slash', '../parent', 'very/nested/path/'])(
      'should throw for relative path: %s',
      parentPath => {
        const fullpath = join(parentPath, 'file.txt');
        expect(() => new FileSystemEntry(fullpath, FileSystemEntryType.FILE)).toThrowError(
          `FileSystemEntry path must be an absolute path: ${fullpath}`
        );
      }
    );
  });

  describe('fullpath property', () => {
    const testCases = [
      {
        scenario: 'regular file',
        name: 'file.txt',
        parentPath: '/home/user',
        type: FileSystemEntryType.FILE,
        expectedPath: '/home/user/file.txt',
      },
      {
        scenario: 'directory',
        name: 'docs',
        parentPath: '/var',
        type: FileSystemEntryType.DIRECTORY,
        expectedPath: '/var/docs',
      },
      {
        scenario: 'unsupported type',
        name: 'device',
        parentPath: '/dev',
        type: FileSystemEntryType.UNSUPPORTED,
        expectedPath: '/dev/device',
      },
    ];

    testCases.forEach(({ scenario, name, parentPath, type, expectedPath }) => {
      it(`generates "${expectedPath}" for ${scenario}`, () => {
        const entry = new FileSystemEntry(join(parentPath, name), type);

        expect(entry.path).toBe(expectedPath);
      });
    });
  });
});
