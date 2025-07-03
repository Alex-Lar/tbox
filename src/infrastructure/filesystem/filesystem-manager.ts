import fs from 'node:fs/promises';
import path from 'node:path';
import { CopyOptions, FilesAndDirsResult } from './types';

class FileSystemManager {
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

  async rm(path: string): Promise<void> {
    await fs.rm(path, { force: true, recursive: true });
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

    let basenames = sources.map((src) => path.basename(src));

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
        .map((entry) => path.join(source, entry.name)) || []
    );
  }

  async copyFile(
    source: string,
    destination: string,
    opts: Pick<CopyOptions, 'force'>
  ) {
    let { force } = opts;
    let mode = force ? 0 : fs.constants.COPYFILE_EXCL;
    await fs.copyFile(source, destination, mode);
  }

  async copyFiles(
    sources: string[],
    destination: string,
    opts: Pick<CopyOptions, 'force'>
  ) {
    await Promise.all(
      sources.map(async (source) => {
        let dest = path.join(destination, path.basename(source));
        await this.copyFile(source, dest, opts);
      })
    );
  }

  async copyDirectory(source: string, destination: string, opts: CopyOptions) {
    await fs.cp(source, destination, opts);
  }

  async copyDirectories(
    sources: string[],
    destination: string,
    opts: CopyOptions
  ) {
    await Promise.all(
      sources.map(async (source) => {
        await this.copyDirectory(source, destination, opts);
      })
    );
  }

  async copyFilesFromDirectory(
    source: string,
    destination: string,
    opts: Pick<CopyOptions, 'force'>
  ) {
    let files = await this.getDirectoryFiles(source);
    if (!files || !files.length)
      throw new Error(
        `Error: specified directory is missing or empty '${source}'`
      );

    await this.copyFiles(files, destination, opts);
  }

  async copyFilesFromDirectories(
    sources: string[],
    destination: string,
    opts: Pick<CopyOptions, 'force'>
  ) {
    await Promise.all(
      sources.map(async (source) => {
        await this.copyFilesFromDirectory(source, destination, opts);
      })
    );
  }
}

export default FileSystemManager;
