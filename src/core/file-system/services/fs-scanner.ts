import { inject, injectable } from 'tsyringe';
import fg from 'fast-glob';

import { isNonEmptyStringArray } from '@shared/guards/index.ts';
import { ScannerOptions } from '@core/file-system/services/types';
import FileSystemEntryFactory from '@core/file-system/entities/fs-entry-factory.ts';
import { GlobEntry } from '@core/file-system/entities/types.ts';
import FileSystemEntry from '@core/file-system/entities/fs-entry.ts';

@injectable()
export default class FileSystemScanner {
    constructor(
        @inject('FileSystemEntryFactory')
        private fsEntryFactory: FileSystemEntryFactory
    ) {}

    private async *scanEntries(source: string | string[], options: ScannerOptions = {}) {
        let streamEntry;

        try {
            streamEntry = fg.stream(source, {
                dot: true,
                objectMode: true,
                onlyFiles: false,
                markDirectories: true,
                absolute: true,
                ignore: options.exclude ?? [],
                unique: true,
            });
        } catch (error) {
            throw new Error(`Error occured while scanning source: ${source}`, { cause: error });
        }

        for await (const entry of streamEntry as AsyncIterable<GlobEntry>) {
            yield entry;
        }
    }

    async scan(
        source: string | string[],
        options: ScannerOptions = {}
    ): Promise<FileSystemEntry[]> {
        if (typeof source !== 'string' && !isNonEmptyStringArray(source))
            throw new Error("Argument type error: 'source' must be a string or array of strings");

        const globEntryGen = this.scanEntries(source, options);
        const fsEntries: FileSystemEntry[] = [];

        for await (const globEntry of globEntryGen) {
            const fsEntry = this.fsEntryFactory.createFromGlobEntry(globEntry);
            fsEntries.push(fsEntry);
        }

        return fsEntries;
    }
}
