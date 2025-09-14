import { isNodeError } from '@shared/guards/error';
import type {
    BigIntStats,
    PathLike,
    StatOptions,
    Stats,
    Dirent as NodeDirent,
    ObjectEncodingOptions,
} from 'node:fs';
import {
    existsSync as fsExistsSync,
    mkdirSync as fsMkdirSync,
    lstatSync as fsLstatSync,
} from 'node:fs';
import {
    constants as fsConstants,
    readdir as fsReaddir,
    lstat as fsLstat,
    mkdir as fsMkdir,
    copyFile as fsCopyFile,
    rename as fsRename,
    rm as fsRm,
} from 'node:fs/promises';

/* Types */
export type Dirent = NodeDirent;

/* Async API */
export async function readdir(
    path: PathLike,
    options?:
        | (ObjectEncodingOptions & {
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
          })
        | BufferEncoding
        | null
) {
    return await fsReaddir(path, options);
}

export async function lstat(path: PathLike, opts?: StatOptions): Promise<Stats | BigIntStats> {
    return await fsLstat(path, opts);
}

export async function ensureDir(path: PathLike): Promise<void> {
    try {
        await fsMkdir(path, { recursive: true });
    } catch (error: unknown) {
        if (isNodeError(error) && error.code === 'EEXIST') {
            return;
        }

        throw error;
    }
}

export async function copyFile(
    source: PathLike,
    destination: PathLike,
    force = false
): Promise<void> {
    const mode = force ? 0 : fsConstants.COPYFILE_EXCL;
    await fsCopyFile(source, destination, mode);
}

export async function rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    await fsRename(oldPath, newPath);
}

export async function remove(path: PathLike): Promise<void> {
    await fsRm(path, { force: true, recursive: true });
}

/* Sync API */
export function existsSync(path: PathLike): boolean {
    return fsExistsSync(path);
}

export function mkdirSync(path: PathLike): void {
    fsMkdirSync(path, { recursive: true });
}

export function isDirSync(path: PathLike): boolean {
    return fsLstatSync(path).isDirectory();
}
