import fs from 'node:fs/promises';
import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';
import { CopyData, CopyOptions, FilesAndDirsResult } from './types';
import { FileSystemOperationError } from '@shared/errors';

class FileSystemManager {
  /**
   * Copies the specified files and directories to the destination path.
   *
   * @throws {FileSystemOperationError} If an error occurs during copying of file system elements.
   */
  async copyAssets({ destination, dirs = [], files = [], options }: CopyData) {
    try {
      const copyOperations = [];

      if (files.length)
        copyOperations.push(this.copyFiles(files, destination, options));

      if (dirs.length) {
        const dirCopyStrategy = options.recursive
          ? this.copyDirectories(dirs, destination, options)
          : this.copyFilesFromDirectories(dirs, destination, options);

        copyOperations.push(dirCopyStrategy);
      }

      await Promise.all(copyOperations);
    } catch (error: unknown) {
      throw new FileSystemOperationError(
        'COPY',
        destination,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async isEmptyDir(path: string): Promise<boolean> {
    const files = await fs.readdir(path);
    return !(files.length > 0);
  }

  async isDir(path: string): Promise<boolean> {
    return (await fs.stat(path)).isDirectory();
  }

  async isExists(path: string): Promise<boolean> {
    try {
      await fs.access(path, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  async makeTemporaryDirectory(dirname?: string) {
    const tmpDirname = join(tmpdir(), `${dirname}-`);
    return await fs.mkdtemp(tmpDirname);
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    await fs.rename(oldPath, newPath);
  }

  async remove(path: string): Promise<void> {
    await fs.rm(path, { force: true, recursive: true });
  }

  async removeManySecure(paths: string[]): Promise<void> {
    const existsArray = await Promise.all(
      paths.map((path) => this.isExists(path))
    );
    const existingPaths = paths.filter((_, index) => existsArray[index]);

    await Promise.all(existingPaths.map((path) => this.remove(path)));
  }

  async mkdir(path: string): Promise<void> {
    await fs.mkdir(path, { recursive: true });
  }

  async ensureDir(path: string): Promise<void> {
    if (await this.isExists(path)) return;

    await this.mkdir(path);
  }

  async findDuplicateNames(
    destination: string,
    sources: string[]
  ): Promise<string[]> {
    if (!sources || !sources.length || !(await this.isExists(destination)))
      return [];

    const entries = await fs.readdir(destination, { withFileTypes: false });
    if (!entries || !entries.length) return [];

    let basenames = sources.map((src) => basename(src));

    return entries.filter((entry) => basenames.includes(entry));
  }

  async containsAnySource(
    destination: string,
    sources: string[]
  ): Promise<boolean> {
    const dublicates = await this.findDuplicateNames(destination, sources);
    return dublicates.length > 0;
  }

  async splitFilesAndDirs(sources: string[]): Promise<FilesAndDirsResult> {
    const filestats = await Promise.all(
      sources.map(async (source) => await fs.lstat(source))
    );

    const files: string[] = [];
    const dirs: string[] = [];
    for (const [index, entry] of filestats.entries()) {
      if (entry.isFile() && sources[index]) files.push(sources[index]);
      else if (entry.isDirectory() && sources[index]) dirs.push(sources[index]);
    }

    return { files, dirs };
  }

  async getDirectoryFiles(source: string): Promise<string[]> {
    const entries = await fs.readdir(source, { withFileTypes: true });
    return (
      entries
        .filter((entry) => entry.isFile())
        .map((entry) => join(source, entry.name)) || []
    );
  }

  /**
   * Copies a file or directory from source to destination.
   * By default, the copy is recursive and forces overwriting existing files.
   *
   * @param source - The path to the source file or directory
   * @param destination - The path to the destination
   * @param options - Copy options (default: { force: true, recursive: true })
   */
  async cp(
    source: string,
    destination: string,
    options: CopyOptions = { force: true, recursive: true }
  ): Promise<void> {
    await fs.cp(source, destination, options);
  }

  async copyFile(
    source: string,
    destination: string,
    options: Pick<CopyOptions, 'force'>
  ) {
    const force = options.force ?? false;
    let mode = force ? 0 : fs.constants.COPYFILE_EXCL;
    await fs.copyFile(source, destination, mode);
  }

  async copyFiles(
    sources: string[],
    destination: string,
    options: Pick<CopyOptions, 'force'>
  ) {
    await Promise.all(
      sources.map(async (source) => {
        let dest = join(destination, basename(source));
        await this.copyFile(source, dest, options);
      })
    );
  }

  async copyDirectory(
    source: string,
    destination: string,
    options: CopyOptions
  ) {
    await fs.cp(source, destination, options);
  }

  async copyDirectories(
    sources: string[],
    destination: string,
    options: CopyOptions
  ) {
    await Promise.all(
      sources.map(async (source) => {
        await this.copyDirectory(source, destination, options);
      })
    );
  }

  async copyFilesFromDirectory(
    source: string,
    destination: string,
    options: Pick<CopyOptions, 'force'>
  ) {
    let files = await this.getDirectoryFiles(source);
    if (!files || !files.length)
      throw new FileSystemOperationError(
        'COPY',
        destination,
        new Error(`Specified directory is missing or empty '${source}'`)
      );

    await this.copyFiles(files, destination, options);
  }

  async copyFilesFromDirectories(
    sources: string[],
    destination: string,
    options: Pick<CopyOptions, 'force'>
  ) {
    await Promise.all(
      sources.map(async (source) => {
        await this.copyFilesFromDirectory(source, destination, options);
      })
    );
  }
}

export default FileSystemManager;
