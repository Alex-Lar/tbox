import { GlobEntry } from '@core/file-system/entities';
import { Dirent } from '@shared/utils/file-system';
import { Readable } from 'node:stream';

export const mockDirent = (isFile: boolean, isDir: boolean): Partial<Dirent> => {
    return {
        isFile: () => isFile,
        isDirectory: () => isDir,
    };
};

export const mockDirentFile = () => mockDirent(true, false);

export const mockDirentDir = () => mockDirent(false, true);

export function mockGlobEntryStream(globEntries: GlobEntry | GlobEntry[]): Readable {
    return Readable.from(Array.isArray(globEntries) ? globEntries : [globEntries]);
}

export const getFastGlobStreamMock = (globEntries: GlobEntry | GlobEntry[]) => {
    return () => {
        return mockGlobEntryStream(globEntries);
    };
};
