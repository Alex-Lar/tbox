export interface CopyOptions {
  readonly force: boolean;
  readonly recursive: boolean;
}

export interface FilesAndDirsResult {
  files: string[];
  dirs: string[];
}

export interface FileSystemTypes {
  FileSystemManager: symbol;
}

export interface CopyData {
  destination: string;
  files: string[];
  dirs: string[];
  options: CopyOptions;
}
