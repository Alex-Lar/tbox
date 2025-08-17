import { isAbsolute } from '@shared/utils/path';
import { FileSystemEntryType } from '@core/file-system/entries';

export default class FileSystemEntry {
  private readonly _name: string;
  private readonly _path: string;
  private readonly _type: FileSystemEntryType;

  constructor(name: string, path: string, type: FileSystemEntryType) {
    this._name = name;
    this._path = path;
    this._type = type;

    if (!this.isAbsolutePath(this._path)) {
      throw new Error(`FileSystemEntry path must be an absolute path: ${this._path}`);
    }
  }

  private isAbsolutePath(path: string): boolean {
    try {
      return isAbsolute(path);
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        return false;
      }

      throw error;
    }
  }

  isDirectory(): boolean {
    return this._type === FileSystemEntryType.DIRECTORY;
  }

  isFile(): boolean {
    return this._type === FileSystemEntryType.FILE;
  }

  get name() {
    return this._name;
  }

  get path() {
    return this._path;
  }

  get type() {
    return this._type;
  }
}
