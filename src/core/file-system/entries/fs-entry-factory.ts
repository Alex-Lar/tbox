import type { Dirent, Stats } from 'fs';
import FileSystemEntry from './fs-entry';
import { singleton } from 'tsyringe';
import { FileSystemEntryProps, FileSystemEntryType, GlobEntry } from './types';
import Logger from '@shared/utils/logger';
import { Factory } from '@shared/types/factory';
import { parse } from '@shared/utils/path';
import { isGlobEntry } from '@core/guards/entry';

@singleton()
export default class FileSystemEntryFactory
  implements Factory<FileSystemEntry, FileSystemEntryProps>
{
  create({ name, path, type }: FileSystemEntryProps): FileSystemEntry {
    if (type === FileSystemEntryType.UNSUPPORTED) {
      const { base } = parse(path);
      Logger.warn(`Unsupported file type: '${base}'`);
    }

    Logger.debug(`[EntryFactory] Path: ${path}`);

    return new FileSystemEntry(name, path, type);
  }

  // TODO: [test]
  createFromGlobEntry(entry: GlobEntry): FileSystemEntry {
    if (!isGlobEntry(entry))
      throw new Error(`[EntryFactory] createFromGlobEntry: invalid GlobEntry object: ${entry}`);

    const { name, path, dirent } = entry;

    const type = this.getEntryType(dirent);

    return this.create({ name, path, type });
  }

  private getEntryType(entry: Pick<Dirent | Stats, 'isDirectory' | 'isFile'>): FileSystemEntryType {
    return entry.isDirectory()
      ? FileSystemEntryType.DIRECTORY
      : entry.isFile()
        ? FileSystemEntryType.FILE
        : FileSystemEntryType.UNSUPPORTED;
  }
}
