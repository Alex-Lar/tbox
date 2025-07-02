export interface CopyOptions {
  readonly force: boolean;
  readonly recursive: boolean;
}

export interface FilesAndDirsResult {
  files: string[];
  dirs: string[];
}
