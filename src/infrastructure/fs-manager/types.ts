export interface CopyOptions {
  readonly force: boolean;
  readonly recursive: boolean;
}

export interface CopyFilters {
  readonly exclude: string[];
}

export type CopyParams = CopyOptions & CopyFilters;

export interface FilesAndDirsResult {
  files: string[];
  dirs: string[];
}

export interface CopyData {
  destination: string;
  files: string[];
  dirs: string[];
  options: CopyParams;
}
