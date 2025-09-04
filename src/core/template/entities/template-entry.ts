import { FileSystemEntry } from '@core/file-system/entities/index.ts';

export default class TemplateEntry {
    private readonly _entry: FileSystemEntry;
    private readonly _destination: string;

    constructor(entry: FileSystemEntry, destination: string) {
        this._entry = entry;
        this._destination = destination;
    }

    isFile(): boolean {
        return this._entry.isFile();
    }

    isDirectory(): boolean {
        return this._entry.isDirectory();
    }

    get source(): string {
        return this._entry.path;
    }

    get destination(): string {
        return this._destination;
    }
}
