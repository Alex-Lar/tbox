import { CopyOptions } from "../utils/fs"; 

export interface TemplateManagerConfig {
    storage: string
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