import { injectable } from 'tsyringe';
import type { Dirent, Stats } from 'fs';
import FileSystemEntry from './fs-entry.ts';
import { FileSystemEntryProps, FileSystemEntryType, GlobEntry } from './types.ts';
import Logger from '@shared/utils/logger.ts';
import { Factory } from '@shared/types/factory.ts';
import { parse } from '@shared/utils/path.ts';
import { isGlobEntry } from '@core/guards/entry.ts';

@injectable()
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

    createFromGlobEntry(entry: GlobEntry): FileSystemEntry {
        if (!isGlobEntry(entry))
            throw new Error(
                `[EntryFactory] createFromGlobEntry: invalid GlobEntry object: ${entry}`
            );

        const { name, path, dirent } = entry;

        const type = this.getEntryType(dirent);

        return this.create({ name, path, type });
    }

    private getEntryType(
        entry: Pick<Dirent | Stats, 'isDirectory' | 'isFile'>
    ): FileSystemEntryType {
        return entry.isDirectory()
            ? FileSystemEntryType.DIRECTORY
            : entry.isFile()
              ? FileSystemEntryType.FILE
              : FileSystemEntryType.UNSUPPORTED;
    }
}
