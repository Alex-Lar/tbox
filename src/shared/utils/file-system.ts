import { BigIntStats, PathLike, StatOptions, Stats, Dirent as NodeDirent } from 'node:fs';
import * as fsExtra from 'fs-extra';

const impl = fsExtra;

/* Types */
export type Dirent = NodeDirent;

/* Async API */
export async function lstat(path: PathLike, opts?: StatOptions): Promise<Stats | BigIntStats> {
  return await impl.lstat(path, opts);
}

export async function ensureDir(path: string): Promise<void> {
  await impl.ensureDir(path);
}

export async function copyFile(source: string, destination: string, force = false): Promise<void> {
  const mode = force ? 0 : impl.constants.COPYFILE_EXCL;
  await impl.copyFile(source, destination, mode);
}

export async function rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
  await impl.rename(oldPath, newPath);
}

export async function remove(dir: string): Promise<void> {
  await impl.remove(dir);
}

/* Sync API */
export function existsSync(path: PathLike): boolean {
  return impl.existsSync(path);
}
