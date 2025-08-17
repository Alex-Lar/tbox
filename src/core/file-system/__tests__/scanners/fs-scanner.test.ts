import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vol } from 'memfs';
import {
  FileSystemEntry,
  FileSystemEntryType,
} from '@core/file-system/entries';
import FileSystemScanner from './fs-scanner';

vi.mock('node:fs/promises');

describe('FileSystemScanner', () => {
  let scanner: FileSystemScanner;

  beforeEach(() => {
    scanner = new FileSystemScanner();
  });

  describe('FileSystemScanner without filters', () => {
    describe('scan()', () => {
      const mockStructure = {
        './document.txt': '.', // /home/document.txt
        './code/index.js': '.', // /home/code/index.js
      };

      beforeEach(() => {
        vol.reset();
        vi.clearAllMocks();

        vol.fromJSON(mockStructure, '/home');
      });

      it('returns list of one entry for singular source file', async () => {
        // Action
        const entries = await scanner.scan('./document.txt', {
          recursive: false,
        });

        // Test
        expect(entries[0]).toBeInstanceOf(FileSystemEntry);
        expect(entries[0]?.name).toBe('document.txt');
        expect(entries[0]?.parentPath).toBe('root/home');
        expect(entries[0]?.fullpath).toBe('root/home/document.txt');
        expect(entries[0]?.type).toBe(FileSystemEntryType.FILE);
      });

      it('returns list of one entry for singular source file', async () => {
        // Action
        const entries = await scanner.scan('./document.txt', {
          recursive: false,
        });

        // Test
        expect(entries[0]).toBeInstanceOf(FileSystemEntry);
        expect(entries[0]?.name).toBe('document.txt');
        expect(entries[0]?.parentPath).toBe('root/home');
        expect(entries[0]?.fullpath).toBe('root/home/document.txt');
        expect(entries[0]?.type).toBe(FileSystemEntryType.FILE);
      });
    });
  });

  describe('FileSystemScanner with filters', () => {
    describe('scan()', () => {
      const mockStructure = {
        './document.txt': '.', // /home/document.txt
        './code/index.js': '.', // /home/code/index.js
      };

      beforeEach(() => {
        vol.reset();
        vi.clearAllMocks();

        vol.fromJSON(mockStructure, '/home');
      });

      it('returns list of one entry for singular source file', async () => {
        // Action
        const entries = await scanner.scan('./document.txt', {
          recursive: false,
        });

        // Test
        expect(entries[0]).toBeInstanceOf(FileSystemEntry);
        expect(entries[0]?.name).toBe('document.txt');
        expect(entries[0]?.parentPath).toBe('root/home');
        expect(entries[0]?.fullpath).toBe('root/home/document.txt');
        expect(entries[0]?.type).toBe(FileSystemEntryType.FILE);
      });
    });
  });
});

// ====================================================================
// let sources = [
//   'tsconfig.json',
//   './src/core',
//   'index.ts',
//   '../another-project/index.ts',
// ];
// const scanner = new FileSystemScanner(new FileSystemEntryFactory());
// const entries = scanner.scan(sources, { recursive: true });

// const example = [
//   {
//     name: 'tsconfig.json',
//     parentPath: '/root/project',
//     type: FileSystemEntryType.FILE,
//   },
//   {
//     name: 'index.ts',
//     parentPath: '/root/project',
//     type: FileSystemEntryType.FILE,
//   },
//   {
//     name: 'index.ts',
//     parentPath: '/root/another-project',
//     type: FileSystemEntryType.FILE,
//   },
//   {
//     name: 'core',
//     parentPath: '/root/project/src',
//     type: FileSystemEntryType.DIRECTORY,
//   },
//   // И если [recursive: true] дальше сканируем все что находится внутри директории core
// ];

// describe('isExists()', () => {
//   let fileManager: FileManager;

//   beforeEach(() => {
//     vol.reset();
//     vi.clearAllMocks();

//     fileManager = new FileManager();
//   });

//   test('returns true when file exists', async () => {
//     const filename = '/test-file.txt';
//     vol.writeFileSync(filename, 'content');

//     const result = await fileManager.isExists(filename);
//     expect(result).toBe(true);
//   });

//   test('returns false when file not exists', async () => {
//     const result = await fileManager.isExists('/non-existent-file.txt');
//     expect(result).toBe(false);
//   });

//   test('handles directory check', async () => {
//     let dirname = '/test-dir';
//     vol.mkdirSync(dirname, { recursive: true });

//     const result = await fileManager.isExists(dirname);
//     expect(result).toBe(true);
//   });

//   test('works with nested paths', async () => {
//     let dirname = '/nested/folder';
//     let filename = '/file.txt';
//     vol.mkdirSync(dirname, { recursive: true });
//     vol.writeFileSync(path.join(dirname, filename), 'hello');

//     expect(await fileManager.isExists('/nested/folder/file.txt')).toBe(true);
//     expect(await fileManager.isExists('/nested/folder')).toBe(true);
//     expect(await fileManager.isExists('/nested')).toBe(true);
//     expect(await fileManager.isExists('/nested/folder/non-existent.txt')).toBe(
//       false
//     );
//   });
// });

// describe('findDuplicateNames()', () => {
//   let fileManager: FileManager;

//   beforeEach(() => {
//     vol.reset();
//     vi.clearAllMocks();

//     fileManager = new FileManager();
//   });

//   test('returns true when at least one file exists in destination', async () => {
//     const destination = '/dest';
//     const mockFiles = ['some.rs', 'index.html', 'main.py', 'abra'];
//     const sources = ['some.c', 'some.java', 'some.rs', 'abra'];

//     vol.mkdirSync(destination, { recursive: true });
//     mockFiles.forEach((file, i) => {
//       vol.writeFileSync(path.join(destination, file), `#${i}`);
//     });

//     let result = await fileManager.findDuplicateNames(destination, sources);
//     console.log('Dublicates:', result);

//     expect(true).toBe(true);
//   });
// });

// describe('containsAnySource()', () => {
//   let fileManager: FileManager;

//   beforeEach(() => {
//     vol.reset();
//     vi.clearAllMocks();

//     fileManager = new FileManager();
//   });

//   test('returns true when at least one file exists in destination', async () => {
//     const destination = '/dest';
//     const mockFiles = ['some.rs'];
//     const sources = ['some.c', 'some.java', 'some.rs'];

//     vol.mkdirSync(destination, { recursive: true });
//     mockFiles.forEach((file, i) => {
//       vol.writeFileSync(path.join(destination, file), `#${i}`);
//     });

//     expect(await fileManager.containsAnySource(destination, sources)).toBe(
//       true
//     );
//   });

//   test('returns true when at least one directory exists in destination', async () => {
//     const destination = '/dest';
//     const mockFiles = ['some.rs'];
//     const sources = ['some.c', 'some.java', 'some-directory'];

//     vol.mkdirSync(path.join(destination, 'some-directory'), {
//       recursive: true,
//     });
//     mockFiles.forEach((file, i) => {
//       vol.writeFileSync(path.join(destination, file), `#${i}`);
//     });

//     expect(await fileManager.containsAnySource(destination, sources)).toBe(
//       true
//     );
//   });

//   test('returns true when multiple sources exist in destination', async () => {
//     const destination = '/dest';
//     const mockFiles = ['another.c', 'some.rs', 'some.c'];
//     const sources = ['some.c', 'some.rs'];

//     vol.mkdirSync(destination, { recursive: true });
//     mockFiles.forEach((file, i) => {
//       vol.writeFileSync(path.join(destination, file), `#${i}`);
//     });

//     expect(await fileManager.containsAnySource(destination, sources)).toBe(
//       true
//     );
//   });

//   test('returns false when no sources exist in destination', async () => {
//     const destination = '/dest';
//     const mockFiles = ['some.js'];
//     const sources = ['some.c', 'some.java', 'some-directory'];

//     vol.mkdirSync(destination, { recursive: true });
//     mockFiles.forEach((file, i) => {
//       vol.writeFileSync(path.join(destination, file), `#${i}`);
//     });

//     expect(await fileManager.containsAnySource(destination, sources)).toBe(
//       false
//     );
//   });

//   test('returns false when destination directory does not exist', async () => {
//     const destination = '/dest';
//     const sources = ['main.c', 'main.java', 'some-directory'];

//     expect(await fileManager.containsAnySource(destination, sources)).toBe(
//       false
//     );
//   });

//   test('returns false when sources array is empty', async () => {
//     const destination = '/dest';
//     const sources: string[] = [];
//     vol.mkdirSync(destination, { recursive: true });

//     expect(await fileManager.containsAnySource(destination, sources)).toBe(
//       false
//     );
//   });

//   test('returns false for empty string in sources', async () => {
//     const destination = '/dest';
//     const sources: string[] = [''];
//     vol.mkdirSync(destination, { recursive: true });

//     expect(await fileManager.containsAnySource(destination, sources)).toBe(
//       false
//     );
//   });
// });

// describe('ensureDir()', () => {
//   let fileManager: FileManager;

//   beforeEach(() => {
//     vol.reset();
//     vi.clearAllMocks();

//     fileManager = new FileManager();
//   });

//   test('should create directory when not exists', async () => {
//     const dirpath = '/new-directory';

//     await fileManager.ensureDir(dirpath);

//     expect(vol.existsSync(dirpath)).toBe(true);
//     expect(vol.statSync(dirpath).isDirectory()).toBe(true);
//   });

//   test('should create nested directories', async () => {
//     const nestedPath = '/nested/path/with/multiple/directories';

//     await fileManager.ensureDir(nestedPath);

//     expect(vol.existsSync(nestedPath)).toBe(true);
//     expect(vol.statSync(nestedPath).isDirectory()).toBe(true);
//   });

//   test('should return undefined when path is a file', async () => {
//     const filepath = '/existing-file.txt';
//     vol.writeFileSync(filepath, 'content');

//     expect(await fileManager.ensureDir(filepath)).toBe(undefined);
//   });

//   test('should return undefined when path is already exists', async () => {
//     const dirpath = '/existing/dir';
//     vol.mkdirSync(dirpath, { recursive: true });

//     expect(await fileManager.ensureDir(dirpath)).toBe(undefined);
//   });
// });
