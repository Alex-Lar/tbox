export interface ScannerOptions {
  recursive?: boolean;
  exclude?: string[];
}

export interface Scanner<T> {
  scan(source: string | string[], options: ScannerOptions): Promise<T[]>;
}
