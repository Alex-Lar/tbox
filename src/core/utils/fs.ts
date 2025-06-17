import fs from 'node:fs/promises';
import path from 'node:path';

export interface CopyOptions {
  readonly force: boolean;
  readonly recursive: boolean;
}

interface FilesAndDirsResult {
  files: string[];
  dirs: string[];
}

export const isEmptyDir = async (path: string): Promise<boolean> => {
  const files = await fs.readdir(path);
  return !(files.length > 0);
};

export const isDir = async (path: string): Promise<boolean> => {
  return (await fs.stat(path)).isDirectory();
};

export const isExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

export const rm = async (path: string): Promise<void> => {
  await fs.rm(path, { force: true, recursive: true });
};

export const mkdir = async (path: string): Promise<void> => {
  await fs.mkdir(path, { recursive: true });
};

export const ensureDir = async (path: string): Promise<void> => {
  if (await isExists(path)) return;

  await mkdir(path);
};

export const findDuplicateNames = async (
  destination: string,
  sources: string[]
): Promise<string[]> => {
  if (!sources || !sources.length || !(await isExists(destination))) return [];

  const entries = await fs.readdir(destination, { withFileTypes: false });
  if (!entries || !entries.length) return [];

  let basenames = sources.map((src) => path.basename(src));

  return entries.filter((entry) => basenames.includes(entry));
};

export const containsAnySource = async (
  destination: string,
  sources: string[]
): Promise<boolean> => {
  const dublicates = await findDuplicateNames(destination, sources);
  return dublicates.length > 0;
};

export const splitFilesAndDirs = async (
  sources: string[]
): Promise<FilesAndDirsResult> => {
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
};

export const getDirectoryFiles = async (source: string): Promise<string[]> => {
  const entries = await fs.readdir(source, { withFileTypes: true });
  return (
    entries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(source, entry.name)) || []
  );
};

export const copyFile = async (
  source: string,
  destination: string,
  opts: Pick<CopyOptions, 'force'>
) => {
  let { force } = opts;
  let mode = force ? 0 : fs.constants.COPYFILE_EXCL;
  await fs.copyFile(source, destination, mode);
};

export const copyFiles = async (
  sources: string[],
  destination: string,
  opts: Pick<CopyOptions, 'force'>
) => {
  await Promise.all(
    sources.map(async (source) => {
      let dest = path.join(destination, path.basename(source));
      await copyFile(source, dest, opts);
    })
  );
};

export const copyDirectory = async (
  source: string,
  destination: string,
  opts: CopyOptions
) => {
  await fs.cp(source, destination, opts);
};

export const copyDirectories = async (
  sources: string[],
  destination: string,
  opts: CopyOptions
) => {
  await Promise.all(
    sources.map(async (source) => {
      await copyDirectory(source, destination, opts);
    })
  );
};

export const copyFilesFromDirectory = async (
  source: string,
  destination: string,
  opts: Pick<CopyOptions, 'force'>
) => {
  let files = await getDirectoryFiles(source);
  if (!files || !files.length)
    throw new Error(
      `Error: specified directory is missing or empty '${source}'`
    );

  await copyFiles(files, destination, opts);
};

export const copyFilesFromDirectories = async (
  sources: string[],
  destination: string,
  opts: Pick<CopyOptions, 'force'>
) => {
  await Promise.all(
    sources.map(async (source) => {
      await copyFilesFromDirectory(source, destination, opts);
    })
  );
};
