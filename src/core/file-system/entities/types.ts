import { Dirent } from '@shared/utils/file-system.ts';

export enum FileSystemEntryType {
    FILE,
    DIRECTORY,
    UNSUPPORTED,
}

export interface FileSystemEntryProps {
    name: string;
    path: string;
    type: FileSystemEntryType;
}

export interface GlobEntry {
    name: string;
    path: string;
    dirent: Pick<Dirent, 'isDirectory' | 'isFile'>;
}
