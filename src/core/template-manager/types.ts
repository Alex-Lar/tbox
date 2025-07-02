import FileManager from '../file-manager';
import type { CopyOptions } from '../file-manager';

export interface TemplateManagerConfig {
  storage: string;
  fileManager: FileManager;
}

export interface TemplateData<T> {
  sources: string[];
  options: T;
}

export interface CopyData {
  destination: string;
  files: string[];
  dirs: string[];
  opts: CopyOptions;
}
