import { GlobEntry } from '@core/file-system/entries/types';

export function isGlobEntry(value: unknown): value is GlobEntry {
  return (
    typeof (value as GlobEntry).name === 'string' &&
    typeof (value as GlobEntry).path === 'string' &&
    typeof (value as GlobEntry).dirent === 'object' &&
    typeof (value as GlobEntry).dirent.isFile === 'function' &&
    typeof (value as GlobEntry).dirent.isDirectory === 'function'
  );
}
