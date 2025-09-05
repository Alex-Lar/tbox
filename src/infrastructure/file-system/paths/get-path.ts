import getAppPaths from '@infrastructure/file-system/paths/paths.ts';
import { APP_NAME } from '@shared/constants/index.ts';

let STORAGE_CACHE: string | null = null;

export function getStoragePath(): string {
    if (STORAGE_CACHE) return STORAGE_CACHE;

    const dataPath = getAppPaths(APP_NAME).data;

    if (!dataPath) throw new Error('Cannot get storage path');

    STORAGE_CACHE = dataPath;

    return dataPath;
}
