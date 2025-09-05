import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import { mkdirSync, existsSync } from '@shared/utils/file-system';

export function ensureStorage() {
    const storagePath = getStoragePath();
    if (existsSync(storagePath)) return;

    try {
        mkdirSync(storagePath);
    } catch (error: unknown) {
        throw new Error(`Cannot create storage at '${storagePath}'`, { cause: error });
    }
}
